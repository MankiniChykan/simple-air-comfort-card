import { LitElement, html, css, nothing } from 'lit';

/**
 * Simple Air Comfort Card — src/simple-air-comfort-card.js
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

/* -----------------------------------------
 * Event helper for HA editors & dashboards
 * -----------------------------------------
 * Home Assistant config UIs expect custom cards to dispatch events like
 * "config-changed" with {bubbles:true, composed:true}. This small helper
 * emits that shape so the parent <hui-card-editor> / Lovelace can listen
 * and persist updates.
 */
const fireEvent = (node, type, detail = {}, options) => {
  const event = new CustomEvent(type, {
    detail,
    bubbles: options?.bubbles ?? true,
    cancelable: options?.cancelable ?? false,
    composed: options?.composed ?? true,
  });
  node?.dispatchEvent(event);
  return event;
};

// --- Legacy/minor-keys detector (warn once) ---
const LEGACY_TEMP_KEYS = [
  't_frosty_max','t_cold_max','t_chilly_max','t_cool_max','t_mild_max',
  't_warm_min','t_hot_min','t_boiling_min',
  // old alias set
  't_perf_min','t_perf_max'
];
let __sac_warned_legacy__ = false;
let __sac_warned_alias_conflict__ = false;


class SimpleAirComfortCard extends LitElement {
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
  static styles = css`
    /* HOST: keep layout flexible; height comes from content (the 1:1 stage) */
    :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        min-height: 0;
        --sac-scale: 1;
        --sac-top-offset: calc(var(--sac-scale, 1) * 50px);
        position: relative;
        padding: var(--card-content-padding, 0px);
        overflow: hidden;
        isolation: isolate;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--sac-temp-bg, #2a2a2a);
        contain: layout paint;

    }

    /* 1:1 square stage using aspect-ratio (replaces padding-top hacks) */
    .ratio{
      position:relative;
      display:block;
      width:100%;
      max-width:100%;
      max-height:100%;
      aspect-ratio:1 / 1;
      margin:0;
      overflow:hidden;
      flex:0 0 auto;
    }

    /* Moving dot:
     * - Absolutely positioned in percent (left/bottom)
     * - 6% of stage size (looks good for typical cards)
     */
    .dot{
      position:absolute; width:6%; height:6%; border-radius:50%;
      background:#fff; box-shadow:0 0 6px rgba(0,0,0,.45);
      transform:translate(-50%, 50%); /* align dot center to coordinate */
      transition:left .8s ease-in-out,bottom .8s ease-in-out; /* smooth moves */
      z-index:3;
    }

    /* When comfort is outside, show a pulsing halo */
    .dot.outside::before{
      content:""; position:absolute; inset:-50%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-heartbeat 2s cubic-bezier(.215,.61,.355,1) infinite; z-index:2;
    }
    @keyframes sac-heartbeat{
      /* two quick pulses, then rest */
      0%   { transform:scale(1);   opacity:0;   }
      15%  { transform:scale(1.18);opacity:1;   }
      30%  { transform:scale(.98); opacity:.6;  }
      45%  { transform:scale(1.12);opacity:1;   }
      55%  { transform:scale(1);   opacity:0;   }
      100% { transform:scale(1);   opacity:0;   }
    }

    /* Layer to hold the dial graphics */
    .canvas{ position:absolute; inset:0; padding:0; z-index:0; }

    /* Header area: small grey title + white comfort subtitle centered near top */
    .header{
      position:absolute; top:10%; left:50%; transform:translate(-50%,-50%);
      width:100%; text-align:center; pointer-events:none; z-index:4;
    }
    .title{
      color:#c9c9c9; font-weight:300;
      font-size: calc(var(--sac-scale,1) * 16px);
      line-height:1.1; letter-spacing:.2px;
    }
    .subtitle{
      color:#fff; font-weight:400;
      font-size: calc(var(--sac-scale,1) * 22px);
      text-shadow:0 1px 2px rgba(0,0,0,.35);
    }

    /* Corner stats: TL dew point, TR apparent temp, BL raw temp, BR RH */
    .corner{ position:absolute; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); z-index:4; }
    .corner .label{
      font-weight:300; opacity:.75; letter-spacing:.1px;
      font-size: calc(var(--sac-scale,1) * 16px);
      display:block;
    }
    .corner .metric{
      font-weight:500;
      font-size: calc(var(--sac-scale,1) * 20px);
      line-height:1.05;
      display: block;
    }
    /* tiny sub-label under the metric (e.g., "BoM" / "Wind Chill") */
    .corner .sublabel{
      display:block;
      margin-top: 2px;
      font-weight:300;
      font-size: calc(var(--sac-scale,1) * 12px);
      letter-spacing:.2px;
      opacity:.75;
    }
    .corner .comfort{
      font-weight:400;
      font-size: calc(var(--sac-scale,1) * 22px);
      letter-spacing:.2px;
      display: block;
      margin-top: 0rem;
    }
    .tl{ left:0%;  top:var(--sac-top-offset); transform:translate(20%,0);  text-align:left; }
    .tr{ right:0%; top:var(--sac-top-offset); transform:translate(-20%,0); text-align:right; }
    .bl{ left:0%;  bottom:0%; transform:translate(20%,-5%);   text-align:left; }
    .br{ right:0%; bottom:0%; transform:translate(-20%,-5%);   text-align:right; }

    /* The circular dial (outer ring + inner circle) sized at 45% of the stage */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:var(--sac-ring-pct,45%); height:var(--sac-ring-pct,45%); z-index:1;
    }

    /* Axis labels (dim) placed just outside the dial */
    .axis{
      position:absolute; color:rgba(200,200,200,.8);
      font-weight:300; text-shadow:0 1px 2px rgba(0,0,0,.25);
      font-size: calc(var(--sac-scale,1) * 16px);
      pointer-events:none; z-index:2;
    }
    .axis-top    { top:-10px;  left:50%; transform:translate(-50%,-50%); }
    .axis-bottom { bottom:-10px;left:50%; transform:translate(-50%, 50%); }
    .axis-left   { left:-10px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-10px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

    /* The shiny outer ring: solid border + subtle glow */
    .outer-ring{
      position:absolute; inset:0; border-radius:50%; border-style: solid; border-color: #fff; border-width: max(1.5px, calc(var(--sac-scale, 1) * var(--sac-ring-border-base, 2.5px)));
      background:var(--sac-dewpoint-ring,radial-gradient(circle,dimgray, 55%,rgba(100,100,100,.15),rgba(100,100,100,.15)));
      box-shadow:0 0 6px 3px rgba(0,0,0,.18), 0 0 18px 6px rgba(0,0,0,.22);
    }

    /* Inner "eye": gradient that tints toward hot/cold/humid based on data */
    .inner-circle{
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      width: var(--sac-inner-pct, 46.5%); height: var(--sac-inner-pct, 46.5%); border-radius:50%;
      background:var(--sac-inner-gradient,radial-gradient(circle,black 0%,black 60%));
      box-shadow:inset 0 0 12px rgba(0,0,0,.6);
    }
  `;

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

  /* ================================
   *             CONFIG
   * ================================
   * setConfig() is called by HA with the user’s YAML options.
   * We validate required keys, parse numbers defensively, and store defaults.
   */
  setConfig(config) {
    // --- NEW: accept grouped YAML and flatten it for runtime ---------------
    const asKV = (x) => {
      if (!x) return {};
      if (Array.isArray(x)) {
        const out = {};
        for (const item of x) if (item && typeof item === 'object') Object.assign(out, item);
        return out;
      }
      return typeof x === 'object' ? x : {};
    };
    const tAnch = asKV(config?.temperature_anchors);
    const hAnch = asKV(config?.humidity_alert_anchors);
    const card  = asKV(config?.card_options);
    config = { ...config, ...tAnch, ...hAnch, ...card };
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
    const _num = (v) => (v === undefined || v === null || v === '' ? NaN : Number(v));
    const _toMpsByToken = (v, token) => {
      if (!Number.isFinite(v)) return 0;
      switch (token) { case 'kmh': return v / 3.6; case 'mph': return v * 0.44704; case 'kn': return v * 0.514444; default: return v; }
    };
    const defaultWindYaml = Number.isFinite(_num(config?.default_wind_speed)) ? _num(config.default_wind_speed) : 0;
    const defaultWindMps  = _toMpsByToken(defaultWindYaml, wind_display_unit);

    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');
    }

