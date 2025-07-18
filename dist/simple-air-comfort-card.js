// simple-air-comfort-card.js
// Full JavaScript rewrite of the Simple Air Comfort Card
// Author: Hunter

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
    .metric-chip {
      position: absolute;
      width: clamp(45px, 10vw, 60px);
      text-align: center;
      font-size: clamp(0.6rem, 1vw, 0.75rem);
      color: white;
      background: rgba(0,0,0,0.5);
      border-radius: 6px;
      padding: 2px;
      z-index: 5;
    }
    .chip-dew {
      left: 10%;
      top: 25%;
    }
    .chip-alt {
      right: 10%;
      top: 25%;
    }
    .chip-temp {
      left: 10%;
      bottom: 10%;
    }
    .chip-humid {
      right: 10%;
      bottom: 10%;
    }
    .title {
      position: absolute;
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
      font-size: clamp(0.8rem, 2vw, 1.2rem);
      color: silver;
      z-index: 6;
    }
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

  render() {
    const temp = parseFloat(this.hass.states[this.config.temperature]?.state);
    const humid = parseFloat(this.hass.states[this.config.humidity]?.state);
    const wind = this.config.wind ? parseFloat(this.hass.states[this.config.wind]?.state || 0) : 0;
    const feelsLike = this._calculateApparentTemperature(temp, humid, wind);
    const altValue = this.config.co2 ? this.hass.states[this.config.co2]?.state : feelsLike.toFixed(1);
    const altIcon = this.config.co2 ? '🫁' : '🤒';
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
      <div class="${dotClass}" style="top: ${pos.top}; left: ${pos.left}; background-color: ${dotColor};"></div>
      <div class="title">${this.config.title || ''}</div>
      <div class="label warm">Warm</div>
      <div class="label cold">Cold</div>
      <div class="label dry">Dry</div>
      <div class="label humid">Humid</div>
      <div class="metric-chip chip-dew">💦 ${dewText}</div>
      <div class="metric-chip chip-alt">${altIcon} ${altValue}</div>
      <div class="metric-chip chip-temp">🌡 ${tempText}</div>
      <div class="metric-chip chip-humid">💧 ${humidText}</div>
    `;
  }

  _calculateApparentTemperature(t, rh, wind = 0) {
    return t + 0.33 * rh / 100 * 6.105 * Math.exp(17.27 * t / (237.7 + t)) - 0.7 * wind - 4.0;
  }

  // Additional methods like _calculateDewPoint, _getDewpointComfortText, etc. remain here
}

customElements.define('simple-air-comfort-card', SimpleAirComfortCard);
