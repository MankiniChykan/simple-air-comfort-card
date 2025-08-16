import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card
 *
 * Core goals:
 * - Compute *Australian BoM Apparent Temperature* in the card (no templates/sensors needed).
 * - Use Arden Buck for saturation vapour pressure (es) and derive vapour pressure (e).
 * - Compute dew point by numerically inverting Buck (robust across sub-/above-freezing).
 * - Be indoor-friendly: default wind speed is 0.0 m/s if no wind entity is set.
 *
 * Formulas:
 *   Apparent Temperature (BoM):
 *     AT = T + 0.33·e − 0.70·ws − 4.0
 *     where T is °C, e is vapour pressure in hPa, ws is wind speed in m/s
 *
 *   Vapour pressure from RH (using Buck saturation vapour pressure):
 *     e = (RH/100) · es(T)
 *
 *   Buck saturation vapour pressure (hPa):
 *     For T ≥ 0°C:  es = 6.1121 · exp((18.678 − T/234.5) · (T / (257.14 + T)))
 *     For T <  0°C: es = 6.1115 · exp((23.036 − T/333.7) · (T / (279.82 + T)))
 *
 *   Dew point (°C):
 *     Numerically invert es to find Td such that es(Td) ≈ e (bisection).
 *
 * Lovelace config example:
 * type: custom:simple-air-comfort-card
 * name: Air Comfort
 * temperature: sensor.living_temp            # required
 * humidity: sensor.living_humidity           # required
 * windspeed: sensor.living_wind_speed        # optional (m/s, km/h, mph, kn supported)
 * decimals: 1                                # optional, display precision (default 1)
 * default_wind_speed: 0                      # optional, m/s fallback when no wind entity (default 0)
 */

/** Small helper to dispatch HA-style events (e.g., 'config-changed' from the editor) */
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

/** ------------------------------------------------------------------------ */
/**                           DISPLAY CARD CLASS                             */
/** ------------------------------------------------------------------------ */
class SimpleAirComfortCard extends LitElement {
  static properties = {
    hass: { type: Object },     // Home Assistant instance
    _config: { state: true },   // Card config (internal reactive state)
  };

  static styles = css`
    ha-card { padding: 16px; }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px;
    }
    .title { font-weight: 600; font-size: 1.1rem; }
    .main {
      display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: baseline;
    }
    .primary { font-size: 2.0rem; font-weight: 700; line-height: 1; }
    .unit { opacity: 0.7; margin-left: 4px; font-weight: 500; }
    .rows { margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
    .row { display: flex; align-items: baseline; gap: 8px; }
    .row .label { opacity: 0.8; }
    .row .value { margin-left: auto; font-variant-numeric: tabular-nums; font-weight: 600; }
    .muted { opacity: 0.7; }
  `;

  /** Validate and normalize config */
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

