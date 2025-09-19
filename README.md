<img src="https://raw.githubusercontent.com/MankiniChykan/simple-air-comfort-card/v1.0.323/src/assets/icon.png" width="100" height="100" alt="Icon" />

# Simple Air Comfort Card

A **custom Lovelace card for Home Assistant** that visualizes indoor climate comfort on a square **dial** with a moving **comfort dot**.  
Dot position = **Relative Humidity** (X) + **Temperature** (Y). The card derives **dew point**, **Feels-like temperature**, comfort words, and color cues for instant, at-a-glance status.

> **Source of truth:** This README matches the current code. Anything not implemented lives under **Roadmap**.

<img src="https://raw.githubusercontent.com/MankiniChykan/simple-air-comfort-card/v1.0.323/src/assets/simple-air-comfort-card-example.png" width="635" height="952" alt="Icon" />

---

## ✨ Features (implemented)

- **Comfort Dot Dial**
  - **X = RH (%)** with calibrated inner-circle intersections (so your chosen RH targets line up with the “eye”).
  - **Y = Temperature** mapped across contiguous comfort bands **FROSTY→BOILING** using geometry-aware anchors.
  - Pulsing halo when conditions are **outside** comfort (too dry/humid or outside PERFECT temp band).

- **Color Cues**
  - **Background** tints by temperature comfort.
  - **Outer ring** tints by dew-point comfort.
  - **Inner circle** blends humidity and “too hot/cold” signals.

- **Corner Stats**
  - **TL:** Dew point  
  - **TR:** Feels-like (label shows formula, e.g. *BoM AT*, *Wind Chill*, *Heat Index*, *Humidex*)  
  - **BL:** Raw temperature + comfort word  
  - **BR:** Humidity + comfort word

- **Physics & Units**
  - **Dew point:** Arden Buck saturation vapour pressure (numeric inversion).
  - **Feels-like modes:** Australian **BoM Apparent Temperature** (default), **Wind Chill**, **Heat Index**, **Humidex**.
  - **Unit handling:** Temp accepts °C/°F; wind accepts m/s, km/h, mph, kn (internally normalized).

- **Responsive & Accessible**
  - 1:1 square stage (CSS `aspect-ratio`).
  - Typography scales with `--sac-scale` (via a `ResizeObserver`).
  - ARIA labels on dial and axes (“Warm”, “Cold”, “Dry”, “Humid”) and glow effects when out of bounds.

- **Editor (hosted in HA)**
  - Entity pickers (temperature, humidity, optional wind).
  - Feels-like formula selector.
  - Display unit preferences (temp: **auto/°C/°F**; wind default unit: **ms/kmh/mph/kn**).
  - RH calibration and vertical fine offset.
  - **10 temperature anchors** with ±4 °C caps on non-edge anchors; neighbors auto-derived with **0.1 °C gaps**.
  - Reset-to-defaults; auto-pick first sensible entities if blank.

- **Host-only Card**
  - No `<ha-card>` wrapper. The card provides its own background via `--sac-temp-bg`.

## 📦 Installation

### HACS (recommended)
1. Open **HACS → Frontend → Custom repositories**.
2. Add: `https://github.com/MankiniChykan/simple-air-comfort-card`
3. Type: **Dashboard**
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
**Recommended:**
```yaml
type: custom:simple-air-comfort-card
name: Living Room

temperature: sensor.living_temperature
temp_display_unit: auto            # 'auto' | 'c' | 'f'

temperature_anchors:               # 10 exposed anchors (°C)
  - t_frosty_min: 0.0
  - t_cold_min: 3.0
  - t_chilly_min: 5.0
  - t_cool_min: 9.0
  - t_mild_min: 14.0
  - t_perfect_min: 19.0
  - t_perfect_max: 23.9
  - t_warm_max: 27.9
  - t_hot_max: 34.9
  - t_boiling_max: 50.0

humidity: sensor.living_humidity
humidity_alert_anchors:
  - rh_left_inner_pct: 40          # inner circle left (%)
  - rh_right_inner_pct: 60         # inner circle right (%)

feels_like: bom                    # 'bom' | 'wind_chill' | 'heat_index' | 'humidex'

windspeed: sensor.living_wind      # optional
wind_display_unit: ms              # 'ms' | 'kmh' | 'mph' | 'kn'
default_wind_speed: 0.1            # shown in the chosen display unit; converted to m/s internally

card_options:
  - decimals: 1
  - y_offset_pct: 0                # fine vertical tweak for the dot
```
The card accepts flat keys too; the editor writes grouped sections (temperature_anchors, humidity_alert_anchors, card_options). Either shape is supported.

