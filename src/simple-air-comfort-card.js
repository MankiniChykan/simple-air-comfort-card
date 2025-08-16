import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card — circular UI
 *
 * Physics:
 *   - Vapour pressure (e) via Arden Buck saturation vapour pressure.
 *   - Dew point from Arden Buck (numeric inverse).
 *   - Apparent Temperature (Australian BoM):
 *       AT = T + 0.33·e − 0.70·ws − 4.0
 *       (T in °C, e in hPa, ws in m/s)
 *   - Default windspeed is 0.0 m/s (indoor-friendly) if no wind entity provided.
 *
 * UI:
 *   - Matches the “eye” layout from the screenshot/picture-elements version:
 *       • outer white ring (dewpoint colour aura driven by AT by default)
 *       • inner circle “glow” (alert colour from AT)
 *       • moving pupil based on Temp (vertical) and RH (horizontal)
 *       • top title + main dewpoint comfort label, small temp trend under it
 *       • four corner readouts: dew point, feels like (AT), temp, humidity
 *       • side axis labels “Dry / Humid”, top/bottom “Warm / Cold”
 *       • optional SVG overlay background (bundled with the card)
 *
 * Lovelace config example:
 *   type: custom:simple-air-comfort-card
 *   name: Living Room
 *   temperature: sensor.living_temp
 *   humidity: sensor.living_humidity
 *   windspeed: sensor.living_wind_speed   # optional
 *   decimals: 1                           # optional (default 1)
 *   default_wind_speed: 0                 # optional (default 0 m/s)
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

// Resolve the overlay that Rollup copies to dist/ so it works in HACS
const OVERLAY_URL = new URL('./sac_background_overlay.svg', import.meta.url);

