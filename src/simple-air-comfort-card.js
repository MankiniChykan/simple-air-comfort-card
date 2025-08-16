import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card
 * - Apparent Temperature (Australian BoM):
 *     AT = T + 0.33·e − 0.70·ws − 4.0
 *     (T in °C, e in hPa from Arden Buck, ws in m/s)
 * - Vapour pressure (e) via Arden Buck saturation vapour pressure.
 * - Dew point from Arden Buck (numeric inverse).
 * - Default windspeed is 0.0 m/s if no wind entity provided.
 *
 * Visual notes:
 * - No external SVG; background is pure CSS (no broken image, no outer border).
 * - Top center inside the ring shows “Air Comfort”.
 * - Bottom-left shows INTENSITY (e.g., “Mild”) under air temperature.
 * - Bottom-right shows COMFORT word (e.g., “Comfy”) under RH.
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
      padding: 0;
      overflow: hidden;
    }

    /* Whole canvas */
    .canvas {
      position: relative;
      padding: 18px;
      min-height: 420px;
      /* soft vignette background */
      background:
        radial-gradient(140% 110% at 50% 35%, rgba(0,0,0,0.26), rgba(0,0,0,0.58)),
        radial-gradient(100% 100% at 50% 50%, rgba(8,32,28,0.55), rgba(0,0,0,0.65));
      border-radius: 14px;
    }

    /* Stage that holds the dial */
    .stage {
      position: relative;
      z-index: 1;
      margin: 8px 6px 10px;
      padding: clamp(14px, 2.4vw, 24px);
      border-radius: 16px;
      background: radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0.35), rgba(0,0,0,0.55));
      box-shadow: inset 0 0 60px rgba(0,0,0,0.35);
    }

    /* Dial geometry */
    .dial {
      position: relative;
      width: min(86vw, 560px);
      max-width: 100%;
      margin: 0 auto;
      aspect-ratio: 1 / 1;
    }

    .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.92);
      box-shadow:
        0 0 12px rgba(255,255,255,0.18),
        inset 0 0 40px rgba(0,0,0,0.4);
    }

    .inner {
      position: absolute;
      inset: 20% 20% 20% 20%;
      border-radius: 50%;
      background: radial-gradient(60% 60% at 50% 45%, rgba(11,109,93,0.95), rgba(0,0,0,0.72));
      box-shadow: inset 0 0 60px rgba(0,0,0,0.55);
    }

    .iris {
      position: absolute;
      inset: 32% 32% 32% 32%;
      border-radius: 50%;
      background: radial-gradient(65% 65% at 45% 40%, rgba(11,109,93,0.9), rgba(0,0,0,0.85));
      box-shadow: inset 0 0 40px rgba(0,0,0,0.7);
    }

    .pupil {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 56px;
      height: 56px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(60% 60% at 45% 40%, #0c0c0c, #000);
      box-shadow:
        0 0 0 6px rgba(255,255,255,0.85),
        0 4px 18px rgba(0,0,0,0.6);
    }

    /* Static captions around ring */
    .caption {
      position: absolute;
      font-size: .92rem;
      font-weight: 700;
      color: rgba(255,255,255,.82);
      text-shadow: 0 1px 2px rgba(0,0,0,.7);
      user-select: none;
      letter-spacing: .2px;
    }
    /* Air Comfort replaces the old top "Warm" caption */
    .top    { top: -30px; left: 50%; transform: translate(-50%, 0); }
    .bottom { bottom: -30px; left: 50%; transform: translate(-50%, 0); }
    .left   { left: -34px; top: 50%; transform: translate(0, -50%) rotate(-90deg); }
    .right  { right: -34px; top: 50%; transform: translate(0, -50%) rotate(90deg); }

    /* Metrics near quadrants */
    .metric {
      position: absolute;
      display: grid;
      gap: 2px;
      text-align: center;
      color: rgba(255,255,255,.88);
      text-shadow: 0 1px 2px rgba(0,0,0,.6);
      font-variant-numeric: tabular-nums;
    }
    .metric .k { font-size: .92rem; opacity: .92; font-weight: 600; }
    .metric .v { font-size: 1.05rem; font-weight: 800; letter-spacing: .2px; }

    .tl { top: 13%; left: 18%; }    /* Dew point */
    .tr { top: 13%; right: 18%; }   /* Feels like */
    .bl { bottom: 11%; left: 18%; } /* Air temperature + INTENSITY */
    .br { bottom: 11%; right: 18%; }/* RH + COMFORT */

    .sub { font-size: .9rem; color: rgba(255,255,255,.75); font-weight: 600; }
  `;

  setConfig(config) {
    if (!config || !config.temperature || !config.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');
    }
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed, // optional
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
    };
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="canvas">
          <div class="stage">
            <div style="text-align:center;color:var(--secondary-text-color);padding:24px 8px">
              Missing entity:
              ${!tState ? this._config.temperature : this._config.humidity}
            </div>
          </div>
        </div>
      </ha-card>`;
    }

    // Inputs
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rh    = this.#clampRH(parseFloat(rhState.state));
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed);

    // Physics
    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC);
    const e_hPa  = (rh / 100) * es_hPa;
    const dewC   = this.#dewPointFromVapourPressure_hPa(e_hPa);
    const atC    = this.#apparentTemperatureC(tempC, e_hPa, ws_mps);

    // Outputs (use same unit as input temp)
    const outUnit = tempUnitIn;
    const valueAT  = this.#fromCelsius(atC, outUnit);
    const valueT   = this.#fromCelsius(tempC, outUnit);
    const valueDew = this.#fromCelsius(dewC, outUnit);

    // Labels
    const comfortWord   = this.#comfortWord(tempC, rh);   // bottom-right
    const intensityWord = this.#intensityWord(tempC, rh); // bottom-left
    const d = this._config.decimals;

    return html`
      <ha-card>
        <div class="canvas">
          <div class="stage">
            <div class="dial">
              <div class="ring"></div>
              <div class="inner"></div>
              <div class="iris"></div>
              <div class="pupil"></div>

              <!-- Captions around the ring -->
              <div class="caption top">Air Comfort</div>
              <div class="caption right">Humid</div>
              <div class="caption bottom">Cold</div>
              <div class="caption left">Dry</div>

              <!-- Quadrant metrics -->
              <div class="metric tl">
                <div class="k">Dew point</div>
                <div class="v">${this.#formatNumber(valueDew, d)} ${outUnit}</div>
              </div>

              <div class="metric tr">
                <div class="k">Feels like</div>
                <div class="v">${this.#formatNumber(valueAT, d)} ${outUnit}</div>
              </div>

              <div class="metric bl">
                <div class="v">${this.#formatNumber(valueT, d)} ${outUnit}</div>
                <div class="sub">${intensityWord}</div>
              </div>

              <div class="metric br">
                <div class="v">${this.#formatNumber(rh, d)} %</div>
                <div class="sub">${comfortWord}</div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 4; }

  // ---- Physics -------------------------------------------------------------

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

  // ---- Classification text -------------------------------------------------

  #comfortWord(Tc, rh) {
    if (rh < 30) return 'Dry';
    if (rh > 60) return 'Humid';
    if (Tc < 18) return 'Cold';
    if (Tc > 26) return 'Warm';
    return 'Comfy';
  }

  #intensityWord(Tc, rh) {
    // distance from nominal comfy center (22°C, 45% RH)
    const dn = Math.hypot((Tc - 22) / 8, (rh - 45) / 25);
    if (dn < 0.45) return 'Mild';
    if (dn < 0.85) return 'Moderate';
    return 'Severe';
  }

  // ---- Helpers -------------------------------------------------------------

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
    'Australian BoM apparent temperature + dew point (Arden Buck). Wind optional; defaults to 0 m/s. Pure CSS background.',
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
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row { display: grid; grid-template-columns: 220px 1fr; gap: 12px; align-items: center; }
    .hint { opacity: 0.7; font-size: 0.9em; }
  `;

  setConfig(config) {
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
    };
  }

  get _name()        { return this._config?.name ?? ''; }
  get _temperature() { return this._config?.temperature ?? ''; }
  get _humidity()    { return this._config?.humidity ?? ''; }
  get _windspeed()   { return this._config?.windspeed ?? ''; }
  get _decimals()    { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defaultWind() { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }

  render() {
    if (!this.hass) return html``;

    return html`
      <div class="form">
        <div class="row">
          <div><label>Name</label></div>
          <ha-textfield
            .value=${this._name}
            @input=${(e) => this._update('name', e.target.value)}
            placeholder="Air Comfort"
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._update('temperature', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._update('humidity', e.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. If empty, wind defaults below.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._update('windspeed', e.detail.value)}
            allow-custom-entity
            no-clear-text
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label></div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._defaultWind)}
            @input=${(e) => this._updateNumber('default_wind_speed', e.target.value)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield
            type="number"
            step="1"
            min="0"
            .value=${String(this._decimals)}
            @input=${(e) => this._updateNumber('decimals', e.target.value, 0)}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  _update(key, value) {
    const newConfig = { ...(this._config ?? {}) };
    if (value === '' || value === undefined || value === null) {
      delete newConfig[key];
    } else {
      newConfig[key] = value;
    }
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  _updateNumber(key, raw, fallback = 0) {
    const num = raw === '' ? undefined : Number(raw);
    const val = Number.isFinite(num) ? num : fallback;
    this._update(key, val);
  }
}

customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
