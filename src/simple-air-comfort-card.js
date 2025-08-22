import { LitElement, html, css, nothing } from 'lit';

/**
 * Simple Air Comfort Card — src/simple-air-comfort-card.js
 * - Square card that scales cleanly in Sections.
 * - Visuals aligned to the original: small grey room title, large white dew-point comfort,
 *   less-bold corner headings, dimmer/smaller axis labels, dial at 45% of the stage.
 * - Physics: Arden Buck + Australian BoM AT. Indoor-friendly default WS = 0.
 * - Dot logic:
 *     x = clamp(RH, 0..100) across the whole card width (percent-based),
 *     y = scaled temp (temp_min→0% .. temp_max→100%),
 *     default when data is unavailable → (50%, 50%) i.e. perfectly centered.
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
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  constructor() {
    super();
    this._config = undefined;
  }

  // ================================ Styles ================================
  static styles = css`
    /* Host should not force a height; HA grid drives width, .ratio drives height */
    :host{ display:inline-block; width:100%; box-sizing:border-box; }

    ha-card{
      position:relative; padding:0; overflow:hidden; isolation:isolate;
      border-radius:var(--ha-card-border-radius,12px);
      background:var(--sac-temp-bg,#2a2a2a);
      /* stretch to grid cell and center contents */
      display:flex; align-items:center; justify-content:center;
      box-sizing:border-box; min-height:0;
      /* prevent children from affecting outer sizing via fractional overflows */
      contain: layout paint;
      /* no aspect-ratio here; the grid rows control height */
    }

      /* Inner square: bullet‑proof “padding-top:100%” square, centered by flex */
      .ratio{
        position:relative;
        width:100%;
        max-width:100%;
        margin:0;
        overflow:hidden;
        flex: 0 0 auto;            /* don’t let flexbox collapse it */
      }
      .ratio::before{
        content:"";
        display:block;
        padding-top:100%;          /* makes the box square from width */
      }

    /* Dot (+ halo when outside) — positioned in % of the whole card */
    .dot{
      position:absolute; width:6%; height:6%; border-radius:50%;
      background:#fff; box-shadow:0 0 6px rgba(0,0,0,.45);
      transform:translate(-50%, 50%);
      transition:left .8s ease-in-out,bottom .8s ease-in-out; z-index:2;
    }
    .dot.outside::before{
      content:""; position:absolute; inset:-50%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-heartbeat 2s cubic-bezier(.215,.61,.355,1) infinite; z-index:-1;
    }
    @keyframes sac-heartbeat{
      0%   { transform:scale(1);   opacity:0;   }  /* start clear */
      15%  { transform:scale(1.18);opacity:1;   }  /* first thump */
      30%  { transform:scale(.98); opacity:.6;  }
      45%  { transform:scale(1.12);opacity:1;   }  /* second thump */
      55%  { transform:scale(1);   opacity:0;   }  /* fade to clear */
      100% { transform:scale(1);   opacity:0;   }  /* stay clear until next cycle */ 
    }

    /* Fill the square with the face */
    .canvas{ position:absolute; inset:0; padding:0px 0px 0px; }

    /* Header (room name + dew-point comfort text under it) */
    .header{
      position:absolute; top:10%; left:50%; transform:translate(-50%,-50%);
      width:100%; text-align:center; pointer-events:none;
    }
    .title{
      color:#c9c9c9; font-weight:300;
      font-size:clamp(10px,1.8vw,14px);
      line-height:1.1; letter-spacing:.2px;
    }
    .subtitle{
      color:#fff; font-weight:600;
      font-size:clamp(13px,2.4vw,18px);
      text-shadow:0 1px 2px rgba(0,0,0,.35);
    }

    /* Corners */
    .corner{ position:absolute; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); }
    .corner .label{
      font-weight:300; opacity:.75; letter-spacing:.1px;
      font-size:clamp(9px,1.6vw,12px);
      display:block;
    }
    .corner .metric{
      font-weight:500;
      font-size:clamp(12px,2.2vw,16px);
      line-height:1.05;
      display: block;
    }
    .corner .comfort{
      font-weight:500;
      font-size:clamp(11px,2vw,15px);
      letter-spacing:.2px;
      display: block;
      margin-top: 0.1rem;
    }
    .tl{ left:8%;  top:23%;  transform:translate(0,-50%); text-align:left; }
    .tr{ right:8%; top:23%;  transform:translate(0,-50%); text-align:right; }
    .bl{ left:8%;  bottom:3%; transform:translate(0,0);   text-align:left; }
    .br{ right:8%; bottom:3%; transform:translate(0,0);   text-align:right; }

    /* Dial — 45% like original */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:45%; height:45%;
    }

    /* Axis labels: smaller & dim grey */
    .axis{
      position:absolute; color:rgba(200,200,200,.8);
      font-weight:300; text-shadow:0 1px 2px rgba(0,0,0,.25);
      font-size:clamp(9px,1.7vw,12px);
      pointer-events:none;
    }
    .axis-top    { top:-10px;  left:50%; transform:translate(-50%,-50%); }
    .axis-bottom { bottom:-10px;left:50%; transform:translate(-50%, 50%); }
    .axis-left   { left:-10px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-10px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

    .outer-ring{
      position:absolute; inset:0; border-radius:50%; border:2.5px solid #fff;
      background:var(--sac-dewpoint-ring,radial-gradient(circle,dimgray,55%,rgba(100,100,100,.15),rgba(100,100,100,.15)));
      box-shadow:0 0 6px 3px rgba(0,0,0,.18), 0 0 18px 6px rgba(0,0,0,.22);
    }
    .inner-circle{
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      width:46.5%; height:46.5%; border-radius:50%;
      background:var(--sac-inner-gradient,radial-gradient(circle,black 0%,black 60%));
      box-shadow:inset 0 0 12px rgba(0,0,0,.6);
    }

  `;

  // ============================== Configs ==============================
  setConfig(config) {
    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');
    }
    const num = v => (v === undefined || v === null || v === '' ? NaN : Number(v));
    const temp_min = Number.isFinite(num(config.temp_min)) ? num(config.temp_min) : 15;
    const temp_max = Number.isFinite(num(config.temp_max)) ? num(config.temp_max) : 35;
    if (temp_max <= temp_min) throw new Error('simple-air-comfort-card: temp_max must be > temp_min.');
    // Geometry (derived from CSS) with safe defaults for your current styles
    const ring_pct   = Number.isFinite(num(config.ring_pct))  ? num(config.ring_pct)  : 45;   // .graphic size (% of card)
    const inner_pct  = Number.isFinite(num(config.inner_pct)) ? num(config.inner_pct) : 46.5; // .inner-circle size (% of .graphic)
    const center_pct = 50; // vertical centre of card (fixed)
    // Optional fine-tune for vertical placement (percent of card height)
    const y_offset_pct = Number.isFinite(num(config.y_offset_pct)) ? num(config.y_offset_pct) : 0;
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(num(config.decimals)) ? num(config.decimals) : 1,
      default_wind_speed: Number.isFinite(num(config.default_wind_speed)) ? num(config.default_wind_speed) : 0.0,
      temp_min, temp_max,
      // Comfort bands — mins & maxes (°C), 0.1 steps (contiguous, GUI-editable)
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
      // Geometry calibration
      ring_pct, inner_pct, center_pct, y_offset_pct,
      // RH→X calibration (defaults: inner circle left=40%, right=60%)
      rh_left_inner_pct:  Number.isFinite(num(config.rh_left_inner_pct))  ? num(config.rh_left_inner_pct)  : 40.0,
      rh_right_inner_pct: Number.isFinite(num(config.rh_right_inner_pct)) ? num(config.rh_right_inner_pct) : 60.0,
    };
  }

  // =============================== Render ===============================
  render() {
    if (!this.hass || !this._config) return html``;

    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    // If either entity missing → show centered default
    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="ratio">
          <div class="canvas">
            ${this.#face({ Tc: NaN, RH: NaN, dpC: NaN, atC: NaN, dewText: 'Unknown',
                           tempText: 'N/A', rhText: 'N/A', cardBg: this.#backgroundGradientForTempC(NaN),
                           ringGrad: this.#dewpointRingGradientFromText('Unknown'),
                           innerGrad: this.#innerEyeGradient(NaN, NaN, this.#bandThresholds()),
                           xPct: 50, yPct: 50, outside: false,
                           outUnit: (tState?.attributes?.unit_of_measurement || '°C'), d: this._config.decimals,
                           dewOut: '—', atOut: '—', tempRaw: '—', rhRaw: '—' })}
          </div>
        </div>
      </ha-card>`;
    }

    // Parse & physics
    const unitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const Tc = this.#toCelsius(Number.isFinite(+tState.state) ? +tState.state : NaN, unitIn);
    const RH = this.#clampRH(Number.isFinite(+rhState.state) ? +rhState.state : NaN);
    const WS = this.#resolveWind(wsState, this._config.default_wind_speed);

    const es  = this.#buckSaturationVapourPressure_hPa(Tc);
    const e   = (RH / 100) * es;
    const dpC = this.#dewPointFromVapourPressure_hPa(e);
    const atC = this.#apparentTemperatureC(Tc, e, WS);

    // Macros → text
    const dewText  = this.#dewpointTextFromMacro(dpC);
    const tempText = this.#temperatureTextFromMacro(Tc);
    const rhText   = this.#humidityTextFromMacro(RH);

    // Gradients & bg
    const cardBg    = this.#backgroundGradientForTempC(Tc);
    const ringGrad  = this.#dewpointRingGradientFromText(dewText);
    const B         = this.#bandThresholds();
    const innerGrad = this.#innerEyeGradient(RH, Tc, B);

    // Use the same L/R thresholds as your inner-circle calibration for outside flag
    const Lh = Number(this._config?.rh_left_inner_pct ?? 40);
    const Rh = Number(this._config?.rh_right_inner_pct ?? 60);

    // Axis color overrides (fallback to default CSS color when condition not met)
    const pal = this.#palette();
    const isHot    = Number.isFinite(Tc) && Tc > B.PERFECT.max;
    const isCold   = Number.isFinite(Tc) && Tc < B.PERFECT.min;
    const isLowRH  = Number.isFinite(RH) && RH < Lh;
    const isHighRH = Number.isFinite(RH) && RH > Rh;
    const axisTopStyle    = isHot ? `color:white; text-shadow:
      0 0 2px white,
      0 0 6px ${pal.hot},
      0 0 12px ${pal.hot},
      0 0 20px ${pal.hot}` : '';

    const axisBottomStyle = isCold ? `color:white; text-shadow:
      0 0 2px white,
      0 0 6px ${pal.cold},
      0 0 12px ${pal.cold},
      0 0 20px ${pal.cold}` : '';

    const axisLeftStyle   = isLowRH ? `color:white; text-shadow:
      0 0 2px white,
      0 0 6px ${pal.humid},
      0 0 12px ${pal.humid},
      0 0 20px ${pal.humid}` : '';

    const axisRightStyle  = isHighRH ? `color:white; text-shadow:
      0 0 2px white,
      0 0 6px ${pal.humid},
      0 0 12px ${pal.humid},
      0 0 20px ${pal.humid}` : '';
 

    // Dot vertical position via geometry-aware anchors + easing
    const yPctBase = this.#tempToYPctGeometryAware(Tc);
    const yPct = Number.isFinite(yPctBase) ? this.#clamp(yPctBase + (this._config.y_offset_pct || 0), 0, 100) : 50;
    // Calibrated RH→X so inner-circle intersections hit user targets (0%→left edge, 100%→right edge stay fixed)
    const xPctBase = this.#rhToXPctCalibrated(RH);
    const xPct = Number.isFinite(xPctBase) ? this.#clamp(xPctBase, 0, 100) : 50;

    // Temperature “comfort” edges come from the configured PERFECT band

    const outside = (Number.isFinite(RH) && Number.isFinite(Tc))
      ? (RH < Lh || RH > Rh || Tc < B.PERFECT.min || Tc > B.PERFECT.max)
      : true;

    // Output strings
    const d = this._config.decimals;
    const outUnit = unitIn;
    const dewOut = this.#formatNumber(this.#fromCelsius(dpC, outUnit), d) + ` ${outUnit}`;
    const atOut  = this.#formatNumber(this.#fromCelsius(atC,  outUnit), d) + ` ${outUnit}`;
    const tempRaw = this.#formatNumber(this.#fromCelsius(Tc, outUnit), d) + ` ${outUnit}`;
    const rhRaw   = Number.isFinite(RH) ? this.#round(RH, d).toFixed(d) + ' %' : '—';

    return html`<ha-card style="--sac-temp-bg:${cardBg}">
      <div class="ratio">
        <div class="canvas">
          ${this.#face({
            Tc, RH, dpC, atC,
            dewText, tempText, rhText,
            cardBg, ringGrad, innerGrad,
            xPct, yPct, outside,
            outUnit, d, dewOut, atOut, tempRaw, rhRaw,
            axisTopStyle, axisBottomStyle, axisLeftStyle, axisRightStyle
          })}
        </div>
      </div>
    </ha-card>`;
  }

  // Render the face elements
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

      <!-- TL / TR -->
      <div class="corner tl">
        <span class="label">Dew point</span>
        <span class="metric">${dewOut}</span>
      </div>
      <div class="corner tr">
        <span class="label">Feels like</span>
        <span class="metric">${atOut}</span>
      </div>

      <!-- BL / BR (raw values + comfort words) -->
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

      <!-- Dial -->
      <div class="graphic" style="--sac-dewpoint-ring:${ringGrad}; --sac-inner-gradient:${innerGrad}">
        <div class="axis axis-top"    style=${axisTopStyle || nothing}>Warm</div>
        <div class="axis axis-bottom" style=${axisBottomStyle || nothing}>Cold</div>
        <div class="axis axis-left"   style=${axisLeftStyle || nothing}>Dry</div>
        <div class="axis axis-right"  style=${axisRightStyle || nothing}>Humid</div>

        <div class="outer-ring"></div>
        <div class="inner-circle"></div>
      </div>
      <div class="dot ${outside ? 'outside' : ''}" style="left:${xPct}%; bottom:${yPct}%;"></div>
    `;
  }

  // ============================== Physics ===============================
  #apparentTemperatureC(Tc, e_hPa, ws_mps){ return Tc + 0.33*e_hPa - 0.70*ws_mps - 4.0; }
  #buckSaturationVapourPressure_hPa(Tc){
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) return 6.1121 * Math.exp((18.678 - Tc/234.5) * (Tc/(257.14 + Tc)));
    return 6.1115 * Math.exp((23.036 - Tc/333.7) * (Tc/(279.82 + Tc)));
  }
  #dewPointFromVapourPressure_hPa(e_hPa){
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

  // ======================= Macro-equivalent texts =======================
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
    const t = this.#round1(Tc); // snap to 0.1 °C for band lookup
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

  // ======================= Visual mappings / BG ========================
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
    // RH color: still tied to the user’s inner-circle thresholds
    const Lh = Number(this._config?.rh_left_inner_pct ?? 40);
    const Rh = Number(this._config?.rh_right_inner_pct ?? 60);

    let humidityColor = 'black';
    if (!Number.isFinite(RH))       humidityColor = 'dimgray';
    else if (RH < Lh || RH > Rh)    humidityColor = pal.humid;

    // Temperature color from configurable PERFECT band (comfortable window)
    const lo = B.PERFECT.min;
    const hi = B.PERFECT.max;
    let temperatureColor = pal.inband; // inside PERFECT → dim gray
    if (Number.isFinite(Tc)) {
     if (Tc > hi)      temperatureColor = pal.hot;   // above comfortable → red
      else if (Tc < lo) temperatureColor = pal.cold;  // below comfortable → blue
    }
    return `radial-gradient(circle, ${humidityColor} 0%, black, ${temperatureColor} 70%)`;
  }

  // =============================== Helpers ===============================
  #clamp(v,a,b){ return Math.min(b, Math.max(a,v)); }
  // Linear map helper
  #lerp(t, a, b){ return a + (b - a) * t; }
  #invLerp(v, a, b){ return (v - a) / (b - a); }
  // Quantize to 0.1 °C (for band lookups only)
  #round1(v){ return Math.round(v * 10) / 10; }
  // Smoothstep easing (C1 continuous) for anchor-to-anchor interpolation
  #smoothstep(x){ return x*x*(3 - 2*x); }

  // Shared palette (themeable via CSS vars; falls back to current literals)
  #palette(){
    return {
      hot:   'var(--sac-col-hot, rgba(255,69,0,0.95))',
      cold:  'var(--sac-col-cold, rgba(0,102,255,0.95))',
      humid: 'var(--sac-col-humid-alert, hotpink)',
      inband:'var(--sac-col-inband, dimgray)',
    };
  }

  // Build sanitized bands (contiguous, non-overlapping, 0.1 steps)
  #bandThresholds(){
    const C = this._config || {};
    const step = 0.1;
    const r1 = (v) => Math.round(v*10)/10;
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

  // Geometry anchors computed from CSS-like percentages
  #geomAnchors(){
    const ring   = Number(this._config?.ring_pct   ?? 45);    // % of card
    const innerR = Number(this._config?.inner_pct  ?? 46.5);  // % of .graphic
    const C      = Number(this._config?.center_pct ?? 50);    // centre of card
    const R_outer = ring / 2;                      // outer ring radius (card %)
    const R_inner = (innerR/100) * (ring/2);       // inner circle radius (card %)
    // X anchors for inner circle intersections
    const x_inner_left  = 50 - R_inner;
    const x_inner_right = 50 + R_inner;
    const y_outer_bottom = C - R_outer;            // lower diameter of outer ring
    const y_outer_top    = C + R_outer;            // upper diameter of outer ring
    const y_inner_bottom = C - R_inner;            // lower diameter of inner circle
    const y_inner_top    = C + R_inner;            // upper diameter of inner circle
    const y_center       = C;
    const y_half_below_outer = (0 + y_outer_bottom)/2;  // halfway between bottom edge and outer-ring lower diameter
    const y_half_above_outer = (100 + y_outer_top)/2;   // halfway between top edge and outer-ring upper diameter
    return {
      y_outer_bottom, y_outer_top, y_inner_bottom, y_inner_top,
      y_center, y_half_below_outer, y_half_above_outer,
      x_inner_left, x_inner_right
    };
  }
  // === RH → X% (card) calibrated mapping ====================================
  // Piecewise linear so that:
  //   RH=0   → X=0
  //   RH=L   → X=inner-left
  //   RH=R   → X=inner-right
  //   RH=100 → X=100
  // with L/R configurable (defaults 40/60). Works with any ring/inner geometry.
  #rhToXPctCalibrated(RH){
    if (!Number.isFinite(RH)) return NaN;
    const { x_inner_left: XL, x_inner_right: XR } = this.#geomAnchors();
    const Lraw = Number(this._config?.rh_left_inner_pct  ?? 40);
    const Rraw = Number(this._config?.rh_right_inner_pct ?? 60);
    // sanitize L,R to [0,100] and ensure L < R
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

  // Temperature→Y% mapping aligned to your visual landmarks, GUI thresholds drive anchor temps
  #tempToYPctGeometryAware(Tc){
    const a = this.#geomAnchors();
    const B = this.#bandThresholds();
    // Anchor temps from band mins/maxes (inner circle spans PERFECT)
    const T_FROSTY_ANCH       = B.FROSTY.max;
    const T_COOL_LOWER_ANCH   = B.COOL.min;                       // outer ring lower diameter
    const T_MILD_LOWER_ANCH   = B.PERFECT.min;                    // inner circle lower diameter
    const T_PERF_CENTER_ANCH  = (B.PERFECT.min + B.PERFECT.max)/2;// centre of PERFECT band
    const T_WARM_UPPER_ANCH   = B.PERFECT.max;                    // inner circle upper diameter
    const T_HOT_UPPER_ANCH    = B.HOT.max;                        // outer ring upper diameter
    const T_BOIL_ANCH         = Math.min(B.BOILING.max, B.BOILING.min + 5);

    const P = [
      { t: T_FROSTY_ANCH,     y: a.y_half_below_outer }, // FROSTY → halfway between bottom and outer-ring lower diameter
      { t: T_COOL_LOWER_ANCH, y: a.y_outer_bottom     }, // COOL   → outer-ring lower diameter
      { t: T_MILD_LOWER_ANCH, y: a.y_inner_bottom     }, // MILD   → inner-circle lower diameter
      { t: T_PERF_CENTER_ANCH,y: a.y_center           }, // PERFECT→ centre
      { t: T_WARM_UPPER_ANCH, y: a.y_inner_top        }, // WARM   → inner-circle upper diameter
      { t: T_HOT_UPPER_ANCH,  y: a.y_outer_top        }, // HOT    → outer-ring upper diameter
      { t: T_BOIL_ANCH,       y: a.y_half_above_outer }, // BOILING→ halfway between top and outer-ring upper diameter
    ];
    if (!Number.isFinite(Tc)) return a.y_center;
    if (Tc <= P[0].t) return P[0].y;
    if (Tc >= P[P.length-1].t) return P[P.length-1].y;
    // Smoothstep across all intervals
    for (let i = 0; i < P.length - 1; i++){
      const a0 = P[i], a1 = P[i+1];
      if (Tc >= a0.t && Tc <= a1.t){
        const s = this.#clamp((Tc - a0.t) / (a1.t - a0.t), 0, 1);
        const e = this.#smoothstep(s);
        return a0.y + (a1.y - a0.y) * e;
      }
    }
    return a.y_center;
  }
  #clampRH(rh){ return Number.isFinite(rh) ? Math.min(100, Math.max(0, rh)) : NaN; }

  #toCelsius(v, unit){ if (!Number.isFinite(v)) return NaN; return (unit||'').toLowerCase().includes('f') ? (v-32)*(5/9) : v; }
  #fromCelsius(vC, unitOut){ if (!Number.isFinite(vC)) return NaN; return (unitOut||'').toLowerCase().includes('f') ? vC*9/5+32 : vC; }

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

  #round(v,d=1){ if(!Number.isFinite(v)) return NaN; const p=Math.pow(10,d); return Math.round(v*p)/p; }
  #formatNumber(v,d=1){ return Number.isFinite(v) ? this.#round(v,d).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d}) : '—'; }

  // Lovelace plumbing
  set hass(hass){ this._hass = hass; this.requestUpdate(); }
  get hass(){ return this._hass; }

  static getConfigElement(){ return document.createElement('simple-air-comfort-card-editor'); }
  static getStubConfig(hass){
    // Fallback if HA doesn’t pass hass (older paths)
    const ha = hass ?? document.querySelector('home-assistant')?.hass;
    const states = ha?.states ?? {};

    const first = (pred) => {
      for (const [id, st] of Object.entries(states)) if (pred(id, st)) return id;
      return undefined;
    };
    const dc  = (st) => st?.attributes?.device_class;
    const uom = (st) => (st?.attributes?.unit_of_measurement || '').toLowerCase();

    // Temperature: prefer device_class, then unit; finally any sensor
    const temperature =
      first((id, st) => id.startsWith('sensor.') && dc(st) === 'temperature') ||
      first((id, st) => id.startsWith('sensor.') && (/°c|°f/.test(uom(st)))) ||
      first((id) => id.startsWith('sensor.'));

    // Humidity: prefer device_class, then % unit; finally any sensor
    const humidity =
      first((id, st) => id.startsWith('sensor.') && dc(st) === 'humidity') ||
      first((id, st) => id.startsWith('sensor.') && uom(st).includes('%')) ||
      first((id) => id.startsWith('sensor.'));

    // Optional wind speed: prefer device_class, else known speed units
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
      temp_min: 15,
      temp_max: 35,
    };
  }
}

customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

/* ----------------------------- GUI editor ----------------------------- */
class SimpleAirComfortCardEditor extends LitElement {
  static properties = { hass:{type:Object}, _config:{state:true}, _schema:{state:true} };
  static styles = css`
    .wrap{ padding:8px 12px 16px; }
    .columns{ display:grid; grid-template-columns:1fr 1fr; gap:12px; align-items:start; }
    .col-title{ font-size:.9em; opacity:.8; margin:8px 0 4px; }
    @media (max-width:560px){ .columns{ grid-template-columns:1fr; } }
  `;
  connectedCallback(){ super.connectedCallback(); window.loadCardHelpers?.().catch(()=>{}); }

  // --- NEW: run auto-pick when hass arrives (once) ---
  set hass(h){
    this._hass = h;
    this._autoFillDefaults();    // <— only fills if empty, only once
    this.requestUpdate();
  }
  get hass(){ return this._hass; }

  setConfig(config){
    this._config = {
      name:'Area Name',
      temperature: undefined, humidity: undefined, windspeed: undefined,
      decimals:1, default_wind_speed:0.1, temp_min:15, temp_max:35,
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
      ring_pct: 45,
      inner_pct: 46.5,
      y_offset_pct: 0,
      // RH→X calibration (defaults)
      rh_left_inner_pct: 40.0,
      rh_right_inner_pct: 60.0,
      ...(config ?? {}),
    };
    this._schema = [
      { name:'name', selector:{ text:{} } },

      // Only temperature sensors in the picker
      { name:'temperature', required:true, selector:{ entity:{ domain:'sensor', device_class:'temperature' } } },

      // Only humidity sensors
      { name:'humidity',    required:true, selector:{ entity:{ domain:'sensor', device_class:'humidity' } } },

      // Optional wind speed
      { name:'windspeed', selector:{ entity:{ domain:'sensor', device_class:'wind_speed' } } },

      { name:'default_wind_speed', selector:{ number:{ min:0, max:50, step:0.1, mode:'box', unit_of_measurement:'m/s' } } },
      { name:'decimals', selector:{ number:{ min:0, max:3, step:1, mode:'box' } } },
      { name:'temp_min', selector:{ number:{ min:-20, max:50, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'temp_max', selector:{ number:{ min:-20, max:60, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      // Comfort bands — mins & maxes (°C), 0.1 steps
      { name:'t_frosty_min', selector:{ number:{ min:-60, max: 20, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_frosty_max', selector:{ number:{ min:-60, max: 20, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_cold_min',   selector:{ number:{ min:-60, max: 25, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_cold_max',   selector:{ number:{ min:-60, max: 25, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_chilly_min', selector:{ number:{ min:-60, max: 30, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_chilly_max', selector:{ number:{ min:-60, max: 30, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_cool_min',   selector:{ number:{ min:-60, max: 35, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_cool_max',   selector:{ number:{ min:-60, max: 35, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_mild_min',   selector:{ number:{ min:-60, max: 40, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_mild_max',   selector:{ number:{ min:-60, max: 40, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_perf_min',   selector:{ number:{ min:-60, max: 45, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_perf_max',   selector:{ number:{ min:-60, max: 45, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_warm_min',   selector:{ number:{ min:-60, max: 50, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_warm_max',   selector:{ number:{ min:-60, max: 50, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_hot_min',    selector:{ number:{ min:-60, max: 60, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_hot_max',    selector:{ number:{ min:-60, max: 60, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_boiling_min',selector:{ number:{ min:-60, max: 80, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'t_boiling_max',selector:{ number:{ min:-60, max: 80, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      // RH→X calibration (inner-circle intersections)
      { name:'rh_left_inner_pct',  selector:{ number:{ min:0, max:100, step:0.1, mode:'box', unit_of_measurement:'%' } } },
      { name:'rh_right_inner_pct', selector:{ number:{ min:0, max:100, step:0.1, mode:'box', unit_of_measurement:'%' } } },
      // Optional geometry calibration fields
      { name:'ring_pct',     selector:{ number:{ min:10,  max:90,  step:0.1,  mode:'box', unit_of_measurement:'%' } } },
      { name:'inner_pct',    selector:{ number:{ min:10,  max:100, step:0.1,  mode:'box', unit_of_measurement:'%' } } },
      { name:'y_offset_pct', selector:{ number:{ min:-30, max:30,  step:0.5,  mode:'box', unit_of_measurement:'%' } } },

    ];
  }

  render(){
    if (!this.hass || !this._config) return html``;
    // split schema: non-band fields, then band mins (left) & band maxes (right)
    const isBand = (n) => typeof n === 'string' && n.startsWith('t_') && (n.endsWith('_min') || n.endsWith('_max'));
    const miscSchema = this._schema.filter(s => !isBand(s.name));
    const minSchema  = this._schema.filter(s => /^t_.*_min$/.test(s.name));
    const maxSchema  = this._schema.filter(s => /^t_.*_max$/.test(s.name));
    return html`<div class="wrap">
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${miscSchema}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._onChange}>
      </ha-form>
      <div class="columns">
        <div>
          <div class="col-title">Band mins (°C)</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${minSchema}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onChange}>
          </ha-form>
        </div>
        <div>
          <div class="col-title">Band maxes (°C)</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${maxSchema}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onChange}>
          </ha-form>
        </div>
      </div>
    </div>`;
  }

  _label = s => ({
    name:'Name', temperature:'Temperature entity', humidity:'Humidity entity', windspeed:'Wind speed entity (optional)',
    default_wind_speed:'Default wind speed (m/s)', decimals:'Decimals',
    temp_min:'Dot temp min (°C)', temp_max:'Dot temp max (°C)',
    t_frosty_min:'FROSTY min (°C)', t_frosty_max:'FROSTY max (°C)',
    t_cold_min:'COLD min (°C)',     t_cold_max:'COLD max (°C)',
    t_chilly_min:'CHILLY min (°C)', t_chilly_max:'CHILLY max (°C)',
    t_cool_min:'COOL min (°C)',     t_cool_max:'COOL max (°C)',
    t_mild_min:'MILD min (°C)',     t_mild_max:'MILD max (°C)',
    t_perf_min:'PERFECT min (°C)',  t_perf_max:'PERFECT max (°C)',
    t_warm_min:'WARM min (°C)',     t_warm_max:'WARM max (°C)',
    t_hot_min:'HOT min (°C)',       t_hot_max:'HOT max (°C)',
    t_boiling_min:'BOILING min (°C)', t_boiling_max:'BOILING max (°C)',
    rh_left_inner_pct:'Inner circle left RH (%)',
    rh_right_inner_pct:'Inner circle right RH (%)',
    ring_pct:'Outer ring box size (% of card)',
    inner_pct:'Inner circle size (% of ring box)',
    y_offset_pct:'Vertical dot offset (%)',
  })[s.name] ?? s.name;

  _helper = (s) => {
    const id = s.name;
    const st = (key) => this.hass?.states?.[this._config?.[key]];
    const unit = (key) => st(key)?.attributes?.unit_of_measurement ?? "";

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
      case 'temp_min':
        return 'Lower bound of the dot’s vertical scale (affects Y mapping only).';
      case 'temp_max':
        return 'Upper bound of the dot’s vertical scale. Must be greater than min.';
      case 't_frosty_min': case 't_frosty_max':
      case 't_cold_min':   case 't_cold_max':
      case 't_chilly_min': case 't_chilly_max':
      case 't_cool_min':   case 't_cool_max':
      case 't_mild_min':   case 't_mild_max':
      case 't_perf_min':   case 't_perf_max':
      case 't_warm_min':   case 't_warm_max':
      case 't_hot_min':    case 't_hot_max':
      case 't_boiling_min':case 't_boiling_max':
        return 'Bands use 0.1 °C steps. Overlaps auto-fix: each next min ≥ previous max + 0.1.';
      case 'rh_left_inner_pct':
      case 'rh_right_inner_pct':
        return 'Maps RH to the inner-circle intersections horizontally: left = this %, right = this %. 0% stays at the left edge; 100% stays at the right edge.';
      case 'ring_pct':
        return 'Diameter of the outer ring as a % of the card. Keep in sync with your CSS.';
      case 'inner_pct':
        return 'Diameter of the inner circle as a % of the outer ring box. Keep in sync with your CSS.';
      case 'y_offset_pct':
        return 'Fine-tune the dot’s vertical position in % of card height (positive moves up).';
      default:
        return 'Tip: values update immediately; click Save when done.';
    }
  };

  // Replace the old handler with this one
  _onChange = (ev) => {
    ev.stopPropagation();
    const merged = { ...(this._config||{}), ...(ev.detail?.value||{}) };
    const cfg = this._sanitizeBandsAndCal(merged);
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: cfg });
  };

  // Add this as a separate method on the class (NOT inside _onChange)
  _sanitizeBandsAndCal(cfg){
    const r1 = v => Math.round((Number(v)||0)*10)/10;
    const step = 0.1;
    const keys = [
      ['t_frosty_min','t_frosty_max'],
      ['t_cold_min','t_cold_max'],
      ['t_chilly_min','t_chilly_max'],
      ['t_cool_min','t_cool_max'],
      ['t_mild_min','t_mild_max'],
      ['t_perf_min','t_perf_max'],
      ['t_warm_min','t_warm_max'],
      ['t_hot_min','t_hot_max'],
      ['t_boiling_min','t_boiling_max'],
    ];
    for (const [lo,hi] of keys){ cfg[lo]=r1(cfg[lo]); cfg[hi]=r1(cfg[hi]); }
    for (let i=0;i<keys.length;i++){
      const [lo,hi] = keys[i];
      if (cfg[hi] < cfg[lo]) cfg[hi] = cfg[lo];
      if (i>0){
        const [plo,phi] = keys[i-1];
        const minAllowed = r1(cfg[phi] + step);
        if (cfg[lo] < minAllowed) cfg[lo] = minAllowed;
        if (cfg[hi] < cfg[lo]) cfg[hi] = cfg[lo];
      }
    }
    // RH→X calibration sanitize: keep within [0,100] and ensure left < right
    const clamp01 = v => Math.min(100, Math.max(0, r1(v)));
    cfg.rh_left_inner_pct  = clamp01(cfg.rh_left_inner_pct  ?? 40);
    cfg.rh_right_inner_pct = clamp01(cfg.rh_right_inner_pct ?? 60);
    if (cfg.rh_right_inner_pct <= cfg.rh_left_inner_pct){
      cfg.rh_right_inner_pct = clamp01(cfg.rh_left_inner_pct + 0.1);
    }
    return cfg;
  }

  // ----------------- NEW: auto-pick logic (runs once) -----------------
  _autoPicked = false;
  _autoFillDefaults(){
    if (this._autoPicked || !this.hass || !this._config) return;

    const states = this.hass.states;

    // helpers
    const firstEntity = (pred) => {
      for (const [id, st] of Object.entries(states)) { if (pred(id, st)) return id; }
      return undefined;
    };
    const devClass = (st) => st?.attributes?.device_class;

    // Only fill if user hasn't set them yet
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

    // If anything changed, notify HA so the editor shows the prefilled values
    fireEvent(this, 'config-changed', { config: this._config });
  }
}

if (!customElements.get('simple-air-comfort-card-editor')) {
  customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
}


/* ----------------------------- Automatic Version on Build ----------------------------- */
const SAC_CARD_VERSION = '__VERSION__'; // replaced at build by rollup

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

/* ----------------------------- Card Size ----------------------------- */
// The height of your card (masonry view only). 1 ~= 50px.
SimpleAirComfortCard.prototype.getCardSize = function () {
  // Roughly align with 4 rows in sections (just a hint for masonry)
  return 4;
};

// The rules for Sections view sizing (12-column grid)
SimpleAirComfortCard.prototype.getGridOptions = function () {
  return {
    // Default footprint (what you asked for):
    columns: 6,   // use multiples of 3 for nicer defaults
    rows: 4,      // ~ 4 * 56px + gaps managed by HA

    // Reasonable bounds so it still looks good when users resize:
    min_columns: 6,
    max_columns: 12,
    min_rows: 4,
    max_rows: 6,
  };
};
