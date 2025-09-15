<img width="720" height="720" alt="Icon" src="https://github.com/user-attachments/assets/31170dba-d536-4d9d-acda-949ebb08549d" />

# Simple Air Comfort Card

A **custom Lovelace card for Home Assistant** that visualizes indoor climate comfort using a square dial with a moving **comfort dot**.  
The dot’s position is determined by **Relative Humidity** (X-axis) and **Temperature** (Y-axis). The card derives **dew point**, **Apparent Temperature (BoM)**, and shows comfort words and color cues for fast, at-a-glance status.

> **Source of truth:** This README documents exactly what’s in the current code. Anything not implemented in the file is listed under **Road Map**.

## ✨ Features (implemented)

- **Comfort Dot Dial**
  - **X = RH (%)** mapped across the card width with calibrated inner-circle intersections.
  - **Y = Temperature** mapped to comfort bands (FROSTY → BOILING) with geometry-aware anchors.
  - Pulsing red halo when outside comfort bounds.

- **Color Cues**
  - **Background**: temperature comfort gradient.
  - **Outer ring**: dew point comfort gradient.
  - **Inner circle**: humidity & temperature alerts.

- **Corner Stats**
  - TL: Dew Point
  - TR: Apparent Temperature (“Feels like”)
  - BL: Raw Temperature + comfort word
  - BR: Humidity + comfort word

- **Physics**
  - Dew Point: Arden Buck formula
  - Apparent Temperature (BoM): `AT = T + 0.33e − 0.70ws − 4.0`
  - Optional wind speed conversion

- **Responsive & Accessible**
  - Square aspect ratio
  - Typography scales via `--sac-scale`
  - ARIA labels for accessibility

- **GUI Editor**
  - Entity selectors
  - Number inputs (decimals, wind, RH calibration, vertical offset)
  - Temperature anchors with buttons (±0.1 °C, enforced contiguous bands)
  - Reset-to-defaults

## 📦 Installation

### HACS (recommended)
1. Open **HACS → Frontend → Custom repositories**.
2. Add: `https://github.com/MankiniChykan/simple-air-comfort-card`
3. Category: **Lovelace**
4. Install → Restart HA.

### Manual
1. Download `dist/simple-air-comfort-card.js` from the release.
2. Copy to `/config/www/`
3. Add resource:
```yaml
resources:
  - url: /local/simple-air-comfort-card.js?v=1
    type: module
```

### 4. Configuration

## 🧩 Lovelace Configuration

**Minimum:**
```yaml
type: custom:simple-air-comfort-card
name: Living Room
temperature: sensor.living_temperature
humidity: sensor.living_humidity
```
```yaml
type: custom:simple-air-comfort-card
name: Living Room
temperature: sensor.living_temperature
humidity: sensor.living_humidity
windspeed: sensor.living_wind
default_wind_speed: 0.1
decimals: 1
rh_left_inner_pct: 40
rh_right_inner_pct: 60
y_offset_pct: 0
```

## ⚙️ Configuration Options

### Required
- **temperature** — sensor entity (reports °C or °F)  
- **humidity** — sensor entity (reports %)

### Optional
- **windspeed** — sensor entity (reports air speed)  
- **default_wind_speed** — fallback value in m/s when no wind entity is set  
- **decimals** — number of decimal places to display (0–3)  
- **rh_left_inner_pct** — left inner-circle intersection for RH mapping (%)  
- **rh_right_inner_pct** — right inner-circle intersection for RH mapping (%)  
- **y_offset_pct** — fine vertical offset of the comfort dot (% of card height)


---

### 5. GUI Editor

## 🛠️ GUI Editor

- Entity pickers for temp/humidity/wind
- Inputs for decimals, RH calibration, vertical offset
- Button-based anchors for temperature bands (±0.1 °C, contiguous)
- Reset defaults
- Auto-pick first available temp/humidity entity if blank
- Colored value pills reflect comfort bands

## 📊 Comfort Bands (defaults)

| Band     | Min (°C) | Max (°C) |
|----------|----------|----------|
| FROSTY   | -40.0    | 2.9      |
| COLD     | 3.0      | 4.9      |
| CHILLY   | 5.0      | 8.9      |
| COOL     | 9.0      | 13.9     |
| MILD     | 14.0     | 18.9     |
| PERFECT  | 19.0     | 23.9     |
| WARM     | 24.0     | 27.9     |
| HOT      | 28.0     | 34.9     |
| BOILING  | 35.0     | 60.0     |

**Humidity words**
- DRY (< left threshold, default 40%)
- COMFY (between left/right thresholds, default 40–60%)
- HUMID (> right threshold, default 60%)

**Dew point words**
- Very Dry, Dry, Pleasant, Comfortable, Sticky Humid, Muggy, Sweltering, Stifling

## 🧪 How It Works

- **Buck vapour pressure (hPa):** piecewise exponential.
- **Dew point:** numeric inversion via bisection search.
- **Apparent Temperature (BoM):** `AT = T + 0.33e − 0.70ws − 4.0`.
- **Unit handling:**
  - Temp: °C or °F based on entity
  - Wind: auto-converts (m/s, km/h, mph, kn → m/s)
- **Y-mapping:** locked anchors for band edges (geometry-aware).

## 🎨 Styling Hooks

CSS variables:

- `--sac-scale` → typography scaling
- `--sac-temp-bg` → background gradient
- `--sac-dewpoint-ring` → outer ring gradient
- `--sac-inner-gradient` → inner circle gradient

Palette (overridable):
- `--sac-col-hot`
- `--sac-col-cold`
- `--sac-col-humid-alert`
- `--sac-col-inband`

## 🧱 Layout Hints

- `getCardSize()` → ≈3 (Masonry heuristic).
- `getGridOptions()` (Sections layout):
  - columns: 6 (min), 12 (max)
  - rows: auto (min 1, max 6)
- Card is **host-only** (no `<ha-card>`).
- Self-registers via `window.customCards.push(...)`.
- Logs version banner with `__VERSION__`.

## 🐞 Troubleshooting

- **Blank card:** Ensure `temperature` & `humidity` are set.
- **Weird “feels like”:** Check wind sensor unit or set `default_wind_speed`.
- **Dot offset:** Adjust `y_offset_pct`.
- **Humidity words off:** Adjust `rh_left_inner_pct` / `rh_right_inner_pct`.
- **Cache:** bump `?v=` in resource URL after updates.

## 🗺️ Road Map (planned)

- Multiple feels-like formulas (Heat Index, Wind Chill, Steadman)
- Alternative corner metrics (CO₂, TVOC, PM, HCHO, CO, windspeed display)
- Translations for corner labels and comfort words
- Imperial/metric toggle in editor
- Advanced calibration tools
- Optional theming presets

## 🤝 Contributing

PRs and issues welcome.  
Please:
- Show screenshots and config when reporting bugs
- Keep comfort bands contiguous with 0.1 °C gaps
- Avoid wrapping in `<ha-card>` — this card is host-only

## 📜 License

MIT License.
