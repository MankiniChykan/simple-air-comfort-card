import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { cardStyles } from './styles';
import {
  LEGACY_TEMP_KEYS,
  TEMP_PRESETS,
  normalizePreset,
  hasWarnedLegacy,
  hasWarnedAliasConflict,
  markLegacyWarned,
  markAliasConflictWarned,
} from './constants';
import {
  pickTenAnchors,
  expandFromTen,
  buildComfortBandMap,
  type ComfortBandMap,
  type KvRecord,
} from './anchors';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { SimpleAirCardConfig } from '../types/simple-air-card-config';

type GeomAnchorMap = {
  y_outer_bottom: number;
  y_outer_top: number;
  y_inner_bottom: number;
  y_inner_top: number;
  y_center: number;
  x_inner_left: number;
  x_inner_right: number;
};

/**
 * Simple Air Comfort Card — src/simple-air-comfort-card.ts
 *
 * OVERVIEW
 * --------
 * A host-only Lovelace card that renders a square dial with a moving “comfort dot”.
 * The dot’s position is computed from:
 *   X = Relative Humidity (%) clamped to [0..100] and calibrated to the inner circle
 *   Y = Temperature (°C/°F) mapped via contiguous comfort bands (FROSTY→BOILING)
 *
 * WHAT YOU SEE
 * ------------
 * - A circular dial (outer ring + inner “eye”) that tints by dew point & temp.
 * - Corner readouts: Dew Point (TL), Feels-Like (TR), Temp (BL), RH (BR).
 * - Axis labels that glow when hot/cold or too dry/humid.
 * - A pulsing halo on the dot when conditions are “outside” comfort.
 *
 * GEOMETRY & SCALING
 * ------------------
 * - The stage is always 1:1 (CSS aspect-ratio), typography scales with --sac-scale.
 * - Dial box size is `ring_pct` (default 45% of the square); inner circle `inner_pct`.
 * - RH→X uses two inner-circle calibration points (`rh_left_inner_pct`, `rh_right_inner_pct`)
 *   so the dot crosses the eye precisely at your chosen RH targets.
 *
 * EDGE POLICY (LOCKED)
 * --------------------
 * - Bottom of card (0%)  = t_frosty_min
 * - Top of card (100%)   = t_boiling_max
 * Do NOT substitute frosty_max / boiling_min for vertical extremes.
 * The Y-mapping uses these two keys as the visual ladder endpoints.
 *
 * TEMPERATURE BANDS (CONTIGUOUS)
 * ------------------------------
 * - The editor exposes 10 anchors (with ±6 °C default caps on non-edge anchors).
 * - cap_degrees changes the default cap in editor and yaml.
 * - All neighbors are auto-derived with 0.1 °C gaps (no overlaps).
 * - Locked landmarks for Y: FROSTY.min, MILD.min, PERFECT.min, PERFECT.max,
 *   WARM.max, BOILING.max (with HOT.max placed proportionally near the top).
 *
 * INPUTS (MINIMUM)
 * ----------------
 * Required:
 *   - temperature: sensor.* (°C/°F)
 *   - humidity:    sensor.* (%)
 * Optional:
 *   - windspeed:   sensor.* (m/s, km/h, mph, kn supported) — used for Feels-Like
 *
 * FEELS-LIKE MODES
 * ----------------
 * - BoM Apparent Temperature (default; uses T + RH (as vapour pressure) + wind)
 * - Wind Chill, Heat Index, or Humidex — selectable via `feels_like`.
 *
 * ACCESSIBILITY
 * -------------
 * - ARIA labels on axes and dial for screen readers.
 *
 * IMPLEMENTATION NOTES
 * --------------------
 * - Host-only: no <ha-card> wrapper. Background provided via --sac-temp-bg.
 * - A ResizeObserver updates --sac-scale from the rendered width (baseline 300 px).
 * - Unit handling: temperatures accept °C/°F; wind speed converts to m/s internally.
 */

export class SimpleAirComfortCard extends LitElement {
  private _config?: (SimpleAirCardConfig & KvRecord);
  private _ro: ResizeObserver | null;
  private _hass?: HomeAssistant;
  private __supportsColorMix?: boolean;

  /* -------------------------------
   * Reactive properties for Lit
   * -------------------------------
   * - `hass` is provided by Home Assistant runtime; it contains entity states
   * - `_config` is our internal, sanitized card config (set via setConfig)
   */
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  constructor() {
    super();
    this._config = undefined; // populated in setConfig()
    this._ro = null;          // ResizeObserver instance
    this._hass = undefined;   // backing store for the hass getter/setter
  }

  /* ================================
   *             STYLES
   * ================================
   * CSS here builds the square stage and dial. All type scales use --sac-scale
   * so text grows/shrinks with the actual rendered size of the card.
   */
  static styles = cardStyles;

  /* ================================
   *           LIFECYCLE
   * ================================
   * We attach a ResizeObserver to the square stage (.ratio) to compute a
   * scale factor relative to a 300px baseline. That factor feeds --sac-scale
   * which all font sizes use. This keeps typography proportional to the card.
   */
  connectedCallback(){
    super.connectedCallback();
    this.updateComplete.then(() => {
      // Observe the inner square; fallback to host if not found
      const target = this.renderRoot?.querySelector('.ratio') || this;
      if (!target) return;

      const BASE = 300; // "1x" width used in our type scale calculations

      this._ro = new ResizeObserver(entries => {
        for (const e of entries){
          // Pick a safe width value (boxSize → contentRect → clientWidth)
          const w = (e.contentBoxSize?.[0]?.inlineSize) ?? e.contentRect?.width ?? target.clientWidth ?? BASE;
          const scale = w / BASE; // card-relative scale (no viewport math)
          this.style.setProperty('--sac-scale', String(scale));
        }
      });
      this._ro.observe(target);
    });
  }

