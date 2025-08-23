import { LitElement, html, css, nothing } from 'lit';

/**
 * Simple Air Comfort Card — src/simple-air-comfort-card.js
 *
 * WHAT THIS CARD DOES (big picture)
 * ---------------------------------
 * - Renders a square dial showing a "comfort dot" positioned by:
 *    X = Relative Humidity (%) clamped 0..100, stretched across the card width
 *    Y = Temperature mapped by comfort bands (FROSTY→BOILING) to dial landmarks
 * - Shows text labels (dew point comfort, temperature band, humidity band)
 * - Colors the background & rings based on comfort text (dew point & temp)
 * - Uses a ResizeObserver to scale typography with the card’s rendered width
 * - Optionally uses a wind-speed sensor for Apparent Temperature (BoM formula)
 *
 * DESIGN NOTES
 * ------------
 * - All text sizes scale by CSS var `--sac-scale`, which the ResizeObserver
 *   updates based on the card’s actual size (so it looks crisp at any size).
 * - The circular dial is 45% of the square by default (configurable).
 * - The dot gets a pulsing red halo when outside comfort bounds.
 *
 * DATA REQUIREMENTS
 * -----------------
 * Required: temperature (sensor.*), humidity (sensor.*)
 * Optional: windspeed (sensor.*) – used to refine Apparent Temperature
 *
 * DEFAULTS
 * --------
 * - Wind speed default = 0 m/s (indoor-friendly)
 * - Comfort bands are contiguous (no gaps/overlaps). Editor enforces 0.1 °C steps.
 *
 * ACCESSIBILITY
 * -------------
 * - Adds ARIA labels on the dial and axes so screen readers have context.
 */

 /* -------------------------
  *  Event helper for HA UI
  * -------------------------
  * Home Assistant’s editors and cards dispatch "config-changed" et al.
  * This small helper mimics HA’s event signature (bubbling + composed).
  */
