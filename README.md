# Simple Air Comfort Card

> A standalone, animated Lovelace card visualizing thermal comfort using temperature, humidity, dew point, and optionally CO₂ or feels-like temperature — now powered entirely by JavaScript + Lit.

---

<img width="573" height="859" alt="image" src="https://github.com/user-attachments/assets/0317339d-cf8a-41f0-867b-54cec6dc7f0b" />

---

## 🔥 Features

- Dynamic floating dot — animates based on live temperature/humidity
- Dew point, temperature, and humidity comfort indicators
- Optional fourth chip for `feels_like` or `co2` entity
- "Feels like" internally computed using Australian Apparent Temperature formula if no entity is provided
- Ring gradient (dew point), background (temperature), inner alert zone (extreme)
- Optional blink animation when outside comfort zone
- Fully responsive, minimal, fast
- Built using LitElement — no templates or `picture-elements`

---

## 📦 Installation

### HACS (Recommended)

1. Go to **HACS > Frontend > Custom Repositories**
2. Add:  
   `https://github.com/MankiniChykan/simple-air-comfort-card`  
   as type `Lovelace`
3. Install **Simple Air Comfort Card**
4. Add to Lovelace resources:

```yaml
url: /hacsfiles/simple-air-comfort-card/simple-air-comfort-card.js
type: module
```

---

## 🧾 Example Card Configuration

```yaml
type: custom:simple-air-comfort-card
temperature: sensor.living_room_temperature
humidity: sensor.living_room_humidity
wind: sensor.living_room_wind_speed       # optional, for feels like
feels_like: sensor.living_room_feelslike  # optional, overrides calculated
# co2: sensor.living_room_co2            # alternative to feels_like
colorOverrides:
  dotNormal: "#4CAF50"
  dotAlert: "#F44336"
  temperatureMap:
    HOT: "#ff5722"
    PERFECT: "#4caf50"
    COLD: "#2196f3"
  dewpointMap:
    MUGGY: "#ef6c00"
    DRY: "#00acc1"
    IDEAL: "#81c784"
```

---

## 📋 Required Entities

| Sensor       | Units | Required | Description                      |
|--------------|-------|----------|----------------------------------|
| `temperature`| °C    | ✅       | Room temperature                 |
| `humidity`   | %     | ✅       | Room relative humidity           |
| `wind`       | km/h  | ❌       | Used to compute apparent temp    |
| `feels_like` | °C    | ❌       | Overrides internal feels-like    |
| `co2`        | ppm   | ❌       | Used if feels_like not set       |

---

## 💡 Logic & Visuals

- **Dot Animation**: Live-mapped to temp/humidity
- **Dew Point Zone**: Renders outer comfort circle
- **Temperature Background**: Gradient SVG-style
- **Inner Alert Ring**: Highlights extreme values
- **Blinking Dot**: Activates if outside comfort zone (e.g. <18°C or >26.4°C, or humidity <40% or >60%)
- **Apparent Temp (Feels Like)**:  
  Formula:  
  `AT = T + 0.33×e − 0.70×wind − 4.0`  
  where `e = RH/100 × 6.105 × exp(17.27×T / (237.7 + T))`

---

## 🛠 Development

```bash
npm install
npm run build
```

Minified output goes to `dist/simple-air-comfort-card.js`.

---

## 🚀 Release Notes

- Uses `release.yml` to auto-build and tag releases via GitHub Actions
- `hacs.json` and `package.json` included for HACS compatibility

To publish a new release:
1. Bump version in `package.json`
2. Push a tag like `v1.0.0`
3. GitHub Actions will take care of the build and release artifacts

---

## 🙌 Credits

Created by **Hunter**  
Inspired by the original Jinja2 + `picture-elements` concept

---

## 📄 License

MIT
