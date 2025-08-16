import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card
 * ------------------------------------------------------------
 * Physics:
 *   Apparent Temp (BoM): AT = T + 0.33·e − 0.70·ws − 4.0
 *     - T in °C
 *     - e in hPa using Arden Buck saturation vapour pressure
 *     - ws in m/s (optional wind entity; else default_wind_speed)
 *
 *   e = RH/100 * es(T)
 *   es(T) [Buck 1981]:
 *      T >= 0°C : 6.1121 * exp((18.678 - T/234.5) * (T/(257.14 + T)))
 *      T <  0°C : 6.1115 * exp((23.036 - T/333.7) * (T/(279.82 + T)))
 *
 *   Dew point is solved by numeric inverse of es(T).
 *
 * UI:
 *   - Room name at the top (card title).
 *   - Right side: dial (outer ring + inner comfort circle + moving pupil).
 *     Dial markers: Warm (top), Cold (bottom), Dry (left), Humid (right).
 *   - Left side numbers:
 *       • Feels like (AT)
 *       • Dew point
 *       • Temperature
 *       • Humidity
 *     and the three text comfort lines below.
 *   - Wind & vapour pressure are NOT shown on the face (wind stays in editor).
 *
 * Config:
 *   type: custom:simple-air-comfort-card
 *   name: Aircomfort
 *   temperature: sensor.room_temp         (required)
 *   humidity: sensor.room_humidity        (required)
 *   windspeed: sensor.room_wind_speed     (optional)
 *   default_wind_speed: 0                 (m/s; default 0)
 *   decimals: 1
 *   temp_min: 10                          (°C; for pupil vertical scaling)
 *   temp_max: 35                          (°C; for pupil vertical scaling)
 *
 * Notes:
 *   - “Text comfort” strings use simple, readable bands. Adjust below or
 *     make them config if you want exact parity with your Jinja macros.
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
    ha-card { padding: 12px 12px 16px; overflow: hidden; }

    .header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 4px;
    }
    .title { font-weight: 700; font-size: 1.05rem; letter-spacing: .2px; }

    .wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 12px;
      align-items: center;
    }

    /* Left column: numbers + text lines */
    .metrics { display: grid; gap: 10px; }
    .primary {
      font-size: 2.0rem; font-weight: 800; line-height: 1;
      display: flex; align-items: baseline; gap: 6px;
    }
    .unit { opacity: .7; font-weight: 600; }

    .grid2 {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px;
      font-variant-numeric: tabular-nums;
    }
    .label { opacity: .8; }
    .val { justify-self: end; font-weight: 600; }

    .comfort {
      margin-top: 2px;
      display: grid; gap: 2px;
      font-size: .95rem;
    }
    .comfort .line { display: flex; justify-content: space-between; gap: 8px; }
    .comfort .k { opacity: .75; }
    .comfort .v { font-weight: 600; }

    /* Right column: dial */
    .dialWrap { position: relative; height: 0; padding-top: 100%; } /* square */
    .dial {
      position: absolute; inset: 0;
      display: grid; place-items: center;
    }

    /* Outer ring (thin border), inner comfort disc */
    .ring {
      position: relative;
      width: 86%;
      height: 86%;
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.9);
      /* subtle radial background so it looks like a dial even w/out the SVG */
      background:
        radial-gradient(closest-side, rgba(255,255,255,0.06), transparent 65%),
        radial-gradient(farthest-side, rgba(255,255,255,0.08), transparent 70%);
    }
    .inner {
      position: absolute; inset: 0;
      margin: 17%;
      border-radius: 50%;
      /* inner comfort zone colour — tweak if you want dynamic colour mapping */
      background: rgba(255,255,255,0.10);
      border: 0 solid transparent;
    }

    /* Pupil (floating dot) */
    .pupil {
      position: absolute;
      width: 14%; height: 14%;
      border-radius: 50%;
      display: grid; place-items: center;
      transform: translate(-50%, -50%);
      /* Ringed dot to read well on any background */
      background: white;
      box-shadow:
        0 0 0 3px rgba(0,0,0,0.25),
        0 0 0 6px rgba(255,255,255,0.6);
    }

    /* Dial markers */
    .marker {
      position: absolute;
      font-size: .85rem; color: grey; font-weight: 600;
      user-select: none;
      text-shadow: 0 1px 0 rgba(0,0,0,0.15);
    }
    .m-warm  { top: 4%; left: 50%; transform: translateX(-50%); }
    .m-cold  { bottom: 4%; left: 50%; transform: translateX(-50%); }
    .m-dry   { left: 4%; top: 50%; transform: translateY(-50%) rotate(180deg); writing-mode: vertical-rl; }
    .m-humid { right: 4%; top: 50%; transform: translateY(-50%); writing-mode: vertical-rl; }

    /* Fine print / muted */
    .muted { opacity: .7; }
  `;

  setConfig(config) {
    if (!config?.temperature || !config?.humidity) {
      throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');
    }
    this._config = {
      name: config.name ?? 'Aircomfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed, // optional
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed:
        Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
      temp_min: Number.isFinite(config.temp_min) ? config.temp_min : 10,  // for pupil vertical scaling
      temp_max: Number.isFinite(config.temp_max) ? config.temp_max : 35,  // for pupil vertical scaling
    };
  }

  /* ----------------------------- RENDER ---------------------------------- */

  render() {
    if (!this.hass || !this._config) return html``;

    const tState = this.hass.states[this._config.temperature];
    const hState = this.hass.states[this._config.humidity];
    const wState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !hState) {
      return html`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="muted">
          Entity not found: ${!tState ? this._config.temperature : this._config.humidity}
        </div>
      </ha-card>`;
    }

    /* Units and raw values */
    const tUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC   = this.#toCelsius(parseFloat(tState.state), tUnitIn);
    const rh      = this.#clampRH(parseFloat(hState.state));
    const ws_mps  = this.#resolveWind(wState, this._config.default_wind_speed);

    /* Physics */
    const es_hPa  = this.#buck_es_hPa(tempC);           // saturation vapour pressure
    const e_hPa   = (rh / 100) * es_hPa;                // actual vapour pressure
    const dewC    = this.#dewpoint_from_e_hPa(e_hPa);   // numeric inverse of Buck es()
    const atC     = this.#apparent_T(tempC, e_hPa, ws_mps);

    /* Presentation units */
    const outU    = tUnitIn; // follow sensor unit (°C or °F)
    const valAT   = this.#fromCelsius(atC, outU);
    const valT    = this.#fromCelsius(tempC, outU);
    const valDew  = this.#fromCelsius(dewC, outU);

    const d = this._config.decimals;

    /* Pupil placement tuned to “macro-like” rules:
     *  - X axis driven by RH (Dry ← 0 … 100 → Humid)
     *  - Y axis driven by Temp scaled by temp_min/temp_max (Cold bottom … Warm top)
     *  - Then clamped into a circle to stay inside ring
     */
    const pupil = this.#pupilPosition(tempC, rh, this._config.temp_min, this._config.temp_max);

    /* Text “comfort” strings — simple bands (adjust to mirror your macros) */
    const txtDew = this.#dewpointComfortText(dewC);
    const txtT   = this.#temperatureComfortText(tempC, this._config.temp_min, this._config.temp_max);
    const txtRH  = this.#humidityComfortText(rh);

    return html`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.name}</div>
        </div>

        <div class="wrap">
          <!-- LEFT: Values -->
          <div class="metrics">
            <div class="primary">
              ${this.#num(valAT, d)} <span class="unit">${outU}</span>
            </div>
            <div class="muted">Apparent temperature</div>

            <div class="grid2">
              <div class="label">Dew point</div>
              <div class="val">${this.#num(valDew, d)} ${outU}</div>

              <div class="label">Air temperature</div>
              <div class="val">${this.#num(valT, d)} ${outU}</div>

              <div class="label">Humidity</div>
              <div class="val">${this.#num(rh, d)} %</div>
            </div>

            <!-- Text comfort lines (replacing external template sensors) -->
            <div class="comfort">
              <div class="line"><span class="k">Dew-point comfort</span><span class="v">${txtDew}</span></div>
              <div class="line"><span class="k">Temperature comfort</span><span class="v">${txtT}</span></div>
              <div class="line"><span class="k">Humidity comfort</span><span class="v">${txtRH}</span></div>
            </div>
          </div>

          <!-- RIGHT: Dial -->
          <div class="dialWrap">
            <div class="dial">
              <div class="ring">
                <div class="inner"></div>

                <!-- Pupil (hidden if NaN) -->
                ${Number.isFinite(pupil.left) && Number.isFinite(pupil.top) ? html`
                  <div class="pupil" style="left:${pupil.left}%; top:${pupil.top}%"></div>
                ` : html``}

                <!-- Markers -->
                <div class="marker m-warm">Warm</div>
                <div class="marker m-cold">Cold</div>
                <div class="marker m-dry">Dry</div>
                <div class="marker m-humid">Humid</div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 3; }

  /* ----------------------------- PHYSICS ---------------------------------- */

  #apparent_T(Tc, e_hPa, ws_mps) {
    return Tc + 0.33 * e_hPa - 0.70 * ws_mps - 4.0;
  }

  #buck_es_hPa(Tc) {
    if (!Number.isFinite(Tc)) return NaN;
    if (Tc >= 0) {
      return 6.1121 * Math.exp((18.678 - Tc / 234.5) * (Tc / (257.14 + Tc)));
    }
    return 6.1115 * Math.exp((23.036 - Tc / 333.7) * (Tc / (279.82 + Tc)));
  }

  #dewpoint_from_e_hPa(e_hPa) {
    if (!Number.isFinite(e_hPa) || e_hPa <= 0) return NaN;
    let lo = -80, hi = 60, mid = 0;
    for (let i = 0; i < 60; i++) {
      mid = (lo + hi) / 2;
      const es = this.#buck_es_hPa(mid);
      if (!Number.isFinite(es)) break;
      if (es > e_hPa) hi = mid; else lo = mid;
      if (Math.abs(hi - lo) < 1e-4) break;
    }
    return mid;
  }

  /* ---------------------------- TEXT LINES -------------------------------- */

  #dewpointComfortText(dewC) {
    if (!Number.isFinite(dewC)) return '—';
    // Typical indoor-feel bands
    if (dewC < 8)   return 'Very dry';
    if (dewC < 12)  return 'Dry';
    if (dewC < 16)  return 'Comfy';
    if (dewC < 20)  return 'Mildly humid';
    if (dewC < 24)  return 'Humid';
    return 'Very humid';
  }

  #temperatureComfortText(Tc, tmin, tmax) {
    if (!Number.isFinite(Tc)) return '—';
    const midLo = tmin + 0.35*(tmax - tmin);
    const midHi = tmin + 0.65*(tmax - tmin);
    if (Tc < tmin)  return 'Cold';
    if (Tc < midLo) return 'Cool';
    if (Tc < midHi) return 'Comfy';
    if (Tc < tmax)  return 'Warm';
    return 'Hot';
  }

  #humidityComfortText(rh) {
    if (!Number.isFinite(rh)) return '—';
    if (rh < 30) return 'Dry';
    if (rh <= 60) return 'Comfy';
    if (rh <= 70) return 'Mildly humid';
    return 'Humid';
  }

  /* ----------------------------- PUPIL ------------------------------------ */

  /**
   * Map T and RH to a position inside the dial circle.
   * - X from RH (0..100 → 0..100%)
   * - Y from T scaled by [temp_min..temp_max] (bottom cold .. top warm)
   * - Clamp to circle (so the dot never escapes the ring)
   * - Add a tiny easing toward the centre (reads nicer)
   */
  #pupilPosition(Tc, rh, tmin, tmax) {
    if (!Number.isFinite(Tc) || !Number.isFinite(rh)) return { left: NaN, top: NaN };

    const nx = this.#clamp01(rh / 100);                          // 0..1 left->right (dry->humid)
    const ny = this.#clamp01((Tc - tmin) / Math.max(1, (tmax - tmin))); // 0..1 cold->warm
    // Map into dial local coords (0..100%)
    let x = 10 + 80 * nx;          // leave 10% padding around
    let y = 90 - 80 * ny;          // invert so warm is top
    // Clamp to circle: move (x,y) toward centre if outside radius
    const cx = 50, cy = 50;
    const dx = x - cx, dy = y - cy;
    const r  = Math.sqrt(dx*dx + dy*dy);
    const R  = 43; // approx radius in % (ring is 86% box)
    if (r > R) {
      x = cx + (dx / r) * R;
      y = cy + (dy / r) * R;
    }
    // Ease slightly toward centre
    x = cx + (x - cx) * 0.92;
    y = cy + (y - cy) * 0.92;
    return { left: this.#round(x, 2), top: this.#round(y, 2) };
  }

  /* ----------------------------- HELPERS ---------------------------------- */

  #clamp01(v) { return Math.min(1, Math.max(0, v)); }

  #clampRH(rh) {
    if (!Number.isFinite(rh)) return NaN;
    return Math.min(100, Math.max(0, rh));
  }

  #toCelsius(v, unit) {
    if (!Number.isFinite(v)) return NaN;
    const u = (unit || '').toLowerCase();
    if (u.includes('f')) return (v - 32) * (5/9);
    return v;
  }

  #fromCelsius(vC, unitOut) {
    if (!Number.isFinite(vC)) return NaN;
    const u = (unitOut || '').toLowerCase();
    if (u.includes('f')) return vC * 9/5 + 32;
    return vC;
  }

  #resolveWind(wsState, fallback_mps) {
    if (!wsState) return Number.isFinite(fallback_mps) ? fallback_mps : 0;
    const raw = parseFloat(wsState.state);
    if (!Number.isFinite(raw)) return Number.isFinite(fallback_mps) ? fallback_mps : 0;
    const unit = (wsState.attributes.unit_of_measurement || 'm/s').toLowerCase();
    if (unit.includes('m/s')) return raw;
    if (unit.includes('km/h') || unit.includes('kph')) return raw / 3.6;
    if (unit.includes('mph')) return raw * 0.44704;
    if (unit.includes('kn'))  return raw * 0.514444;
    return raw;
  }

  #round(v, d = 1) {
    if (!Number.isFinite(v)) return NaN;
    const p = Math.pow(10, d);
    return Math.round(v * p) / p;
  }

  #num(v, d = 1) {
    if (!Number.isFinite(v)) return '—';
    return this.#round(v, d).toLocaleString(undefined, {
      minimumFractionDigits: d, maximumFractionDigits: d,
    });
  }

  /* --------------------------- LOVELACE API ------------------------------- */

  set hass(hass) { this._hass = hass; this.requestUpdate(); }
  get hass() { return this._hass; }

  static getConfigElement() { return document.createElement('simple-air-comfort-card-editor'); }

  static getStubConfig() {
    return {
      name: 'Aircomfort',
      temperature: 'sensor.temperature',
      humidity: 'sensor.humidity',
      // windspeed: 'sensor.wind_speed',
      decimals: 1,
      default_wind_speed: 0,
      temp_min: 10,
      temp_max: 35,
    };
  }
}