  disconnectedCallback(){
    // Always disconnect observers to avoid leaks
    try { this._ro?.disconnect(); } catch(e) {}
    this._ro = null;
    super.disconnectedCallback();
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions(): {
    columns: number;
    rows: string;
    min_columns: number;
    max_columns: number;
    min_rows: number;
    max_rows: number;
  } {
    return {
      columns: 6,
      rows: 'auto',
      min_columns: 6,
      max_columns: 12,
      min_rows: 1,
      max_rows: 6,
    };
  }

  /* ================================
   *             CONFIG
   * ================================
   * setConfig() is called by HA with the user’s YAML options.
   * We validate required keys, parse numbers defensively, and store defaults.
   */
  setConfig(configIn: Partial<SimpleAirCardConfig> & Record<string, unknown>) {
    // --- NEW: accept grouped YAML and flatten it for runtime ---------------
    const asKV = (value: unknown): KvRecord => {
      if (!value) return {};
      if (Array.isArray(value)) {
        const out: KvRecord = {};
        for (const item of value) {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            Object.assign(out, item as KvRecord);
          }
        }
        return out;
      }
      return typeof value === 'object' ? (value as KvRecord) : {};
    };
    const tAnch = asKV(configIn?.temperature_anchors);
    const hAnch = asKV(configIn?.humidity_alert_anchors);
    const card  = asKV(configIn?.card_options);
    const config = { ...configIn, ...tAnch, ...hAnch, ...card } as (SimpleAirCardConfig & KvRecord);
    // --- NEW: sanitize icon_position ('left' | 'right' | 'bottom') ---
    const icon_position = (() => {
      const v = String((config?.icon_position ?? 'left')).toLowerCase();
      return v === 'right' || v === 'bottom' ? v : 'left';
    })();
    const temp_preset = normalizePreset(config?.temp_preset);
    const icon = (config?.icon && String(config.icon)) || 'mdi:home-account';
    // -----------------------------------------------------------------------

    // --- Normalize display-unit prefs (YAML-safe) ---
    const normTempDU = String(config?.temp_display_unit ?? 'auto').toLowerCase();
    const temp_display_unit =
      normTempDU === 'c' || normTempDU === '°c' ? 'c' :
      normTempDU === 'f' || normTempDU === '°f' ? 'f' : 'auto';

    // Accept legacy "m/s|km/h" but store YAML-safe tokens: ms|kmh|mph|kn
    const normWindDUraw = String(config?.wind_display_unit ?? 'ms').toLowerCase();
    const wind_display_unit =
      /km\/?h/.test(normWindDUraw) ? 'kmh' :
      normWindDUraw.includes('mph') ? 'mph' :
      normWindDUraw.includes('kn')  ? 'kn'  : 'ms';

    // Helpers to convert YAML default wind (given in the chosen token) → m/s
    const parseMaybeNumber = (value: unknown): number =>
      (value === undefined || value === null || value === '' ? NaN : Number(value));
    const toMpsByToken = (value: number, token: string): number => {
      if (!Number.isFinite(value)) return 0;
      switch (token) {
        case 'kmh': return value / 3.6;
        case 'mph': return value * 0.44704;
        case 'kn':  return value * 0.514444;
        default:    return value;
      }
    };
    const defaultWindYaml = Number.isFinite(parseMaybeNumber(config?.default_wind_speed))
      ? parseMaybeNumber(config.default_wind_speed)
      : 0;
    const defaultWindMps  = toMpsByToken(defaultWindYaml, wind_display_unit);

    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');
    }

    // ---- Console notices for legacy / conflicting keys (warn once) ----
    if (!hasWarnedLegacy()) {
      const present = LEGACY_TEMP_KEYS.filter(k => k in config);
      if (present.length) {
        console.warn(
          'simple-air-comfort-card: Detected legacy/derived or alias keys in YAML. ' +
          'The card now derives hidden neighbors automatically from 10 anchors.\n' +
          'Omit these keys from YAML:', present,
          '\nKeep only: t_frosty_min, t_cold_min, t_chilly_min, t_cool_min, t_mild_min, ' +
          't_perfect_min, t_perfect_max, t_warm_max, t_hot_max, t_boiling_max.'
        );
        markLegacyWarned();
      }
    }
    if (!hasWarnedAliasConflict()) {
      const hasPerfect = ('t_perfect_min' in config) || ('t_perfect_max' in config);
      const hasPerf    = ('t_perf_min'    in config) || ('t_perf_max'    in config);
      if (hasPerfect && hasPerf) {
        console.warn(
          'simple-air-comfort-card: Both alias sets present for PERFECT band. ' +
          'Using t_perfect_min/t_perfect_max and ignoring t_perf_min/t_perf_max.'
        );
        markAliasConflictWarned();
      }
    }


    // Small number parser that returns NaN for missing/blank
    const num = (value: unknown): number =>
      (value === undefined || value === null || value === '' ? NaN : Number(value));

    // Geometry (percentages that must match the CSS layout)
    const ring_pct   = Number.isFinite(num(config.ring_pct))  ? num(config.ring_pct)  : 45;   // dial box size (% of card)
    const inner_pct  = Number.isFinite(num(config.inner_pct)) ? num(config.inner_pct) : 46.5; // inner circle size (% of dial)
    const center_pct = 50; // fixed vertical center for the dial
    const y_offset_pct = Number.isFinite(num(config.y_offset_pct)) ? num(config.y_offset_pct) : 0; // fine vertical tweak

    // Expand to a full contiguous temperature ladder from the 10 anchors
    const ten = pickTenAnchors(config, temp_preset);
    const full = expandFromTen(ten, temp_preset);

