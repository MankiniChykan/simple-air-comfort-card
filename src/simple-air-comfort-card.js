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
    :host {
      display: block;                /* ensure the custom element participates in layout */
      height: 100%;
    }  
    ha-card {
      position: relative;
      padding: 0;
      overflow: hidden;
      isolation: isolate;                                            /* keep z-index stacking inside this card only */
      border-radius: var(--ha-card-border-radius, 12px);    
      background: var(--sac-temp-bg, #2a2a2a);                     /* gradient on the card */
      height: 100%;
    }

    /* Square canvas so % math matches your YAML placements */
    .canvas {
      position: absolute;
      inset: 0;                                 /* fill ha-card */
      background: transparent;                  /* was var(--sac-temp-bg, …) */
      padding: 14px 12px 12px;                  /* if you stil want inner spacing */
      border-radius: 0;
      aspect-ratio: 1/1;
    }

    /* Title + subtitle (room name + dewpoint text) */
    .header {
      position: absolute;
      top: clamp(10px, 6%, 22px);   /* never closer than ~10px to the top on small cards */
      left: 50%;
      transform: translate(-50%,-50%);
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

    /* Four corners (TL/TR/BL/BR) */
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
    .tl { left: 8%;  top: 18%; transform: translate(0, -50%);  text-align: left;  }
    .tr { right: 8%; top: 18%; transform: translate(0, -50%);  text-align: right; }
    .bl { left: 8%;  bottom: 8%;  transform: translate(0,  0%);  text-align: left;  }
    .br { right: 8%; bottom: 8%;  transform: translate(0,  0%);  text-align: right; }

    /* Center graphic: perfectly centered concentric circles */
    .graphic {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 56%;
      height: 56%;
      min-width: 120px;
      min-height: 120px;
    }

    /* Axis labels placed around the dial rim */
    .axis {
      position: absolute;
      color: rgba(255,255,255,0.92);
      font-weight: 700;
      text-shadow: 0 1px 2px rgba(0,0,0,0.45);
      pointer-events: none;
    }
    .axis-top    { top: -12px; left: 50%; transform: translate(-50%, -50%); }
    .axis-bottom { bottom: -12px; left: 50%; transform: translate(-50%,  50%); }
    .axis-left   { left: -20px;  top: 50%;  transform: translate(-50%, -50%) rotate(180deg); writing-mode: vertical-rl; }
    .axis-right  { right: -20px; top: 50%;  transform: translate( 50%, -50%); writing-mode: vertical-rl; }

    /* Outer ring: white border + dewpoint gradient fill (macro colours) */
    .outer-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2.5px solid white;
      background: var(--sac-dewpoint-ring, radial-gradient(circle, dimgray, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15)));
      box-shadow:
        0 0 6px 3px rgba(0,0,0,0.18),
        0 0 18px 6px rgba(0,0,0,0.22);
    }

    /* Inner comfort circle: black + humidity/temperature gradient (macro) */
    .inner-circle {
      position: absolute;
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

    /* Floating dot + alert blink */
    .dot {
      position: absolute;
      width: 15%;
      height: 15%;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 6px rgba(0,0,0,0.45);
      transform: translate(-50%, 50%);
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
      0%   { opacity: 1; }
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

    // Entities
    const tState  = this.hass.states[this._config.temperature];
    const rhState = this.hass.states[this._config.humidity];
    const wsState = this._config.windspeed ? this.hass.states[this._config.windspeed] : undefined;

    if (!tState || !rhState) {
      return html`<ha-card>
        <div class="canvas">
          <div class="header">
            <div class="title">${this._config.name ?? 'Air Comfort'}</div>
            <div class="subtitle">Entity not found: ${!tState ? this._config.temperature : this._config.humidity}</div>
          </div>
        </div>
      </ha-card>`;
    }

    // Parse & physics
    const tempUnitIn = (tState.attributes.unit_of_measurement || '°C').trim();
    const Tc   = this.#toCelsius(parseFloat(tState.state), tempUnitIn);
    const RH   = this.#clampRH(parseFloat(rhState.state));
    const WS   = this.#resolveWind(wsState, this._config.default_wind_speed);

    const es   = this.#buckSaturationVapourPressure_hPa(Tc);
    const e    = (RH / 100) * es;
    const dpC  = this.#dewPointFromVapourPressure_hPa(e);
    const atC  = this.#apparentTemperatureC(Tc, e, WS);

    // Macro texts
    const dewText  = this.#dewpointTextFromMacro(dpC);
    const tempText = this.#temperatureTextFromMacro(Tc);
    const rhText   = this.#humidityTextFromMacro(RH);

    // Gradients (macros → CSS)
    const cardBg    = this.#backgroundGradientForTempC(Tc);
    const ringGrad  = this.#dewpointRingGradientFromText(dewText);
    const innerGrad = this.#innerEyeGradient(RH, Tc);

    // Floating dot position (full 0..100% space of the graphic box)
    const { temp_min, temp_max } = this._config;
    const yPct = this.#scaleClamped(Tc, temp_min, temp_max, 0, 100); // bottom..top
    const xPct = this.#clamp(RH + 0.5, 0, 100);                      // left..right (+0.5 like your macro)

    // Outside limits → blink
    const outside = (RH < 40 || RH > 60 || Tc < 18 || Tc > 26.4);

    // Output strings
    const d = this._config.decimals;
    const outUnit = tempUnitIn;
    const dewOut = this.#formatNumber(this.#fromCelsius(dpC, outUnit), d) + ` ${outUnit}`;
    const atOut  = this.#formatNumber(this.#fromCelsius(atC,  outUnit), d) + ` ${outUnit}`;

    return html`
      <ha-card style="--sac-temp-bg:${cardBg}">
        <div class="canvas">
          <!-- Title + Dewpoint comfort text -->
          <div class="header">
            <div class="title">${this._config.name ?? 'Air Comfort'}</div>
            <div class="subtitle">${dewText}</div>
          </div>

          <!-- TL: Dew point -->
          <div class="corner tl">
            <span class="label">Dew point</span>
            <span class="value">${dewOut}</span>
          </div>

          <!-- TR: Feels like -->
          <div class="corner tr">
            <span class="label">Feels like</span>
            <span class="value">${atOut}</span>
          </div>

          <!-- BL: Temperature comfort -->
          <div class="corner bl">
            <span class="label">Temperature</span>
            <span class="value">${tempText}</span>
          </div>

          <!-- BR: Humidity comfort -->
          <div class="corner br">
            <span class="label">Humidity</span>
            <span class="value">${rhText}</span>
          </div>

          <!-- Center dial -->
          <div class="graphic">
            <div class="axis axis-top">Warm</div>
            <div class="axis axis-bottom">Cold</div>
            <div class="axis axis-left">Dry</div>
            <div class="axis axis-right">Humid</div>

            <div class="outer-ring" style="background:${ringGrad}"></div>
            <div class="inner-circle" style="background:${innerGrad}"></div>

            <div class="dot ${outside ? 'outside' : ''}"
                style="left:${xPct}%; bottom:${yPct}%;">
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  // Give Lovelace a conservative size on first pass
  getCardSize() {
    return 10;
  }

  // Default grid sizing for Sections view (multiples of 3 recommended)
  getGridOptions() {
    const c = this._config ?? {};
    return {
      // defaults make a roughly square card by default
      columns: c.grid_columns ?? 6,
      min_columns: c.min_grid_columns ?? 3,
      rows: c.grid_rows ?? 6,
      min_rows: c.min_grid_rows ?? 3,
      // max_* optional; omit so HA can grow if user drags
    };
  }

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

  #dewpointRingGradientFromText(text) {
    // Mirrors your `calculate_dewpoint_colour_outer_ring_limits`
    const base = (t => {
      switch (t) {
        case 'Very Dry':     return 'deepskyblue';
        case 'Dry':          return 'mediumaquamarine';
        case 'Pleasant':     return 'limegreen';
        case 'Comfortable':  return 'yellowgreen';
        case 'Sticky Humid': return 'yellow';
        case 'Muggy':        return 'gold';
        case 'Sweltering':   return 'orange';
        case 'Stifling':     return 'crimson';
        case 'Unknown':
        case 'Unavailable':
        default:             return 'dimgray';
      }
    })(text || 'Unknown');

    // Same stops/alphas as the Jinja macro
    return `radial-gradient(circle, ${base}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`;
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
/*                     GUI EDITOR — schema-driven (ha-form)                 */
/* ------------------------------------------------------------------------ */
class SimpleAirComfortCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
    _schema: { state: true },
  };

  static styles = css`
    .wrap { padding: 8px 12px 16px; }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Tiny hook: ensure helpers are available in the editor
    window.loadCardHelpers?.().catch(() => {});
  }

  set hass(hass) { this._hass = hass; this.requestUpdate(); }
  get hass() { return this._hass; }

  setConfig(config) {
    // Defaults + incoming config
    this._config = {
      name: 'Air Comfort',
      temperature: undefined,
      humidity: undefined,
      windspeed: undefined,            // optional
      decimals: 1,
      default_wind_speed: 0.0,         // m/s
      temp_min: 15,                    // °C
      temp_max: 35,                    // °C
      ...(config ?? {}),
    };

    // Build ha-form schema once (or whenever you want to adjust)
    this._schema = [
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
        selector: { entity: { domain: 'sensor' } }, // optional
      },
      {
        name: 'default_wind_speed',
        selector: {
          number: {
            min: 0,
            max: 50,
            step: 0.1,
            mode: 'box',
            unit_of_measurement: 'm/s',
          },
        },
      },
      {
        name: 'decimals',
        selector: {
          number: {
            min: 0,
            max: 3,
            step: 1,
            mode: 'box',
          },
        },
      },
      {
        name: 'temp_min',
        selector: {
          number: {
            min: -20,
            max: 50,
            step: 0.1,
            mode: 'box',
            unit_of_measurement: '°C',
          },
        },
      },
      {
        name: 'temp_max',
        selector: {
          number: {
            min: -20,
            max: 60,
            step: 0.1,
            mode: 'box',
            unit_of_measurement: '°C',
          },
        },
      },
    ];
  }

  render() {
    if (!this.hass || !this._config) return html``;

    return html`
      <div class="wrap">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      </div>
    `;
  }

  _computeLabel = (s) => {
    const labels = {
      name: 'Name',
      temperature: 'Temperature entity',
      humidity: 'Humidity entity',
      windspeed: 'Wind speed entity (optional)',
      default_wind_speed: 'Default wind speed (m/s)',
      decimals: 'Decimals',
      temp_min: 'Dot temp min (°C)',
      temp_max: 'Dot temp max (°C)',
    };
    return labels[s.name] ?? s.name;
  };

  _onValueChanged = (ev) => {
    ev.stopPropagation();
    const cfg = ev.detail.value;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: cfg });
  };
}

customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);