class SimpleAirComfortCard extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    ha-card {
      position: relative;
      overflow: hidden;
      padding: 0;
      /* subtle rounded look like your mock */
      border-radius: 12px;
    }

    /* background glow (approximate your green aura); kept subtle so themes work */
    .bg {
      position: absolute; inset: 0;
      background: radial-gradient(80% 80% at 50% 50%,
                    rgba(0,200,120,0.25), rgba(0,200,120,0.08) 40%, transparent 70%);
      filter: blur(0.5px);
      pointer-events: none;
    }

    /* optional SVG overlay you ship with the card */
    .overlay {
      position: absolute; inset: 0;
      object-fit: cover;
      width: 100%; height: 100%;
      opacity: 0.6;
      pointer-events: none;
    }

    .wrap {
      position: relative;
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: 12px;
      min-height: 260px; /* keeps a nice square-ish card */
    }

    /* header area */
    .top {
      display: grid;
      justify-items: center;
      gap: 2px;
      margin-bottom: 6px;
    }
    .room { font-weight: 600; color: var(--secondary-text-color); }
    .headline { font-size: 1.4rem; font-weight: 800; line-height: 1.1; }
    .subtle { color: var(--secondary-text-color); font-size: .9rem; }

    /* center “eye” layout */
    .center {
      display: grid;
      place-items: center;
      position: relative;
      margin: 4px 0;
    }
    .dial {
      position: relative;
      width: min(78vmin, 240px);
      aspect-ratio: 1/1;
      display: grid;
      place-items: center;
    }
    /* outer white ring */
    .ring {
      position: absolute; inset: 6%;
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.95);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05) inset;
    }
    /* dewpoint/AT aura under ring (uses CSS var set from JS) */
    .aura {
      position: absolute; inset: 2%;
      border-radius: 50%;
      background: radial-gradient(60% 60% at 50% 50%,
                  var(--sac-aura, rgba(0,200,120,.25)),
                  transparent 70%);
      filter: blur(1px);
    }
    /* inner glow circle (alert colour) */
    .inner {
      position: absolute;
      inset: 27%;
      border-radius: 50%;
      background:
        radial-gradient(35% 35% at 40% 40%, rgba(255,255,255,.75), transparent 45%),
        radial-gradient(75% 75% at 50% 50%, var(--sac-inner, rgba(0,160,120,.55)), rgba(0,0,0,.25));
      box-shadow: inset 0 10px 25px rgba(0,0,0,.35);
    }
    /* pupil (the moving dot) */
    .pupil {
      position: absolute;
      width: 18%;
      aspect-ratio: 1/1;
      border-radius: 50%;
      background:
        radial-gradient(30% 30% at 30% 30%, rgba(255,255,255,.9), transparent 30%),
        radial-gradient(80% 80% at 55% 55%, rgba(0,0,0,.95), rgba(0,0,0,.7));
      transform: translate(var(--px, 0), var(--py, 0));
      transition: transform .3s ease-out, background-color .2s linear;
      will-change: transform;
    }

    /* axis labels like your mock */
    .axis {
      position: absolute; inset: 0;
      display: grid;
      grid-template-areas:
        "top top"
        "left right"
        "bottom bottom";
      grid-template-rows: 1fr auto 1fr;
      grid-template-columns: 1fr 1fr;
      font-size: .85rem; color: grey; pointer-events: none;
      font-weight: 600;
    }
    .axis .top    { grid-area: top;    justify-self: end; margin-right: 4px; }
    .axis .bottom { grid-area: bottom; justify-self: end; margin-right: 4px; }
    .axis .left   { grid-area: left;   writing-mode: vertical-rl; transform: rotate(180deg); justify-self: start; margin-left: 6px; }
    .axis .right  { grid-area: right;  writing-mode: vertical-rl; justify-self: end; margin-right: 6px; }

    /* corners with values */
    .corners {
      position: absolute; inset: 0;
      display: grid; grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      font-variant-numeric: tabular-nums;
      pointer-events: none;
    }
    .corner {
      display: grid; gap: 2px; align-content: start; justify-items: center;
      padding: 6px; font-size: .9rem;
    }
    .corner .mini { color: var(--secondary-text-color); font-size: .8rem; }
    .corner .big  { font-weight: 700; }
    .tl { align-content: start; justify-items: start; }
    .tr { align-content: start; justify-items: end;  }
    .bl { align-content: end;   justify-items: start; }
    .br { align-content: end;   justify-items: end;   }

    .bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      font-weight: 700;
    }
    .bottom .label {
      color: var(--secondary-text-color);
      font-weight: 600;
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
      windspeed: config.windspeed, // optional
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
      show_overlay: config.show_overlay !== false, // default true
    };
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="wrap">
          <div class="top"><div class="room">${this._config.name}</div></div>
          <div class="subtle">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
        </div>
      </ha-card>`;
    }

    // --- Read inputs & compute physics -------------------------------------
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rh    = this.#clampRH(parseFloat(rhState.state));
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed);

    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC);
    const e_hPa  = (rh / 100) * es_hPa;
    const dewC   = this.#dewPointFromVapourPressure_hPa(e_hPa);
    const atC    = this.#apparentTemperatureC(tempC, e_hPa, ws_mps);

    // --- Display units (match the temperature sensor’s unit) ---------------
    const outUnit   = tempUnitIn;
    const vAT       = this.#fromCelsius(atC, outUnit);
    const vT        = this.#fromCelsius(tempC, outUnit);
    const vDew      = this.#fromCelsius(dewC, outUnit);
    const d         = this._config.decimals;

    // --- Comfort text to mimic your picture-elements version ----------------
    const dewText  = this.#dewpointComfortText(dewC);   // big headline (“Dry/Comfy/Sticky/…”)
    const tempText = this.#temperatureComfortText(tempC); // small under headline (“Warm/Cold/…”)
    const tempBadge= this.#temperatureBadge(tempC);     // bottom-left badge (“PERFECT/COOL/WARM/…”)
    const rhBadge  = this.#humidityBadge(rh);           // bottom-right badge (“COMFY/DRY/HUMID”)

    // --- Colour hints for aura/inner (kept conservative, overridable by theme) ---
    const aura = this.#auraColorFromAT(atC);     // greenish glow in comfy range, amber/red when high
    const inner = this.#innerColorFromAT(atC);   // inner fill tint

    // --- Pupil offset (mimic your macro: RH moves horizontal, Temp vertical) ------
    // Map: RH=0→left, 50→center, 100→right; Temp 22°C center, warmer goes up, cooler down.
    const radiusPx = 0.24; // of dial size (kept inside inner circle)
    const x = this.#clamp(-1, (rh - 50) / 50, 1);                 // -1..+1
    const y = this.#clamp(-1, (22 - tempC) / 10, 1);              // -1..+1
    // keep inside circle
    const mag = Math.hypot(x, y);
    const sx = (mag > 1 ? x / mag : x) * radiusPx;
    const sy = (mag > 1 ? y / mag : y) * radiusPx;

    const windText = wsState
      ? `${this.#round(ws_mps, d)} m/s`
      : `${this.#round(this._config.default_wind_speed, d)} m/s (default)`;

    return html`
      <ha-card style=${styleMap({
        '--sac-aura': aura,
        '--sac-inner': inner,
      })}>
        ${this._config.show_overlay ? html`<img class="overlay" alt="" src="${OVERLAY_URL}">` : null}
        <div class="bg"></div>

        <div class="wrap">
          <!-- Top title + labels -->
          <div class="top">
            <div class="room">${this._config.name}</div>
            <div class="headline">${dewText}</div>
            <div class="subtle">${tempText}</div>
          </div>

          <!-- Center “eye” -->
          <div class="center">
            <div class="dial">
              <div class="aura"></div>
              <div class="ring"></div>
              <div class="inner"></div>

              <!-- axis labels like the mock -->
              <div class="axis">
                <div class="top">Warm</div>
                <div class="bottom">Cold</div>
                <div class="left">Dry</div>
                <div class="right">Humid</div>
              </div>

              <!-- corner readouts -->
              <div class="corners">
                <div class="corner tl">
                  <div class="mini">Dew point</div>
                  <div class="big">${this.#formatNumber(vDew, d)} ${outUnit}</div>
                </div>
                <div class="corner tr">
                  <div class="mini">Feels like</div>
                  <div class="big">${this.#formatNumber(vAT, d)} ${outUnit}</div>
                </div>
                <div class="corner bl">
                  <div class="big">${this.#formatNumber(vT, d)} ${outUnit}</div>
                  <div class="mini">${tempBadge}</div>
                </div>
                <div class="corner br">
                  <div class="big">${this.#formatNumber(rh, d)} %</div>
                  <div class="mini">${rhBadge}</div>
                </div>
              </div>

              <!-- moving pupil -->
              <div class="pupil"
                   style=${styleMap({
                     '--px': `${sx * 100}%`,
                     '--py': `${sy * 100}%`,
                   })}></div>
            </div>
          </div>

          <!-- bottom row with wind & vapour pressure like your simple card -->
          <div class="bottom">
            <div>
              <div class="label">Wind speed</div>
              <div>${windText}</div>
            </div>
            <div style="text-align:right">
              <div class="label">Vapour pressure (e)</div>
              <div>${this.#formatNumber(e_hPa, d)} hPa</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 4; }

  // ===================== Physics =====================

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

  // ===================== Comfort text & colours =====================

  #dewpointComfortText(dpC) {
    if (!Number.isFinite(dpC)) return '—';
    // Close to the picture-elements thresholds (AU-oriented):
    if (dpC < 5)  return 'Very Dry';
    if (dpC < 10) return 'Dry';
    if (dpC < 17) return 'Comfy';
    if (dpC < 21) return 'Sticky';
    if (dpC < 24) return 'Uncomfortable';
    return 'Oppressive';
  }

  #temperatureComfortText(Tc) {
    if (!Number.isFinite(Tc)) return '—';
    if (Tc < 18) return 'Cold';
    if (Tc < 21) return 'Cool';
    if (Tc <= 24) return 'Warm'; // small label under headline in your mock says “Warm”
    if (Tc <= 27) return 'Warm';
    return 'Hot';
  }

  #temperatureBadge(Tc) {
    if (!Number.isFinite(Tc)) return '';
    if (Tc < 18) return 'COLD';
    if (Tc < 21) return 'COOL';
    if (Tc <= 24) return 'PERFECT';
    if (Tc <= 27) return 'WARM';
    return 'HOT';
    // tweak these to your preference
  }

  #humidityBadge(rh) {
    if (!Number.isFinite(rh)) return '';
    if (rh < 30) return 'DRY';
    if (rh <= 60) return 'COMFY';
    return 'HUMID';
  }

  #auraColorFromAT(at) {
    if (!Number.isFinite(at)) return 'rgba(0,200,120,.22)';
    // green in comfy zone, amber/red as AT rises, bluish when very low
    if (at < 10) return 'rgba(60,140,255,.22)';
    if (at < 18) return 'rgba(0,180,140,.22)';
    if (at <= 25) return 'rgba(0,200,120,.28)';
    if (at <= 30) return 'rgba(255,170,0,.24)';
    return 'rgba(255,60,60,.24)';
  }

  #innerColorFromAT(at) {
    if (!Number.isFinite(at)) return 'rgba(0,160,120,.5)';
    if (at < 10) return 'rgba(80,140,255,.45)';
    if (at < 18) return 'rgba(0,160,140,.48)';
    if (at <= 25) return 'rgba(0,160,120,.55)';
    if (at <= 30) return 'rgba(255,160,0,.5)';
    return 'rgba(255,80,80,.5)';
  }

  // ===================== Helpers =====================

  #clamp(a, v, b) { return Math.min(b, Math.max(a, v)); }

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

  // ===================== Lovelace plumbing =====================

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
      show_overlay: true,
    };
  }
}

// ---------- Register the card ----------
customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

// Lovelace card picker metadata
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description:
    'Circular “eye” display with BoM apparent temperature + Arden Buck dew point. Defaults wind to 0 m/s if none.',
  preview: true,
});

/* ========================================================================== */
/*                                  GUI EDITOR                                */
/* ========================================================================== */

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

  setConfig(config) {
    this._config = {
      name: config.name ?? 'Air Comfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed: Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
      show_overlay: config.show_overlay !== false,
    };
  }

  get _name() { return this._config?.name ?? ''; }
  get _temperature() { return this._config?.temperature ?? ''; }
  get _humidity() { return this._config?.humidity ?? ''; }
  get _windspeed() { return this._config?.windspeed ?? ''; }
  get _decimals() { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defaultWind() { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }
  get _showOverlay() { return this._config?.show_overlay !== false; }

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
          <div class="hint">If no wind speed entity is set, use this default.</div>
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
          <div><label>Show overlay</label></div>
          <ha-switch
            .checked=${this._showOverlay}
            @change=${(e) => this._update('show_overlay', e.target.checked)}
          ></ha-switch>
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

/* small helper: lit-style map without importing lit/directives explicitly */
function styleMap(obj) {
  return Object.entries(obj).map(([k,v]) => `${k}: ${v}`).join('; ');
}