## ⚙️ Configuration Options

### Required
- **temperature** — sensor entity (reports °C or °F)  
- **humidity** — sensor entity (reports %)

### Optional
- `name` — small title at the top
- `feels_like` — bom (default) | wind_chill | heat_index | humidex
- `decimals` — integer 0–3 (default: 1)
- `temp_display_unit` — auto (follow sensor), or override with c/f
- `rh_left_inner_pct`/`rh_right_inner_pct` — map inner circle intersections (%, default 40/60)
- `y_offset_pct` — fine vertical offset for the dot (%, default 0)

**Wind:**
- `windspeed` — wind speed sensor (optional)
- `wind_display_unit` — ms | kmh | mph | kn (used for the editor display of default_wind_speed)
- `default_wind_speed` — fallback when no wind entity; shown in the chosen display unit, converted to m/s internally

### Advanced (rarely needed)
- `ring_pct` — dial box size as % of card (default 45)
- `inner_pct` — inner circle size as % of dial (default 46.5)

---

### 5. GUI Editor

## 🛠️ GUI Editor

- Entity pickers for temperature/humidity/wind (auto-picks sensible defaults once).
- Choose feels-like formula; set display units for temp and default wind.
- Inputs for decimals, RH calibration, vertical offset.
- **Temperature anchors panel** (10 anchors). 
  - Non-edge anchors are limited to ±4 °C from defaults; neighbors auto-derive with 0.1 °C gaps (no overlaps).
  - Calculated PERFECT midpoint is shown read-only.
  - Reset to defaults button.
  - Colored value pills match each band for quick context.

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

**Buck vapour pressure (hPa)** — piecewise exponential.
**Dew point** — numeric inversion (bisection) on Buck.
**Feels-like (BoM)** — `AT = T + 0.33e − 0.70·WS − 4.0` (T in °C, `e` in hPa from RH, `WS` in m/s).
- Alternative modes: Wind Chill, Heat Index, Humidex.
**Unit handling**
- **Temp:** accepts °C or °F (display can follow sensor or force °C/°F).
- **Wind:** m/s, km/h, mph, kn accepted; all converted to m/s internally.
**RH→X mapping** Humidity Alert Anchors
- Linear across four segments so that `rh_left_inner_pct` and `rh_right_inner_pct` land exactly on the inner circle intersections while preserving 0 % at left edge and 100 % at right edge.
**Temp→Y mapping**
- Smooth on outer spans; linear inside the ring; locked endpoints at `t_frosty_min` and `t_boiling_max`.

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
**WARNING!** Do not use the GUI to change the layout option in the card or add them via YAML. In GUI mode hit save and the card will delete those options.
- `getGridOptions()` (Sections layout):
  - columns: 6 (min), 12 (max)
  - rows: auto (min 1, max 6)
- Card is **host-only** (no `<ha-card>`).
- Self-registers via `window.customCards.push(...)`.
- Logs version banner with `__VERSION__`.

## 🐞 Troubleshooting

- **Blank card:** Ensure `temperature` & `humidity` are set.
- **Weird “feels like”:** Check wind sensor unit or set `default_wind_speed`.
- **Dot vertical feels shifted:** Adjust `y_offset_pct`. But just setting your temperature map correctly will fix.
- **Humidity words off:** Adjust `rh_left_inner_pct` / `rh_right_inner_pct`.

## 🗺️ Road Map (planned)

- Alternative corner metrics for top left corner (CO₂, TVOC, PM, HCHO, CO, windspeed display)
- Colour maps applied to Inner Eye Ring Gradient for top left corner metrics
- Translations for corner labels and comfort words
- Advanced calibration tools in the editor
- Optional theming presets
- Background SVG icon bottom left corner to make the room more obvious from a distance

## 🤝 Contributing

PRs and issues welcome.  
Please:
- Show screenshots and config when reporting bugs
- Keep comfort bands contiguous with 0.1 °C gaps
- Avoid wrapping in `<ha-card>` — this card is host-only

## 📜 License

MIT License.