const fireEvent = (node, type, detail, options) => {
  const event = new Event(type, {
    bubbles: options?.bubbles ?? true,
    cancelable: options?.cancelable ?? false,
    composed: options?.composed ?? true,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

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
      z-index:2;
    }

    /* When comfort is outside, show a pulsing halo */
    .dot.outside::before{
      content:""; position:absolute; inset:-50%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-heartbeat 2s cubic-bezier(.215,.61,.355,1) infinite; z-index:-1;
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
    .canvas{ position:absolute; inset:0; padding:0; }

    /* Header area: small grey title + white comfort subtitle centered near top */
    .header{
      position:absolute; top:10%; left:50%; transform:translate(-50%,-50%);
      width:100%; text-align:center; pointer-events:none;
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
    .corner{ position:absolute; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); }
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
    .corner .comfort{
      font-weight:400;
      font-size: calc(var(--sac-scale,1) * 22px);
      letter-spacing:.2px;
      display: block;
      margin-top: 0rem;
    }
    .tl{ left:0%;  top:0%;  transform:translate(20%,100%); text-align:left; }
    .tr{ right:0%; top:0%;  transform:translate(-20%,100%); text-align:right; }
    .bl{ left:0%;  bottom:0%; transform:translate(20%,-5%);   text-align:left; }
    .br{ right:0%; bottom:0%; transform:translate(-20%,-5%);   text-align:right; }

    /* The circular dial (outer ring + inner circle) sized at 45% of the stage */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:45%; height:45%;
    }

    /* Axis labels (dim) placed just outside the dial */
    .axis{
      position:absolute; color:rgba(200,200,200,.8);
      font-weight:300; text-shadow:0 1px 2px rgba(0,0,0,.25);
      font-size: calc(var(--sac-scale,1) * 16px);
      pointer-events:none;
    }
    .axis-top    { top:-10px;  left:50%; transform:translate(-50%,-50%); }
    .axis-bottom { bottom:-10px;left:50%; transform:translate(-50%, 50%); }
    .axis-left   { left:-10px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-10px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

    /* The shiny outer ring: solid border + subtle glow */
    .outer-ring{
      position:absolute; inset:0; border-radius:50%; border:2.5px solid #fff;
      background:var(--sac-dewpoint-ring,radial-gradient(circle,dimgray,55%,rgba(100,100,100,.15),rgba(100,100,100,.15)));
      box-shadow:0 0 6px 3px rgba(0,0,0,.18), 0 0 18px 6px rgba(0,0,0,.22);
    }

    /* Inner "eye": gradient that tints toward hot/cold/humid based on data */
    .inner-circle{
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      width:46.5%; height:46.5%; border-radius:50%;
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
    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');
    }

    // Small number parser that returns NaN for missing/blank
    const num = v => (v === undefined || v === null || v === '' ? NaN : Number(v));

    // Geometry (percentages that must match the CSS layout)
    const ring_pct   = Number.isFinite(num(config.ring_pct))  ? num(config.ring_pct)  : 45;   // dial box size (% of card)
    const inner_pct  = Number.isFinite(num(config.inner_pct)) ? num(config.inner_pct) : 46.5; // inner circle size (% of dial)
    const center_pct = 50; // fixed vertical center for the dial
    const y_offset_pct = Number.isFinite(num(config.y_offset_pct)) ? num(config.y_offset_pct) : 0; // fine vertical tweak

    // Final sanitized config object we’ll use at runtime
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(num(config.decimals)) ? num(config.decimals) : 1,
      default_wind_speed: Number.isFinite(num(config.default_wind_speed)) ? num(config.default_wind_speed) : 0.0,

      // Comfort bands: contiguous ranges for label lookup; the editor enforces 0.1 °C steps
      t_frosty_min: Number.isFinite(num(config.t_frosty_min)) ? num(config.t_frosty_min) : -40.0,
      t_frosty_max: Number.isFinite(num(config.t_frosty_max)) ? num(config.t_frosty_max) :   2.9,
      t_cold_min:   Number.isFinite(num(config.t_cold_min))   ? num(config.t_cold_min)   :   3.0,
      t_cold_max:   Number.isFinite(num(config.t_cold_max))   ? num(config.t_cold_max)   :   4.9,
      t_chilly_min: Number.isFinite(num(config.t_chilly_min)) ? num(config.t_chilly_min) :   5.0,
      t_chilly_max: Number.isFinite(num(config.t_chilly_max)) ? num(config.t_chilly_max) :   8.9,
      t_cool_min:   Number.isFinite(num(config.t_cool_min))   ? num(config.t_cool_min)   :   9.0,
      t_cool_max:   Number.isFinite(num(config.t_cool_max))   ? num(config.t_cool_max)   :  13.9,
      t_mild_min:   Number.isFinite(num(config.t_mild_min))   ? num(config.t_mild_min)   :  14.0,
      t_mild_max:   Number.isFinite(num(config.t_mild_max))   ? num(config.t_mild_max)   :  18.9,
      t_perf_min:   Number.isFinite(num(config.t_perf_min))   ? num(config.t_perf_min)   :  19.0,
      t_perf_max:   Number.isFinite(num(config.t_perf_max))   ? num(config.t_perf_max)   :  23.9,
      t_warm_min:   Number.isFinite(num(config.t_warm_min))   ? num(config.t_warm_min)   :  24.0,
      t_warm_max:   Number.isFinite(num(config.t_warm_max))   ? num(config.t_warm_max)   :  27.9,
      t_hot_min:    Number.isFinite(num(config.t_hot_min))    ? num(config.t_hot_min)    :  28.0,
      t_hot_max:    Number.isFinite(num(config.t_hot_max))    ? num(config.t_hot_max)    :  34.9,
      t_boiling_min:Number.isFinite(num(config.t_boiling_min))? num(config.t_boiling_min):  35.0,
      t_boiling_max:Number.isFinite(num(config.t_boiling_max))? num(config.t_boiling_max):  60.0,

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
    const atC = this.#apparentTemperatureC(Tc, e, WS);          // feels like (°C)

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

    const axisTopStyle    = isHot ? `color:white; text-shadow:
      0 0 2px white, 0 0 6px ${pal.hot}, 0 0 12px ${pal.hot}, 0 0 20px ${pal.hot}` : '';
    const axisBottomStyle = isCold ? `color:white; text-shadow:
      0 0 2px white, 0 0 6px ${pal.cold}, 0 0 12px ${pal.cold}, 0 0 20px ${pal.cold}` : '';
    const axisLeftStyle   = isLowRH ? `color:white; text-shadow:
      0 0 2px white, 0 0 6px ${pal.humid}, 0 0 12px ${pal.humid}, 0 0 20px ${pal.humid}` : '';
    const axisRightStyle  = isHighRH ? `color:white; text-shadow:
      0 0 2px white, 0 0 6px ${pal.humid}, 0 0 12px ${pal.humid}, 0 0 20px ${pal.humid}` : '';

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
    const outUnit = unitIn;
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
            cardBg, ringGrad, innerGrad,
            // geometry
            xPct, yPct, outside,
            // text outputs
            outUnit, d, dewOut, atOut, tempRaw, rhRaw,
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
      <div class="graphic" style="--sac-dewpoint-ring:${ringGrad}; --sac-inner-gradient:${innerGrad}">
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
    const r1 = (v) => Math.round(v*10)/10; // enforce one decimal
    const B = {
      FROSTY: {min:r1(C.t_frosty_min ?? -40.0), max:r1(C.t_frosty_max ??  2.9)},
      COLD:   {min:r1(C.t_cold_min   ??   3.0), max:r1(C.t_cold_max   ??  4.9)},
      CHILLY: {min:r1(C.t_chilly_min ??   5.0), max:r1(C.t_chilly_max ??  8.9)},
      COOL:   {min:r1(C.t_cool_min   ??   9.0), max:r1(C.t_cool_max   ?? 13.9)},
      MILD:   {min:r1(C.t_mild_min   ??  14.0), max:r1(C.t_mild_max   ?? 18.9)},
      PERFECT:{min:r1(C.t_perf_min   ??  19.0), max:r1(C.t_perf_max   ?? 23.9)},
      WARM:   {min:r1(C.t_warm_min   ??  24.0), max:r1(C.t_warm_max   ?? 27.9)},
      HOT:    {min:r1(C.t_hot_min    ??  28.0), max:r1(C.t_hot_max    ?? 34.9)},
      BOILING:{min:r1(C.t_boiling_min??  35.0), max:r1(C.t_boiling_max?? 60.0)},
    };
    const order = ["FROSTY","COLD","CHILLY","COOL","MILD","PERFECT","WARM","HOT","BOILING"];
    // Ensure each min >= previous max + 0.1, and max >= min
    for (let i=0;i<order.length;i++){
      const k = order[i], prev = order[i-1] && B[order[i-1]], cur = B[k];
      if (i>0){
        const minAllowed = r1(prev.max + step);
        if (cur.min < minAllowed) cur.min = minAllowed;
      }
      if (cur.max < cur.min) cur.max = cur.min;
    }
    return B;
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

    // Halfway positions to ease extremes gracefully
    const y_half_below_outer = (0 + y_outer_bottom)/2;
    const y_half_above_outer = (100 + y_outer_top)/2;

    return {
      y_outer_bottom, y_outer_top, y_inner_bottom, y_inner_top,
      y_center, y_half_below_outer, y_half_above_outer,
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
   * Temperature → Y% mapping (smoothed)
   * -------------------------------------------
   * Locked anchors per spec:
   *   PERFECT max → inner top
   *   WARM    max → outer top
   *   HOT     max → halfway between outer top and top endpoint
   *   BOILING max → top endpoint (100%)
   *   PERFECT min → inner bottom
   *   MILD    min → outer bottom
   *   COOL min, CHILLY min, COLD min, FROSTY max → evenly spaced
   *     from outer bottom down to FROSTY min (bottom endpoint, 0%).
   * Between each adjacent pair we smoothstep for natural motion.
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

    // HOT max sits midway from outer-top to top endpoint
    const y_hot_half = (y_outer_top + y_top) / 2;

    // Even ladder between outer-bottom and bottom endpoint for:
    // COOL min, CHILLY min, COLD min, FROSTY max (include endpoints in spacing)
    const gaps = 5; // 6 points: bottom .. outer-bottom → 5 equal gaps
    const step = (y_outer_bottom - y_bottom) / gaps;
    const y_frosty_min = y_bottom + step * 0; // endpoint
    const y_frosty_max = y_bottom + step * 1;
    const y_cold_min   = y_bottom + step * 2;
    const y_chilly_min = y_bottom + step * 3;
    const y_cool_min   = y_bottom + step * 4;
    const y_mild_min   = y_bottom + step * 5; // == y_outer_bottom

    // Ordered anchors (temperature asc → Y% asc)
    const P = [
      { t: B.FROSTY.min, y: y_frosty_min }, // bottom endpoint
      { t: B.FROSTY.max, y: y_frosty_max },
      { t: B.COLD.min,   y: y_cold_min   },
      { t: B.CHILLY.min, y: y_chilly_min },
      { t: B.COOL.min,   y: y_cool_min   },
      { t: B.MILD.min,   y: y_mild_min   }, // locked outer-bottom
      { t: B.PERFECT.min, y: y_inner_bottom }, // locked inner-bottom
      { t: B.PERFECT.max, y: y_inner_top    }, // locked inner-top
      { t: B.WARM.max,    y: y_outer_top    }, // locked outer-top
      { t: B.HOT.max,     y: y_hot_half     }, // midway to top endpoint
      { t: B.BOILING.max, y: y_top          }, // top endpoint
    ];

    if (!Number.isFinite(Tc)) return a.y_center;
    if (Tc <= P[0].t) return P[0].y;
    if (Tc >= P[P.length-1].t) return P[P.length-1].y;

    // Smoothstep interpolation between the surrounding anchors
    for (let i = 0; i < P.length - 1; i++){
      const a0 = P[i], a1 = P[i+1];
      if (Tc >= a0.t && Tc <= a1.t){
        const s = this.#clamp((Tc - a0.t) / (a1.t - a0.t), 0, 1);
        const e = this.#smoothstep(s);
        return a0.y + (a1.y - a0.y) * e;
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

    return {
      name: 'Area Name',
      temperature,
      humidity,
      windspeed,
      decimals: 1,
      default_wind_speed: 0.1,
      // Y mapping uses bands, not temp_min/temp_max
    };
  }
}

customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

/* =============================================================================
 *                              GUI EDITOR (ha-form)
 * =============================================================================
 * A small editor so users can pick entities and tweak thresholds in the UI.
 * It auto-fills temperature/humidity once on mount if blank.
 */
class SimpleAirComfortCardEditor extends LitElement {
  static properties = { hass:{type:Object}, _config:{state:true}, _schema:{state:true} };
  static styles = css`
    .wrap{ padding:8px 12px 16px; }
    .columns{ display:grid; grid-template-columns:1fr 1fr; gap:12px; align-items:start; }
    .col-title{ font-size:.9em; opacity:.8; margin:8px 0 4px; }
    @media (max-width:560px){ .columns{ grid-template-columns:1fr; } }
    /* Single-row temperature bar */
    .temps-bar{ margin-top:12px; }
    .temps-bar ha-form{
      display:grid;
      grid-template-columns:repeat(10, minmax(90px,1fr));
      gap:8px;
    }
    @media (max-width:980px){ .temps-bar ha-form{ grid-template-columns:repeat(5, minmax(90px,1fr)); } }
    @media (max-width:560px){ .temps-bar ha-form{ grid-template-columns:repeat(2, minmax(120px,1fr)); } }
    .center-readonly{ margin-top:6px; font-size:.95em; opacity:.8; }
  `;
  connectedCallback(){ super.connectedCallback(); window.loadCardHelpers?.().catch(()=>{}); }

  // When HA injects hass, we try to auto-pick temperature & humidity once
  set hass(h){
    this._hass = h;
    this._autoFillDefaults(); // fill only if empty, only once
    this.requestUpdate();
  }
  get hass(){ return this._hass; }

  // Build default config and editor schema; merge user overrides on top
  setConfig(config){
    this._config = {
      name:'Area Name',
      temperature: undefined, humidity: undefined, windspeed: undefined,
      decimals:1, default_wind_speed:0.1,

      // Comfort bands — mins & maxes (°C), 0.1 steps
      t_frosty_min: -40.0, t_frosty_max:  2.9,
      t_cold_min:     3.0, t_cold_max:    4.9,
      t_chilly_min:   5.0, t_chilly_max:  8.9,
      t_cool_min:     9.0, t_cool_max:   13.9,
      t_mild_min:    14.0, t_mild_max:   18.9,
      t_perf_min:    19.0, t_perf_max:   23.9,
      t_warm_min:    24.0, t_warm_max:   27.9,
      t_hot_min:     28.0, t_hot_max:    34.9,
      t_boiling_min: 35.0, t_boiling_max:60.0,

      // Optional geometry calibration
      y_offset_pct: 0,

      // RH→X calibration (defaults)
      rh_left_inner_pct: 40.0,
      rh_right_inner_pct: 60.0,

      ...(config ?? {}),
    };

    // --- NEW: define the two schemas separately ---
    // Single temperature row, ordered Boiling→Frosty (top→bottom in GUI)
    this._schemaTempsRow = [
      { name:'t_boiling_max', selector:{ number:{ min:-60, max:80, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_hot_max',     selector:{ number:{ min:-60, max:60, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_warm_max',    selector:{ number:{ min:-60, max:50, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_perf_max',    selector:{ number:{ min:-60, max:45, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_perf_min',    selector:{ number:{ min:-60, max:45, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_mild_min',    selector:{ number:{ min:-60, max:40, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_cool_min',    selector:{ number:{ min:-60, max:35, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_chilly_min',  selector:{ number:{ min:-60, max:30, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_cold_min',    selector:{ number:{ min:-60, max:25, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_frosty_min',  selector:{ number:{ min:-60, max:20, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
    ];

    // Misc (non-temperature) settings shown separately in the editor
    this._schemaMisc = [
      { name:'name', selector:{ text:{} } },
      { name:'temperature', required:true, selector:{ entity:{ domain:'sensor', device_class:'temperature' } } },
      { name:'humidity',    required:true, selector:{ entity:{ domain:'sensor', device_class:'humidity' } } },
      { name:'windspeed', selector:{ entity:{ domain:'sensor', device_class:'wind_speed' } } },
      { name:'default_wind_speed', selector:{ number:{ min:0, max:50, step:0.1, mode:'box', unit_of_measurement:'m/s' } } },
      { name:'decimals', selector:{ number:{ min:0, max:3, step:1, mode:'box' } } },
      { name:'rh_left_inner_pct',  selector:{ number:{ min:0, max:100, step:0.1, mode:'box', unit_of_measurement:'%' } } },
      { name:'rh_right_inner_pct', selector:{ number:{ min:0, max:100, step:0.1, mode:'box', unit_of_measurement:'%' } } },
      { name:'y_offset_pct', selector:{ number:{ min:-30, max:30, step:0.5, mode:'box', unit_of_measurement:'%' } } },
    ];
  }


  // Render misc form + single-row temperatures with midpoint display
  render(){
    if (!this.hass || !this._config) return html``;
    return html`<div class="wrap">
      <!-- Miscellaneous settings -->
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schemaMisc}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._onMiscChange}>
      </ha-form>

      <!-- Temperature anchors (single row: Boiling → Frosty) -->
      <div class="col-title" style="margin-top:12px">Temperature anchors (°C)</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schemaTempsRow}
        .computeLabel=${this._labelTemp}
        @value-changed=${this._onTempsChange}>
      </ha-form>

      <!-- Exact PERFECT midpoint (read-only) -->
      <div class="col-title" style="margin-top:8px;opacity:.8">
        Center (exact midpoint between PERFECT min & max): ${this._centerTemp()}
      </div>
    </div>`;
  }


  // Human labels for misc (non-temperature) fields in the editor
  _label = (s) => {
    const id = s.name;
    const base = ({
      name:'Name', temperature:'Temperature entity', humidity:'Humidity entity', windspeed:'Wind speed entity (optional)',
      default_wind_speed:'Default wind speed (m/s)', decimals:'Decimals',
      rh_left_inner_pct:'Inner circle left RH (%)',
      rh_right_inner_pct:'Inner circle right RH (%)',
      ring_pct:'Outer ring box size (% of card)',
      inner_pct:'Inner circle size (% of ring box)',
      y_offset_pct:'Vertical dot offset (%)',
    })[id];
    return base ?? id;
  };

  // Human labels for the single-row temperature anchors (Boiling→Frosty)
  _labelTemp = (s) => ({
    t_boiling_max:'BOILING max (°C)',
    t_hot_max:'HOT max (°C)',
    t_warm_max:'WARM max (°C)',
    t_perf_max:'PERFECT max (°C)',
    t_perf_min:'PERFECT min (°C)',
    t_mild_min:'MILD min (°C)',
    t_cool_min:'COOL min (°C)',
    t_chilly_min:'CHILLY min (°C)',
    t_cold_min:'COLD min (°C)',
    t_frosty_min:'FROSTY min (°C)',
  }[s.name] ?? s.name);
  

  // Helper/tooltips for each field (shows under the input)
  _helper = (s) => {
    const id = s.name;
    const st   = (key) => this.hass?.states?.[this._config?.[key]];
    const unit = (key) => st(key)?.attributes?.unit_of_measurement ?? "";

    // Which min follows which max
    const prevOf = {
      t_cold_min:   't_frosty_max',
      t_chilly_min: 't_cold_max',
      t_cool_min:   't_chilly_max',
      t_mild_min:   't_cool_max',
      t_perf_min:   't_mild_max',
      t_warm_min:   't_perf_max',
      t_hot_min:    't_warm_max',
    };

    // Pretty band name
    const nice = (k) => (k?.match(/^t_(.+)_(min|max)$/)?.[1] || '').toUpperCase();

    // Non-band helpers (unchanged from your version)
    switch (id) {
      case 'name':
        return 'Shown as the small grey title at the top of the card.';
      case 'temperature':
        return `Pick an indoor temperature sensor. ${unit('temperature') ? `Current unit: ${unit('temperature')}.` : ''}`;
      case 'humidity':
        return `Pick a relative humidity sensor (0–100%). ${unit('humidity') ? `Current unit: ${unit('humidity')}.` : ''}`;
      case 'windspeed':
        return 'Optional. If set, Apparent Temperature uses this wind; if empty, the “Default wind speed” below is used.';
      case 'default_wind_speed':
        return 'Indoor fallback for Apparent Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 m/s.';
      case 'decimals':
        return 'How many decimal places to show for temperatures and humidity.';
      case 'rh_left_inner_pct':
      case 'rh_right_inner_pct':
        return 'Maps RH to the inner-circle intersections horizontally: left = this %, right = this %. 0% stays at the left edge; 100% stays at the right edge.';
      case 'y_offset_pct':
        return 'Fine-tune the dot’s vertical position in % of card height (positive moves up).';
    }

    // Special band edges
    if (id === 't_frosty_min')
      return 'Unused lower edge (ignored on save).';
    if (id === 't_boiling_max')
      return 'Unused upper edge (ignored on save).';

    // Computed/locked mins: show driver and current resolved values
    if (id in prevOf) {
      const p = prevOf[id];
      const pVal = this._config?.[p];
      const cur  = this._config?.[id];
      return `Locked = ${nice(p)} max +0.1 °C`;
    }

    // Editable controls: all *_max except BOILING max, plus t_boiling_min
    if ([
      't_frosty_max','t_cold_max','t_chilly_max','t_cool_max',
      't_mild_max','t_perf_max','t_warm_max','t_hot_max','t_boiling_min'
    ].includes(id)) {
      return 'Moving this shifts the next Min';
    }

    // Generic band help (fallback)
    if (/^t_.*_(min|max)$/.test(id)) {
      return 'Bands use 0.1 °C steps. Each next min follows the previous max + 0.1.';
    }

    // Final fallback
    return 'Tip: values update immediately; click Save when done.';
  };

  // Mirror user edits → ignore min or max → sanitize → notify HA
  // --- New: exact PERFECT midpoint for display (no rounding of value itself) ---
  _centerTemp(){
    const a = this._config || {};
    const lo = Number(a.t_perf_min);
    const hi = Number(a.t_perf_max);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return '—';
    return `${((lo + hi) / 2).toFixed(2)} °C`;
  }

  // --- New: misc handler (entities/decimals/RH/offsets) ---
  _onMiscChange = (ev) => {
    ev.stopPropagation();
    const delta = { ...(ev.detail?.value || {}) };
    if (!Object.keys(delta).length) return;
    const merged = { ...(this._config || {}), ...delta };
    this._config = merged;
    fireEvent(this, 'config-changed', { config: merged });
  };

  // --- New: single-row temperature handler (hot→cold), with bi-directional drag ---
  _onTempsChange = (ev) => {
    ev.stopPropagation();
    const delta = { ...(ev.detail?.value || {}) };
    if (!Object.keys(delta).length) return;
    const cfg = this._applyTempsRowBiDirectional({ ...(this._config || {}), ...delta });
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: cfg });
  };

  // Keep bands contiguous using GUI order: Boiling max → … → Frosty min
  _applyTempsRowBiDirectional(cfgIn){
    const r1 = v => Math.round((Number(v) ?? 0) * 10) / 10;
    const step = 0.1;
    const P = {
      boiling_max: r1(cfgIn.t_boiling_max ?? 60.0),
      hot_max:     r1(cfgIn.t_hot_max     ?? 34.9),
      warm_max:    r1(cfgIn.t_warm_max    ?? 27.9),
      perf_max:    r1(cfgIn.t_perf_max    ?? 23.9),
      perf_min:    r1(cfgIn.t_perf_min    ?? 19.0),
      mild_min:    r1(cfgIn.t_mild_min    ?? 14.0),
      cool_min:    r1(cfgIn.t_cool_min    ??  9.0),
      chilly_min:  r1(cfgIn.t_chilly_min  ??  5.0),
      cold_min:    r1(cfgIn.t_cold_min    ??  3.0),
      frosty_min:  r1(cfgIn.t_frosty_min  ?? -40.0),
    };

    // GUI chain (descending temperature)
    const chain = ['boiling_max','hot_max','warm_max','perf_max','perf_min','mild_min','cool_min','chilly_min','cold_min','frosty_min'];

    // Forward: enforce strictly descending by ≥0.1
    for (let i = 1; i < chain.length; i++){
      const prev = chain[i-1], cur = chain[i];
      const limit = r1(P[prev] - step);
      if (P[cur] > limit) P[cur] = limit;
    }
    // Backward: ensure previous is ≤ next - 0.1
    for (let i = chain.length - 2; i >= 0; i--){
      const cur = chain[i], next = chain[i+1];
      const limit = r1(P[next] + step);
      if (P[cur] < limit) P[cur] = limit;
    }

    const out = { ...cfgIn };

    // Write back the ten GUI fields
    out.t_boiling_max = P.boiling_max;
    out.t_hot_max     = P.hot_max;
    out.t_warm_max    = P.warm_max;
    out.t_perf_max    = P.perf_max;
    out.t_perf_min    = P.perf_min;
    out.t_mild_min    = P.mild_min;
    out.t_cool_min    = P.cool_min;
    out.t_chilly_min  = P.chilly_min;
    out.t_cold_min    = P.cold_min;
    out.t_frosty_min  = P.frosty_min;

    // Derive the in-between neighbors to keep full band set contiguous
    out.t_frosty_max  = r1(P.cold_min   - step);
    out.t_cold_max    = r1(P.chilly_min - step);
    out.t_chilly_max  = r1(P.cool_min   - step);
    out.t_cool_max    = r1(P.mild_min   - step);
    out.t_mild_max    = r1(P.perf_min   - step);
    out.t_warm_min    = r1(P.perf_max   + step);
    out.t_hot_min     = r1(P.warm_max   + step);
    out.t_boiling_min = r1(P.hot_max    + step);

    // RH calibration passthrough (unchanged)
    const clamp01 = v => Math.min(100, Math.max(0, r1(v)));
    out.rh_left_inner_pct  = clamp01(out.rh_left_inner_pct  ?? 40);
    out.rh_right_inner_pct = clamp01(out.rh_right_inner_pct ?? 60);
    if (out.rh_right_inner_pct <= out.rh_left_inner_pct){
      out.rh_right_inner_pct = clamp01(out.rh_left_inner_pct + 0.1);
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
    fireEvent(this, 'config-changed', { config: this._config });
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
