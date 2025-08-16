import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * Simple Air Comfort Card
 *
 * Physics:
 *  - Vapour pressure (e, hPa) via Arden Buck saturation vapour pressure.
 *  - Dew point via numeric inverse of Buck.
 *  - Apparent Temperature (Australian BoM):
 *        AT = T + 0.33·e − 0.70·ws − 4.0
 *        (T in °C, e in hPa, ws in m/s)
 *
 * Behaviour:
 *  - If no wind entity, a default wind speed (m/s) is used (configurable; default 0.0 m/s).
 *  - Wind speed and vapour pressure are not rendered on the dial; they’re only used in calculations.
 *  - Temperature units follow the temperature entity (°C/°F); internal math uses °C.
 *
 * Lovelace:
 *  type: custom:simple-air-comfort-card
 *  name: Air Comfort
 *  temperature: sensor.living_temp
 *  humidity: sensor.living_humidity
 *  windspeed: sensor.living_wind_speed  # optional
 *  decimals: 1                          # optional (default 1)
 *  default_wind_speed: 0                # optional (default 0 m/s)
 *  overlay_url: /hacsfiles/simple-air-comfort-card/sac_background_overlay.svg  # optional
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

  /* ---------- Look & layout (ring-anchored) -------------------------------- */
  static styles = css`
    :host { --ring-size: 68%; } /* ring size relative to the square canvas */

    ha-card { padding: 16px; overflow: hidden; }

    /* Header */
    .header { display: grid; place-items: center; gap: 4px; margin-bottom: 6px; text-align: center; }
    .title { font-weight: 700; opacity: 0.9; }
    .summary { font-size: 1.6rem; font-weight: 800; line-height: 1; }
    .sub { opacity: 0.75; font-size: 0.95rem; }

    /* Square working area holding the dial */
    .canvas {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 12px;
      background: radial-gradient(60% 60% at 50% 45%, rgba(0,160,120,0.22), rgba(0,0,0,0.36) 55%, rgba(0,0,0,0.65));
      box-shadow: inset 0 0 60px rgba(0,0,0,0.35);
    }

    /* Real white outer ring (not dependent on the SVG) */
    .ring {
      position: absolute;
      left: 50%; top: 50%;
      width: var(--ring-size); height: var(--ring-size);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.95);
      box-shadow: 0 0 4px rgba(0,0,0,0.45);
      pointer-events: none;
    }

    /* Optional overlay SVG for the soft halo/vignette */
    .overlay {
      position: absolute; left: 50%; top: 50%;
      width: var(--ring-size); height: var(--ring-size);
      transform: translate(-50%, -50%);
      object-fit: contain; pointer-events: none;
      filter: drop-shadow(0 0 6px rgba(0,0,0,0.35)) brightness(1.05);
    }

    /* Inner glow */
    .inner {
      position: absolute; left: 50%; top: 50%;
      width: calc(var(--ring-size) * 0.58); height: calc(var(--ring-size) * 0.58);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background:
        radial-gradient(40% 40% at 45% 45%, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.1) 65%, transparent 66%),
        radial-gradient(circle at 50% 55%, rgba(0,200,160,0.6), rgba(0,120,100,0.42) 60%, rgba(0,0,0,0.15) 100%);
    }

    /* Floating dot (white rimmed) whose position is tied to comfort */
    .dot {
      position: absolute;
      left: calc(50% + var(--dot-x));
      top:  calc(50% + var(--dot-y));
      width: calc(var(--ring-size) * 0.095);
      height: calc(var(--ring-size) * 0.095);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #000;
      border: 6px solid rgba(238,238,238,0.98);
      box-shadow: 0 10px 18px rgba(0,0,0,0.55);
    }

    /* Ring-tied captions */
    .label { position: absolute; color: rgba(255,255,255,0.8); text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-variant-numeric: tabular-nums; }
    .label.small { font-size: 0.95rem; font-weight: 700; }
    .label.tiny  { font-size: 0.85rem; opacity: 0.72; font-weight: 600; }
    .label.caption { font-size: 0.85rem; opacity: 0.65; }

    /* Cardinal captions positioned relative to the ring */
    .at-top    { left: 50%; top: 38%; transform: translate(-50%, -50%); }
    .at-bottom { left: 50%; top: 79%; transform: translate(-50%, -50%); }
    .at-left   { left: 24%;  top: 58%; transform: translate(-50%, -50%) rotate(180deg); writing-mode: vertical-rl; }
    .at-right  { left: 76%;  top: 58%; transform: translate(-50%, -50%); writing-mode: vertical-rl; }

    /* Corner metric blocks that hug the ring */
    .corner { position: absolute; transform: translate(-50%, -50%); text-align: center; }
    .tl { left: 34%; top: 33%; } /* Dew point */
    .tr { left: 66%; top: 33%; } /* Feels like */
    .bl { left: 34%; top: 77%; } /* Air temp + text */
    .br { left: 66%; top: 77%; } /* RH + text   */

    .metric { display: grid; gap: 2px; justify-items: center; }
    .metric .big { font-weight: 900; }
    .metric .cap { opacity: 0.72; font-size: 0.85rem; }
  `;

  /* ---------- Config ------------------------------------------------------- */
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
      overlay_url: config.overlay_url || '/hacsfiles/simple-air-comfort-card/sac_background_overlay.svg',
    };
  }

  /* ---------- Rendering ---------------------------------------------------- */
  render() {
    if (!this.hass || !this._config) return html``;

    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="sub">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
      </ha-card>`;
    }

    /* Units & inputs */
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rhRaw = parseFloat(rhState.state);
    const rh = this.#clampRH(rhRaw);
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed);

    /* Physics (Buck + BoM) */
    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC);
    const e_hPa  = (rh / 100) * es_hPa;
    const dewC   = this.#dewPointFromVapourPressure_hPa(e_hPa);
    const atC    = this.#apparentTemperatureC(tempC, e_hPa, ws_mps);

    /* Output units follow the temperature entity */
    const outUnit = tempUnitIn;
    const tOut   = this.#fromCelsius(tempC, outUnit);
    const dewOut = this.#fromCelsius(dewC, outUnit);
    const atOut  = this.#fromCelsius(atC, outUnit);
    const d = this._config.decimals;

    /* Headline words (moisture dominates big word; thermal is sub) */
    const moistureWord = rh < 35 ? 'Dry' : (rh > 60 ? 'Humid' : 'Comfy');
    const thermalBand  = atC >= 26 ? 'Hot' : atC >= 23 ? 'Warm' : atC >= 19 ? 'Mild' : atC >= 16 ? 'Cool' : 'Cold';

    /* Bottom captions (like your reference card) */
    const humidComfort = rh < 35 ? 'DRY' : (rh <= 60 ? 'COMFY' : 'HUMID');
    const tempComfort  = (atC > 20 && atC < 22) ? 'PERFECT'
                        : (atC >= 18 && atC <= 24) ? 'MILD'
                        : (atC < 18) ? 'COOL' : 'WARM';

    /* Floating dot position: X = humidity (dry← … humid→), Y = thermal (warm↑ … cold↓).
       Normalized range: [-1, +1], then scaled against ring size via CSS calc(). */
    const clamp01 = (n) => Math.max(-1, Math.min(1, n));
    const nx = clamp01((rh - 50) / 50);   // -1 (dry) … +1 (humid)
    const ny = clamp01((21 - atC) / 10);  // +1 cold (down), -1 warm (up) relative to ~21°C
    const dotX = `calc(var(--ring-size) * 0.32 * ${nx.toFixed(3)})`;
    const dotY = `calc(var(--ring-size) * 0.32 * ${ny.toFixed(3)})`;

    const OVERLAY_URL = this._config.overlay_url;

    return html`
      <ha-card>
        <!-- Header -->
        <div class="header">
          <div class="title">${this._config.name}</div>
          <div class="summary">${moistureWord}</div>
          <div class="sub">${thermalBand}</div>
        </div>

        <!-- Dial -->
        <div class="canvas" style=${styleMap({ '--dot-x': dotX, '--dot-y': dotY })}>
          <!-- Cardinal captions -->
          <div class="label tiny at-top">Warm</div>
          <div class="label tiny at-bottom">Cold</div>
          <div class="label tiny at-left">Dry</div>
          <div class="label tiny at-right">Humid</div>

          <!-- Ring + optional overlay + glow + dot -->
          <div class="ring"></div>
          <img class="overlay" src="${OVERLAY_URL}" alt="" />
          <div class="inner"></div>
          <div class="dot" aria-hidden="true"></div>

          <!-- Corners -->
          <div class="corner tl metric">
            <div class="label caption">Dew point</div>
            <div class="label small big">${this.#formatNumber(dewOut, d)} ${outUnit}</div>
          </div>

          <div class="corner tr metric">
            <div class="label caption">Feels like</div>
            <div class="label small big">${this.#formatNumber(atOut, d)} ${outUnit}</div>
          </div>

          <div class="corner bl metric">
            <div class="label small big">${this.#formatNumber(tOut, d)} ${outUnit}</div>
            <div class="label cap">${tempComfort}</div>
          </div>

          <div class="corner br metric">
            <div class="label small big">${this.#formatNumber(rh, d)} %</div>
            <div class="label cap">${humidComfort}</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 3; }

  /* ---------- Physics ------------------------------------------------------ */

  // Australian BoM apparent temperature in °C
  #apparentTemperatureC(Tc, e_hPa, ws_mps) {
    return Tc + 0.33 * e_hPa - 0.70 * ws_mps - 4.0;
  }

  // Buck saturation vapour pressure (hPa)
  #buckSaturationVapourPressure_hPa(Tc) {
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) {
      return 6.1121 * Math.exp((18.678 - Tc / 234.5) * (Tc / (257.14 + Tc)));
    }
    return 6.1115 * Math.exp((23.036 - Tc / 333.7) * (Tc / (279.82 + Tc)));
  }

  // Dew point from vapour pressure via numeric inverse of Buck (°C)
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

  /* ---------- Helpers ------------------------------------------------------ */

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
    if (unit.includes('kn'))  return raw * 0.514444;
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

  /* ---------- Lovelace plumbing ------------------------------------------- */

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

/* Register the card element */
customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

/* Lovelace card picker metadata */
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description:
    'Australian BoM apparent temperature + dew point (Arden Buck). Wind defaults to 0.0 m/s if not provided.',
  preview: true,
});

/* -------------------------------------------------------------------------- */
/*                                GUI EDITOR                                  */
/* -------------------------------------------------------------------------- */

class SimpleAirComfortCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 12px;
      align-items: center;
    }
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
      overlay_url: config.overlay_url || '/hacsfiles/simple-air-comfort-card/sac_background_overlay.svg',
    };
  }

  get _name() { return this._config?.name ?? ''; }
  get _temperature() { return this._config?.temperature ?? ''; }
  get _humidity() { return this._config?.humidity ?? ''; }
  get _windspeed() { return this._config?.windspeed ?? ''; }
  get _decimals() { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defaultWind() { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }
  get _overlay() { return this._config?.overlay_url ?? ''; }

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
            <div class="hint">Optional. If empty, wind defaults below and is used only in the calculation.</div>
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
          <div><label>Default wind speed (m/s)</label>
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

        <div class="row">
          <div><label>Overlay URL (optional)</label>
            <div class="hint">Defaults to the HACS path. Leave blank to keep default.</div>
          </div>
          <ha-textfield
            .value=${this._overlay}
            @input=${(e) => this._update('overlay_url', e.target.value)}
            placeholder="/hacsfiles/simple-air-comfort-card/sac_background_overlay.svg"
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