    // ---- Console notices for legacy / conflicting keys (warn once) ----
    if (!__sac_warned_legacy__) {
      const present = LEGACY_TEMP_KEYS.filter(k => k in config);
      if (present.length) {
        console.warn(
          'simple-air-comfort-card: Detected legacy/derived or alias keys in YAML. ' +
          'The card now derives hidden neighbors automatically from 10 anchors.\n' +
          'Omit these keys from YAML:', present,
          '\nKeep only: t_frosty_min, t_cold_min, t_chilly_min, t_cool_min, t_mild_min, ' +
          't_perfect_min, t_perfect_max, t_warm_max, t_hot_max, t_boiling_max.'
        );
        __sac_warned_legacy__ = true;
      }
    }
    if (!__sac_warned_alias_conflict__) {
      const hasPerfect = ('t_perfect_min' in config) || ('t_perfect_max' in config);
      const hasPerf    = ('t_perf_min'    in config) || ('t_perf_max'    in config);
      if (hasPerfect && hasPerf) {
        console.warn(
          'simple-air-comfort-card: Both alias sets present for PERFECT band. ' +
          'Using t_perfect_min/t_perfect_max and ignoring t_perf_min/t_perf_max.'
        );
        __sac_warned_alias_conflict__ = true;
      }
    }


    // Small number parser that returns NaN for missing/blank
    const num = v => (v === undefined || v === null || v === '' ? NaN : Number(v));

    // Geometry (percentages that must match the CSS layout)
    const ring_pct   = Number.isFinite(num(config.ring_pct))  ? num(config.ring_pct)  : 45;   // dial box size (% of card)
    const inner_pct  = Number.isFinite(num(config.inner_pct)) ? num(config.inner_pct) : 46.5; // inner circle size (% of dial)
    const center_pct = 50; // fixed vertical center for the dial
    const y_offset_pct = Number.isFinite(num(config.y_offset_pct)) ? num(config.y_offset_pct) : 0; // fine vertical tweak

    // Expand to a full contiguous temperature ladder from the 10 anchors
    const ten = this.#pickTenAnchors(config);
    const full = this.#expandFromTen(ten);

