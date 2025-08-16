import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card (dial layout)
 * - Apparent Temperature (Australian BoM): AT = T + 0.33·e − 0.70·ws − 4.0
 *   (T in °C, e in hPa from Arden Buck, ws in m/s)
 * - Vapour pressure (e) via Arden Buck saturation vapour pressure.
 * - Dew point from Arden Buck (numeric inverse).
 * - Default windspeed is 0.0 m/s if no wind entity provided.
 *
 * Visual policy per user:
 *   • Wind speed and vapour pressure are used only in calculations.
 *   • Wind speed remains configurable in the GUI editor.
 *   • Neither wind speed nor vapour pressure are displayed on the card.
 *
 * Lovelace usage:
 * type: custom:simple-air-comfort-card
 * name: Living Room
 * temperature: sensor.room_temp
 * humidity: sensor.room_rh
 * windspeed: sensor.room_ws           # optional
 * decimals: 1                         # optional
 * default_wind_speed: 0               # optional (m/s)
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

// Resolve the ring overlay from this bundle (works when served by HACS)
const OVERLAY_URL = new URL('./sac_background_overlay.svg', import.meta.url).toString();

class SimpleAirComfortCard extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    :host { --ring-size: 74%; /* % of canvas (square) side */ }

    ha-card {
      padding: 16px;
      overflow: hidden;
    }

    .header {
      display: grid;
      place-items: center;
      gap: 4px;
      margin-bottom: 6px;
      text-align: center;
    }
    .title { font-weight: 700; opacity: 0.88; }
    .summary { font-size: 1.6rem; font-weight: 800; line-height: 1; }
    .sub { opacity: 0.75; font-size: 0.95rem; }

    /* Square canvas: all positioning is relative to this */
    .canvas {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 12px;
      background: radial-gradient(60% 60% at 50% 45%, rgba(0,160,120,0.22), rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.6));
      box-shadow: inset 0 0 60px rgba(0,0,0,0.35);
    }

    /* Ring overlay image */
    .overlay {
      position: absolute;
      left: 50%;
      top: 50%;
      width: var(--ring-size);
      height: var(--ring-size);
      transform: translate(-50%, -50%);
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 0 6px rgba(0,0,0,0.35));
    }

    /* Inner glow circle */
    .inner {
      position: absolute;
      left: 50%;
      top: 50%;
      width: calc(var(--ring-size) * 0.58);
      height: calc(var(--ring-size) * 0.58);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background:
        radial-gradient(40% 40% at 45% 45%, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.1) 65%, transparent 66%),
        radial-gradient(circle at 50% 55%, rgba(0,200,160,0.6), rgba(0,120,100,0.4) 60%, rgba(0,0,0,0.15) 100%);
    }

    /* Floating dot anchored to ring coords */
    .dot {
      position: absolute;
      left: calc(50% + var(--dot-x));
      top:  calc(50% + var(--dot-y));
      width: calc(var(--ring-size) * 0.095);
      height: calc(var(--ring-size) * 0.095);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: black;
      box-shadow:
        0 0 0 5px rgba(255,255,255,0.6),
        0 8px 18px rgba(0,0,0,0.55);
    }

    /* Labels tied to the ring, not card edges */
    .label {
      position: absolute;
      color: rgba(255,255,255,0.78);
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      font-variant-numeric: tabular-nums;
    }
    .label.small { font-size: 0.95rem; font-weight: 700; }
    .label.tiny  { font-size: 0.85rem; opacity: 0.72; font-weight: 600; }
    .label.caption { font-size: 0.85rem; opacity: 0.65; }

    .at-top    { left: 50%; top: 16%; transform: translate(-50%, -50%); }
    .at-bottom { left: 50%; top: 84%; transform: translate(-50%, -50%); }
    .at-left   { left: 14%; top: 50%; transform: translate(-50%, -50%) rotate(180deg); writing-mode: vertical-rl; }
    .at-right  { left: 86%; top: 50%; transform: translate(-50%, -50%); writing-mode: vertical-rl; }

    /* Corner metric blocks around the ring */
    .corner { position: absolute; transform: translate(-50%, -50%); text-align: center; }
    .tl { left: 26%; top: 28%; }
    .tr { left: 74%; top: 28%; }
    .bl { left: 26%; top: 78%; }
    .br { left: 74%; top: 78%; }

    .metric { display: grid; gap: 2px; justify-items: center; }
    .metric .big { font-weight: 900; }
    .metric .cap { opacity: 0.7; font-size: 0.85rem; }
  `;

  setConfig(config) {
    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');
    }
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed, // optional (kept in GUI, not shown visually)
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
    };
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const tState = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="sub">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
      </ha-card>`;
    }

    // ---- Inputs & physics --------------------------------------------------
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rh = this.#clampRH(parseFloat(rhState.state));
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed); // used in AT, not shown

    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC);
    const e_hPa = (rh / 100) * es_hPa; // used for AT & dew point, not shown
    const dewC = this.#dewPointFromVapourPressure_hPa(e_hPa);
    const atC = this.#apparentTemperatureC(tempC, e_hPa, ws_mps);

    // Output unit follows input temperature
    const outUnit = tempUnitIn;
    const d = this._config.decimals;
    const tOut = this.#fromCelsius(tempC, outUnit);
    const dewOut = this.#fromCelsius(dewC, outUnit);
    const atOut = this.#fromCelsius(atC, outUnit);

    // Simple buckets
    const rhText = rh < 35 ? 'Dry' : rh > 60 ? 'Humid' : 'Comfy';
    const tempBand = tempC < 18 ? 'Cold' : tempC > 26 ? 'Warm' : 'Mild';
    const tempComfort = tempC >= 20 && tempC <= 24 ? 'PERFECT' : tempBand.toUpperCase();
    const humidComfort = rh >= 35 && rh <= 60 ? 'COMFY' : rhText.toUpperCase();

    // Floating dot position (relative to ring radius)
    const norm = (v, a, b) => (v - a) / (b - a); // 0..1
    const xFrac = Math.min(1, Math.max(0, norm(rh, 0, 100)));     // humidity L->R
    const yFrac = Math.min(1, Math.max(0, norm(tempC, 12, 30)));  // temp T->B
    const reach = 0.40;                                           // % of ring radius
    const toOffset = (frac, center = 0.5) => (frac - center) * reach;
    const dotX = `calc((var(--ring-size)) * ${toOffset(xFrac)} )`;
    const dotY = `calc((var(--ring-size)) * ${toOffset(yFrac)} )`;

    return html`
      <ha-card>
        <!-- Header -->
        <div class="header">
          <div class="title">${this._config.name}</div>
          <div class="summary">${rhText}</div>
          <div class="sub">${tempBand}</div>
        </div>

        <!-- Square canvas with centered overlay and dot -->
        <div class="canvas" style=${styleMap({ '--dot-x': dotX, '--dot-y': dotY })}>
          <!-- Ring captions -->
          <div class="label tiny at-top">Warm</div>
          <div class="label tiny at-bottom">Cold</div>
          <div class="label tiny at-left">Dry</div>
          <div class="label tiny at-right">Humid</div>

          <!-- Ring + inner glow + dot -->
          <img class="overlay" src="${OVERLAY_URL}" alt="" />
          <div class="inner"></div>
          <div class="dot" aria-hidden="true"></div>

          <!-- Corner metrics -->
          <div class="corner tl metric">
            <div class="caption">Dew point</div>
            <div class="small big">${this.#formatNumber(dewOut, d)} ${outUnit}</div>
          </div>

          <div class="corner tr metric">
            <div class="caption">Feels like</div>
            <div class="small big">${this.#formatNumber(atOut, d)} ${outUnit}</div>
          </div>

          <div class="corner bl metric">
            <div class="small big">${this.#formatNumber(tOut, d)} ${outUnit}</div>
            <div class="cap">${tempComfort}</div>
          </div>

          <div class="corner br metric">
            <div class="small big">${this.#formatNumber(rh, d)} %</div>
            <div class="cap">${humidComfort}</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 5; }

  // ------------------- Physics -------------------

  #apparentTemperatureC(Tc, e_hPa, ws_mps) {
    return Tc + 0.33 * e_hPa - 0.70 * ws_mps - 4.0;
  }

  #buckSaturationVapourPressure_hPa(Tc) {
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) {
      return 6.1121 * Math.exp((18.678 - Tc / 234.5) * (Tc / (257.14 + Tc)));
    }
    return 6.1115 * Math.exp((23.036 - Tc / 333.7) * (Tc / (279.82 + Tc)));
  }

  #dewPointFromVapourPressure_hPa(e_hPa) {
    if (!Number.isFinite(e_hPa) || e_hPa <= 0) return NaN;
    let lo = -80, hi = 60, mid = 0;
    for (let i = 0; i < 60; i++) {
      mid = (lo + hi) / 2;
      const es = this.#buckSaturationVapourPressure_hPa(mid);
      if (!Number.isFinite(es)) break;
      if (es > e_hPa) hi = mid; else lo = mid;
      if (Math.abs(hi - lo) < 1e-4) break;
    }
    return mid;
  }

  // ------------------- Helpers -------------------

  #clampRH(rh) {
    if (!Number.isFinite(rh)) return NaN;
    return Math.min(100, Math.max(0, rh));
  }

  #toCelsius(value, unit) {
    if (!Number.isFinite(value)) return NaN;
    const u = (unit || '').toLowerCase();
    if (u.includes('f')) return (value - 32) * (5 / 9);
    return value;
  }

  #fromCelsius(valueC, unitOut) {
    const u = (unitOut || '').toLowerCase();
    if (!Number.isFinite(valueC)) return NaN;
    if (u.includes('f')) return valueC * 9/5 + 32;
    return valueC;
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
    return raw; // assume m/s
  }

  #round(v, d = 1) {
    if (!Number.isFinite(v)) return NaN;
    const p = Math.pow(10, d);
    return Math.round(v * p) / p;
  }

  #formatNumber(v, d = 1) {
    if (!Number.isFinite(v)) return '—';
    return this.#round(v, d).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  // ---------------- Lovelace plumbing ----------------

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
  description: 'Dial-style comfort card (BoM apparent temp + Arden Buck dewpoint). Wind/e used in math only.',
  preview: true,
});

/* ========================= GUI EDITOR ========================= */

class SimpleAirComfortCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row { display: grid; grid-template-columns: 220px 1fr; gap: 12px; align-items: center; }
    .hint { opacity: 0.7; font-size: 0.9em; }
  `;

  setConfig(config) {
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed, // keep in GUI
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
    };
  }

  get _name() { return this._config?.name ?? ''; }
  get _temperature() { return this._config?.temperature ?? ''; }
  get _humidity() { return this._config?.humidity ?? ''; }
  get _windspeed() { return this._config?.windspeed ?? ''; }
  get _decimals() { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defaultWind() { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }

  render() {
    if (!this.hass) return html``;
    return html`
      <div class="form">
        <div class="row">
          <div><label>Name</label></div>
          <ha-textfield .value=${this._name} @input=${(e)=>this.#update('name', e.target.value)} placeholder="Air Comfort"></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${['sensor']}
            @value-changed=${(e)=>this.#update('temperature', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${['sensor']}
            @value-changed=${(e)=>this.#update('humidity', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. If empty, the default wind speed below is used.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${['sensor']}
            @value-changed=${(e)=>this.#update('windspeed', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label></div>
          <ha-textfield type="number" inputmode="decimal" step="0.1" .value=${String(this._defaultWind)}
            @input=${(e)=>this.#updateNumber('default_wind_speed', e.target.value)}></ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield type="number" step="1" min="0" .value=${String(this._decimals)}
            @input=${(e)=>this.#updateNumber('decimals', e.target.value, 0)}></ha-textfield>
        </div>
      </div>
    `;
  }

  #update(key, value) {
    const cfg = { ...(this._config ?? {}) };
    if (value === '' || value === undefined || value === null) delete cfg[key];
    else cfg[key] = value;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: cfg });
  }
  #updateNumber(key, raw, fallback = 0) {
    const num = raw === '' ? undefined : Number(raw);
    const val = Number.isFinite(num) ? num : fallback;
    this.#update(key, val);
  }
}

customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);

// Minimal styleMap helper (avoid importing directive)
function styleMap(obj) {
  return Object.entries(obj).map(([k,v]) => `${k}: ${v}`).join('; ');
}
