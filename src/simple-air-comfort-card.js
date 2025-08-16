import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card
 *
 * Formulas:
 *   Apparent Temperature (BoM, °C):
 *     AT = T + 0.33·e − 0.70·ws − 4.0
 *     (T in °C, e in hPa from Arden Buck, ws in m/s)
 *
 *   Buck saturation vapour pressure (hPa):
 *     T ≥ 0°C:  es = 6.1121 * exp((18.678 − T/234.5) * (T/(257.14 + T)))
 *     T <  0°C: es = 6.1115 * exp((23.036 − T/333.7) * (T/(279.82 + T)))
 *
 *   Vapour pressure:
 *     e = (RH/100) * es(T)
 *
 *   Dew point:
 *     numeric inverse of Buck via bisection to find Td such that es(Td) ≈ e
 *
 * Defaults:
 *   - If no wind entity is provided, wind speed defaults to 0.0 m/s (indoor-friendly).
 *
 * Lovelace example:
 * type: custom:simple-air-comfort-card
 * name: Air Comfort
 * temperature: sensor.living_temp
 * humidity: sensor.living_humidity
 * windspeed: sensor.living_wind_speed   # optional
 * decimals: 1                           # optional (default 1)
 * default_wind_speed: 0                 # optional (default 0 m/s)
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

/* ==========================================================================
 *                               DISPLAY CARD
 * ========================================================================== */
class SimpleAirComfortCard extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
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

    const tState = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    // If required entities missing, show a small error in the card
    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="muted">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
      </ha-card>`;
    }

    // Parse sensor values/units
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rh = this.#clampRH(parseFloat(rhState.state));
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed);

    // Physics
    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC);
    const e_hPa  = (rh / 100) * es_hPa;
    const dewC   = this.#dewPointFromVapourPressure_hPa(e_hPa);
    const atC    = this.#apparentTemperatureC(tempC, e_hPa, ws_mps);

    // Display unit matches the temperature entity (°C or °F)
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
        <div class="header"><div class="title">${this._config.name}</div></div>

        <div class="main">
          <div class="primary">
            ${this.#formatNumber(valueAT, d)}<span class="unit">${outUnit}</span>
          </div>
          <div class="muted">Apparent temperature</div>
        </div>

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

  getCardSize() { return 3; }

  /* ------------------------------ Physics -------------------------------- */

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
    // Simple bisection search over a generous range
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

  /* ------------------------------ Helpers -------------------------------- */

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
    return raw;
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

  /* --------------------------- Lovelace plumbing ------------------------- */

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

customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description:
    'Australian BoM apparent temperature + dew point (Arden Buck). Defaults wind to 0.0 m/s if not provided.',
  preview: true,
});

/* ==========================================================================
 *                                 GUI EDITOR
 *   Uses Home Assistant’s <ha-form> with selectors so entity pickers render.
 * ========================================================================== */

class SimpleAirComfortCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    .wrap { padding: 8px 12px 16px; }
  `;

  constructor() {
    super();
    // Loading helpers prompts HA to register editor controls consistently.
    this._ensureHelpers();
  }

  async _ensureHelpers() {
    try {
      await window.loadCardHelpers?.();
      // Also wait for ha-form to be defined (usually already is).
      if (!customElements.get('ha-form')) {
        // Yield once to let HA register its elements
        await new Promise((r) => setTimeout(r, 0));
      }
      this.requestUpdate();
    } catch (_) {
      // ignore
    }
  }

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

  // Schema-driven editor (labels + helpers are computed below)
  get _schema() {
    return [
      { name: 'name', selector: { text: {} } },
      {
        name: 'temperature',
        required: true,
        selector: { entity: { domain: 'sensor' } },
      },
      {
        name: 'humidity',
        required: true,
        selector: { entity: { domain: 'sensor' } },
      },
      {
        name: 'windspeed',
        selector: { entity: { domain: 'sensor' } },
      },
      {
        name: 'default_wind_speed',
        selector: { number: { min: 0, step: 0.1, mode: 'box' } },
      },
      {
        name: 'decimals',
        selector: { number: { min: 0, max: 3, step: 1, mode: 'box' } },
      },
    ];
  }

  // Nice labels for each field
  _computeLabel = (schema) => {
    switch (schema.name) {
      case 'name': return 'Name';
      case 'temperature': return 'Temperature entity';
      case 'humidity': return 'Humidity entity';
      case 'windspeed': return 'Wind speed entity (optional)';
      case 'default_wind_speed': return 'Default wind speed (m/s)';
      case 'decimals': return 'Decimals';
      default: return schema.name;
    }
  };

  // Helper (hint) under some fields
  _computeHelper = (schema) => {
    if (schema.name === 'windspeed') {
      return 'Optional. If empty, default wind speed below will be used.';
    }
    if (schema.name === 'default_wind_speed') {
      return 'If no wind speed entity is set, use this default.';
    }
    return undefined;
    // Return undefined (not empty string) when no helper is needed,
    // otherwise HA shows an extra blank line.
  };

  render() {
    if (!this.hass) return html``;
    // Fallback: if ha-form truly isn’t available, show a simple message.
    if (!customElements.get('ha-form')) {
      return html`<div class="wrap">
        <p>Loading editor controls… if this persists, update Home Assistant frontend.</p>
      </div>`;
    }

    return html`
      <div class="wrap">
        <ha-form
          .hass=${this.hass}
          .data=${this._config ?? {}}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    const newConfig = ev.detail.value;
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }
}

customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);