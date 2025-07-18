import { LitElement, html, css } from 'lit';

class SimpleAirComfortCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .background {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .dot {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      transform: translate(-50%, 50%);
      transition: top 0.8s ease-in-out, left 0.8s ease-in-out;
      z-index: 3;
    }
    .dot.blink {
      animation: blink 1s infinite alternate;
    }
    @keyframes blink {
      0% { opacity: 1; }
      100% { opacity: 0.3; }
    }
    .ring {
      position: absolute;
      border-radius: 50%;
      width: 45%;
      height: 45%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
    .inner-zone {
      position: absolute;
      border-radius: 50%;
      width: 21%;
      height: 21%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    .label {
      position: absolute;
      font-size: clamp(0.55rem, 1.2vw, 1rem);
      color: grey;
      z-index: 4;
    }
    .label.warm {
      top: 22%;
      right: 0%;
      transform: translate(-50%, -50%) scale(0.7);
    }
    .label.cold {
      top: 79%;
      right: 0%;
      transform: translate(-50%, -50%) scale(0.7);
    }
    .label.dry {
      left: 22%;
      top: 50%;
      writing-mode: vertical-rl;
      transform: rotate(180deg) translate(-50%, -50%) scale(0.7);
    }
    .label.humid {
      left: 79%;
      top: 50%;
      writing-mode: vertical-rl;
      transform: translate(-50%, -50%) scale(0.7);
    }
    .info-container {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      font-size: clamp(0.7rem, 1.5vw, 0.9rem);
      color: #fff;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 8px;
    }
    .metric-chip {
      position: absolute;
      bottom: 10%;
      width: clamp(45px, 10vw, 60px);
      text-align: center;
      font-size: clamp(0.6rem, 1vw, 0.75rem);
      color: white;
      background: rgba(0,0,0,0.5);
      border-radius: 6px;
      padding: 2px;
      z-index: 5;
    }
    .chip-temp { left: 10%; }
    .chip-humid { left: 30%; }
    .chip-dew { left: 50%; transform: translateX(-50%); }
    .chip-co2 { left: 70%; }
  `;

  setConfig(config) {
    if (!config.temperature || !config.humidity) {
      throw new Error('Temperature and humidity entities must be defined');
    }
    this.config = {
      ...config,
      colorOverrides: config.colorOverrides || {}
    };
  }

  _computeDotPosition(temp, humid) {
    const tMin = 15, tMax = 35;
    const hMin = 40, hMax = 60;
    const tempClamped = Math.max(tMin, Math.min(temp, tMax));
    const humidClamped = Math.max(hMin, Math.min(humid, hMax));
    const top = 100 - ((tempClamped - tMin) / (tMax - tMin)) * 100;
    const left = ((humidClamped - hMin) / (hMax - hMin)) * 100;
    return { top: `${top}%`, left: `${left}%` };
  }

  render() {
    const temp = parseFloat(this.hass.states[this.config.temperature]?.state);
    const humid = parseFloat(this.hass.states[this.config.humidity]?.state);
    const co2 = this.config.co2 ? this.hass.states[this.config.co2]?.state : 'N/A';
    const dewPoint = this._calculateDewPoint(temp, humid);
    const dewText = this._getDewpointComfortText(dewPoint);
    const tempText = this._getTemperatureComfortText(temp);
    const humidText = this._getHumidityComfortText(humid);
    const pos = this._computeDotPosition(temp, humid);

    const backgroundGradient = this._getTemperatureGradient(tempText);
    const ringGradient = this._getDewpointGradient(dewText);
    const alertGradient = this._getInnerAlertGradient(temp, humid);
    const dotColor = this._dotColor(temp, humid);
    const dotClass = this._isOutsideComfort(temp, humid) ? 'dot blink' : 'dot';

    return html`
      <div class="background" style="background-image: ${backgroundGradient};"></div>
      <div class="ring" style="background-image: ${ringGradient};"></div>
      <div class="inner-zone" style="background: ${alertGradient};"></div>
      <div
        class="${dotClass}"
        style="top: ${pos.top}; left: ${pos.left}; background-color: ${dotColor};"
      ></div>
      <div class="label warm">Warm</div>
      <div class="label cold">Cold</div>
      <div class="label dry">Dry</div>
      <div class="label humid">Humid</div>
      <div class="metric-chip chip-temp">🌡 ${tempText}</div>
      <div class="metric-chip chip-humid">💧 ${humidText}</div>
      <div class="metric-chip chip-dew">💦 ${dewText}</div>
      <div class="metric-chip chip-co2">🫁 ${co2}</div>
    `;
  }

  _dotColor(temp, humid) {
    if (isNaN(temp) || isNaN(humid)) return 'gray';
    if (this._isOutsideComfort(temp, humid)) return this.config.colorOverrides.dotAlert || 'red';
    return this.config.colorOverrides.dotNormal || 'lime';
  }

  _isOutsideComfort(temp, humid) {
    return isNaN(temp) || isNaN(humid) || temp > 26.4 || temp < 18 || humid < 40 || humid > 60;
  }

  _getInnerAlertGradient(temp, humid) {
    if (isNaN(temp) || isNaN(humid)) return 'dimgray';

    const humidityColor = (humid < 40 || humid > 60)
      ? this.config.colorOverrides.humidityAlert || 'hotpink'
      : 'black';
    let temperatureColor = 'dimgray';

    if (temp < 14) temperatureColor = this.config.colorOverrides.tempCold || 'rgba(0, 102, 255, 0.8)';
    else if (temp > 26.4) temperatureColor = this.config.colorOverrides.tempHot || 'rgba(255, 69, 0, 0.8)';

    return `radial-gradient(circle, ${humidityColor} 0%, black, ${temperatureColor} 70%)`;
  }

  _calculateDewPoint(T, RH) {
    const a = 6.1121;
    const b = 18.678;
    const c = 257.14;
    const d = 234.5;
    const gamma = Math.log((RH / 100) * Math.exp((b - T / d) * (T / (c + T))));
    return +(c * gamma / (b - gamma)).toFixed(1);
  }

  _getDewpointComfortText(dewpoint) {
    if (dewpoint === null || isNaN(dewpoint)) return 'Unknown';
    if (dewpoint < 5) return 'Very Dry';
    if (dewpoint <= 10) return 'Dry';
    if (dewpoint <= 12.79) return 'Pleasant';
    if (dewpoint <= 15.49) return 'Comfortable';
    if (dewpoint <= 18.39) return 'Sticky Humid';
    if (dewpoint <= 21.19) return 'Muggy';
    if (dewpoint <= 23.9) return 'Sweltering';
    return 'Stifling';
  }

  _getTemperatureComfortText(temp) {
    if (temp === null || isNaN(temp)) return 'N/A';
    if (temp < 3) return 'FROSTY';
    if (temp <= 4.99) return 'COLD';
    if (temp <= 8.99) return 'CHILLY';
    if (temp <= 13.99) return 'COOL';
    if (temp <= 18.99) return 'MILD';
    if (temp <= 23.99) return 'PERFECT';
    if (temp <= 27.99) return 'WARM';
    if (temp <= 34.99) return 'HOT';
    return 'BOILING';
  }

  _getHumidityComfortText(humid) {
    if (humid === null || isNaN(humid)) return 'N/A';
    if (humid < 40) return 'DRY';
    if (humid <= 60) return 'COMFY';
    return 'HUMID';
  }

  _getTemperatureGradient(tempText) {
    const map = this.config.colorOverrides.temperatureMap || {
      'FROSTY': 'mediumblue',
      'COLD': 'dodgerblue',
      'CHILLY': 'deepskyblue',
      'COOL': 'mediumaquamarine',
      'MILD': 'seagreen',
      'PERFECT': 'limegreen',
      'WARM': 'gold',
      'HOT': 'orange',
      'BOILING': 'crimson'
    };
    const color = map[tempText?.toUpperCase()] || 'dimgray';
    return `radial-gradient(circle, rgba(100,100,100,0.15), ${color})`;
  }

  _getDewpointGradient(dewText) {
    const map = this.config.colorOverrides.dewpointMap || {
      'VERY DRY': 'deepskyblue',
      'DRY': 'mediumaquamarine',
      'PLEASANT': 'limegreen',
      'COMFORTABLE': 'yellowgreen',
      'STICKY HUMID': 'yellow',
      'MUGGY': 'gold',
      'SWELTERING': 'orange',
      'STIFLING': 'crimson'
    };
    const color = map[dewText?.toUpperCase()] || 'dimgray';
    return `radial-gradient(circle, ${color}, rgba(100,100,100,0.15))`;
  }
}

customElements.define('simple-air-comfort-card', SimpleAirComfortCard);
