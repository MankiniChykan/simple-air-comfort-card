import { LitElement, html, css } from 'lit';

/**
 * Simple Air Comfort Card
 *
 * Physics & conventions
 * - Apparent Temperature (Australian BoM):
 *     AT = T + 0.33·e − 0.70·ws − 4.0
 *     (T in °C, e in hPa from Arden Buck, ws in m/s)
 * - Vapour pressure (e) via Arden Buck saturation vapour pressure.
 * - Dew point from Arden Buck (numeric inverse).
 * - Default windspeed is 0.0 m/s (indoor-friendly) if no wind entity provided.
 *
 * Visuals
 * - Card background colour = your macro `calculate_temperature_colour_card_background`
 *   (we reproduce it 1:1 in JS helpers).
 * - Outer ring: white stroke with a soft, dew-point-tinted glow (mapping from your dewpoint text).
 * - Inner eye (radial): humidity/temperature alert gradient from your inner-circle macro.
 * - Floating white dot: moves by RH (x) and T (y), scaling by configurable temp_min/temp_max.
 * - Face shows: room name at top, dewpoint text under name, TL dewpoint value, TR feels-like,
 *   BL temperature-comfort text, BR humidity-comfort text.
 *
 * Lovelace config example:
 * type: custom:simple-air-comfort-card
 * name: Master Bedroom
 * temperature: sensor.bed_temp
 * humidity: sensor.bed_rh
 * windspeed: sensor.bed_ws           # optional
 * decimals: 1                        # optional (default 1)
 * default_wind_speed: 0              # optional (default 0 m/s)
 * temp_min: 15                       # optional (dot vertical scale min °C)
 * temp_max: 35                       # optional (dot vertical scale max °C)
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
      position: relative;
    }

    /* Content frame with rounded corners so the background gradient looks like your macro card */
    .frame {
      margin: 16px;
      border-radius: 18px;
      padding: 20px;
      min-height: 360px;
      position: relative;
    }

    .title {
      text-align: center;
      font-weight: 700;
      font-size: 1.2rem;
      color: rgba(255,255,255,0.92);
      text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    }

    .subtitle {
      margin-top: 4px;
      text-align: center;
      font-weight: 600;
      color: rgba(255,255,255,0.70);
    }

    /* Two-column layout: left labels, right dial */
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 16px;
      align-items: start;
      margin-top: 16px;
    }

    /* Numbers & labels at TL/TR/BL/BR */
    .corner {
      display: grid;
      gap: 6px;
      align-content: start;
      color: rgba(255,255,255,0.9);
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
    }
    .label {
      font-weight: 600;
      color: rgba(255,255,255,0.85);
    }
    .value {
      font-weight: 800;
      font-size: 1.1rem;
    }

    /* Dial area at right column */
    .dial-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      display: grid;
      place-items: center;
    }
    .dial {
      position: relative;
      width: min(82%, 360px);
      aspect-ratio: 1 / 1;
    }

    /* Outer ring: white rim; the glow tint is set inline via style= (dewpoint mapping) */
    .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow:
        0 0 6px 3px rgba(0,0,0,0.18),
        0 0 18px 6px rgba(0,0,0,0.22);
    }

    /* Inner eye gradient: inline background via style= (from macro rules) */
    .eye {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 62%;
      aspect-ratio: 1 / 1;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow:
        inset 0 0 24px rgba(0,0,0,0.65),
        0 0 24px rgba(0,0,0,0.25);
    }

    /* Floating dot (white), positioned by inline left/bottom % */
    .dot {
      position: absolute;
      width: 9%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.35);
      transform: translate(-50%, 50%);
      transition: bottom 0.8s ease-in-out, left 0.8s ease-in-out;
      z-index: 3;
    }

    /* Axis labels around the ring (fixed) */
    .axis {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -26px;
      color: rgba(255,255,255,0.85);
      font-weight: 700;
    }
    .axis-bottom {
      top: auto;
      bottom: -26px;
    }
    .axis-left,
    .axis-right {
      top: 50%;
      transform: translateY(-50%);
      left: -28px;
      writing-mode: vertical-rl;
      rotate: 180deg;
    }
    .axis-right {
      left: auto;
      right: -28px;
      rotate: 0deg;
    }

    /* Bottom row: BL temperature comfort text, BR humidity comfort text */
    .bottom-row {
      margin-top: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
    .bottom-cell {
      display: grid;
      gap: 6px;
    }
    .bottom-title {
      color: rgba(255,255,255,0.85);
      font-weight: 700;
    }
    .bottom-value {
      color: rgba(255,255,255,0.95);
      font-size: 1.1rem;
      font-weight: 900;
      letter-spacing: 0.4px;
    }

    /* Small screen tweaks */
    @media (max-width: 540px) {
      .grid { grid-template-columns: 1fr; }
      .dial { width: min(86%, 360px); margin: 0 auto; }
      .corner { text-align: left; }
      .bottom-row { grid-template-columns: 1fr 1fr; }
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
      // dot vertical scaling (maps temperature to dial vertical pos)
      temp_min: Number.isFinite(config.temp_min) ? config.temp_min : 15,
      temp_max: Number.isFinite(config.temp_max) ? config.temp_max : 35,
    };
  }

  render() {
    if (!this.hass || !this._config) return html``;

    // ---- Pull entity states -------------------------------------------------
    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !rhState) {
      return html`<ha-card><div class="frame">
        <div class="title">${this._config.name}</div>
        <div class="subtitle">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
      </div></ha-card>`;
    }

    // ---- Units & numeric parsing -------------------------------------------
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const tempC  = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const rh     = this.#clampRH(parseFloat(rhState.state));
    const ws_mps = this.#resolveWind(wsState, this._config.default_wind_speed);

    // ---- Physics ------------------------------------------------------------
    const es_hPa = this.#buckSaturationVapourPressure_hPa(tempC);
    const e_hPa  = (rh / 100) * es_hPa;
    const dewC   = this.#dewPointFromVapourPressure_hPa(e_hPa);
    const atC    = this.#apparentTemperatureC(tempC, e_hPa, ws_mps);

    // ---- Macro-equivalent text categories ----------------------------------
    const dewText  = this.#dewpointTextFromMacro(dewC);
    const tempText = this.#temperatureTextFromMacro(tempC);
    const rhText   = this.#humidityTextFromMacro(rh);

    // ---- Visual colours per your macros ------------------------------------
    const cardBg     = this.#backgroundGradientForTempC(tempC);          // <-- NEW: matches Jinja macro exactly
    const ringGlow   = this.#dewpointGlowForText(dewText);               // outer ring halo tint
    const innerEyeBg = this.#innerEyeGradient(rh, tempC);                // black/pink/blue per macro rules

    // ---- Floating dot position ---------------------------------------------
    const { temp_min, temp_max } = this._config;
    const yPct = this.#scaleClamped(tempC, temp_min, temp_max, 0, 100);   // 0=bottom, 100=top
    const xPct = this.#clamp(rh, 0, 100);                                 // 0..100 across

    // ---- Output numbers & units -------------------------------------------
    const d = this._config.decimals;
    const outUnit = tempUnitIn;
    const dewOut = this.#formatNumber(this.#fromCelsius(dewC, outUnit), d) + ` ${outUnit}`;
    const atOut  = this.#formatNumber(this.#fromCelsius(atC,  outUnit), d) + ` ${outUnit}`;

    return html`
      <ha-card style="background:${cardBg}">
        <div class="frame">
          <div class="title">${this._config.name}</div>
          <div class="subtitle">${dewText}</div>

          <div class="grid">
            <!-- Left (TL) Dew point value -->
            <div class="corner">
              <div class="label">Dew point</div>
              <div class="value">${dewOut}</div>
            </div>

            <!-- Right column: the dial -->
            <div class="dial-wrap">
              <div class="dial">
                <div class="axis">Warm</div>
                <div class="axis axis-bottom">Cold</div>
                <div class="axis-left">Dry</div>
                <div class="axis-right">Humid</div>

                <div class="ring" style="${ringGlow}"></div>
                <div class="eye" style="background:${innerEyeBg}"></div>

                <!-- floating dot -->
                <div class="dot" style="left:${xPct}%; bottom:${yPct}%"></div>
              </div>
            </div>

            <!-- Right (TR) Feels like -->
            <div class="corner" style="grid-column: 2 / 3; grid-row: 1 / 2; justify-self:end; text-align:right;">
              <div class="label">Feels like</div>
              <div class="value">${atOut}</div>
            </div>
          </div>

          <div class="bottom-row">
            <div class="bottom-cell">
              <div class="bottom-title">Temperature</div>
              <div class="bottom-value">${tempText}</div>
            </div>
            <div class="bottom-cell" style="text-align:right;">
              <div class="bottom-title">Humidity</div>
              <div class="bottom-value">${rhText}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 4; }

  // ==========================================================================
  // Physics
  // ==========================================================================

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
    // Numeric inverse of Arden Buck via bisection
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

  // ==========================================================================
  // Macro-equivalent text mappings (locked to your Jinja ranges)
  // ==========================================================================

  // Dewpoint Comfort Text
  #dewpointTextFromMacro(dpC) {
    if (!Number.isFinite(dpC)) return 'Unknown';
    if (dpC < 5)                       return 'Very Dry';
    if (dpC >= 5     && dpC <= 10)     return 'Dry';
    if (dpC >= 10.1  && dpC <= 12.79)  return 'Pleasant';
    if (dpC >= 12.8  && dpC <= 15.49)  return 'Comfortable';
    if (dpC >= 15.5  && dpC <= 18.39)  return 'Sticky Humid';
    if (dpC >= 18.4  && dpC <= 21.19)  return 'Muggy';
    if (dpC >= 21.2  && dpC <= 23.9)   return 'Sweltering';
    return 'Stifling';
  }

  // Temperature Comfort Text
  #temperatureTextFromMacro(Tc) {
    if (!Number.isFinite(Tc)) return 'N/A';
    if (Tc < 3)                         return 'FROSTY';
    if (Tc >= 3.1  && Tc <= 4.99)       return 'COLD';
    if (Tc >= 5    && Tc <= 8.99)       return 'CHILLY';
    if (Tc >= 9    && Tc <= 13.99)      return 'COOL';
    if (Tc >= 14   && Tc <= 18.99)      return 'MILD';
    if (Tc >= 19   && Tc <= 23.99)      return 'PERFECT';
    if (Tc >= 24   && Tc <= 27.99)      return 'WARM';
    if (Tc >= 28   && Tc <= 34.99)      return 'HOT';
    return 'BOILING';
  }

  // Humidity Comfort Text
  #humidityTextFromMacro(RH) {
    if (!Number.isFinite(RH)) return 'N/A';
    if (RH < 40)              return 'DRY';
    if (RH <= 60)             return 'COMFY';
    return 'HUMID';
  }

  // ==========================================================================
  // Visual mappings (ring glow, inner eye gradient, card background gradient)
  // ==========================================================================

  // NEW: exact reproduction of your calculate_temperature_colour_card_background macro
  #temperatureComfortTextForBg(Tc) {
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
  #_bgColourFromText(text) {
    const t = String(text || '').toLowerCase();
    if (t === 'frosty')  return 'mediumblue';
    if (t === 'cold')    return 'dodgerblue';
    if (t === 'chilly')  return 'deepskyblue';
    if (t === 'cool')    return 'mediumaquamarine';
    if (t === 'mild')    return 'seagreen';
    if (t === 'perfect') return 'limegreen';
    if (t === 'warm')    return 'gold';
    if (t === 'hot')     return 'orange';
    if (t === 'boiling') return 'crimson';
    return 'dimgray';
  }
  #backgroundGradientForTempC(Tc) {
    const label  = this.#temperatureComfortTextForBg(Tc);
    const colour = this.#_bgColourFromText(label);
    return `radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${colour})`;
  }

  // Map dewpoint text -> soft halo tint behind the white ring
  #dewpointGlowForText(text) {
    // tint colours mirror your dewpoint outer-ring macro
    const m = {
      'Unknown':       'dimgray',
      'Unavailable':   'dimgray',
      'Very Dry':      'deepskyblue',
      'Dry':           'mediumaquamarine',
      'Pleasant':      'limegreen',
      'Comfortable':   'yellowgreen',
      'Sticky Humid':  'yellow',
      'Muggy':         'gold',
      'Sweltering':    'orange',
      'Stifling':      'crimson',
    };
    const base = m[text] || 'rgba(100,100,100,0.15)';
    // apply as inset/outer glow under the ring border
    return `box-shadow:
      0 0 0 3px white inset,
      0 0 18px 6px ${base},
      0 0 22px 10px rgba(0,0,0,0.25)`;
  }

  // Inner eye gradient following your inner_circle_comfort_zone_alert_colour
  #innerEyeGradient(RH, Tc) {
    // Humidity colour: hotpink when outside [40..60], else black
    let humidityColor = 'black';
    if (!Number.isFinite(RH)) humidityColor = 'dimgray';
    else if (RH < 40 || RH > 60) humidityColor = 'hotpink';

    // Temperature colour buckets
    let temperatureColor = 'dimgray';
    if (Number.isFinite(Tc)) {
      if (Tc > 34.9)                         temperatureColor = 'rgba(255, 69, 0, 0.8)';      // boiling+
      else if (Tc > 26.5 && Tc <= 34.9)      temperatureColor = 'rgba(255, 69, 0, 0.8)';      // hot
      else if (Tc > 24.0 && Tc <= 26.5)      temperatureColor = 'dimgray';                     // warm
      else if (Tc > 19.0 && Tc <= 24.0)      temperatureColor = 'dimgray';                     // mild
      else if (Tc > 14.0 && Tc <= 19.0)      temperatureColor = 'rgba(0, 102, 255, 0.8)';      // cool
      else if (Tc > 9.0  && Tc <= 14.0)      temperatureColor = 'rgba(0, 102, 255, 0.8)';      // chilly
      else if (Tc > 5.0  && Tc <= 9.0)       temperatureColor = 'rgba(0, 102, 255, 0.8)';      // cold
      else if (Tc > 3.0  && Tc <= 5.0)       temperatureColor = 'rgba(0, 102, 255, 0.8)';      // frosty-ish
      else if (Tc <= 3.0)                    temperatureColor = 'rgba(0, 102, 255, 0.8)';      // frosty
    } else {
      temperatureColor = 'dimgray';
    }

    // Same structure as your macro (radial gradient)
    return `radial-gradient(circle, ${humidityColor} 0%, black, ${temperatureColor} 70%)`;
  }

  // ==========================================================================
  // Helpers
  // ==========================================================================

  #clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  #scaleClamped(v, inMin, inMax, outMin, outMax) {
    if (!Number.isFinite(v)) return (outMin + outMax) / 2;
    const t = (v - inMin) / (inMax - inMin);
    return this.#clamp(outMin + t * (outMax - outMin), outMin, outMax);
  }

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
      temp_min: 15,
      temp_max: 35,
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
    'Australian BoM apparent temperature + dew point (Arden Buck). Indoor-friendly defaults, macro-matched visuals.',
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
      temp_min: Number.isFinite(config.temp_min) ? config.temp_min : 15,
      temp_max: Number.isFinite(config.temp_max) ? config.temp_max : 35,
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
            <div class="hint">Optional. If empty, the default below is used.</div>
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
          <div><label>Dot temp min (°C)</label></div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._tmin)}
            @input=${(e) => this._updateNumber('temp_min', e.target.value, 15)}
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Dot temp max (°C)</label></div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._tmax)}
            @input=${(e) => this._updateNumber('temp_max', e.target.value, 35)}
          ></ha-entity-picker>
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