  /** Render the card UI */
  render() {
    if (!this.hass || !this._config) return html``;

    // Grab states
    const tState = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    // Early error if required entities are missing
    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="muted">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
      </ha-card>`;
    }

    // Parse units and values
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rh = this.#clampRH(parseFloat(rhState.state));
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed);

    // Physics calculations
    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC); // saturation vapour pressure at T
    const e_hPa = (rh / 100) * es_hPa;                            // actual vapour pressure from RH
    const dewC = this.#dewPointFromVapourPressure_hPa(e_hPa);     // dew point by numeric inversion
    const atC = this.#apparentTemperatureC(tempC, e_hPa, ws_mps); // BoM apparent temperature

    // Display in the same temperature unit the sensor reported (°C or °F)
    const outUnit = tempUnitIn;
    const valueAT  = this.#fromCelsius(atC, outUnit);
    const valueT   = this.#fromCelsius(tempC, outUnit);
    const valueDew = this.#fromCelsius(dewC, outUnit);

    const d = this._config.decimals;
    const windText = wsState
      ? `${this.#round(ws_mps, d)} m/s`
      : `${this.#round(this._config.default_wind_speed, d)} m/s (default)`;

    return html`
      <ha-card>
        <!-- Header -->
        <div class="header"><div class="title">${this._config.name}</div></div>

        <!-- Primary display -->
        <div class="main">
          <div class="primary">
            ${this.#formatNumber(valueAT, d)}<span class="unit">${outUnit}</span>
          </div>
          <div class="muted">Apparent temperature</div>
        </div>

        <!-- Secondary rows -->
        <div class="rows">
          <div class="row">
            <div class="label">Air temperature</div>
            <div class="value">${this.#formatNumber(valueT, d)} ${outUnit}</div>
          </div>
          <div class="row">
            <div class="label">Relative humidity</div>
            <div class="value">${this.#formatNumber(rh, d)} %</div>
          </div>
          <div class="row">
            <div class="label">Dew point</div>
            <div class="value">${this.#formatNumber(valueDew, d)} ${outUnit}</div>
          </div>
          <div class="row">
            <div class="label">Wind speed</div>
            <div class="value">${windText}</div>
          </div>
          <div class="row">
            <div class="label">Vapour pressure (e)</div>
            <div class="value">${this.#formatNumber(e_hPa, d)} hPa</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  /** Let HA estimate the card's vertical size */
  getCardSize() { return 3; }

  // -------------------------------------------------------------------------
  //                            Physics helpers
  // -------------------------------------------------------------------------

  /** BoM apparent temperature in °C: AT = T + 0.33·e − 0.70·ws − 4.0 */
  #apparentTemperatureC(Tc, e_hPa, ws_mps) {
    return Tc + 0.33 * e_hPa - 0.70 * ws_mps - 4.0;
  }

  /** Buck saturation vapour pressure in hPa, piecewise for above/below freezing */
  #buckSaturationVapourPressure_hPa(Tc) {
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) {
      return 6.1121 * Math.exp((18.678 - Tc / 234.5) * (Tc / (257.14 + Tc)));
    }
    return 6.1115 * Math.exp((23.036 - Tc / 333.7) * (Tc / (279.82 + Tc)));
  }

  /**
   * Find dew point in °C from vapour pressure e (hPa) by numerically inverting Buck.
   * Uses a robust bisection over a broad temperature range.
   */
  #dewPointFromVapourPressure_hPa(e_hPa) {
    if (!Number.isFinite(e_hPa) || e_hPa <= 0) return NaN;
    let lo = -80, hi = 60, mid = 0;
    for (let i = 0; i < 60; i++) { // 60 iters is generous; usually converges quickly
      mid = (lo + hi) / 2;
      const es = this.#buckSaturationVapourPressure_hPa(mid);
      if (!Number.isFinite(es)) break;
      if (es > e_hPa) hi = mid; else lo = mid;
      if (Math.abs(hi - lo) < 1e-4) break;
    }
    return mid;
  }

  // -------------------------------------------------------------------------
  //                              Utilities
  // -------------------------------------------------------------------------

  /** Clamp RH to [0, 100] to avoid nonsense values propagating */
  #clampRH(rh) {
    if (!Number.isFinite(rh)) return NaN;
    return Math.min(100, Math.max(0, rh));
  }

  /** Convert a temperature reading to °C from its unit */
  #toCelsius(value, unit) {
    if (!Number.isFinite(value)) return NaN;
    const u = (unit || '').toLowerCase();
    if (u.includes('f')) return (value - 32) * (5 / 9);
    return value; // assume already °C
  }

  /** Convert °C to the requested output unit (°C or °F) */
  #fromCelsius(valueC, unitOut) {
    const u = (unitOut || '').toLowerCase();
    if (!Number.isFinite(valueC)) return NaN;
    if (u.includes('f')) return valueC * 9/5 + 32;
    return valueC;
  }

  /**
   * Resolve wind speed to m/s from a variety of common units.
   * Fallback to the configured default if no entity or invalid value.
   */
  #resolveWind(wsState, default_mps) {
    if (!wsState) return default_mps ?? 0.0;
    const raw = parseFloat(wsState.state);
    if (!Number.isFinite(raw)) return default_mps ?? 0.0;
    const unit = (wsState.attributes.unit_of_measurement || 'm/s').toLowerCase();
    if (unit.includes('m/s')) return raw;
    if (unit.includes('km/h') || unit.includes('kph')) return raw / 3.6;
    if (unit.includes('mph')) return raw * 0.44704;
    if (unit.includes('kn')) return raw * 0.514444;
    return raw; // assume m/s if unknown
  }

  /** Safe rounding with fixed decimals */
  #round(v, d = 1) {
    if (!Number.isFinite(v)) return NaN;
    const p = Math.pow(10, d);
    return Math.round(v * p) / p;
  }

  /** Format a number with fixed decimals, or show an em dash on NaN */
  #formatNumber(v, d = 1) {
    if (!Number.isFinite(v)) return '—';
    return this.#round(v, d).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  // -------------------------------------------------------------------------
  //                           Lovelace plumbing
  // -------------------------------------------------------------------------

  /** Trigger re-render on new hass */
  set hass(hass) { this._hass = hass; this.requestUpdate(); }
  get hass() { return this._hass; }

  /** Tell HA which element to use as the GUI editor */
  static getConfigElement() {
    return document.createElement('simple-air-comfort-card-editor');
  }

  /** Provide a reasonable default config in the card picker */
  static getStubConfig() {
    return {
      name: 'Air Comfort',
      temperature: 'sensor.temperature',
      humidity: 'sensor.humidity',
      // windspeed: 'sensor.wind_speed', // optional
      decimals: 1,
      default_wind_speed: 0,
    };
  }
}

/** Register the card as a custom element */
customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

/** Advertise to the Lovelace card picker */
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description:
    'Australian BoM apparent temperature + dew point (Arden Buck). Defaults wind to 0.0 m/s if not provided.',
  preview: true,
});

/* ------------------------------------------------------------------------ */
/*                               GUI EDITOR                                 */
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
      grid-template-columns: 220px 1fr;
      gap: 12px;
      align-items: center;
    }
    .hint { opacity: 0.7; font-size: 0.9em; }
  `;

  constructor() {
    super();
    // Ensure HA's helper web components (ha-entity-picker, ha-textfield, etc.) are registered.
    // Without this, the pickers may not render inside the editor.
    this._ensureHelpers();
  }

  async _ensureHelpers() {
    try {
      await window.loadCardHelpers?.();
      this.requestUpdate(); // re-render once helpers are loaded
    } catch (_) {
      // No-op; HA may still define them shortly; the editor will re-render as needed.
    }
  }

  /** Editor receives current config from HA */
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

  // Convenience getters to keep template tidy
  get _name() { return this._config?.name ?? ''; }
  get _temperature() { return this._config?.temperature ?? ''; }
  get _humidity() { return this._config?.humidity ?? ''; }
  get _windspeed() { return this._config?.windspeed ?? ''; }
  get _decimals() { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defaultWind() { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }

  /** Render the editor form */
  render() {
    if (!this.hass) return html``;

    return html`
      <div class="form">
        <!-- Name -->
        <div class="row">
          <div><label>Name</label></div>
          <ha-textfield
            .value=${this._name}
            @input=${(e) => this._update('name', e.target.value)}
            placeholder="Air Comfort"
          ></ha-textfield>
        </div>

        <!-- Temperature entity -->
        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._update('temperature', e.detail.value)}
          ></ha-entity-picker>
        </div>

        <!-- Humidity entity -->
        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._update('humidity', e.detail.value)}
          ></ha-entity-picker>
        </div>

        <!-- Wind speed entity (optional) -->
        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. If empty, wind defaults below.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._update('windspeed', e.detail.value)}
          ></ha-entity-picker>
        </div>

        <!-- Default wind speed fallback -->
        <div class="row">
          <div>
            <label>Default wind speed (m/s)</label>
            <div class="hint">If no wind speed entity is set, use this default.</div>
          </div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._defaultWind)}
            @input=${(e) => this._updateNumber('default_wind_speed', e.target.value)}
          ></ha-textfield>
        </div>

        <!-- Decimals -->
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

  /** Update config value (strings/entities) */
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

  /** Update numeric config with fallback (for number inputs) */
  _updateNumber(key, raw, fallback = 0) {
    const num = raw === '' ? undefined : Number(raw);
    const val = Number.isFinite(num) ? num : fallback;
    this._update(key, val);
  }
}

/** Register the editor custom element */
customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
