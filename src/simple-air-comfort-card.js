import { LitElement, html, css } from 'lit';

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
    :host{ display:block; width:100%; box-sizing:border-box; }

    ha-card{
      position:relative; padding:0; overflow:hidden; isolation:isolate;
      border-radius:var(--ha-card-border-radius,12px);
      background:var(--sac-temp-bg,#2a2a2a);
      display:block; box-sizing:border-box; min-height:0;
    }

    /* Square stage defines height (no absolute here) */
    .ratio{ position:relative; width:100%; aspect-ratio:1/1; margin:0; }

    /* Dot (+ halo when outside) — positioned in % of the whole card */
    .dot{
      position:absolute; width:15%; height:15%; border-radius:50%;
      background:#fff; box-shadow:0 0 6px rgba(0,0,0,.45);
      transform:translate(-50%, 50%);
      transition:left .8s ease-in-out,bottom .8s ease-in-out; z-index:2;
    }
    .dot.outside::before{
      content:""; position:absolute; inset:-20%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-blink 1s infinite alternate; z-index:-1;
    }
    @keyframes sac-blink{ 0%{opacity:1} 100%{opacity:.3} }

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
      margin-top:.18rem;
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
      margin-top: 0.15rem;
    }
    .tl{ left:8%;  top:18%;  transform:translate(0,-50%); text-align:left; }
    .tr{ right:8%; top:18%;  transform:translate(0,-50%); text-align:right; }
    .bl{ left:8%;  bottom:6%; transform:translate(0,0);   text-align:left; }
    .br{ right:8%; bottom:6%; transform:translate(0,0);   text-align:right; }

    /* Dial — 45% like original */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:45%; height:45%; min-width:120px; min-height:120px;
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
    .axis-left   { left:-18px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-18px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

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

  // ============================== Config ==============================
  setConfig(config) {
    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');
    }
    const num = v => (v === undefined || v === null || v === '' ? NaN : Number(v));
    const temp_min = Number.isFinite(num(config.temp_min)) ? num(config.temp_min) : 15;
    const temp_max = Number.isFinite(num(config.temp_max)) ? num(config.temp_max) : 35;
    if (temp_max <= temp_min) throw new Error('simple-air-comfort-card: temp_max must be > temp_min.');
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(num(config.decimals)) ? num(config.decimals) : 1,
      default_wind_speed: Number.isFinite(num(config.default_wind_speed)) ? num(config.default_wind_speed) : 0.0,
      temp_min, temp_max,
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
                           innerGrad: this.#innerEyeGradient(NaN, NaN),
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
    const innerGrad = this.#innerEyeGradient(RH, Tc);

    // Dot (percent of the whole card; defaults to exact center if NaN)
    const { temp_min, temp_max } = this._config;
    const yPct = Number.isFinite(Tc) ? this.#scaleClamped(Tc, temp_min, temp_max, 0, 100) : 50;
    const xPct = Number.isFinite(RH) ? this.#clamp(RH + 0.0, 0, 100) : 50; // +0 so 0..100 maps 1:1
    const outside = (Number.isFinite(RH) && Number.isFinite(Tc)) ?
      (RH < 40 || RH > 60 || Tc < 18 || Tc > 26.4) : false;

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
            outUnit, d, dewOut, atOut, tempRaw, rhRaw
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
    dewOut, atOut, tempRaw, rhRaw
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
        <div class="axis axis-top">Warm</div>
        <div class="axis axis-bottom">Cold</div>
        <div class="axis axis-left">Dry</div>
        <div class="axis axis-right">Humid</div>

        <div class="outer-ring"></div>
        <div class="inner-circle"></div>
        <div class="dot ${outside ? 'outside' : ''}" style="left:${xPct}%; bottom:${yPct}%;"></div>
      </div>
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
    if (Tc < 3) return 'FROSTY';
    if (Tc <= 4.99) return 'COLD';
    if (Tc <= 8.99) return 'CHILLY';
    if (Tc <= 13.99) return 'COOL';
    if (Tc <= 18.99) return 'MILD';
    if (Tc <= 23.99) return 'PERFECT';
    if (Tc <= 27.99) return 'WARM';
    if (Tc <= 34.99) return 'HOT';
    return 'BOILING';
  }
  #humidityTextFromMacro(RH){
    if (!Number.isFinite(RH)) return 'N/A';
    if (RH < 40) return 'DRY';
    if (RH <= 60) return 'COMFY';
    return 'HUMID';
  }

  // ======================= Visual mappings / BG ========================
  #temperatureComfortTextForBg(Tc){
    if (!Number.isFinite(Tc)) return 'n/a';
    if (Tc < 3) return 'frosty';
    if (Tc <= 4.99) return 'cold';
    if (Tc <= 8.99) return 'chilly';
    if (Tc <= 13.99) return 'cool';
    if (Tc <= 18.99) return 'mild';
    if (Tc <= 23.99) return 'perfect';
    if (Tc <= 27.99) return 'warm';
    if (Tc <= 34.99) return 'hot';
    return 'boiling';
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
  #innerEyeGradient(RH, Tc){
    let humidityColor='black';
    if (!Number.isFinite(RH)) humidityColor='dimgray';
    else if (RH < 40 || RH > 60) humidityColor='hotpink';
    let temperatureColor='dimgray';
    if (Number.isFinite(Tc)){
      if (Tc > 34.9) temperatureColor='rgba(255,69,0,0.8)';
      else if (Tc > 26.5) temperatureColor='rgba(255,69,0,0.8)';
      else if (Tc > 24.0) temperatureColor='dimgray';
      else if (Tc > 19.0) temperatureColor='dimgray';
      else if (Tc > 14.0) temperatureColor='rgba(0,102,255,0.8)';
      else temperatureColor='rgba(0,102,255,0.8)';
    }
    return `radial-gradient(circle, ${humidityColor} 0%, black, ${temperatureColor} 70%)`;
  }

  // =============================== Helpers ===============================
  #clamp(v,a,b){ return Math.min(b, Math.max(a,v)); }
  #scaleClamped(v, inMin, inMax, outMin, outMax){
    if (!Number.isFinite(v)) return (outMin+outMax)/2;
    const t=(v - inMin)/(inMax - inMin);
    return this.#clamp(outMin + t*(outMax - outMin), outMin, outMax);
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
  static getStubConfig(){
    return {
      name:'Air Comfort',
      temperature:'sensor.temperature',
      humidity:'sensor.humidity',
      decimals:1, default_wind_speed:0, temp_min:15, temp_max:35,
    };
  }
}

customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

/* ----------------------------- GUI editor ----------------------------- */
class SimpleAirComfortCardEditor extends LitElement {
  static properties = { hass:{type:Object}, _config:{state:true}, _schema:{state:true} };
  static styles = css`.wrap{ padding:8px 12px 16px; }`;
  connectedCallback(){ super.connectedCallback(); window.loadCardHelpers?.().catch(()=>{}); }
  set hass(h){ this._hass=h; this.requestUpdate(); } get hass(){ return this._hass; }

  setConfig(config){
    this._config = {
      name:'Air Comfort',
      temperature: undefined, humidity: undefined, windspeed: undefined,
      decimals:1, default_wind_speed:0, temp_min:15, temp_max:35,
      ...(config ?? {}),
    };
    this._schema = [
      { name:'name', selector:{ text:{} } },
      { name:'temperature', required:true, selector:{ entity:{ domain:'sensor' } } },
      { name:'humidity',    required:true, selector:{ entity:{ domain:'sensor' } } },
      { name:'windspeed', selector:{ entity:{ domain:'sensor' } } },
      { name:'default_wind_speed', selector:{ number:{ min:0, max:50, step:0.1, mode:'box', unit_of_measurement:'m/s' } } },
      { name:'decimals', selector:{ number:{ min:0, max:3, step:1, mode:'box' } } },
      { name:'temp_min', selector:{ number:{ min:-20, max:50, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
      { name:'temp_max', selector:{ number:{ min:-20, max:60, step:0.1, mode:'box', unit_of_measurement:'°C' } } },
    ];
  }

  render(){
    if (!this.hass || !this._config) return html``;
    return html`<div class="wrap">
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._label}
        @value-changed=${this._onChange}>
      </ha-form>
    </div>`;
  }
  _label = s => ({
    name:'Name', temperature:'Temperature entity', humidity:'Humidity entity', windspeed:'Wind speed entity (optional)',
    default_wind_speed:'Default wind speed (m/s)', decimals:'Decimals',
    temp_min:'Dot temp min (°C)', temp_max:'Dot temp max (°C)',
  })[s.name] ?? s.name;

  _onChange = (ev) => {
    ev.stopPropagation();
    const cfg = ev.detail.value;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: cfg });
  };
}
customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