/* Register the card */
customElements.define('simple-air-comfort-card', SimpleAirComfortCard);

/* Card picker metadata */
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description:
    'BoM apparent temperature + Arden Buck dewpoint; dial with moving pupil; wind only in editor.',
  preview: true,
});

/* ------------------------------------------------------------------------ */
/*                                GUI EDITOR                                */
/* ------------------------------------------------------------------------ */

class SimpleAirComfortCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row { display: grid; grid-template-columns: 210px 1fr; gap: 12px; align-items: center; }
    .hint { opacity: .7; font-size: .9em; }
  `;

  setConfig(config) {
    this._config = {
      name: config.name ?? 'Aircomfort',
      temperature: config.temperature,
      humidity: config.humidity,
      windspeed: config.windspeed,
      decimals: Number.isFinite(config.decimals) ? config.decimals : 1,
      default_wind_speed:
        Number.isFinite(config.default_wind_speed) ? config.default_wind_speed : 0.0,
      temp_min: Number.isFinite(config.temp_min) ? config.temp_min : 10,
      temp_max: Number.isFinite(config.temp_max) ? config.temp_max : 35,
    };
  }

  get _name()       { return this._config?.name ?? ''; }
  get _temperature(){ return this._config?.temperature ?? ''; }
  get _humidity()   { return this._config?.humidity ?? ''; }
  get _windspeed()  { return this._config?.windspeed ?? ''; }
  get _decimals()   { return Number.isFinite(this._config?.decimals) ? this._config.decimals : 1; }
  get _defWind()    { return Number.isFinite(this._config?.default_wind_speed) ? this._config.default_wind_speed : 0.0; }
  get _tmin()       { return Number.isFinite(this._config?.temp_min) ? this._config.temp_min : 10; }
  get _tmax()       { return Number.isFinite(this._config?.temp_max) ? this._config.temp_max : 35; }

  render() {
    if (!this.hass) return html``;

    return html`
      <div class="form">
        <div class="row">
          <div><label>Name (shown at top)</label></div>
          <ha-textfield .value=${this._name}
                        @input=${e => this.#update('name', e.target.value)}
                        placeholder="Aircomfort"></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${e => this.#update('temperature', e.detail.value)}>
          </ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${e => this.#update('humidity', e.detail.value)}>
          </ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. Used in AT calc only.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${e => this.#update('windspeed', e.detail.value)}>
          </ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label>
            <div class="hint">If no wind speed entity is set, this value is used.</div>
          </div>
          <ha-textfield type="number" inputmode="decimal" step="0.1"
                        .value=${String(this._defWind)}
                        @input=${e => this.#updateNumber('default_wind_speed', e.target.value, 0)}>
          </ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp scale min (°C)</label>
            <div class="hint">Pupil vertical scaling lower bound.</div>
          </div>
          <ha-textfield type="number" step="0.5"
                        .value=${String(this._tmin)}
                        @input=${e => this.#updateNumber('temp_min', e.target.value, 10)}>
          </ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp scale max (°C)</label>
            <div class="hint">Pupil vertical scaling upper bound.</div>
          </div>
          <ha-textfield type="number" step="0.5"
                        .value=${String(this._tmax)}
                        @input=${e => this.#updateNumber('temp_max', e.target.value, 35)}>
          </ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield type="number" step="1" min="0"
                        .value=${String(this._decimals)}
                        @input=${e => this.#updateNumber('decimals', e.target.value, 1)}>
          </ha-textfield>
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
