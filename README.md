# IN DEVELOPMENT NOT WORKING YET

# Simple Air Comfort Card

A high-visibility, responsive Lovelace custom card for Home Assistant that visualizes thermal comfort using temperature, humidity, dew point, and apparent temperature (feels like). The floating dot moves dynamically and blinks when conditions are outside the comfort zone.

---

## 💡 Features

- 🎯 Floating **comfort dot** that tracks temp/humidity in real time
- 🌡️ Dynamic **apparent temperature** (feels like), calculated with temp, humidity, and wind
- 🫁 Optional CO₂ sensor display overrides apparent temp if defined
- 💬 Comfort descriptors: dew point, temperature, humidity
- 🎨 Color-coded gradients for temperature and dew point
- 🔁 Blinking indicator when outside comfort zone
- 🧊 Fully passive visual card (no tap actions)
- 🧱 Configurable color overrides via YAML

---

## 📊 Required Sensors

| Sensor       | Units  | Required | Description                                                   |
|--------------|--------|----------|---------------------------------------------------------------|
| `temperature`| °C     | ✅       | Room temperature                                              |
| `humidity`   | %      | ✅       | Room relative humidity                                        |
| `wind`       | km/h   | ❌       | Optional: for calculating apparent temperature (feels like)   |
| `co2`        | ppm    | ❌       | Optional: overrides feels like chip if defined                |

> ⚠️ Apparent temperature is **always calculated** from temp, humidity, and optional wind unless overridden by `co2`.

---

## 🧮 Apparent Temperature Formula

Used when `co2` is not defined:

```
Apparent = T + 0.33 × RH × 6.105 × e^(17.27×T / (237.7+T)) − 0.7 × Wind − 4.0
```

---

## 🧾 YAML Configuration Example

```yaml
type: custom:simple-air-comfort-card
title: Master Bedroom
temperature: sensor.master_temp
humidity: sensor.master_humidity
wind: sensor.master_wind_speed        # Optional
co2: sensor.master_co2                # Optional override
colorOverrides:
  comfort: "#00FFAA"
  warning: "#FFAA00"
  danger: "#FF3300"
```

---

## 🧪 Example with Multiple Cards

```yaml
type: vertical-stack
cards:
  - type: custom:simple-air-comfort-card
    title: "Upstairs"
    temperature: sensor.temp_upstairs
    humidity: sensor.humidity_upstairs
    wind: sensor.wind_upstairs
  - type: custom:simple-air-comfort-card
    title: "Master Bedroom"
    temperature: sensor.master_temp
    humidity: sensor.master_humidity
    co2: sensor.master_co2
```

---

## 🖼 Dot Positioning

- Temperature range: **10°C – 30°C** → affects vertical axis (`top`)
- Humidity range: **20% – 80%** → affects horizontal axis (`left`)
- Comfort zone: dot stays still; outside zone: dot blinks

---

## 🔧 Manual Installation

1. Copy `simple-air-comfort-card.js` into `www/community/simple-air-comfort-card/`
2. Add to Lovelace resources:

```yaml
resources:
  - url: /local/community/simple-air-comfort-card/simple-air-comfort-card.js
    type: module
```

---

## 🧱 HACS Installation

1. In HACS, go to *Frontend → Custom Repositories*
2. Add `https://github.com/yourname/simple-air-comfort-card`
3. Choose category: **Lovelace**
4. Click **Install**, then restart UI

---

## 🖥 Screenshot

![Card Preview](https://your-repo-url/preview.png)

---

## 📄 License

MIT License © Hunter
