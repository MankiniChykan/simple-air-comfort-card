import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card
 *
 * Face:
 *  - Title (room name) at top, dewpoint comfort text as subtitle.
 *  - TL: Dew point (°C)
 *  - TR: Apparent temperature (AT, °C)
 *  - BL: Temperature comfort text
 *  - BR: Humidity comfort text
 *  - Right side graphic: outer white ring (dewpoint gradient), inner black comfort circle (humidity/temperature gradient),
 *    and a floating white dot that moves per humidity (X) & temperature (Y) and blinks when outside limits.
 *
 * Physics:
 *  - Apparent Temperature (Australian BoM):
 *      AT = T + 0.33·e − 0.70·ws − 4.0
 *    where T in °C, e in hPa (Arden Buck vapour pressure from RH & T), ws in m/s
 *  - Dew point via Arden Buck inverse (numeric bisection).
 *
 * GUI Editor:
 *  - Pick temperature, humidity, optional wind. Set decimals, default wind, temp/humidity limits.
 *
 * No vapour pressure or wind readouts on face (wind still used in AT).
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

  static styles = css`
    ha-card {
      position: relative;
      padding: 12px 12px 14px;
      overflow: hidden;
    }

    /* Maintain a square canvas for the graphic so percentages match your YAML layout */
    .canvas {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      /* Background = temperature color mapping (matches your comfort bands) */
      background: var(--sac-temp-bg, #2a2a2a);
      border-radius: 8px;
    }

    /* Title + subtitle row */
    .header {
      position: absolute;
      top: 6%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      pointer-events: none;
    }
    .title {
      font-weight: 700;
      font-size: 1.05rem;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
      line-height: 1.15;
    }
    .subtitle {
      font-weight: 600;
      font-size: 0.9rem;
      color: silver;
      margin-top: 0.15rem;
    }

    /* The four text corners (TL/TR/BL/BR), using your picture-element style placements */
    .corner {
      position: absolute;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .corner .label {
      font-size: 0.75rem;
      opacity: 0.85;
      display: block;
      font-weight: 600;
    }
    .corner .value {
      font-size: 1.05rem;
    }
    .tl { left: 8%; top: 18%; transform: translate(-0%, -50%); text-align: left; }
    .tr { right: 8%; top: 18%; transform: translate(0%, -50%); text-align: right; }
    .bl { left: 8%; bottom: 8%; transform: translate(0%, 0%); text-align: left; }
    .br { right: 8%; bottom: 8%; transform: translate(0%, 0%); text-align: right; }

    /* Right-side graphic group (matches your YAML proportions) */
    .graphic {
      position: absolute;
      top: 50%;
      right: 4.5%;
      transform: translate(0, -50%);
      width: 45%;
      height: 45%;
      min-width: 120px; /* keep it visible on small cards */
      min-height: 120px;
    }

    /* Outer ring: white border + dewpoint gradient fill (your ring macro colors) */
    .outer-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2.5px solid white;
      background: var(--sac-dewpoint-ring, radial-gradient(circle, dimgray, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15)));
    }

    /* Inner comfort circle: black base + humidity/temperature gradient per your macro */
    .inner-circle {
      position: absolute;
      /* From your YAML: inner ~21% within a 45% ring -> centered circle sized ~21% of canvas. */
      /* We’ll center it within the outer ring using 50% and translate. */
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 46.5%;
      height: 46.5%;
      border-radius: 50%;
      background: var(--sac-inner-gradient, radial-gradient(circle, black 0%, black 60%));
      border: 0;
      box-shadow: inset 0 0 12px rgba(0,0,0,0.6);
    }

    /* Floating dot and its blink aura when outside limits */
    .dot {
      position: absolute;
      width: 15%;
      height: 15%;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 6px rgba(0,0,0,0.45);
      transform: translate(-50%, 50%); /* Match your macro’s translate */
      transition: left 0.8s ease-in-out, bottom 0.8s ease-in-out;
      z-index: 2;
    }
    .dot.outside::before {
      content: "";
      position: absolute;
      inset: -20%;
      border-radius: 50%;
      background: radial-gradient(circle,
        rgba(255,0,0,0.8) 20%,
        rgba(255,0,0,0.3) 50%,
        rgba(255,0,0,0.1) 70%,
        rgba(255,0,0,0) 100%
      );
      animation: sac-blink 1s infinite alternate;
      z-index: -1;
    }
    @keyframes sac-blink {
      0% { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;

  setConfig(config) {
    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');
    }
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed, // optional; used in AT only
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,

      // Limits & warnings (used for dot motion + blink + scaling)
      temp_min: Number.isFinite(config.temp_min) ? config.temp_min : 15,
      temp_max: Number.isFinite(config.temp_max) ? config.temp_max : 35,
      temp_min_warning: Number.isFinite(config.temp_min_warning) ? config.temp_min_warning : 18,
      temp_max_warning: Number.isFinite(config.temp_max_warning) ? config.temp_max_warning : 26.4,
      humidity_min: Number.isFinite(config.humidity_min) ? config.humidity_min : 40,
      humidity_max: Number.isFinite(config.humidity_max) ? config.humidity_max : 60,
    };
  }

  // ---- Rendering -----------------------------------------------------------

  render() {
    if (!this.hass || !this._config) return html``;

    const t = this.hass.states[this._config.temperature];
    const h = this.hass.states[this._config.humidity];
    const w = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!t || !h) {
      return html`<ha-card>
        <div class="canvas"></div>
        <div style="padding: 8px; color: var(--primary-text-color)">Missing entity:
          ${!t ? this._config.temperature : this._config.humidity}</div>
      </ha-card>`;
    }

    // Raw sensor values
    const unitT = (t.attributes.unit_of_measurement || '°C').trim();
    const T_C = this.#toC(parseFloat(t.state), unitT);
    const RH = this.#clampRH(parseFloat(h.state));

    // Wind (m/s) resolution (hidden on face, used in AT)
    const WS = this.#resolveWind(w, this._config.default_wind_speed);

    // Buck vapour pressure (hPa) and dew point (°C)
    const es_hPa = this.#buckEs_hPa(T_C);
    const e_hPa = (RH / 100) * es_hPa;
    const dew_C = this.#dewFromE_hPa(e_hPa);

    // Apparent Temperature (BoM)
    const AT_C = this.#apparentTemperatureC(T_C, e_hPa, WS);

    // Texts per your macros (EXACT thresholds)
    const textDew = this.#dewpointTextFromMacro(dew_C);
    const textTemp = this.#temperatureTextFromMacro(T_C);
    const textHum = this.#humidityTextFromMacro(RH);

    // Visual colors/gradients from your macros
    const dewRing = this.#dewpointRingGradient(textDew);
    const innerGrad = this.#innerCircleGradient(RH, T_C);

    // Card background color from temperature comfort bands (approximate mapping)
    const tempBg = this.#temperatureBackground(T_C);

    // Floating dot position + blink (exact macro behavior)
    const {
      leftPct, bottomPct, outsideLimits,
    } = this.#floatingDot(T_C, RH,
      this._config.temp_min, this._config.temp_max,
      this._config.temp_min_warning, this._config.temp_max_warning,
      this._config.humidity_min, this._config.humidity_max
    );

    // Format numbers
    const d = this._config.decimals;
    const dewOut = this.#fmt(this.#fromC(dew_C, unitT), d);
    const atOut  = this.#fmt(this.#fromC(AT_C, unitT), d);

    // Inline CSS vars for gradients & bg
    const styleVars = `
      --sac-temp-bg: ${tempBg};
      --sac-dewpoint-ring: ${dewRing};
      --sac-inner-gradient: ${innerGrad};
    `;

    return html`
      <ha-card>
        <div class="canvas" style=${styleVars}>

          <!-- Title + subtitle (dewpoint comfort text) -->
          <div class="header">
            <div class="title">${this._config.name}</div>
            <div class="subtitle">${textDew}</div>
          </div>

          <!-- TL: Dew point -->
          <div class="corner tl">
            <span class="label">Dew point</span>
            <span class="value">${dewOut} ${unitT}</span>
          </div>

          <!-- TR: Apparent temperature -->
          <div class="corner tr">
            <span class="label">Feels like</span>
            <span class="value">${atOut} ${unitT}</span>
          </div>

          <!-- BL: Temperature comfort text -->
          <div class="corner bl">
            <span class="label">Temperature</span>
            <span class="value">${textTemp}</span>
          </div>

          <!-- BR: Humidity comfort text -->
          <div class="corner br">
            <span class="label">Humidity</span>
            <span class="value">${textHum}</span>
          </div>

          <!-- Right graphic: outer dewpoint ring + inner comfort circle + floating dot -->
          <div class="graphic">
            <div class="outer-ring"></div>
            <div class="inner-circle"></div>

            <!-- Floating dot -->
            <div
              class="dot ${outsideLimits ? 'outside' : ''}"
              style="left:${leftPct}%; bottom:${bottomPct}%;">
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 3; }

  // ---- Physics -------------------------------------------------------------

  #apparentTemperatureC(Tc, e_hPa, ws_mps) {
    return Tc + 0.33 * e_hPa - 0.70 * ws_mps - 4.0;
  }

  #buckEs_hPa(Tc) {
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) return 6.1121 * Math.exp((18.678 - Tc / 234.5) * (Tc / (257.14 + Tc)));
    return 6.1115 * Math.exp((23.036 - Tc / 333.7) * (Tc / (279.82 + Tc)));
  }

  #dewFromE_hPa(e_hPa) {
    if (!Number.isFinite(e_hPa) || e_hPa <= 0) return NaN;
    let lo = -80, hi = 60, mid = 0;
    for (let i = 0; i < 60; i++) {
      mid = (lo + hi) / 2;
      const es = this.#buckEs_hPa(mid);
      if (!Number.isFinite(es)) break;
      if (es > e_hPa) hi = mid; else lo = mid;
      if (Math.abs(hi - lo) < 1e-4) break;
    }
    return mid;
  }

  // ---- Macro-matching texts ------------------------------------------------

  #dewpointTextFromMacro(dpC) {
    if (!Number.isFinite(dpC)) return 'Unknown';
    if (dpC < 5) return 'Very Dry';
    if (dpC <= 10) return 'Dry';
    if (dpC <= 12.79) return 'Pleasant';
    if (dpC <= 15.49) return 'Comfortable';
    if (dpC <= 18.39) return 'Sticky Humid';
    if (dpC <= 21.19) return 'Muggy';
    if (dpC <= 23.9) return 'Sweltering';
    return 'Stifling';
  }

  #temperatureTextFromMacro(Tc) {
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

  #humidityTextFromMacro(RH) {
    if (!Number.isFinite(RH)) return 'N/A';
    if (RH < 40) return 'DRY';
    if (RH <= 60) return 'COMFY';
    return 'HUMID';
  }

  // ---- Visual mappings (match your macros) ---------------------------------

  #dewpointRingGradient(text) {
    // Your ring macro colors:
    // Very Dry -> deepskyblue
    // Dry -> mediumaquamarine
    // Pleasant -> limegreen
    // Comfortable -> yellowgreen
    // Sticky Humid -> yellow
    // Muggy -> gold
    // Sweltering -> orange
    // Stifling -> crimson
    // Unknown/Unavailable -> dimgray
    const color =
      text === 'Very Dry' ? 'deepskyblue' :
      text === 'Dry' ? 'mediumaquamarine' :
      text === 'Pleasant' ? 'limegreen' :
      text === 'Comfortable' ? 'yellowgreen' :
      text === 'Sticky Humid' ? 'yellow' :
      text === 'Muggy' ? 'gold' :
      text === 'Sweltering' ? 'orange' :
      text === 'Stifling' ? 'crimson' :
      'dimgray';
    // Recreate your gradient structure
    return `radial-gradient(circle, ${color}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`;
  }

  #innerCircleGradient(RH, Tc) {
    // Humidity color per macro:
    // unknown/unavailable -> dimgray
    // <40 or >60 -> hotpink
    // 40..60 -> black
    let humColor = 'dimgray';
    if (Number.isFinite(RH)) {
      if (RH > 60 || RH < 40) humColor = 'hotpink';
      else humColor = 'black';
    }

    // Temperature color per macro (many ranges -> blue/orange families or dimgray mid)
    let tColor = 'dimgray';
    if (Number.isFinite(Tc)) {
      if (Tc > 26.5) tColor = 'rgba(255, 69, 0, 0.8)';                 // hot/orange
      else if (Tc > 24.0 && Tc <= 26.5) tColor = 'dimgray';             // neutral
      else if (Tc > 19.0 && Tc <= 24.0) tColor = 'dimgray';             // neutral
      else /* <=19.0 */ tColor = 'rgba(0, 102, 255, 0.8)';              // cool/blue (covers <=19 inc <3)
    }

    return `radial-gradient(circle, ${humColor} 0%, black, ${tColor} 70%)`;
  }

  #temperatureBackground(Tc) {
    // Simple band -> color mapping to mimic your "temperature colour" backdrop
    if (!Number.isFinite(Tc)) return '#333';
    if (Tc < 3) return 'linear-gradient(135deg,#001a4d,#003d99)';        // FROSTY deep blues
    if (Tc <= 4.99) return 'linear-gradient(135deg,#0a2a6b,#0f49a5)';
    if (Tc <= 8.99) return 'linear-gradient(135deg,#0e4ba0,#1380d3)';    // CHILLY/Cooler blues
    if (Tc <= 13.99) return 'linear-gradient(135deg,#1063b7,#16a0e0)';
    if (Tc <= 18.99) return 'linear-gradient(135deg,#0f8a7a,#1fc0a5)';   // MILD teal/green
    if (Tc <= 23.99) return 'linear-gradient(135deg,#2aa84a,#85c638)';   // PERFECT greens
    if (Tc <= 27.99) return 'linear-gradient(135deg,#f0b323,#f76b1c)';   // WARM orange
    if (Tc <= 34.99) return 'linear-gradient(135deg,#ef4823,#e9290f)';   // HOT red-orange
    return 'linear-gradient(135deg,#7a0000,#b00000)';                    // BOILING deep red
  }

  // ---- Floating dot logic (exact macro) -----------------------------------

  #floatingDot(Tc, RH, tMin, tMax, tWarnMin, tWarnMax, hMin, hMax) {
    // Defaults when unknown/unavailable
    const tIsFinite = Number.isFinite(Tc);
    const hIsFinite = Number.isFinite(RH);
    const tVal = tIsFinite ? Tc : 22;
    const hVal = hIsFinite ? RH : 50;

    // Scale temperature -> 0..100% (bottom..top)
    const clampedT = Math.min(Math.max(tVal, tMin), tMax);
    const bottomPct = ((clampedT - tMin) * (100 - 0)) / (tMax - tMin); // 0..100

    // X position is humidity % (+0.5% offset like your macro)
    const leftPct = Math.min(Math.max(hVal, 0), 100) + 0.5;

    // Outside limits check
    const outsideLimits =
      (hVal < hMin) || (hVal > hMax) ||
      (tVal < tWarnMin) || (tVal > tWarnMax) ||
      (!hIsFinite && !tIsFinite) || // both unknown -> defaults in macro, considered outside
      (!hIsFinite && tIsFinite && tVal === 22) ||
      (hIsFinite && !tIsFinite && hVal === 50);

    return {
      leftPct: this.#round(leftPct, 1),
      bottomPct: this.#round(bottomPct, 1),
      outsideLimits,
    };
  }

  // ---- Helpers -------------------------------------------------------------

  #toC(v, unit) {
    if (!Number.isFinite(v)) return NaN;
    const u = (unit || '').toLowerCase();
    if (u.includes('f')) return (v - 32) * (5 / 9);
    return v;
  }
  #fromC(vC, unitOut) {
    if (!Number.isFinite(vC)) return NaN;
    const u = (unitOut || '').toLowerCase();
    if (u.includes('f')) return (vC * 9/5) + 32;
    return vC;
  }
  #clampRH(rh) {
    if (!Number.isFinite(rh)) return NaN;
    return Math.min(100, Math.max(0, rh));
  }
  #resolveWind(wsState, default_mps) {
    if (!wsState) return default_mps ?? 0.0;
    const raw = parseFloat(wsState.state);
    if (!Number.isFinite(raw)) return default_mps ?? 0.0;
    const unit = (wsState.attributes.unit_of_measurement || 'm/s').toLowerCase();
    if (unit.includes('m/s')) return raw;
    if (unit.includes('km/h') || unit.includes('kph')) return raw / 3.6;
    if (unit.includes('mph')) return raw * 0.44704;
    if (unit.includes('kn')) return raw * 0.514444;
    return raw;
  }
  #round(v, d = 1) {
    if (!Number.isFinite(v)) return NaN;
    const p = Math.pow(10, d);
    return Math.round(v * p) / p;
  }
  #fmt(v, d = 1) {
    if (!Number.isFinite(v)) return '—';
    return this.#round(v, d).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  // ---- Lovelace plumbing ---------------------------------------------------

  set hass(hass) { this._hass = hass; this.requestUpdate(); }
  get hass() { return this._hass; }

  static getConfigElement() {
    return document.createElement('simple-air-comfort-card-editor');
  }

  static getStubConfig() {
    return {
      name: 'Air Comfort',
      temperature: 'sensor.temperature',
      humidity: 'sensor.humidity',
      // windspeed: 'sensor.wind_speed',
      decimals: 1,
      default_wind_speed: 0,
      temp_min: 15,
      temp_max: 35,
      temp_min_warning: 18,
      temp_max_warning: 26.4,
      humidity_min: 40,
      humidity_max: 60,
    };
  }
}

