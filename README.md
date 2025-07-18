# Simple Air Comfort Card

> A fully dynamic, visually responsive Home Assistant Lovelace card for visualizing thermal and humidity comfort using temperature, humidity, and dew point.

![screenshot](https://raw.githubusercontent.com/MankiniChykan/simple-air-comfort-card/main/assets/example-card.png)

---

## ✨ Features

- Animated floating dot that reflects live comfort readings
- Blinking warning for uncomfortable conditions
- Dew point, temperature, and humidity comfort text labels
- Radial gradient visuals for temperature and dew point zones
- Customizable color overrides via card config
- Optional CO₂ sensor chip display
- Fully standalone: no `picture-elements`, no Jinja2 templates
- Built with LitElement + JavaScript for optimal performance
- HACS-ready: includes release automation and CI/CD pipeline

---

## 🛠 Installation

### Recommended: HACS

1. Go to **HACS > Frontend > Custom Repositories**
2. Add `https://github.com/MankiniChykan/simple-air-comfort-card` as a *Lovelace* repo
3. Install **Simple Air Comfort Card**
4. Add to your Lovelace resources:

```yaml
url: /hacsfiles/simple-air-comfort-card/simple-air-comfort-card.js
type: module
```

### Manual

1. Download `simple-air-comfort-card.js` from the `dist/` folder
2. Place it in `www/simple-air-comfort-card/`
3. Reference in Lovelace:

```yaml
url: /local/simple-air-comfort-card/simple-air-comfort-card.js
type: module
```

---

## 🧾 Example Lovelace YAML

```yaml
type: custom:simple-air-comfort-card
temperature: sensor.living_room_temperature
humidity: sensor.living_room_humidity
co2: sensor.living_room_co2
colorOverrides:
  dotNormal: "#00ff00"
  dotAlert: "#ff0000"
  temperatureMap:
    HOT: "#ff5722"
    PERFECT: "#00e676"
  dewpointMap:
    "MUGGY": "#ffa500"
    "VERY DRY": "#1e88e5"
```

---

## 📋 Required Entities

- `sensor.living_room_temperature`: in °C
- `sensor.living_room_humidity`: in %
- Optional: `sensor.living_room_co2`: in ppm

The dew point is calculated internally using the Arden Buck formula — no extra sensor needed.

---

## 🎨 Configuration Options

| Option             | Description                                  | Required |
|--------------------|----------------------------------------------|----------|
| `temperature`      | Entity ID for temperature sensor             | ✅       |
| `humidity`         | Entity ID for humidity sensor                | ✅       |
| `co2`              | CO₂ sensor (ppm)                             | ❌       |
| `colorOverrides`   | Customize colors and gradients               | ❌       |

---

## 🧠 Internal Logic

- **Floating Dot Position**: Scales temperature (15–35°C) and humidity (40–60%) onto card grid
- **Dot Blink Alert**: Activates outside 18–26.4°C or humidity outside 40–60%
- **Dew Point Calculation**: Buck formula
- **Comfort Levels**: Derived from ranges and rendered via chip text and gradients
- **Gradient Backgrounds**: Dynamically colored for temperature and dew point zones

---

## 🧑‍💻 Development

Clone this repo, install dependencies, and run the build script:

```bash
npm install
npm run build
```

The output is written to `/dist`.

---

## 📦 HACS Release Workflow

- A GitHub tag (e.g., `v1.0.0`) automatically builds and publishes a release
- `simple-air-comfort-card.js` is minified and output to `dist/`
- `hacs.json` and `release.yml` are included for CI compatibility

---

## 📮 Feedback

Open an issue or pull request — feedback and contributions welcome.

---

**License:** MIT  
**Author:** [Hunter](https://github.com/MankiniChykan)