    // Final sanitized config object we’ll use at runtime
    this._config = {
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
  render() {
    // If HA or config didn’t arrive yet, render nothing
    if (!this.hass || !this._config) return html``;

    // Fetch current entity states (strings from HA state machine)
    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

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
              dewOut: '—', atOut: '—', tempRaw: '—', rhRaw: '—',
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
    const unitIn = (tState.attributes.unit_of_measurement || '°C').trim();
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

    const GLOW = (col) => `
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
        <div class="canvas">
          ${this.#face({
            // underlying numbers available if you later want to expose them
            Tc, RH, dpC, atC,
            // labels + gradients
            dewText, tempText, rhText,
            ringGrad, innerGrad,
            // geometry
            xPct, yPct, outside,
            // text outputs
            outUnit, d, dewOut, atOut, tempRaw, rhRaw, atTag,
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
    dewText, tempText, rhText,
    ringGrad, innerGrad,
    xPct, yPct, outside,
    dewOut, atOut, tempRaw, rhRaw,
    atTag,
    axisTopStyle = '', axisBottomStyle = '', axisLeftStyle = '', axisRightStyle = ''
  }) {
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
  #dewpointTextFromMacro(dpC){
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

  #temperatureTextFromMacro(Tc){
    if (!Number.isFinite(Tc)) return 'N/A';
    const B = this.#bandThresholds();

    // Round to 0.1 °C to avoid off-by-one band edges
    const t = this.#round1(Tc);

    const bands = [
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

  #humidityTextFromMacro(RH){
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
  #temperatureComfortTextForBg(Tc){
    if (!Number.isFinite(Tc)) return 'n/a';
    return this.#temperatureTextFromMacro(Tc).toLowerCase();
  }
  #_bgColourFromText(text){
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
  #backgroundGradientForTempC(Tc){
    const label=this.#temperatureComfortTextForBg(Tc);
    const colour=this.#_bgColourFromText(label);
    return `radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${colour})`;
  }
  #dewpointRingGradientFromText(text){
    const base = ({
      'Very Dry':'deepskyblue','Dry':'mediumaquamarine','Pleasant':'limegreen','Comfortable':'yellowgreen',
      'Sticky Humid':'yellow','Muggy':'gold','Sweltering':'orange','Stifling':'crimson'
    })[text] || 'dimgray';
    return `radial-gradient(circle, ${base}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`;
  }

  #innerEyeGradient(RH, Tc, B){
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
   *             HELPERS
   * ================================ */
  #clamp(v,a,b){ return Math.min(b, Math.max(a,v)); }
  #lerp(t, a, b){ return a + (b - a) * t; }
  #invLerp(v, a, b){ return (v - a) / (b - a); }
  #round1(v){ return Math.round(v * 10) / 10; } // to 0.1 °C
  #smoothstep(x){ return x*x*(3 - 2*x); }       // smooth interpolation

  // Shared palette (CSS-customizable with fallbacks)
  #palette(){
    return {
      hot:   'var(--sac-col-hot, rgba(255,69,0,0.95))',
      cold:  'var(--sac-col-cold, rgba(0,102,255,0.95))',
      humid: 'var(--sac-col-humid-alert, hotpink)',
      inband:'var(--sac-col-inband, dimgray)',
    };
  }

  // Build sanitized contiguous bands from config, enforcing 0.1 °C gaps
  #bandThresholds(){
    const C = this._config || {};
    const step = 0.1;
    // enforce one decimal & tolerate NaN by falling back to a default
    const r1 = (v, dflt) => {
      const n = Number.isFinite(v) ? v : dflt;
      return Math.round(n * 10) / 10;
    };
    const B = {
      FROSTY: {min:r1(C.t_frosty_min,    0.0), max:r1(C.t_frosty_max,   2.9)},
      COLD:   {min:r1(C.t_cold_min,      3.0), max:r1(C.t_cold_max,     4.9)},
      CHILLY: {min:r1(C.t_chilly_min,    5.0), max:r1(C.t_chilly_max,   8.9)},
      COOL:   {min:r1(C.t_cool_min,      9.0), max:r1(C.t_cool_max,    13.9)},
      MILD:   {min:r1(C.t_mild_min,     14.0), max:r1(C.t_mild_max,    18.9)},
      PERFECT:{min:r1(C.t_perf_min,     19.0), max:r1(C.t_perf_max,    23.9)},
      WARM:   {min:r1(C.t_warm_min,     24.0), max:r1(C.t_warm_max,    27.9)},
      HOT:    {min:r1(C.t_hot_min,      28.0), max:r1(C.t_hot_max,     34.9)},
      BOILING:{min:r1(C.t_boiling_min,  35.0), max:r1(C.t_boiling_max, 50.0)},
    };
    // UI + Y‑mapping invariants:
    // - “Locked” visual anchors used by the geometry map:
    //   FROSTY.min, MILD.min, PERFECT.min, PERFECT.max, WARM.max, BOILING.max
    // - Even spacing within FROSTY.min..MILD.min for: COLD.min, CHILLY.min, COOL.min
    // - HOT.max is used as a helper inside WARM.max..BOILING.max for top smoothing
    const order = ["FROSTY","COLD","CHILLY","COOL","MILD","PERFECT","WARM","HOT","BOILING"];
    // Ensure each min >= previous max + 0.1, and max >= min
    for (let i=0;i<order.length;i++){
      const k = order[i], prev = order[i-1] && B[order[i-1]], cur = B[k];
      if (i>0){
        const minAllowed = r1(prev.max + step, prev.max + step);
        if (cur.min < minAllowed) cur.min = minAllowed;
      }
      if (cur.max < cur.min) cur.max = cur.min;
    }
    return B;
  }

  // ---- Ten-anchor helpers (card side) ----
  #r1_(v){ return Math.round(v*10)/10; }
  #pickTenAnchors(cfg){
    // Prefer t_perfect_* if present, else allow legacy t_perf_* in.
    const perfMin = ('t_perfect_min' in cfg) ? cfg.t_perfect_min : cfg.t_perf_min;
    const perfMax = ('t_perfect_max' in cfg) ? cfg.t_perfect_max : cfg.t_perf_max;
    return {
      t_frosty_min:  Number(cfg.t_frosty_min  ?? 0.0),
      t_cold_min:    Number(cfg.t_cold_min    ?? 3.0),
      t_chilly_min:  Number(cfg.t_chilly_min  ?? 5.0),
      t_cool_min:    Number(cfg.t_cool_min    ?? 9.0),
      t_mild_min:    Number(cfg.t_mild_min    ??14.0),
      t_perfect_min: Number(perfMin ?? 19.0),
      t_perfect_max: Number(perfMax ?? 23.9),
      t_warm_max:    Number(cfg.t_warm_max    ??27.9),
      t_hot_max:     Number(cfg.t_hot_max     ??34.9),
      t_boiling_max: Number(cfg.t_boiling_max ??50.0),
    };
  }
  #expandFromTen(T){
    // Rebuild full ladder with 0.1 °C gaps (same rules as the editor)
    const r1 = this.#r1_.bind(this), step=0.1;
    const P = {
      frosty_min: r1(T.t_frosty_min ?? 0.0),
      cold_min:   r1(T.t_cold_min   ?? 3.0),
      chilly_min: r1(T.t_chilly_min ?? 5.0),
      cool_min:   r1(T.t_cool_min   ?? 9.0),
      mild_min:   r1(T.t_mild_min   ??14.0),
      perf_min:   r1(T.t_perfect_min??19.0),
      perf_max:   r1(T.t_perfect_max??23.9),
      warm_max:   r1(T.t_warm_max   ??27.9),
      hot_max:    r1(T.t_hot_max    ??34.9),
      boiling_max:r1(T.t_boiling_max??50.0),
    };
    // neighbor clamping (defensive)
    P.cold_min   = Math.max(r1(P.frosty_min+step), P.cold_min);
    P.chilly_min = Math.max(r1(P.cold_min  +step), P.chilly_min);
    P.cool_min   = Math.max(r1(P.chilly_min+step), P.cool_min);
    P.mild_min   = Math.max(r1(P.cool_min  +step), P.mild_min);
    P.perf_min   = Math.max(r1(P.mild_min  +step), Math.min(P.perf_min, r1(P.perf_max-step)));
    P.perf_max   = Math.max(r1(P.perf_min  +step), Math.min(P.perf_max, r1(P.warm_max-step)));
    P.warm_max   = Math.max(r1(P.perf_max  +step), Math.min(P.warm_max, r1(P.hot_max-step)));
    P.hot_max    = Math.max(r1(P.warm_max  +step), Math.min(P.hot_max,  r1(P.boiling_max-step)));
    // derived
    const out = {
      t_frosty_min: P.frosty_min,
      t_cold_min:   P.cold_min,
      t_chilly_min: P.chilly_min,
      t_cool_min:   P.cool_min,
      t_mild_min:   P.mild_min,
      t_perf_min:   P.perf_min,
      t_perf_max:   P.perf_max,
      t_warm_max:   P.warm_max,
      t_hot_max:    P.hot_max,
      t_boiling_max:P.boiling_max,
      // neighbors
      t_frosty_max: r1(P.cold_min   - step),
      t_cold_max:   r1(P.chilly_min - step),
      t_chilly_max: r1(P.cool_min   - step),
      t_cool_max:   r1(P.mild_min   - step),
      t_mild_max:   r1(P.perf_min   - step),
      t_warm_min:   r1(P.perf_max   + step),
      t_hot_min:    r1(P.warm_max   + step),
      t_boiling_min:r1(P.hot_max    + step),
    };
    return out;
  } 

  /* -------------------------------------------
   * Geometry anchors in card %, derived from config
   * -------------------------------------------
   * We compute x/y landmarks so temp/RH map smoothly to visual anchors:
   * - inner circle intersections left/right (for RH → X%)
   * - dial diameters + center (for temperature → Y%)
   */
  #geomAnchors(){
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
    };
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
  #rhToXPctCalibrated(RH){
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
  #tempToYPctGeometryAware(Tc){
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
  #clampRH(rh){ return Number.isFinite(rh) ? Math.min(100, Math.max(0, rh)) : NaN; }

  // Unit conversions for temperature
  #toCelsius(v, unit){ if (!Number.isFinite(v)) return NaN; return (unit||'').toLowerCase().includes('f') ? (v-32)*(5/9) : v; }
  #fromCelsius(vC, unitOut){ if (!Number.isFinite(vC)) return NaN; return (unitOut||'').toLowerCase().includes('f') ? vC*9/5+32 : vC; }

  // Resolve wind speed to m/s, with unit handling and default fallback
  #resolveWind(wsState, def_mps){
    if (!wsState) return def_mps ?? 0;
    const raw = parseFloat(wsState.state);
    if (!Number.isFinite(raw)) return def_mps ?? 0;
    const unit=(wsState.attributes.unit_of_measurement||'m/s').toLowerCase();
    if (unit.includes('m/s')) return raw;
    if (unit.includes('km/h') || unit.includes('kph')) return raw/3.6;
    if (unit.includes('mph')) return raw*0.44704;
    if (unit.includes('kn')) return raw*0.514444;
    return raw;
  }

  // Numeric formatting helpers
  #round(v,d=1){ if(!Number.isFinite(v)) return NaN; const p=Math.pow(10,d); return Math.round(v*p)/p; }
  #formatNumber(v,d=1){ return Number.isFinite(v) ? this.#round(v,d).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d}) : '—'; }

  /* ================================
   *          HA PLUMBING
   * ================================ */
  set hass(hass){ this._hass = hass; this.requestUpdate(); }
  get hass(){ return this._hass; }

  // Tell HA which editor element to create for this card
  static getConfigElement(){ return document.createElement('simple-air-comfort-card-editor'); }

  // Provide a helpful stub when user adds card from UI (auto picks typical sensors)
  static getStubConfig(hass){
    // Back-compat: sometimes HA passes no hass here; try global if so
    const ha = hass ?? document.querySelector('home-assistant')?.hass;
    const states = ha?.states ?? {};

    const first = (pred) => {
      for (const [id, st] of Object.entries(states)) if (pred(id, st)) return id;
      return undefined;
    };
    const dc  = (st) => st?.attributes?.device_class;
    const uom = (st) => (st?.attributes?.unit_of_measurement || '').toLowerCase();

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
        { t_frosty_min: 0.0 },
        { t_cold_min: 3.0 },
        { t_chilly_min: 5.0 },
        { t_cool_min: 9.0 },
        { t_mild_min: 14.0 },
        { t_perfect_min: 19.0 },
        { t_perfect_max: 23.9 },
        { t_warm_max: 27.9 },
        { t_hot_max: 34.9 },
        { t_boiling_max: 50.0 },
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
        { decimals: 1 },
        { y_offset_pct: 0 },
      ],
    };
  }
}

if (!customElements.get('simple-air-comfort-card')) {
  customElements.define('simple-air-comfort-card', SimpleAirComfortCard);
}

/* =============================================================================
 *                              GUI EDITOR (ha-form)
 * =============================================================================
 * A small editor so users can pick entities and tweak thresholds in the UI.
 * It auto-fills temperature/humidity once on mount if blank.
 */
class SimpleAirComfortCardEditor extends LitElement {
  static properties = { hass:{type:Object}, _config:{state:true}, };
  static styles = css`
    .wrap{ padding:12px 12px 16px; }
    .row{
      display:grid;
      grid-template-columns:1fr auto auto; /* title | value | button group */
      align-items:center;
      gap:10px;
      padding:8px 0;
    }
    .panel {
      border: 1px solid var(--divider-color, #444);
      border-radius: 10px;
      margin: 8px 0 14px;
    }
    .panel > summary {
      cursor: pointer;
      padding: 10px 12px;
      font-weight: 600;
      list-style: none;
    }
    .panel[open] > summary {
      border-bottom: 1px solid var(--divider-color, #444);
    }
    .panel > *:not(summary) {
      padding: 10px 12px;
    }
    .name{ font-weight:600; }
    .helper{ grid-column:1 / -1; opacity:.8; font-size:.92em; margin:-2px 0 4px; }
    .btn{
      appearance:none;
      border:1px solid var(--divider-color, #444);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.08));
      color:var(--primary-text-color,#fff);
      padding:6px 10px;
      border-radius:10px;
      font-weight:600;
      cursor:pointer;
      display:inline-flex;
      align-items:center;
      gap:8px;
      box-shadow: 0 1px 0 rgba(255,255,255,.06) inset,
                  0 1px 8px rgba(0,0,0,.15);
      transition: transform .05s ease, box-shadow .15s ease, background .2s ease, opacity .2s ease;
    }
    .btn svg{ width:16px; height:16px; display:block; }
    /* icon-only button sizing */
    .btn.icon{
      width:34px;
      height:34px;
      padding:0;
      justify-content:center;
    }
    .btn:hover{
      box-shadow: 0 1px 0 rgba(255,255,255,.08) inset,
                  0 2px 12px rgba(0,0,0,.25);
    }
    .btn:active{ transform:translateY(1px); }
    .btn:focus-visible{
      outline:2px solid transparent;
      box-shadow:
        0 0 0 2px rgba(255,255,255,.15) inset,
        0 0 0 2px rgba(255,255,255,.15),
        0 0 0 4px rgba(3,169,244,.45);
    }
    .btn.ghost{
      background:transparent;
      border-color:rgba(255,255,255,.15);
    }
    .btn[disabled]{ opacity:.45; cursor:not-allowed; box-shadow:none; }
    .seg{ display:flex; gap:8px; justify-self:end; }  /* keep the buttons on the right */
    .value{
      font-variant-numeric:tabular-nums;
      font-weight:700;
      padding:2px 8px;
      border-radius:8px;
      background:rgba(255,255,255,.06);
      justify-self:end;   /* push the pill to the right edge of its grid cell */
      text-align:right;   /* align digits inside the pill to the right */
      min-width:6ch;      /* keeps width stable as numbers change */
      margin-right:2px;   /* tiny breathing room before the buttons */
      white-space:nowrap; /* prevent "°C" wrapping to next line */
    }
    /* band-tinted value pill (uses --pill-col provided inline) */
    .value.coloured{
      color: var(--pill-col);
      /* modern browsers: soft fill + subtle border from band color */
      background: color-mix(in srgb, var(--pill-col) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pill-col) 45%, transparent);
    }
    /* Center row styling (green) */
    .name--center{ color: var(--sac-center-green, #8ef0ae); font-weight:700; }
    .value--center{
      background: rgba(76,175,80,.18);
      color: var(--sac-center-green, #8ef0ae);
      box-shadow: inset 0 0 0 1px rgba(76,175,80,.35);
    }
    /* Placeholder segment to keep grid alignment without visible buttons */
    .seg--ghost{ visibility:hidden; }
    .title{ font-size:0.95em; opacity:.85; margin:12px 0 6px; }
    .actions{ display:flex; gap:8px; margin-top:10px; }
    .danger{ border-color:#a33; color:#fff; background:#702; }
  `;
  connectedCallback(){ super.connectedCallback(); window.loadCardHelpers?.().catch(()=>{}); }

  // When HA injects hass, we try to auto-pick temperature & humidity once
  // --- NEW: editor cap degrees (default ±6 °C); overridable via cap_degrees
  _capDegrees() {
    const v = Number(this._config?.cap_degrees);
    // clamp to a sensible range to avoid silly values
    return Number.isFinite(v) ? Math.max(0, Math.min(20, v)) : 6.0;
  }

  set hass(h){
    this._hass = h;
    this._autoFillDefaults(); // fill only if empty, only once
    this.requestUpdate();
  }
  get hass(){ return this._hass; }

  // Build default config and keep default anchors for default ±6°C cap_degrees
  setConfig(config){
    // --- NEW: accept grouped YAML and flatten it so the editor fields populate
    const asKV = (x) => {
      if (!x) return {};
      if (Array.isArray(x)) {
        const out = {};
        for (const item of x) if (item && typeof item === 'object') Object.assign(out, item);
        return out;
      }
      return typeof x === 'object' ? x : {};
    };
    const tAnch = asKV(config?.temperature_anchors);
    const hAnch = asKV(config?.humidity_alert_anchors);
    const card  = asKV(config?.card_options);
    const normalized = { ...(config ?? {}), ...tAnch, ...hAnch, ...card };
    // -----------------------------------------------------------------------

    this._config = {
      name:'Area Name',
      temperature: undefined, humidity: undefined, windspeed: undefined,
      temp_display_unit:'auto',   // 'auto' | 'c' | 'f'
      wind_display_unit:'ms',     // 'ms' | 'kmh' | 'mph' | 'kn'
      feels_like:'bom',
      decimals:1, default_wind_speed:0.1,
      cap_degrees:6.0,

      // Comfort bands — mins & maxes (°C), 0.1 steps
      t_frosty_min:   0.0, t_frosty_max:  2.9,
      t_cold_min:     3.0, t_cold_max:    4.9,
      t_chilly_min:   5.0, t_chilly_max:  8.9,
      t_cool_min:     9.0, t_cool_max:   13.9,
      t_mild_min:    14.0, t_mild_max:   18.9,
      t_perfect_min: 19.0, t_perfect_max:23.9,
      t_warm_min:    24.0, t_warm_max:   27.9,
      t_hot_min:     28.0, t_hot_max:    34.9,
      t_boiling_min: 35.0, t_boiling_max:50.0,

      // Optional geometry calibration
      y_offset_pct: 0,

      // RH→X calibration (defaults)
      rh_left_inner_pct: 40.0,
      rh_right_inner_pct: 60.0,

      ...normalized,
    };

    // Capture defaults for default ±6°C movement cap_degrees (non-edge anchors)
    this._defaults = {
      hot_max: 34.9,
      warm_max: 27.9,
      // keep both alias shapes so lookups work no matter how we normalize
      perf_max: 23.9,
      perf_min: 19.0,
      perfect_max: 23.9,
      perfect_min: 19.0,
      mild_min: 14.0,
      cool_min: 9.0,
      chilly_min: 5.0,
      cold_min: 3.0,
    };
  }


  // Render button UI for anchors + small ha-form for entities/misc
  render(){
    if (!this.hass || !this._config) return html``;

    const capStr = `${this._capDegrees().toFixed(1)}°C`;

    return html`
      <div class="wrap">
        <!-- Entities -->
        <div class="title">Card Title</div>

        <!-- Name + Temperature entity -->
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            { name:'name', selector:{ text:{} } },
            { name:'temperature', required:true, selector:{ entity:{ domain:'sensor', device_class:'temperature' } } },
          ]}
          .computeLabel=${this._label}
          .computeHelper=${this._helper}
          @value-changed=${this._onMiscChange}>
        </ha-form>

        <!-- Temperature Unit (after temperature) -->
        <details class="panel">
          <summary>Temperature Display Unit</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'temp_display_unit',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'auto', label:'Auto (follow sensor)' },
                  { value:'c',    label:'Celsius (°C)' },
                  { value:'f',    label:'Fahrenheit (°F)' },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Temperature Anchors (dropdown under Temperature entity) -->
        <details class="panel">
          <summary>Temperature Anchors</summary>

          ${this._anchorRow('t_boiling_max', 'BOILING.max → Top of Card (100%)',
            'Changes how far (HOT.max) is from the edge of the card.', false)}
          ${this._anchorRow('t_hot_max', 'HOT.max (Scales with BOILING.max)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_hot_max')}`, true)}
          ${this._anchorRow('t_warm_max', 'WARM.max → Outer Ring Top',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_warm_max')}`, true)}
          ${this._anchorRow('t_perfect_max', 'PERFECT.max → Inner Comfort Circle Top',
            html`High Temperature Alert :<br>Cap ±${capStr} from default. ${this._slimDerivedHelper('t_perfect_max')}`, true)}

          ${(() => {
            const center = this._centerTemp();
            const min = Number(this._config?.t_perfect_min);
            const max = Number(this._config?.t_perfect_max);
            const helper = (Number.isFinite(min) && Number.isFinite(max))
              ? html`Midpoint of PERFECT band: (${min.toFixed(1)} → ${max.toFixed(1)}).<br>Updates automatically when either edge changes.`
              : html`Read-only. Midpoint of PERFECT band. Set PERFECT.min and PERFECT.max to compute.`;
            return html`
              <div class="row">
                <div class="name name--center">Calculated PERFECT midpoint</div>
                <div class="value value--center" title=${center}>${center}</div>
                <div class="seg seg--ghost"><button class="btn icon" aria-hidden="true"></button></div>
                <div class="helper">${helper}</div>
              </div>
            `;
          })()}

          ${this._anchorRow('t_perfect_min', 'PERFECT.min → Inner Comfort Circle Bottom',
            html`Low Temperature Alert Limit :<br>Cap±${capStr} from default. ${this._slimDerivedHelper('t_perfect_min')}`, true)}
          ${this._anchorRow('t_mild_min', 'MILD.min → Outer Ring Bottom',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_mild_min')}`, true)}
          ${this._anchorRow('t_cool_min', 'COOL.min (Scales with FROSTY.min)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_cool_min')}`, true)}
          ${this._anchorRow('t_chilly_min', 'CHILLY.min (Scales with FROSTY.min)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_chilly_min')}`, true)}
          ${this._anchorRow('t_cold_min', 'COLD.min (Scales with FROSTY.min)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_cold_min')}`, true)}
          ${this._anchorRow('t_frosty_min', 'FROSTY.min → Bottom of Card (0%)',
            'Changes how far (COOL.min → COLD.min) is from the edge of the card.', false)}

          <!-- NEW: Anchor Cap (±°C) — placed below all band rows, above Reset -->
          <div class="title">Anchor Cap (±°C)</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'cap_degrees',
                selector:{ number:{ min:0, max:20, step:0.5, mode:'box', unit_of_measurement:'°C' } }
              },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>

          <div class="actions">
            <button class="btn danger" @click=${this._resetDefaults}>Reset to defaults</button>
          </div>
        </details>

        <!-- Humidity entity ONLY (so we can place anchors directly below it) -->
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            { name:'humidity', required:true, selector:{ entity:{ domain:'sensor', device_class:'humidity' } } },
          ]}
          .computeLabel=${this._label}
          .computeHelper=${this._helper}
          @value-changed=${this._onMiscChange}>
        </ha-form>

        <!-- Humidity Alert Anchors (immediately below Humidity entity) -->
        <details class="panel">
          <summary>Humidity Alert Anchors</summary>
          ${this._rhRow('rh_left_inner_pct',  'Low Humidity Alert (%)')}
          ${this._rhRow('rh_right_inner_pct', 'High Humidity Alert (%)')}
        </details>

          <!-- Feels Like (still "under humidity") -->
        <details class="panel">
          <summary>Feels Like Formula</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'feels_like',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'bom',        label:'Apparent Temperature (BoM, T+RH+Wind)' },
                  { value:'wind_chill', label:'Wind Chill (T+Wind, cold)' },
                  { value:'heat_index', label:'Heat Index (T+RH, hot)' },
                  { value:'humidex',    label:'Humidex (T+RH, hot)' },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Wind entity + default wind speed (default sits under windspeed) -->
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            { name:'windspeed', selector:{ entity:{ domain:'sensor', device_class:'wind_speed' } } },
            { name:'default_wind_speed', selector:{ number:{
                min:0, max:200, step:0.1, mode:'box',
                unit_of_measurement: ({ ms:'m/s', kmh:'km/h', mph:'mph', kn:'kn' }[this._config?.wind_display_unit || 'ms'])
            } } },
          ]}
          .computeLabel=${this._label}
          .computeHelper=${this._helper}
          @value-changed=${this._onMiscChange}>
        </ha-form>

        <!-- Wind Unit -->
        <details class="panel">
          <summary>Wind Display Unit</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'wind_display_unit',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'ms',  label:'m/s'  },
                  { value:'kmh', label:'km/h' },
                  { value:'mph', label:'mph'  },
                  { value:'kn',  label:'kn'   },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Card Options -->
        <details class="panel">
          <summary>Card Options</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'decimals', selector:{ number:{ min:0, max:3, step:1, mode:'box' } } },
              { name:'y_offset_pct', selector:{ number:{ min:-30, max:30, step:0.5, mode:'box', unit_of_measurement:'%' } } },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>
      </div>
    `;
  }



  // Human labels for misc (non-temperature) fields in the editor
  _label = (s) => {
    const id = s.name;
    const windUnit = ({ ms:'m/s', kmh:'km/h', mph:'mph', kn:'kn' }[this._config?.wind_display_unit || 'ms']);
    const base = ({
      name:'Name', temperature:'Temperature entity', humidity:'Humidity entity', windspeed:'Wind speed entity (optional)',
      feels_like:'Feels-like formula',
      // show label with the currently selected wind unit
      default_wind_speed:`Default wind speed (${windUnit})`,
      decimals:'Decimals',
      rh_left_inner_pct:'Inner circle left RH (%)',
      rh_right_inner_pct:'Inner circle right RH (%)',
      y_offset_pct:'Vertical dot offset (%)',
    })[id];
    return base ?? id;
  };
  
  // Map band key to the same colours the card uses
  _bandBaseColour(name){
    const t = String(name || '').toLowerCase();
    if (t==='frosty')  return 'mediumblue';
    if (t==='cold')    return 'dodgerblue';
    if (t==='chilly')  return 'deepskyblue';
    if (t==='cool')    return 'mediumaquamarine';
    if (t==='mild')    return 'seagreen';
    if (t==='perfect') return 'limegreen';
    if (t==='warm')    return 'gold';
    if (t==='hot')     return 'orange';
    if (t==='boiling') return 'crimson';
    return 'dimgray';
  }

  // Which band colour to use for each anchor row's value pill
  _bandForAnchor(anchorName){
    switch(anchorName){
      case 't_boiling_max': return 'boiling';
      case 't_hot_max':     return 'hot';
      case 't_warm_max':    return 'warm';
      case 't_perfect_max':
      case 't_perfect_min': return 'perfect';
      case 't_mild_min':    return 'mild';
      case 't_cool_min':    return 'cool';
      case 't_chilly_min':  return 'chilly';
      case 't_cold_min':    return 'cold';
      case 't_frosty_min':  return 'frosty';
      default:              return null;
    }
  }
  // Show the derived neighbor on the row that DEFINES it, e.g.:
  // MILD.min helper also shows "COOL.max = 13.9°C"
  _fmtC(v){ return Number.isFinite(v) ? `${Number(v).toFixed(1)}°C` : '—'; }
  _slimDerivedHelper(anchorName){
    const C = this._config || {};
    const pair = ({
      t_hot_max:     ['BOILING.min', C.t_boiling_min],
      t_warm_max:    ['HOT.min',     C.t_hot_min],
      t_perfect_max: ['WARM.min',    C.t_warm_min],
      t_perfect_min: ['MILD.max',    C.t_mild_max],
      t_mild_min:    ['COOL.max',    C.t_cool_max],
      t_cool_min:    ['CHILLY.max',  C.t_chilly_max],
      t_chilly_min:  ['COLD.max',    C.t_cold_max],
      t_cold_min:    ['FROSTY.max',  C.t_frosty_max],
    })[anchorName];
    return pair ? html`${pair[0]} = ${this._fmtC(pair[1])}` : nothing;
  }
  // Button row factory (name, title, helper, limited?)
  _anchorRow(name, title, helper, limited){
    const v = Number(this._config?.[name]);
    const display = Number.isFinite(v) ? `${v.toFixed(1)} °C` : '—';
    const band = this._bandForAnchor(name);
    const col  = band ? this._bandBaseColour(band) : null;
    const cap = limited ? this._capFor(name) : null;
    const atLo = cap ? v <= cap.lo : false;
    const atHi = cap ? v >= cap.hi : false;
    return html`
      <div class="row">
        <div class="name">${title}</div>
        <div class="value ${col ? 'coloured' : ''}" style=${col ? `--pill-col:${col}` : nothing} title=${display}>${display}</div>
        <div class="seg">
          <button
            class="btn icon ghost"
            type="button"
            ?disabled=${atLo}
            @click=${() => this._bump(name, -0.1, limited)}
            aria-label="${title} down"
            title="Decrease by 0.1 °C"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="btn icon"
            type="button"
            ?disabled=${atHi}
            @click=${() => this._bump(name, +0.1, limited)}
            aria-label="${title} up"
            title="Increase by 0.1 °C"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="helper">${helper}</div>
      </div>
    `;
  }

  // Humidity rows styled like temperature anchors
  _rhRow(name, title){
    const v = Number(this._config?.[name]);
    const display = Number.isFinite(v) ? `${v.toFixed(1)} %` : '—';
    const col = 'hotpink';              // same alert hue used in the card
    const step = 0.1;

    const L = Number(this._config?.rh_left_inner_pct  ?? 40);
    const R = Number(this._config?.rh_right_inner_pct ?? 60);

    // Disable buttons at sensible limits and keep L < R by 0.1%
    let atLo = false, atHi = false;
    if (name === 'rh_left_inner_pct'){
      atLo = v <= 0;
      atHi = v >= (R - step);           // cannot cross right anchor
    } else { // rh_right_inner_pct
      atLo = v <= (L + step);           // cannot cross left anchor
      atHi = v >= 100;
    }

    const helper = this._helper({ name }); // reuse your existing helper copy

    return html`
      <div class="row">
        <div class="name">${title}</div>
        <div class="value coloured" style="--pill-col:${col}" title=${display}>${display}</div>
        <div class="seg">
          <button
            class="btn icon ghost"
            type="button"
            ?disabled=${atLo}
            @click=${() => this._bump(name, -step, /*limited*/false)}
            aria-label="${title} down"
            title="Decrease by ${step} %">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="btn icon"
            type="button"
            ?disabled=${atHi}
            @click=${() => this._bump(name, +step, /*limited*/false)}
            aria-label="${title} up"
            title="Increase by ${step} %">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="helper">${helper}</div>
      </div>
    `;
  }

  // Helper/tooltips for each field (shows under the input)
  _helper = (s) => {
    const st   = (key) => this.hass?.states?.[this._config?.[key]];
    const unit = (key) => st(key)?.attributes?.unit_of_measurement ?? "";
    const id = s.name; // ← needed so switch(id) works

    // Non-band helpers
    switch (id) {
      case 'name':
        return 'Shown as the small grey title at the top of the card.';
      case 'temperature':
        return `Pick an indoor temperature sensor. ${unit('temperature') ? `Current unit: ${unit('temperature')}.` : ''}`;
      case 'temp_display_unit':
        return 'Choose the temperature unit used for display. Calculations always normalize internally.';
      case 'humidity':
        return `Pick a relative humidity sensor (0–100%). ${unit('humidity') ? `Current unit: ${unit('humidity')}.` : ''}`;
      case 'windspeed':
        return 'Optional. If set, Feels Like Temperature uses this wind; if empty, the “Default wind speed” below is used.';
      case 'wind_display_unit':
        return 'Unit for showing the default wind value below (YAML-safe tokens). Physics converts to m/s internally.';
      case 'default_wind_speed':
        return 'Indoor fallback for Feels Like Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 in the chosen unit.';
      case 'feels_like':
        return 'Choose the formula for the top-right “Feels like” value. BoM uses T+RH+Wind; Wind Chill uses T+Wind (cold); Heat Index/Humidex use T+RH (hot).';
      case 'decimals':
        return 'How many decimal places to show for temperatures and humidity.';
      case 'rh_left_inner_pct':
        return 'Maps RH to the inner-comfort-circle LEFT intersection horizontally';
      case 'rh_right_inner_pct':
        return 'Maps RH to the inner-comfort-circle RIGHT intersection horizontally';
      case 'y_offset_pct':
        return 'Fine-tune the dot’s vertical position in % of card height (positive moves up). Temperature Anchors are what positions the dot, this setting is only fine tuning';
      case 'cap_degrees':
        return '±°C limit for the editor’s +/- buttons on non-edge anchors. Not applied to FROSTY.min or BOILING.max.';

    }

    // Band helpers with your exact drag semantics
    const gap = '0.1 °C';
    if (id === 't_boiling_max')
      return 'BOILING.max → top (100%). Dragging down stops at BOILING.min (tracks HOT.max+0.1). Dragging up increases the scale.';
    if (id === 't_hot_max')
      return 'HOT.max. Drags BOILING.min with it up/down (BOILING.min = HOT.max+0.1). HOT.max ≤ BOILING.max−0.1 and ≥ WARM.max+0.1.';
    if (id === 't_warm_max')
      return 'WARM.max → outer-top. Drags HOT.min with it (HOT.min = WARM.max+0.1). WARM.max ≤ HOT.max−0.1 and ≥ PERFECT.max+0.1.';
    if (id === 't_perfect_max')
      return 'PERFECT.max → inner-top. Drags WARM.min (WARM.min = PERFECT.max+0.1). PERFECT.max ≤ WARM.max−0.1 and ≥ PERFECT.min+0.1.';
    if (id === 't_perfect_min')
      return 'PERFECT.min → inner-bottom. Drags MILD.max (MILD.max = PERFECT.min−0.1). PERFECT.min ≤ PERFECT.max−0.1 and ≥ MILD.min+0.1.';
    if (id === 't_mild_min')
      return 'MILD.min → outer-bottom. Drags COOL.max (COOL.max = MILD.min−0.1). MILD.min ≤ PERFECT.min and ≥ COOL.min+0.1.';
    if (id === 't_cool_min')
      return 'COOL.min. Drags CHILLY.max (CHILLY.max = COOL.min−0.1). COOL.min ≤ MILD.min and ≥ CHILLY.min+0.1.';
    if (id === 't_chilly_min')
      return 'CHILLY.min. Drags COLD.max (COLD.max = CHILLY.min−0.1). CHILLY.min ≤ COOL.min and ≥ COLD.min+0.1.';
    if (id === 't_cold_min')
      return 'COLD.min. Drags FROSTY.max (FROSTY.max = COLD.min−0.1). COLD.min ≤ CHILLY.min and ≥ FROSTY.min+0.1.';
    if (id === 't_frosty_min')
      return 'FROSTY.min → bottom (0%). Dragging up stops at FROSTY.max (COLD.max−0.1). Dragging down increases the scale lower.';
    if (/^t_.*_(min|max)$/.test(id))
      return `All band edges keep contiguous ${gap} gaps automatically.`;
    return 'Tip: values update immediately; click Save when done.';
  };

  // Mirror user edits → ignore min or max → sanitize → notify HA
  // --- New: exact PERFECT midpoint for display (no rounding of value itself) ---
  _centerTemp(){
    const a = this._config || {};
    const lo = Number(a.t_perfect_min);
    const hi = Number(a.t_perfect_max);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return '—';
    return `${((lo + hi) / 2).toFixed(2)} °C`;
  }

  // --- New: cap helper so buttons disable at ±cap_degrees°C from defaults ---
  _capFor(name){
    const defKey = name.replace('t_', '');
    // support both perf_* and perfect_* in _defaults
    const def =
      this._defaults[defKey] ??
      (defKey.startsWith('perfect_')
        ? this._defaults[defKey.replace('perfect_', 'perf_')]
        : undefined);
    if (def === undefined) return null; // edges (t_boiling_max, t_frosty_min): no caps
    const r1 = (x) => Math.round(x * 10) / 10;
    const CAP = this._capDegrees(); // use UI-configurable cap instead of fixed 4.0
    return { lo: r1(def - CAP), hi: r1(def + CAP) };
  }

  // Reset visible anchors to defaults, re-derive neighbors, emit
  _resetDefaults = () => {
    const out = { ...(this._config || {}) };
    // Restore the 10 exposed handles to their schema defaults
    out.t_boiling_max = 50.0;
    out.t_hot_max     = 34.9;
    out.t_warm_max    = 27.9;
    out.t_perfect_max = 23.9;
    out.t_perfect_min = 19.0;
    out.t_mild_min    = 14.0;
    out.t_cool_min    =  9.0;
    out.t_chilly_min  =  5.0;
    out.t_cold_min    =  3.0;
    out.t_frosty_min  =  0.0;
    const derived = this._applyTempsRowBiDirectional(out, [
      't_boiling_max','t_hot_max','t_warm_max','t_perfect_max','t_perfect_min',
      't_mild_min','t_cool_min','t_chilly_min','t_cold_min','t_frosty_min'
    ]);
    this._config = derived;
    fireEvent(this, 'config-changed', { config: this._persistKeys(derived) });
  };

  // --- Wind unit helpers for editor conversions (ms|kmh|mph|kn) ---
  _toDisplayWind(v_mps, unit){
    if (!Number.isFinite(v_mps)) return 0;
    switch(unit){ case 'kmh': return v_mps * 3.6; case 'mph': return v_mps / 0.44704; case 'kn': return v_mps / 0.514444; default: return v_mps; }
  }
  _fromDisplayWind(v, unit){
    if (!Number.isFinite(v)) return 0;
    switch(unit){ case 'kmh': return v / 3.6; case 'mph': return v * 0.44704; case 'kn': return v * 0.514444; default: return v; }
  }

  // Adjust default_wind_speed value when wind_display_unit changes (preserve physical value)
  _onMiscChange = (ev) => {
    ev.stopPropagation();
    const delta = { ...(ev.detail?.value || {}) };
    if (!Object.keys(delta).length) return;

    // If unit changes, convert the numeric field to the new unit for display
    if ('wind_display_unit' in delta && this._config?.default_wind_speed != null){
      const prevU = this._config.wind_display_unit || 'ms';
      const nextU = delta.wind_display_unit || prevU;
      if (prevU !== nextU){
        const prevVal = Number(this._config.default_wind_speed);
        const asMps = this._fromDisplayWind(prevVal, prevU);
        delta.default_wind_speed = this._toDisplayWind(asMps, nextU);
      }
    }

    const merged = { ...(this._config || {}), ...delta };
    this._config = merged;
    fireEvent(this, 'config-changed', { config: this._persistKeys(merged) });
  };


  // Button click → bump a single handle by delta, apply caps & derive neighbors
  _bump(name, delta, limited){
    const r1 = (x) => Math.round(x * 10) / 10;
    const cfg = { ...(this._config || {}) };
    const before = Number(cfg[name]);
    if (!Number.isFinite(before)) return;

    // ±cap_degrees caps for limited anchors based on defaults
    let next = r1(before + delta);

    // Map to defaults keys (we stored without 't_'; build a lookup)
    const mapDef = {
      t_hot_max:'t_hot_max',
      t_warm_max:'t_warm_max',
      t_perfect_max:'t_perfect_max',
      t_perfect_min:'t_perfect_min',
      t_mild_min:'t_mild_min',
      t_cool_min:'t_cool_min',
      t_chilly_min:'t_chilly_min',
      t_cold_min:'t_cold_min',
    };
    if (limited && mapDef[name]){
      const defVal = this._defaults[mapDef[name].replace('t_','')];
      if (Number.isFinite(defVal)){
        const CAP = this._capDegrees(); // dynamic ±cap (e.g., 6.0)
        const lo = r1(defVal - CAP);
        const hi = r1(defVal + CAP);
        next = Math.min(hi, Math.max(lo, next));
      }
    }

    const merged = { ...cfg, [name]: next };
    const derived = this._applyTempsRowBiDirectional(merged, [name]);
    this._config = derived;
    fireEvent(this, 'config-changed', { config: this._persistKeys(derived) });
  }

  // Clamp only the edited handles against *their local neighbors*; then update derived neighbors.
  _applyTempsRowBiDirectional(cfgIn, changedKeys = []){
    // round to 0.1 and coerce
    const r1 = (v) => Math.round((Number(v) || 0) * 10) / 10;
    const step = 0.1;

    // Pull GUI fields (only the 10 exposed)
    const P = {
      boiling_max: r1(cfgIn.t_boiling_max ?? 50.0),
      hot_max:     r1(cfgIn.t_hot_max     ?? 34.9),
      warm_max:    r1(cfgIn.t_warm_max    ?? 27.9),
      perf_max:    r1(cfgIn.t_perfect_max ?? 23.9),
      perf_min:    r1(cfgIn.t_perfect_min ?? 19.0),
      mild_min:    r1(cfgIn.t_mild_min    ?? 14.0),
      cool_min:    r1(cfgIn.t_cool_min    ??  9.0),
      chilly_min:  r1(cfgIn.t_chilly_min  ??  5.0),
      cold_min:    r1(cfgIn.t_cold_min    ??  3.0),
      frosty_min:  r1(cfgIn.t_frosty_min  ??  0.0),
    };

    // Map config field -> our P keys
    const keyMap = {
      t_boiling_max: 'boiling_max',
      t_hot_max:     'hot_max',
      t_warm_max:    'warm_max',
      t_perfect_max: 'perf_max',
      t_perfect_min: 'perf_min',
      t_mild_min:    'mild_min',
      t_cool_min:    'cool_min',
      t_chilly_min:  'chilly_min',
      t_cold_min:    'cold_min',
      t_frosty_min:  'frosty_min',
    };

    // If HA batches more than one, clamp each edited field *independently* against its immediate neighbors.
    const targets = (changedKeys && changedKeys.length) ? changedKeys : Object.keys(keyMap);
    const ks = targets.map(k => keyMap[k] || k).filter(Boolean);

    const clampEdited = (k) => {
      switch (k) {
        case 'boiling_max':
          // Drag down stops at BOILING.min (= HOT.max + 0.1). Drag up grows scale.
          P.boiling_max = Math.max(P.boiling_max, r1(P.hot_max + step));
          break;
        case 'hot_max':
          // HOT.max ∈ [WARM.max+0.1, BOILING.max-0.1]
          P.hot_max = Math.max(r1(P.warm_max + step), Math.min(P.hot_max, r1(P.boiling_max - step)));
          break;
        case 'warm_max':
          // WARM.max ∈ [PERFECT.max+0.1, HOT.max-0.1]
          P.warm_max = Math.max(r1(P.perf_max + step), Math.min(P.warm_max, r1(P.hot_max - step)));
          break;
        case 'perf_max':
          // PERFECT.max ∈ [PERFECT.min+0.1, WARM.max-0.1]
          P.perf_max = Math.max(r1(P.perf_min + step), Math.min(P.perf_max, r1(P.warm_max - step)));
          break;
        case 'perf_min':
          // PERFECT.min ∈ [MILD.min+0.1, PERFECT.max-0.1]
          P.perf_min = Math.max(r1(P.mild_min + step), Math.min(P.perf_min, r1(P.perf_max - step)));
          break;
        case 'mild_min':
          // MILD.min ∈ [COOL.min+0.1, PERFECT.min]
          P.mild_min = Math.max(r1(P.cool_min + step), Math.min(P.mild_min, r1(P.perf_min - step)));
          break;
        case 'cool_min':
          // COOL.min ∈ [CHILLY.min+0.1, MILD.min]
          P.cool_min = Math.max(r1(P.chilly_min + step), Math.min(P.cool_min, r1(P.mild_min - step)));
          break;
        case 'chilly_min':
          // CHILLY.min ∈ [COLD.min+0.1, COOL.min]
          P.chilly_min = Math.max(r1(P.cold_min + step), Math.min(P.chilly_min, r1(P.cool_min - step)));
          break;
        case 'cold_min':
          // COLD.min ∈ [FROSTY.min+0.1, CHILLY.min]
          P.cold_min = Math.max(r1(P.frosty_min + step), Math.min(P.cold_min, r1(P.chilly_min - step)));
          break;
        case 'frosty_min':
          // FROSTY.min ≤ COLD.min − 0.1 (dragging down increases scale)
          P.frosty_min = Math.min(P.frosty_min, r1(P.cold_min - step));
          break;
      }
    };
    ks.forEach(clampEdited);

    // 3) Apply the explicit drag couplings by deriving “hidden” neighbors
    // Apply the explicit drag couplings by deriving “hidden” neighbors
    const out = { ...cfgIn };
    out.t_boiling_max = P.boiling_max;
    out.t_hot_max     = P.hot_max;
    out.t_warm_max    = P.warm_max;
    out.t_perfect_max = P.perf_max;
    out.t_perfect_min = P.perf_min;
    out.t_mild_min    = P.mild_min;
    out.t_cool_min    = P.cool_min;
    out.t_chilly_min  = P.chilly_min;
    out.t_cold_min    = P.cold_min;
    out.t_frosty_min  = P.frosty_min;

    // Derived neighbors (follow spec: min/max pairs maintain 0.1 °C gaps)
    out.t_boiling_min = r1(P.hot_max    + step); // HOT.max ↔ BOILING.min
    out.t_hot_min     = r1(P.warm_max   + step); // WARM.max ↔ HOT.min
    out.t_warm_min    = r1(P.perf_max   + step); // PERFECT.max ↔ WARM.min
    out.t_mild_max    = r1(P.perf_min   - step); // PERFECT.min ↔ MILD.max
    out.t_cool_max    = r1(P.mild_min   - step); // MILD.min ↔ COOL.max
    out.t_chilly_max  = r1(P.cool_min   - step); // COOL.min ↔ CHILLY.max
    out.t_cold_max    = r1(P.chilly_min - step); // CHILLY.min ↔ COLD.max
    out.t_frosty_max  = r1(P.cold_min   - step); // COLD.min ↔ FROSTY.max

    // 4) RH calibration passthrough (unchanged)
    const clamp01 = v => Math.min(100, Math.max(0, r1(v)));
    out.rh_left_inner_pct  = clamp01(out.rh_left_inner_pct  ?? 40);
    out.rh_right_inner_pct = clamp01(out.rh_right_inner_pct ?? 60);
    if (out.rh_right_inner_pct <= out.rh_left_inner_pct){
      out.rh_right_inner_pct = clamp01(out.rh_left_inner_pct + 0.1);
    }
    return out;
  }

  // Persist in grouped YAML shape (temperature_anchors, humidity_alert_anchors, card_options)
  _persistKeys(cfg){
    const out = {
      type: 'custom:simple-air-comfort-card',
      name: cfg.name,
      temperature: cfg.temperature,
      temp_display_unit: cfg.temp_display_unit,

      temperature_anchors: [
        { t_boiling_max: cfg.t_boiling_max },
        { t_hot_max:     cfg.t_hot_max },
        { t_warm_max:    cfg.t_warm_max },
        { t_perfect_max: cfg.t_perfect_max ?? cfg.t_perf_max },
        { t_perfect_min: cfg.t_perfect_min ?? cfg.t_perf_min },
        { t_mild_min:    cfg.t_mild_min },
        { t_cool_min:    cfg.t_cool_min },
        { t_chilly_min:  cfg.t_chilly_min },
        { t_cold_min:    cfg.t_cold_min },
        { t_frosty_min:  cfg.t_frosty_min },
        ...(cfg.cap_degrees != null ? [{ cap_degrees: cfg.cap_degrees }] : []),
      ],

      humidity: cfg.humidity,
      humidity_alert_anchors: [
        { rh_left_inner_pct:  cfg.rh_left_inner_pct },
        { rh_right_inner_pct: cfg.rh_right_inner_pct },
      ],

      feels_like: cfg.feels_like,
      windspeed: cfg.windspeed,
      wind_display_unit: cfg.wind_display_unit,
      default_wind_speed: cfg.default_wind_speed,

      card_options: [
        { decimals:     cfg.decimals },
        { y_offset_pct: cfg.y_offset_pct },
      ],
    };
    if (!window.__sac_editor_prune_warned__) {
      console.info(
        'simple-air-comfort-card-editor: Writing grouped YAML ' +
        '(temperature_anchors, humidity_alert_anchors, card_options).'
      );
      window.__sac_editor_prune_warned__ = true;
    }
    return out;
  }

  // One-time auto-pick of temp/humidity if user hasn’t selected any
  _autoPicked = false;
  _autoFillDefaults(){
    if (this._autoPicked || !this.hass || !this._config) return;

    const states = this.hass.states;

    const firstEntity = (pred) => {
      for (const [id, st] of Object.entries(states)) { if (pred(id, st)) return id; }
      return undefined;
    };
    const devClass = (st) => st?.attributes?.device_class;

    if (!this._config.temperature) {
      this._config.temperature = firstEntity((id, st) =>
        id.startsWith('sensor.') && devClass(st) === 'temperature'
      ) || this._config.temperature;
    }

    if (!this._config.humidity) {
      this._config.humidity = firstEntity((id, st) =>
        id.startsWith('sensor.') && devClass(st) === 'humidity'
      ) || this._config.humidity;
    }

    this._autoPicked = true;
    fireEvent(this, 'config-changed', { config: this._persistKeys(this._config) });
  }
}

if (!customElements.get('simple-air-comfort-card-editor')) {
  customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
}

/* ----------------------------- Automatic Version on Build -----------------------------
 * `__VERSION__` is replaced by your build pipeline (e.g., Rollup plugin).
 * It shows in the console so users can verify which bundle they’re running.
 */
const SAC_CARD_VERSION = '__VERSION__';

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description: 'Dew point + AT dial, comfort words, moving dot.',
  preview: true,
  documentationURL: 'https://github.com/MankiniChykan/simple-air-comfort-card'
});

console.info(
  `%c SIMPLE AIR COMFORT CARD %c v${SAC_CARD_VERSION} `,
  'color:white;background:#2a2a2a;padding:2px 6px;border-radius:4px 0 0 4px;',
  'color:#2a2a2a;background:#c9c9c9;padding:2px 6px;border-radius:0 4px 4px 0;'
);

/* ----------------------------- Card Size Hints -----------------------------
 * getCardSize() helps Masonry layout estimate height;
 * getGridOptions() guides the 12-column Sections layout’s default footprint.
 */
SimpleAirComfortCard.prototype.getCardSize = function () {
  // ~3 rows (1 row ≈ 50px in classic Masonry layout)
  return 3;
};

SimpleAirComfortCard.prototype.getGridOptions = function () {
  return {
    columns: 6,       // default width (use multiples of 3 for tidy grid)
    rows: "auto",     // height adjusts to content
    min_columns: 6,   // don’t let it shrink too small
    max_columns: 12,  // can span full width
    min_rows: 1,
    max_rows: 6,
  };
};