// Register the card element
customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

// Lovelace card picker metadata
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description:
    'Australian BoM apparent temperature + dew point (Buck). Outer dewpoint ring, inner comfort circle, and moving dot.',
  preview: true,
});

/* ------------------------------------------------------------------------ */
/*                             GUI EDITOR                                   */
/* ------------------------------------------------------------------------ */

class SimpleAirComfortCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    .form {
      display: grid;
      gap: 12px;
      padding: 8px 12px 16px;
    }
    .row {
      display: grid;
      grid-template-columns: 230px 1fr;
      gap: 12px;
      align-items: center;
    }
    .hint { opacity: 0.72; font-size: 0.9em; }
    ha-textfield { width: 100%; }
  `;

  setConfig(config) {
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
      temp_min: Number.isFinite(config.temp_min) ? config.temp_min : 15,
      temp_max: Number.isFinite(config.temp_max) ? config.temp_max : 35,
      temp_min_warning: Number.isFinite(config.temp_min_warning) ? config.temp_min_warning : 18,
      temp_max_warning: Number.isFinite(config.temp_max_warning) ? config.temp_max_warning : 26.4,
      humidity_min: Number.isFinite(config.humidity_min) ? config.humidity_min : 40,
      humidity_max: Number.isFinite(config.humidity_max) ? config.humidity_max : 60,
    };
  }

  get _name() { return this._config?.name ?? ''; }
  get _temperature() { return this._config?.temperature ?? ''; }
  get _humidity() { return this._config?.humidity ?? ''; }
  get _windspeed() { return this._config?.windspeed ?? ''; }
  get _decimals() { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defaultWind() { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }
  get _tmin() { return Number.isFinite(this._config?.temp_min) ? this._config.temp_min : 15; }
  get _tmax() { return Number.isFinite(this._config?.temp_max) ? this._config.temp_max : 35; }
  get _twmin() { return Number.isFinite(this._config?.temp_min_warning) ? this._config.temp_min_warning : 18; }
  get _twmax() { return Number.isFinite(this._config?.temp_max_warning) ? this._config.temp_max_warning : 26.4; }
  get _hmin() { return Number.isFinite(this._config?.humidity_min) ? this._config.humidity_min : 40; }
  get _hmax() { return Number.isFinite(this._config?.humidity_max) ? this._config.humidity_max : 60; }

  render() {
    if (!this.hass) return html``;

    return html`
      <div class="form">
        <div class="row">
          <div><label>Name</label></div>
          <ha-textfield
            .value=${this._name}
            @input=${(e) => this._set('name', e.target.value)}
            placeholder="Air Comfort"
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._set('temperature', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._set('humidity', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. Used only in Apparent Temperature.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._set('windspeed', e.detail.value)}
            allow-custom-entity
            no-clear-text
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label>
            <div class="hint">Used if no wind entity is set.</div>
          </div>
          <ha-textfield
            type="number" inputmode="decimal" step="0.1"
            .value=${String(this._defaultWind)}
            @input=${(e) => this._setNum('default_wind_speed', e.target.value, 0)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield
            type="number" step="1" min="0"
            .value=${String(this._decimals)}
            @input=${(e) => this._setNum('decimals', e.target.value, 1)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp scale min / max (°C)</label>
            <div class="hint">Dot vertical mapping (bottom..top).</div>
          </div>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._tmin)}
            @input=${(e) => this._setNum('temp_min', e.target.value, 15)}
          ></ha-textfield>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._tmax)}
            @input=${(e) => this._setNum('temp_max', e.target.value, 35)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp warning min / max (°C)</label>
            <div class="hint">Blink when outside.</div>
          </div>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._twmin)}
            @input=${(e) => this._setNum('temp_min_warning', e.target.value, 18)}
          ></ha-textfield>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._twmax)}
            @input=${(e) => this._setNum('temp_max_warning', e.target.value, 26.4)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Humidity range min / max (%)</label>
            <div class="hint">Blink when outside.</div>
          </div>
          <ha-textfield
            type="number" step="1"
            .value=${String(this._hmin)}
            @input=${(e) => this._setNum('humidity_min', e.target.value, 40)}
          ></ha-textfield>
          <ha-textfield
            type="number" step="1"
            .value=${String(this._hmax)}
            @input=${(e) => this._setNum('humidity_max', e.target.value, 60)}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  _set(k, v) {
    const cfg = { ...(this._config ?? {}) };
    if (v === '' || v === undefined || v === null) delete cfg[k];
    else cfg[k] = v;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: cfg });
  }
  _setNum(k, raw, fallback) {
    const num = raw === '' ? undefined : Number(raw);
    this._set(k, Number.isFinite(num) ? num : fallback);
  }
}

customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