    // Final sanitized config object we’ll use at runtime
    this._config = {
      // keep preset around for downstream functions/editor
      temp_preset,
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      feels_like: (config.feels_like ?? 'bom'), // 'bom' | 'wind_chill' | 'heat_index' | 'humidex'
      decimals: Number.isFinite(num(config.decimals)) ? num(config.decimals) : 1,
      // Display preferences (YAML-safe tokens)
      temp_display_unit,
      wind_display_unit,
      default_wind_speed: Number.isFinite(defaultWindMps) ? defaultWindMps : 0.0, // stored internally as m/s
      icon, // ← user-selectable MDI icon (YAML + editor)
      icon_position, // ← NEW
      // Editor-only guardrail (not used by runtime physics)
      cap_degrees: Number.isFinite(num(config.cap_degrees)) ? num(config.cap_degrees) : 6.0,

      // Comfort bands: use fully-expanded contiguous ranges
      t_frosty_min: full.t_frosty_min, t_frosty_max: full.t_frosty_max,
      t_cold_min:   full.t_cold_min,   t_cold_max:   full.t_cold_max,
      t_chilly_min: full.t_chilly_min, t_chilly_max: full.t_chilly_max,
      t_cool_min:   full.t_cool_min,   t_cool_max:   full.t_cool_max,
      t_mild_min:   full.t_mild_min,   t_mild_max:   full.t_mild_max,
      t_perf_min:   full.t_perf_min,   t_perf_max:   full.t_perf_max,
      t_warm_min:   full.t_warm_min,   t_warm_max:   full.t_warm_max,
      t_hot_min:    full.t_hot_min,    t_hot_max:    full.t_hot_max,
      t_boiling_min:full.t_boiling_min,t_boiling_max:full.t_boiling_max,

      // Geometry calibration (should match CSS)
      ring_pct, inner_pct, center_pct, y_offset_pct,

      // RH→X mapping calibration (keeps 0% at left edge, 100% at right edge)
      rh_left_inner_pct:  Number.isFinite(num(config.rh_left_inner_pct))  ? num(config.rh_left_inner_pct)  : 40.0,
      rh_right_inner_pct: Number.isFinite(num(config.rh_right_inner_pct)) ? num(config.rh_right_inner_pct) : 60.0,
    };
  }

  /* ================================
   *             RENDER
   * ================================
   * Produces the DOM via Lit. We compute all physics + texts first,
   * then pass a small "view model" to #face() which returns the template.
   */
  render(): TemplateResult {
    // If HA or config didn’t arrive yet, render nothing
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return html``;

    // Fetch current entity states (strings from HA state machine)
    const tState  = hass.states[config.temperature];
    const rhState = hass.states[config.humidity];
    const wsState = config.windspeed ? hass.states[config.windspeed] : undefined;

    // If required entities are missing, show neutral face (no ha-card wrapper)
    if (!tState || !rhState) {
      // neutral background + centered fallback position
      this.style.setProperty('--sac-temp-bg', '#2a2a2a');
      const { y_center } = this.#geomAnchors();
      return html`
        <div class="ratio" role="img" aria-label="Air comfort dial">
          <div class="canvas">
            ${this.#face({
              dewText: 'Unknown',
              tempText: 'N/A',
              rhText: 'N/A',
              ringGrad: this.#dewpointRingGradientFromText('Unknown'),
              innerGrad: this.#innerEyeGradient(NaN, NaN, this.#bandThresholds()),
              // Default dot pos at geometric center; flash red to signal unavailable
              xPct: 50, yPct: y_center, outside: true,
              dewOut: '—', atOut: '—', tempRaw: '—', rhRaw: '—', atTag: '',
              axisTopStyle: '', axisBottomStyle: '', axisLeftStyle: '', axisRightStyle: '',
            })}
          </div>
        </div>
      `;
    }

    /* ---------------------------
     * Parse & compute "physics"
     * ---------------------------
     * - Convert temperature to °C if needed
     * - Clamp RH to 0..100
     * - Resolve wind speed (convert to m/s for BoM formula)
     * - Compute saturation vapour pressure (Buck), actual e (hPa), dew point,
     *   and Apparent Temperature (AT) as per Australian BoM.
     */
    const unitAttr = tState.attributes.unit_of_measurement;
    const unitIn = typeof unitAttr === 'string' ? unitAttr.trim() : '°C';
    const Tc = this.#toCelsius(Number.isFinite(+tState.state) ? +tState.state : NaN, unitIn);
    const RH = this.#clampRH(Number.isFinite(+rhState.state) ? +rhState.state : NaN);
    const WS = this.#resolveWind(wsState, this._config.default_wind_speed);

    const es  = this.#buckSaturationVapourPressure_hPa(Tc);     // hPa @ saturation
    const e   = (RH / 100) * es;                                // actual vapour pressure (hPa)
    const dpC = this.#dewPointFromVapourPressure_hPa(e);        // dew point (°C)
    // Feels-like selector
    let atC;
    let atTag; // short label for UI
    switch (String(this._config.feels_like || 'bom')) {
      case 'wind_chill':
        atC = this.#windChillC(Tc, WS);
        atTag = 'Wind Chill';
        break;
      case 'heat_index':
        atC = this.#heatIndexC(Tc, RH);
        atTag = 'Heat Index';
        break;
      case 'humidex':
        atC = this.#humidexC(Tc, e);
        atTag = 'Humidex';
        break;
      case 'bom':
      default:
        atC = this.#apparentTemperatureC(Tc, e, WS);
        atTag = 'BoM AT';
        break;
    }

    /* ---------------------------
     * Friendly texts + visuals
     * ---------------------------
     * Convert numbers to human-readable bands/labels, and build gradients.
     */
    const dewText  = this.#dewpointTextFromMacro(dpC);
    const tempText = this.#temperatureTextFromMacro(Tc);
    const rhText   = this.#humidityTextFromMacro(RH);

    const cardBg    = this.#backgroundGradientForTempC(Tc);
    const ringGrad  = this.#dewpointRingGradientFromText(dewText);
    const B         = this.#bandThresholds();                   // contiguous bands
    const innerGrad = this.#innerEyeGradient(RH, Tc, B);
    const iconGrad  = this.#iconBackgroundGradientForTemp(Tc);

    /* ---------------------------
     * Axis highlight logic
     * ---------------------------
     * When too hot/cold or too dry/humid, the matching axis label glows.
     */
    const Lh = Number(this._config?.rh_left_inner_pct ?? 40);
    const Rh = Number(this._config?.rh_right_inner_pct ?? 60);

    const pal = this.#palette();
    const isHot    = Number.isFinite(Tc) && Tc > B.PERFECT.max;
    const isCold   = Number.isFinite(Tc) && Tc < B.PERFECT.min;
    const isLowRH  = Number.isFinite(RH) && RH < Lh;
    const isHighRH = Number.isFinite(RH) && RH > Rh;

    const GLOW = (col: string): string => `
      color:white;
      text-shadow:
        0 0 calc(var(--sac-scale,1) * 2px)  rgba(255,255,255,.95),
        0 0 calc(var(--sac-scale,1) * 10px) ${col},
        0 0 calc(var(--sac-scale,1) * 22px) ${col},
        0 0 calc(var(--sac-scale,1) * 40px) ${col},
        0 0 calc(var(--sac-scale,1) * 70px) ${col},
        0 0 calc(var(--sac-scale,1) * 100px) ${col};
    `;

    const axisTopStyle    = isHot    ? GLOW(pal.hot)   : '';
    const axisBottomStyle = isCold   ? GLOW(pal.cold)  : '';
    const axisLeftStyle   = isLowRH  ? GLOW(pal.humid) : '';
    const axisRightStyle  = isHighRH ? GLOW(pal.humid) : '';

    /* ---------------------------
     * Dot position (percentages)
     * ---------------------------
     * - Y: temperature anchored to geometry (smoothstep between landmarks)
     * - X: RH piecewise-mapped so user-chosen inner circle intersections line up
     */
    const yPctBase = this.#tempToYPctGeometryAware(Tc);
    const yPct = Number.isFinite(yPctBase) ? this.#clamp(yPctBase + (this._config.y_offset_pct || 0), 0, 100) : 50;

    const xPctBase = this.#rhToXPctCalibrated(RH);
    const xPct = Number.isFinite(xPctBase) ? this.#clamp(xPctBase, 0, 100) : 50;

    /* ---------------------------
     * Outside comfort check
     * ---------------------------
     * “Outside” means out of PERFECT temp band or outside inner RH thresholds.
     * When outside, the dot shows a pulsing halo.
     */
    const outside = (Number.isFinite(RH) && Number.isFinite(Tc))
      ? (RH < Lh || RH > Rh || Tc < B.PERFECT.min || Tc > B.PERFECT.max)
      : true;

    /* ---------------------------
     * Formatted outputs for corners
     * ---------------------------
     * Keep HA’s current temp unit (°C/°F) for display, retain % for RH.
     */
    const d = this._config.decimals;
    // Respect display preference: 'auto' uses sensor unit, 'c'/'f' override
    const outUnitPref = this._config?.temp_display_unit || 'auto';
    const outUnit =
      outUnitPref === 'c' ? '°C' :
      outUnitPref === 'f' ? '°F' :
      unitIn;
    const dewOut  = this.#formatNumber(this.#fromCelsius(dpC, outUnit), d) + ` ${outUnit}`;
    const atOut   = this.#formatNumber(this.#fromCelsius(atC,  outUnit), d) + ` ${outUnit}`;
    const tempRaw = this.#formatNumber(this.#fromCelsius(Tc,  outUnit), d) + ` ${outUnit}`;
    const rhRaw   = Number.isFinite(RH) ? this.#round(RH, d).toFixed(d) + ' %' : '—';

    // Render Face Host now owns the background; no <ha-card> wrapper
    this.style.setProperty('--sac-temp-bg', cardBg);
    return html`
      <div class="ratio" role="img" aria-label="Air comfort dial">
        <!-- Temperature-tinted icon puck: sits below content (z:-1), coords via inline style -->
        ${Number.isFinite(Tc) ? html`
          ${(() => {
            // compute coordinates for puck
            const pos = String(this._config.icon_position || 'left');
            let left = '10%'; let top = '50%';
            if (pos === 'right')  { left = '90%'; top = '50%'; }
            if (pos === 'bottom') { left = '50%'; top = '90%'; }
            const style = `
              left:${left};
              top:${top};
              transform: translate(-50%, -50%) scale(0.7);
              background:${iconGrad};
            `;
            return html`
              <div class="icon-puck" style=${style}>
                <ha-icon .icon=${this._config.icon}></ha-icon>
              </div>
            `;
          })()}
        ` : nothing}

        <div class="canvas">
          ${this.#face({
            // labels + gradients
            dewText, tempText, rhText,
            ringGrad, innerGrad,
            // geometry
            xPct, yPct, outside,
            // text outputs
            dewOut, atOut, tempRaw, rhRaw, atTag,
            // axis glow styles
            axisTopStyle, axisBottomStyle, axisLeftStyle, axisRightStyle
          })}
        </div>
      </div>
    `;
  }

  /**
   * #face() returns the DOM for the dial and labels.
   * Keeping this small makes it easy to tweak markup without touching physics.
   */
  #face({
    dewText,
    tempText,
    rhText,
    ringGrad,
    innerGrad,
    xPct,
    yPct,
    outside,
    dewOut,
    atOut,
    tempRaw,
    rhRaw,
    atTag = '',
    axisTopStyle = '',
    axisBottomStyle = '',
    axisLeftStyle = '',
    axisRightStyle = '',
  }: {
    dewText: string;
    tempText: string;
    rhText: string;
    ringGrad: string;
    innerGrad: string;
    xPct: number;
    yPct: number;
    outside: boolean;
    dewOut: string;
    atOut: string;
    tempRaw: string;
    rhRaw: string;
    atTag?: string;
    axisTopStyle?: string;
    axisBottomStyle?: string;
    axisLeftStyle?: string;
    axisRightStyle?: string;
  }): TemplateResult {
    return html`
      <div class="header">
        <div class="title">${this._config.name ?? 'Air Comfort'}</div>
        <div class="subtitle">${dewText}</div>
      </div>

      <!-- TL / TR corner stats -->
      <div class="corner tl">
        <span class="label">Dew point</span>
        <span class="metric">${dewOut}</span>
      </div>
      <div class="corner tr">
        <span class="label">Feels like</span>
        <span class="metric">${atOut}</span>
        ${atTag ? html`<span class="sublabel">${atTag}</span>` : nothing}
      </div>

      <!-- BL / BR corner stats (raw values + comfort labels) -->
      <div class="corner bl">
        <span class="label">Temp</span>
        <span class="metric">${tempRaw}</span>
        <span class="comfort">${tempText}</span>
      </div>
      <div class="corner br">
        <span class="label">Humidity</span>
        <span class="metric">${rhRaw}</span>
        <span class="comfort">${rhText}</span>
      </div>

      <!-- Dial (outer ring + inner eye) and labeled axes -->
      <div class="graphic"
            style="--sac-ring-pct:${this._config.ring_pct}%;
                  --sac-inner-pct:${this._config.inner_pct}%;
                  --sac-dewpoint-ring:${ringGrad};
                  --sac-inner-gradient:${innerGrad}">
        <div class="axis axis-top"    style=${axisTopStyle || nothing}    aria-label="Warm">Warm</div>
        <div class="axis axis-bottom" style=${axisBottomStyle || nothing} aria-label="Cold">Cold</div>
        <div class="axis axis-left"   style=${axisLeftStyle || nothing}   aria-label="Dry">Dry</div>
        <div class="axis axis-right"  style=${axisRightStyle || nothing}  aria-label="Humid">Humid</div>

        <div class="outer-ring" aria-hidden="true"></div>
        <div class="inner-circle" aria-hidden="true"></div>
      </div>

      <!-- The moving dot -->
      <div class="dot ${outside ? 'outside' : ''}" style="left:${xPct}%; bottom:${yPct}%;"></div>
    `;
  }

  /* ================================
   *             PHYSICS
   * ================================
   * Formulas:
   * - Buck saturation vapour pressure (Arden Buck) → es(T) in hPa
   * - Dew point from bisection search that finds T where es(T) = e
   * - Apparent Temperature (BoM): AT = T + 0.33e - 0.70WS - 4.0
   *   (We input e in hPa and WS in m/s)
   */
  #apparentTemperatureC(Tc, e_hPa, ws_mps){ return Tc + 0.33*e_hPa - 0.70*ws_mps - 4.0; }

  // Wind Chill (NWS/Environment Canada) — expects T in °C, wind in km/h
  #windChillC(Tc, ws_mps){
    if (!Number.isFinite(Tc) || !Number.isFinite(ws_mps)) return NaN;
    const V = ws_mps * 3.6; // m/s -> km/h
    // Standard formula valid roughly for T<=10°C and V>=4.8 km/h; still return continuous value otherwise.
    return 13.12 + 0.6215*Tc - 11.37*Math.pow(V,0.16) + 0.3965*Tc*Math.pow(V,0.16);
  }

  // Heat Index (Rothfusz regression) — compute in °F then convert back
  #heatIndexC(Tc, RH){
    if (!Number.isFinite(Tc) || !Number.isFinite(RH)) return NaN;
    const T = Tc * 9/5 + 32; // °F
    const R = this.#clampRH(RH); // %
    const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541;
    const c5 = -0.00683783, c6 = -0.05481717, c7 = 0.00122874, c8 = 0.00085282, c9 = -0.00000199;
    let HI = c1 + c2*T + c3*R + c4*T*R + c5*T*T + c6*R*R + c7*T*T*R + c8*T*R*R + c9*T*T*R*R;
    // Simple adjustments (NWS) near lower bounds — optional; safe to omit for compactness.
    // Convert back to °C
    return (HI - 32) * 5/9;
  }

  // Humidex (Environment Canada) — needs vapour pressure (hPa)
  #humidexC(Tc, e_hPa){
    if (!Number.isFinite(Tc) || !Number.isFinite(e_hPa)) return NaN;
    // Humidex = T + 0.5555*(e - 10) where e is in hPa
    return Tc + 0.5555 * (e_hPa - 10);
  }

  #buckSaturationVapourPressure_hPa(Tc){
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) return 6.1121 * Math.exp((18.678 - Tc/234.5) * (Tc/(257.14 + Tc)));
    return 6.1115 * Math.exp((23.036 - Tc/333.7) * (Tc/(279.82 + Tc)));
  }

  #dewPointFromVapourPressure_hPa(e_hPa){
    // Invert Buck with a stable bisection over [-80, 60] °C
    if (!Number.isFinite(e_hPa) || e_hPa <= 0) return NaN;
    let lo=-80, hi=60, mid=0;
    for(let i=0;i<60;i++){
      mid=(lo+hi)/2;
      const es=this.#buckSaturationVapourPressure_hPa(mid);
      if (!Number.isFinite(es)) break;
      if (es > e_hPa) hi=mid; else lo=mid;
      if (Math.abs(hi-lo) < 1e-4) break;
    }
    return mid;
  }

  /* ================================
   *       TEXT LABEL LOOKUPS
   * ================================
   * Turn raw numbers into helpful words for users.
   */
  #dewpointTextFromMacro(dpC: number): string {
    if (!Number.isFinite(dpC)) return 'Unknown';
    if (dpC < 5)                       return 'Very Dry';
    if (dpC <= 10)                     return 'Dry';
    if (dpC <= 12.79)                  return 'Pleasant';
    if (dpC <= 15.49)                  return 'Comfortable';
    if (dpC <= 18.39)                  return 'Sticky Humid';
    if (dpC <= 21.19)                  return 'Muggy';
    if (dpC <= 23.9)                   return 'Sweltering';
    return 'Stifling';
  }

  #temperatureTextFromMacro(Tc: number): string {
    if (!Number.isFinite(Tc)) return 'N/A';
    const B = this.#bandThresholds();

    // Round to 0.1 °C to avoid off-by-one band edges
    const t = this.#round1(Tc);

    const bands: Array<[string, number, number]> = [
      ["FROSTY",  B.FROSTY.min,  B.FROSTY.max],
      ["COLD",    B.COLD.min,    B.COLD.max],
      ["CHILLY",  B.CHILLY.min,  B.CHILLY.max],
      ["COOL",    B.COOL.min,    B.COOL.max],
      ["MILD",    B.MILD.min,    B.MILD.max],
      ["PERFECT", B.PERFECT.min, B.PERFECT.max],
      ["WARM",    B.WARM.min,    B.WARM.max],
      ["HOT",     B.HOT.min,     B.HOT.max],
      ["BOILING", B.BOILING.min, B.BOILING.max],
    ];
    for (const [name, lo, hi] of bands){
      if (t >= lo && t <= hi) return name;
    }
    // Fallback if outside configured extremes
    return t < bands[0][1] ? "FROSTY" : "BOILING";
  }

  #humidityTextFromMacro(RH: number): string {
    if (!Number.isFinite(RH)) return 'N/A';
    const L = Number(this._config?.rh_left_inner_pct ?? 40);
    const R = Number(this._config?.rh_right_inner_pct ?? 60);
    if (RH < L) return 'DRY';
    if (RH <= R) return 'COMFY';
    return 'HUMID';
  }

  /* ================================
   *      VISUAL MAPS / GRADIENTS
   * ================================
   * These compute the CSS backgrounds based on the labels above.
   */
  #temperatureComfortTextForBg(Tc: number): string {
    if (!Number.isFinite(Tc)) return 'n/a';
    return this.#temperatureTextFromMacro(Tc).toLowerCase();
  }
  #_bgColourFromText(text: string): string {
    const t=String(text||'').toLowerCase();
    if (t==='frosty') return 'mediumblue';
    if (t==='cold') return 'dodgerblue';
    if (t==='chilly') return 'deepskyblue';
    if (t==='cool') return 'mediumaquamarine';
    if (t==='mild') return 'seagreen';
    if (t==='perfect') return 'limegreen';
    if (t==='warm') return 'gold';
    if (t==='hot') return 'orange';
    if (t==='boiling') return 'crimson';
    return 'dimgray';
  }
  #backgroundGradientForTempC(Tc: number): string {
    const label=this.#temperatureComfortTextForBg(Tc);
    const colour=this.#_bgColourFromText(label);
    return `radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${colour})`;
  }
  #dewpointRingGradientFromText(text: string): string {
    const base = ({
      'Very Dry':'deepskyblue','Dry':'mediumaquamarine','Pleasant':'limegreen','Comfortable':'yellowgreen',
      'Sticky Humid':'yellow','Muggy':'gold','Sweltering':'orange','Stifling':'crimson'
    })[text] || 'dimgray';
    return `radial-gradient(circle, ${base}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`;
  }

  #innerEyeGradient(RH: number, Tc: number, B: ComfortBandMap): string {
    const pal = this.#palette();

    // RH color: tied to your inner-circle thresholds
    const Lh = Number(this._config?.rh_left_inner_pct ?? 40);
    const Rh = Number(this._config?.rh_right_inner_pct ?? 60);

    let humidityColor = 'black';
    if (!Number.isFinite(RH))       humidityColor = 'dimgray'; // unknown → neutral
    else if (RH < Lh || RH > Rh)    humidityColor = pal.humid; // out of range → alert

    // Temperature color driven by PERFECT band
    const lo = B.PERFECT.min;
    const hi = B.PERFECT.max;
    let temperatureColor = pal.inband;                 // inside band → dim gray
    if (Number.isFinite(Tc)) {
      if (Tc > hi)      temperatureColor = pal.hot;    // too hot
      else if (Tc < lo) temperatureColor = pal.cold;   // too cold
    }
    return `radial-gradient(circle, ${humidityColor} 0%, black, ${temperatureColor} 70%)`;
  }

  /* ================================
   *  Icon puck gradient (temp-matched)
   * ================================
   * First gradient stop must match the card’s temperature background colour.
   * Uses the same band → colour mapping as #backgroundGradientForTempC.
   */
  #iconBackgroundGradientForTemp(Tc: number): string {
    const bandText = this.#temperatureComfortTextForBg(Tc); // 'frosty'...'boiling' or 'n/a'
    const base = this.#_bgColourFromText(bandText);         // named CSS colour

    // Prefer color-mix when supported for a clean 50% alpha blend
    if (typeof this.__supportsColorMix === 'undefined') {
      this.__supportsColorMix = CSS?.supports?.('color: color-mix(in srgb, red 50%, transparent)') ?? false;
    }
    if (this.__supportsColorMix){
      return `radial-gradient(circle, color-mix(in srgb, ${base} 50%, transparent) 0%, rgba(0,0,0,0) 78%)`;
    }

    // Fallback: map named colour → RGB → rgba(...,0.5)
    const RGB = {
      mediumblue:[0,0,205], dodgerblue:[30,144,255], deepskyblue:[0,191,255],
      mediumaquamarine:[102,205,170], seagreen:[46,139,87], limegreen:[50,205,50],
      gold:[255,215,0], orange:[255,165,0], crimson:[220,20,60], dimgray:[105,105,105]
    }[String(base).toLowerCase()] || [105,105,105];
    const rgba = `rgba(${RGB[0]},${RGB[1]},${RGB[2]},0.5)`;
    return `radial-gradient(circle, ${rgba} 0%, rgba(0,0,0,0) 78%)`;
  }


  /* ================================
   *             HELPERS
   * ================================ */
  #clamp(v: number, a: number, b: number): number { return Math.min(b, Math.max(a, v)); }
  #lerp(t: number, a: number, b: number): number { return a + (b - a) * t; }
  #invLerp(v: number, a: number, b: number): number { return (v - a) / (b - a); }
  #round1(v: number): number { return Math.round(v * 10) / 10; } // to 0.1 °C
  #smoothstep(x: number): number { return x * x * (3 - 2 * x); } // smooth interpolation

  // Shared palette (CSS-customizable with fallbacks)
  #palette(): Record<'hot' | 'cold' | 'humid' | 'inband', string> {
    return {
      hot:   'var(--sac-col-hot, rgba(255,69,0,0.95))',
      cold:  'var(--sac-col-cold, rgba(0,102,255,0.95))',
      humid: 'var(--sac-col-humid-alert, hotpink)',
      inband:'var(--sac-col-inband, dimgray)',
    };
  }

  // Build sanitized contiguous bands from config, enforcing 0.1 °C gaps
  #bandThresholds(): ComfortBandMap {
    const preset = TEMP_PRESETS[normalizePreset(this._config?.temp_preset)];
    const fallback = expandFromTen(preset, this._config?.temp_preset);
    return buildComfortBandMap((this._config || {}) as KvRecord, fallback);
  }

  /* -------------------------------------------
   * Geometry anchors in card %, derived from config
   * -------------------------------------------
   * We compute x/y landmarks so temp/RH map smoothly to visual anchors:
   * - inner circle intersections left/right (for RH → X%)
   * - dial diameters + center (for temperature → Y%)
   */
  #geomAnchors(): GeomAnchorMap {
    const ring   = Number(this._config?.ring_pct   ?? 45);   // dial box size (% of card)
    const innerR = Number(this._config?.inner_pct  ?? 46.5); // inner circle size (% of dial)
    const C      = Number(this._config?.center_pct ?? 50);   // vertical center (%)

    const R_outer = ring / 2;                      // outer ring radius (card %)
    const R_inner = (innerR/100) * (ring/2);       // inner circle radius (card %)

    // Horizontal anchors for inner circle intersections
    const x_inner_left  = 50 - R_inner;
    const x_inner_right = 50 + R_inner;

    // Vertical anchors at ring diameters and center
    const y_outer_bottom = C - R_outer;
    const y_outer_top    = C + R_outer;
    const y_inner_bottom = C - R_inner;
    const y_inner_top    = C + R_inner;
    const y_center       = C;

    return {
      y_outer_bottom, y_outer_top, y_inner_bottom, y_inner_top,
      y_center,
      x_inner_left, x_inner_right
    } as GeomAnchorMap;
  }

  /* -------------------------------------------
   * RH → X% mapping (piecewise linear)
   * -------------------------------------------
   * Ensures:
   *   RH  = 0    → X = 0      (left edge of card)
   *   RH  = L    → X = inner-left intersection
   *   RH  = R    → X = inner-right intersection
   *   RH  = 100  → X = 100    (right edge of card)
   * L/R come from config (defaults 40/60).
   */
  #rhToXPctCalibrated(RH: number): number {
    if (!Number.isFinite(RH)) return NaN;
    const { x_inner_left: XL, x_inner_right: XR } = this.#geomAnchors();

    // sanitize L,R to [0,100] and ensure L < R
    const Lraw = Number(this._config?.rh_left_inner_pct  ?? 40);
    const Rraw = Number(this._config?.rh_right_inner_pct ?? 60);
    const L = this.#clamp(Lraw, 0, 100);
    const R = this.#clamp(Math.max(Rraw, L + 0.1), 0, 100);

    const v = this.#clamp(RH, 0, 100);

    // guard degenerate edges (avoid division by zero when L==0 or R==100)
    const EPS = 1e-6;
    if (L <= EPS && v <= L) return 0;
    if (R >= 100 - EPS && v >= R) return 100;

    if (v <= L){
      const t = this.#invLerp(v, 0, L);
      return this.#lerp(t, 0, XL);
    } else if (v >= R){
      const t = this.#invLerp(v, R, 100);
      return this.#lerp(t, XR, 100);
    } else {
      const t = this.#invLerp(v, L, R);
      return this.#lerp(t, XL, XR);
    }
  }

  /* -------------------------------------------
   * Temperature → Y% mapping (locked anchors + smooth segments)
   * ORDER (and UI order) — top → bottom:
   *   BOILING.max → top (100%)              [LOCKED]
   *   HOT.max     → scales between          [EVEN between WARM.max..BOILING.max]
   *   WARM.max    → outer-top               [LOCKED]
   *   PERFECT.max → inner-top               [LOCKED]
   *   PERFECT.min → inner-bottom            [LOCKED]
   *   MILD.min    → outer-bottom            [LOCKED]
   *   COOL.min    →                         [EVEN between FROSTY.min..MILD.min]
   *   CHILLY.min  →                         [EVEN between FROSTY.min..MILD.min]
   *   COLD.min    →                         [EVEN between FROSTY.min..MILD.min]
   *   FROSTY.min  → bottom (0%)             [LOCKED]
   
   * Note: bottom/top are locked to t_frosty_min and t_boiling_max respectively.
   * Segment rules:
   * - FROSTY.min → MILD.min         : bottom → outer-bottom       (SMOOTH)
   * - MILD.min   → PERFECT.min      : outer-bottom → inner-bottom (LINEAR)
   * - PERFECT.min→ PERFECT.max      : inner-bottom → inner-top    (LINEAR)
   * - PERFECT.max→ WARM.max         : inner-top → outer-top       (LINEAR)
   * - WARM.max   → BOILING.max      : outer-top → top             (SMOOTH)
   */
  #tempToYPctGeometryAware(Tc: number): number {
    const a = this.#geomAnchors();
    const B = this.#bandThresholds();

    // Vertical endpoints
    const y_bottom = 0;
    const y_top    = 100;

    // Fixed anchors from geometry
    const y_outer_bottom = a.y_outer_bottom;
    const y_inner_bottom = a.y_inner_bottom;
    const y_inner_top    = a.y_inner_top;
    const y_outer_top    = a.y_outer_top;

    // --- Temperature-aware ladders ---
    // Helper: safe fractional position of t within [t0..t1]
    const _frac = (t, t0, t1) => {
      const den = (t1 - t0);
      if (!Number.isFinite(den) || Math.abs(den) < 1e-6) return 0;
      return this.#clamp((t - t0) / den, 0, 1);
    };

    // Bottom ladder spans FROSTY.min..MILD.min  →  y_bottom..y_outer_bottom
    const tB0 = B.FROSTY.min, tB1 = B.MILD.min;
    const yB0 = y_bottom,     yB1 = y_outer_bottom;
    const yFromBottomSpan = (t) => yB0 + _frac(t, tB0, tB1) * (yB1 - yB0);

    const y_frosty_min = yFromBottomSpan(B.FROSTY.min); // = y_bottom
    const y_cold_min   = yFromBottomSpan(B.COLD.min);
    const y_chilly_min = yFromBottomSpan(B.CHILLY.min);
    const y_cool_min   = yFromBottomSpan(B.COOL.min);
    const y_mild_min   = yFromBottomSpan(B.MILD.min);   // = y_outer_bottom

    // Ordered anchors (temperature asc → Y% asc). Matches UI order.
    // Top helper: place HOT.max proportionally in WARM.max..BOILING.max
    const tT0 = B.WARM.max, tT1 = B.BOILING.max;
    const yT0 = y_outer_top, yT1 = y_top;
    const y_hot_max = yT0 + _frac(B.HOT.max, tT0, tT1) * (yT1 - yT0);

    const P = [
      { t: B.FROSTY.min,  y: y_frosty_min    }, // bottom (0%)  [LOCKED]
      { t: B.COLD.min,    y: y_cold_min      }, // parametric   [SPAN-FRACTION]
      { t: B.CHILLY.min,  y: y_chilly_min    }, // parametric   [SPAN-FRACTION]
      { t: B.COOL.min,    y: y_cool_min      }, // parametric   [SPAN-FRACTION]
      { t: B.MILD.min,    y: y_mild_min      }, // outer-bottom [LOCKED]
      { t: B.PERFECT.min, y: y_inner_bottom  }, // inner-bottom [LOCKED]
      { t: B.PERFECT.max, y: y_inner_top     }, // inner-top    [LOCKED]
      { t: B.WARM.max,    y: y_outer_top     }, // outer-top    [LOCKED]
      { t: B.HOT.max,     y: y_hot_max       }, // proportional in WARM..BOILING
      { t: B.BOILING.max, y: y_top           }, // top (100%)   [LOCKED]
    ];

    if (!Number.isFinite(Tc)) return a.y_center;
    if (Tc <= P[0].t) return P[0].y;
    if (Tc >= P[P.length-1].t) return P[P.length-1].y;

    // Interp between surrounding anchors:
    //  - SMOOTH on the two outer spans (FROSTY.min→MILD.min, WARM.max→BOILING.max)
    //  - LINEAR on the three inner spans (MILD.min→PERFECT.min, PERFECT.min→PERFECT.max, PERFECT.max→WARM.max)
    for (let i = 0; i < P.length - 1; i++){
      const a0 = P[i], a1 = P[i+1];
      if (Tc >= a0.t && Tc <= a1.t){
        const s = this.#clamp((Tc - a0.t) / (a1.t - a0.t), 0, 1);

        // Linear for the three inner spans:
        // [MILD.min→PERFECT.min], [PERFECT.min→PERFECT.max], [PERFECT.max→WARM.max]
        const isLinear =
          (a0.t === B.MILD.min    && a1.t === B.PERFECT.min) ||
          (a0.t === B.PERFECT.min && a1.t === B.PERFECT.max) ||
          (a0.t === B.PERFECT.max && a1.t === B.WARM.max);

        const u = isLinear ? s : this.#smoothstep(s);
        return a0.y + (a1.y - a0.y) * u;
      }
    }
    return a.y_center; // safe fallback
  }

  // Constrain RH in [0,100]; return NaN if not a number
  #clampRH(rh: number): number { return Number.isFinite(rh) ? Math.min(100, Math.max(0, rh)) : NaN; }

  // Unit conversions for temperature
  #toCelsius(v: number, unit?: string): number {
    if (!Number.isFinite(v)) return NaN;
    return (unit || '').toLowerCase().includes('f') ? (v - 32) * (5 / 9) : v;
  }
  #fromCelsius(vC: number, unitOut?: string): number {
    if (!Number.isFinite(vC)) return NaN;
    return (unitOut || '').toLowerCase().includes('f') ? vC * 9 / 5 + 32 : vC;
  }

  // Resolve wind speed to m/s, with unit handling and default fallback
  #resolveWind(wsState: HassEntity | undefined, def_mps: number | undefined): number {
    if (!wsState) return def_mps ?? 0;
    const raw = Number.parseFloat(wsState.state);
    if (!Number.isFinite(raw)) return def_mps ?? 0;
    const unitRaw = wsState.attributes.unit_of_measurement;
    const unit = (typeof unitRaw === 'string' ? unitRaw : String(unitRaw ?? 'm/s')).toLowerCase();
    if (unit.includes('m/s')) return raw;
    if (unit.includes('km/h') || unit.includes('kph')) return raw / 3.6;
    if (unit.includes('mph')) return raw * 0.44704;
    if (unit.includes('kn')) return raw * 0.514444;
    return raw;
  }

  // Numeric formatting helpers
  #round(v: number, d = 1): number {
    if (!Number.isFinite(v)) return NaN;
    const p = Math.pow(10, d);
    return Math.round(v * p) / p;
  }
  #formatNumber(v: number, d = 1): string {
    return Number.isFinite(v)
      ? this.#round(v, d).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
      : '—';
  }

  /* ================================
   *          HA PLUMBING
   * ================================ */
  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    this.requestUpdate();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  // Tell HA which editor element to create for this card
  static getConfigElement(): HTMLElement {
    return document.createElement('simple-air-comfort-card-editor');
  }

  // Provide a helpful stub when user adds card from UI (auto picks typical sensors)
  static getStubConfig(hass?: HomeAssistant){
    // Back-compat: sometimes HA passes no hass here; try global if so
    const ha = hass ?? (document.querySelector('home-assistant') as (Element & { hass?: HomeAssistant }) | null)?.hass;
    const states = (ha?.states ?? {}) as Record<string, HassEntity>;
    const temp_preset = 'indoor'; // or 'outdoor' if you prefer as default
    const BASE = TEMP_PRESETS[temp_preset];

    const first = (pred: (id: string, st: HassEntity) => boolean): string | undefined => {
      for (const [id, st] of Object.entries(states)) if (pred(id, st)) return id;
      return undefined;
    };
    const dc  = (st: HassEntity | undefined): string | undefined =>
      (st?.attributes?.device_class as string | undefined);
    const uom = (st: HassEntity | undefined): string =>
      String(st?.attributes?.unit_of_measurement || '').toLowerCase();

    const temperature =
      first((id, st) => id.startsWith('sensor.') && dc(st) === 'temperature') ||
      first((id, st) => id.startsWith('sensor.') && (/°c|°f/.test(uom(st)))) ||
      first((id) => id.startsWith('sensor.'));

    const humidity =
      first((id, st) => id.startsWith('sensor.') && dc(st) === 'humidity') ||
      first((id, st) => id.startsWith('sensor.') && uom(st).includes('%')) ||
      first((id) => id.startsWith('sensor.'));

    const windspeed =
      first((id, st) => id.startsWith('sensor.') && dc(st) === 'wind_speed') ||
      first((id, st) => id.startsWith('sensor.') && /(m\/s|km\/h|kph|mph|kn)/.test(uom(st)));


    // --- NEW: return grouped YAML shape to match your desired editor layout
    return {
      type: 'custom:simple-air-comfort-card',
      name: 'Upstairs',
      temperature,
      temp_display_unit: 'auto',
      temperature_anchors: [
        { temp_preset },
        { t_boiling_max: BASE.t_boiling_max },
        { t_hot_max:     BASE.t_hot_max     },
        { t_warm_max:    BASE.t_warm_max    },
        { t_perfect_max: BASE.t_perfect_max },
        { t_perfect_min: BASE.t_perfect_min },
        { t_mild_min:    BASE.t_mild_min    },
        { t_cool_min:    BASE.t_cool_min    },
        { t_chilly_min:  BASE.t_chilly_min  },
        { t_cold_min:    BASE.t_cold_min    },
        { t_frosty_min:  BASE.t_frosty_min  },
        { cap_degrees: 6.0 },
      ],
      humidity,
      humidity_alert_anchors: [
        { rh_left_inner_pct: 40 },
        { rh_right_inner_pct: 60 },
      ],
      feels_like: 'bom',
      windspeed,
      wind_display_unit: 'ms',
      default_wind_speed: 0.1,
      card_options: [
        { icon: 'mdi:home-account' },
        { icon_position: 'left' },
        { decimals: 1 },
        { y_offset_pct: 0 },
      ],
    };
  }
}
