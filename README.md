<img src="https://raw.githubusercontent.com/MankiniChykan/simple-air-comfort-card/v1.0.323/src/assets/icon.png" width="100" height="100" alt="Icon" />

# Simple Air Comfort Card

A **custom Lovelace card for Home Assistant** that visualizes indoor climate comfort on a square **dial** with a moving **comfort dot**.  
Dot position = **Relative Humidity** (X) + **Temperature** (Y). The card derives **dew point**, **Feels-like temperature**, comfort words, and color cues for instant, at-a-glance status.

> **Source of truth:** This README matches the current code. Anything not implemented lives under **Roadmap**.

<img src="https://raw.githubusercontent.com/MankiniChykan/simple-air-comfort-card/v1.0.323/src/assets/simple-air-comfort-card-example.png" width="635" height="952" alt="Icon" />

---

## UI‑First Card & YAML Policy

**This is a UI‑first card.** Use the built‑in editor to configure it. The editor is the *source of truth* and will **fix/normalize any YAML** you paste or previously saved:

- Writes configuration in **grouped YAML** sections:
  - `temperature_anchors`, `humidity_alert_anchors`, `card_options`
- **Repairs** values: rounds to **0.1 °C**, enforces **contiguous 0.1 °C gaps** between bands, and clamps editor +/- to **±`cap_degrees`** on non‑edge anchors.
- **Derives neighbors automatically** (`*_max`/`*_min`) so you only set the **10 anchors**.
- **Converts units** for default wind speed based on your selected `wind_display_unit` (internally uses m/s).
- **Handles legacy keys**: logs a console warning and ignores deprecated/alias keys (e.g., `t_perf_*` when `t_perfect_*` is present).
- **Persists grouped YAML** even if you entered flat keys — you’ll see grouped structure after saving.

You *can* hand‑edit YAML, but it’s optional. If you do, simply open the editor and click **Save** — it will normalize and persist the config in the supported shape.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Required Sensors](#required-sensors)
  - [Grouped YAML Structure](#grouped-yaml-structure)
  - [Temperature Presets & Anchors](#temperature-presets--anchors)
  - [Humidity Alert Anchors (RH → X calibration)](#humidity-alert-anchors-rh--x-calibration)
  - [Feels‑Like Modes](#feels-like-modes)
  - [Units & Formatting](#units--formatting)
  - [Advanced Options](#advanced-options)
  - [Full Example](#full-example)
- [Geometry & Scaling](#geometry--scaling)
- [Temperature Bands (Contiguous)](#temperature-bands-contiguous)
- [Edge Policy (Locked)](#edge-policy-locked)
- [Dew Point & Background Tints](#dew-point--background-tints)
- [Editor UI](#editor-ui)
- [Migration Guide](#migration-guide)
- [Accessibility](#accessibility)
- [Styling Hooks (CSS Custom Properties)](#styling-hooks-css-custom-properties)
- [Card Size Hints](#card-size-hints)
- [Developer Notes](#developer-notes)
- [How It’s Calculated (Formulas)](#how-its-calculated-formulas)
- [Credits & License](#credits--license)

---

## Features

- **Comfort Dot Dial**
  - **X = RH (%)** with calibrated inner-circle intersections (so your chosen RH targets line up with the “eye”).
  - **Y = Temperature** mapped across contiguous comfort bands **FROSTY→BOILING** using geometry-aware anchors.
  - Pulsing halo when conditions are **outside** comfort (too dry/humid or outside PERFECT temp band).

- **Dial UI**
  - Outer ring + inner “comfort eye”
  - Axis labels **glow** when too hot/cold or too dry/humid
  - Dot **pulses** when outside temp/RH comfort zone

- **Color Cues**
  - **Background** tints by temperature comfort.
  - **Outer ring** tints by dew-point comfort.
  - **Inner circle** blends humidity and “too hot/cold” signals.

- **Temperature-Tinted Icon Puck**
  - A new circular **“puck” layer** is drawn between the card background and all other elements.  
  - The puck glows with a **radial gradient** where the **first color stop matches the card’s current temperature background color**, so the glow always harmonizes with the climate band (Frosty → Boiling).
  - The puck can be positioned in three preset locations: left (default), right, bottom
  - An **MDI icon** is rendered inside the puck..

- **Selectable Icon**
  - The icon inside the puck can now be set via YAML or the UI editor.
  - Default: `mdi:home-account`.

- **Corner metrics**
  - **Top‑Left**: Dew Point
  - **Top‑Right**: Feels‑Like (BoM **Apparent Temperature** by default; Wind Chill / Heat Index / Humidex optional)
  - **Bottom‑Left**: Raw temperature (your display unit) + comfort word
  - **Bottom‑Right**: Relative Humidity (%) + comfort word

- **Physics & Units**
  - **Dew point:** Arden Buck saturation vapour pressure (numeric inversion).
  - **Feels-like modes:** Australian **BoM Apparent Temperature** (default), **Wind Chill**, **Heat Index**, **Humidex**.
  - **Unit handling:** Temp accepts °C/°F; wind accepts m/s, km/h, mph, kn (internally normalized).

- **Smart scaling**
  - Square stage via CSS `aspect-ratio`
  - Typography scales with card width using `--sac-scale` (baseline 300 px)

- **Sensible defaults**
  - **Presets**: `indoor` (default) or `outdoor`
  - **Contiguous temperature bands** with 0.1 °C gaps auto‑derived from **10 anchors**
  - RH → X mapping that hits your inner circle exactly at the two alert anchors

- **Editor (hosted in HA)**
  - Entity pickers (temperature, humidity, optional wind).
  - Feels-like formula selector.
  - Display unit preferences (temp: **auto/°C/°F**; wind default unit: **ms/kmh/mph/kn**).
  - RH calibration and vertical fine offset.
  - **10 temperature anchors** with ±4 °C caps on non-edge anchors; neighbors auto-derived with **0.1 °C gaps**.
  - Reset-to-defaults; auto-pick first sensible entities if blank.

---

## Installation

### HACS (recommended)

1. Add this repository to HACS (Custom repositories) or install from HACS if available.
2. Restart Home Assistant or reload Lovelace resources.

### Manual

1. Copy `simple-air-comfort-card.js` to:
   ```text
   config/www/simple-air-comfort-card.js
   ```
2. Add a Lovelace resource (Settings → Dashboards → ⋯ → **Resources**):
   - **URL**: `/local/simple-air-comfort-card.js`
   - **Type**: `Module`

---

## Quick Start

**USE THE EDITOR TO SETUP THE CARD IT WILL WRITE THE YAML FOR YOU**

Minimal config (temperature + humidity):

```yaml
type: custom:simple-air-comfort-card
name: Upstairs
temperature: sensor.upstairs_temperature
humidity: sensor.upstairs_humidity

# Optional conveniences
card_options:
  - icon: mdi:home-account
  - icon_position: left   # left | right | bottom
```

Add wind (sensor or fallback) to improve Feels‑Like:

```yaml
type: custom:simple-air-comfort-card
name: Upstairs
temperature: sensor.upstairs_temperature
humidity: sensor.upstairs_humidity
windspeed: sensor.lounge_wind            # optional
default_wind_speed: 0.1                  # unit shown via wind_display_unit
```

> The editor can also auto‑pick sensible entities the first time you open it.

---

## Configuration

### Required Sensors

- `temperature`: `sensor.*` (°C/°F accepted; display unit configurable)
- `humidity`: `sensor.*` (% 0–100)
- `windspeed` (optional): `sensor.*` in m/s, km/h, mph, or kn (internally converted to m/s)

### Grouped YAML Structure

The editor and card use **grouped YAML** for clarity:

- `temperature_anchors`: the **10** temperature anchor handles (plus `temp_preset` & `cap_degrees`)
- `humidity_alert_anchors`: the two RH alert points that also calibrate the inner circle intersections
- `card_options`: miscellaneous UI options

> You can still write flat keys — `setConfig()` flattens grouped input — but the editor **persists** grouped YAML on save.

| Option               | Type              |       Default | Description                                                      |
| -------------------- | ----------------- | ------------: | ---------------------------------------------------------------- |
| `type`               | string (required) |             — | Must be `custom:simple-air-comfort-card`.                        |
| `name`               | string            | `Air Comfort` | Title shown above the dial.                                      |
| `temperature`        | entity (required) |             — | Temperature sensor (°C/°F).                                      |
| `humidity`           | entity (required) |             — | Relative humidity sensor (0–100%).                               |
| `windspeed`          | entity            |             — | Wind speed sensor (optional).                                    |
| `feels_like`         | enum              |         `bom` | `bom`, `wind_chill`, `heat_index`, or `humidex`.                 |
| `temp_display_unit`  | enum              |        `auto` | `auto`, `c`, or `f` (display only).                              |
| `wind_display_unit`  | enum              |          `ms` | Display token for wind: `ms`, `kmh`, `mph`, `kn`.                |
| `default_wind_speed` | number            |         `0.1` | Fallback wind if no entity; interpreted via `wind_display_unit`. |
| `decimals`           | integer           |           `1` | Decimal places for temps and RH.                                 |
| `ring_pct`           | number (0–100)    |          `45` | Dial diameter as % of card.                                      |
| `inner_pct`          | number (0–100)    |        `46.5` | Inner circle diameter as % of dial.                              |
| `y_offset_pct`       | number            |           `0` | Fine vertical tweak (%) after temp mapping.                      |

### Temperature Presets & Anchors

Two presets seed the 10 anchors:

- `indoor` (default)
- `outdoor`

Anchors you set:

- `t_frosty_min`, `t_cold_min`, `t_chilly_min`, `t_cool_min`, `t_mild_min`,
- `t_perfect_min`, `t_perfect_max`, `t_warm_max`, `t_hot_max`, `t_boiling_max`

Neighbors (`*_max` / `*_min`) are **derived automatically** with **0.1 °C** gaps — no overlaps.

Configure via editor or YAML:

```yaml
temperature_anchors:
  - t_boiling_max: 42.0
  - t_hot_max: 31.0
  - t_warm_max: 26.0
  - t_perfect_max: 23.5
  - t_perfect_min: 20.5
  - t_mild_min: 18.0
  - t_cool_min: 16.0
  - t_chilly_min: 12.0
  - t_cold_min: 8.0
  - t_frosty_min: 0.0
  - cap_degrees: 6.0         # editor +/- safety cap for non-edge anchors
  - temp_preset: indoor      # or 'outdoor' Will change temperature anchors.
```

**Editor caps (`cap_degrees`)**  
The editor’s +/- buttons are clamped to ±`cap_degrees` from the preset’s default for **non‑edge** anchors. This is a **UI guardrail** — not applied to the two edges (`t_frosty_min`, `t_boiling_max`).

| Item key            | Type        | Default (by preset) | Description                                   |
| ------------------- | ----------- | ------------------: | --------------------------------------------- |
| `{ temp_preset }`   | enum        |            `indoor` | Seeds all anchors. `indoor` / `outdoor`.      |
| `{ t_boiling_max }` | number (°C) |              preset | Top of card (100%).                           |
| `{ t_hot_max }`     | number (°C) |              preset | Upper HOT edge.                               |
| `{ t_warm_max }`    | number (°C) |              preset | Upper WARM edge → **outer-top**.              |
| `{ t_perfect_max }` | number (°C) |              preset | Upper PERFECT edge → **inner-top**.           |
| `{ t_perfect_min }` | number (°C) |              preset | Lower PERFECT edge → **inner-bottom**.        |
| `{ t_mild_min }`    | number (°C) |              preset | Lower MILD edge → **outer-bottom**.           |
| `{ t_cool_min }`    | number (°C) |              preset | Lower COOL edge.                              |
| `{ t_chilly_min }`  | number (°C) |              preset | Lower CHILLY edge.                            |
| `{ t_cold_min }`    | number (°C) |              preset | Lower COLD edge.                              |
| `{ t_frosty_min }`  | number (°C) |              preset | Bottom of card (0%).                          |
| `{ cap_degrees }`   | number      |               `6.0` | **Editor only**: ±°C cap for the +/- buttons. |

### Humidity Alert Anchors (RH → X calibration)

These do double duty:

1. Define “**comfy**” RH (the inner‑eye band)  
2. Calibrate RH → X so the dot crosses the inner circle exactly at those RH values

```yaml
humidity_alert_anchors:
  - rh_left_inner_pct: 40
  - rh_right_inner_pct: 60
```

| Item key                 | Type           | Default | Description                                |
| ------------------------ | -------------- | ------: | ------------------------------------------ |
| `{ rh_left_inner_pct }`  | number (0–100) |    `40` | RH at **left** inner-circle intersection.  |
| `{ rh_right_inner_pct }` | number (0–100) |    `60` | RH at **right** inner-circle intersection. |

### Feels‑Like Modes

Choose with `feels_like`:

- `bom` (default): **Apparent Temperature** — T + RH (as vapour pressure) + wind
- `wind_chill`: T + wind (cold conditions)
- `heat_index`: T + RH (hot conditions; US NWS regression)
- `humidex`: T + RH (hot conditions; Environment Canada)

```yaml
feels_like: bom  # bom | wind_chill | heat_index | humidex
```

### Units & Formatting

- `temp_display_unit`: `auto` (use sensor unit), or force `c` / `f`
- `wind_display_unit`: one of `ms`, `kmh`, `mph`, `kn` (used for **display** of `default_wind_speed`)
- `default_wind_speed`: numeric fallback (internally converted to m/s)
- `decimals`: number of fractional digits for all readouts

```yaml
temp_display_unit: auto  # auto | c | f
wind_display_unit: ms    # ms | kmh | mph | kn
default_wind_speed: 0.1  # shown in the chosen wind_display_unit

card_options:
  - decimals: 1
```

| Item key            | Type    |            Default | Description                                            |
| ------------------- | ------- | -----------------: | ------------------------------------------------------ |
| `{ icon }`          | string  | `mdi:home-account` | MDI icon drawn in the tinted puck.                     |
| `{ icon_position }` | enum    |             `left` | `left`, `right`, or `bottom`.                          |
| `{ decimals }`      | integer |                `1` | Same as top-level `decimals` (either place works).     |
| `{ y_offset_pct }`  | number  |                `0` | Same as top-level `y_offset_pct` (either place works). |

### Full Example

```yaml
type: custom:simple-air-comfort-card
name: Upstairs

# Required entities
temperature: sensor.upstairs_temperature
humidity: sensor.upstairs_humidity

# Optional feels-like + wind
feels_like: bom            # bom | wind_chill | heat_index | humidex
windspeed: sensor.upstairs_wind_speed   # optional
wind_display_unit: ms      # ms | kmh | mph | kn
default_wind_speed: 0.1    # used if windspeed sensor is not set

# Display preferences
temp_display_unit: auto    # auto | c | f

# Temperature anchor preset + handles (grouped)
temperature_anchors:
  - temp_preset: indoor    # indoor | outdoor (seeds the defaults below)
  - t_boiling_max: 42.0
  - t_hot_max: 31.0
  - t_warm_max: 26.0
  - t_perfect_max: 23.5
  - t_perfect_min: 20.5
  - t_mild_min: 18.0
  - t_cool_min: 16.0
  - t_chilly_min: 12.0
  - t_cold_min: 8.0
  - t_frosty_min: 0.0
  - cap_degrees: 6.0       # UI editor ±°C cap for non-edge anchors

# Humidity alert thresholds (inner circle intersections)
humidity_alert_anchors:
  - rh_left_inner_pct: 40  # % where inner circle crosses on the left
  - rh_right_inner_pct: 60 # % where inner circle crosses on the right

# Card options group (visual/formatting)
card_options:
  - icon_position: left          # left | right | bottom
  - icon: mdi:home-account       # MDI icon shown in the puck
  - decimals: 1                  # decimals for temps/RH readouts
  - y_offset_pct: 0              # fine vertical dot tweak (-30..30)
```

---

## Geometry & Scaling

- Stage is always **1:1** (`aspect-ratio`)
- Text scales with `--sac-scale`, computed from card width (baseline 300 px)
- **Dial sizing**
  - `ring_pct`: dial box size (default **45%**)
  - `inner_pct`: inner circle size (default **46.5%** of dial)
- **RH → X mapping** (piecewise):
  - 0% RH → left edge
  - `rh_left_inner_pct` → inner‑circle left intersection
  - `rh_right_inner_pct` → inner‑circle right intersection
  - 100% RH → right edge

---

## Temperature Bands (Contiguous)

The Y mapping uses a **contiguous** ladder derived from **10 anchors**; all neighbors are automatically spaced with **0.1 °C** gaps (no overlaps).

Locked visual landmarks used by the Y mapping:

- `FROSTY.min` (bottom)
- `MILD.min` (outer‑bottom)
- `PERFECT.min` (inner‑bottom)
- `PERFECT.max` (inner‑top)
- `WARM.max` (outer‑top)
- `BOILING.max` (top)

`HOT.max` is placed **proportionally** between `WARM.max` and `BOILING.max` to smooth the top segment.

---

## Edge Policy (Locked)

- **Bottom of card (0%)** = `t_frosty_min`
- **Top of card (100%)**  = `t_boiling_max`

Do **not** substitute `frosty_max` / `boiling_min` for vertical extremes. The Y map’s endpoints are the two keys above.

---

## Dew Point & Background Tints

- **Outer ring** tints by dew point category.
- **Inner eye** tints by temperature (too cold/hot) and humidity (outside inner anchors).

Dew point labels:

| Dew Point (°C) | Label            |
| --- | --- |
| `< 5`          | Very Dry         |
| `≤ 10`         | Dry              |
| `≤ 12.79`      | Pleasant         |
| `≤ 15.49`      | Comfortable      |
| `≤ 18.39`      | Sticky Humid     |
| `≤ 21.19`      | Muggy            |
| `≤ 23.9`       | Sweltering       |
| `> 23.9`       | Stifling         |

---

## Editor UI

- Entities: name, temperature, humidity, optional wind
- Temperature Display Unit: `auto` / `°C` / `°F`
- **Temperature Anchors**: 10 handles with live derived neighbors
  - **Calculated PERFECT midpoint** shown read‑only
  - **Anchor Cap (±°C)** guard for the +/- buttons on non‑edge anchors
  - **Temperature Preset**: reseeds the 10 anchors (`indoor` / `outdoor`)
  - **Reset to defaults**: resets all 10 anchors to the **current preset**
- Humidity Alert Anchors: `rh_left_inner_pct`, `rh_right_inner_pct`
- Feels‑Like Formula: `bom` / `wind_chill` / `heat_index` / `humidex`
- Wind Display Unit + Default Wind
- Card Options: `icon`, `icon_position`, `decimals`, `y_offset_pct`

> The editor **persists** using the grouped YAML layout shown above and will normalize any flat/legacy YAML.

---

## Migration Guide

**USE THE EDITOR TO SETUP THE CARD IT WILL WRITE THE YAML FOR YOU**

**What changed** (compared to older versions):

1. **UI‑First + Grouped YAML**
   - New sections: `temperature_anchors`, `humidity_alert_anchors`, `card_options`
   - The card/editor read both grouped and flat, but the editor **writes grouped** and **normalizes** on save.

2. **10‑anchor model** with **auto‑derived neighbors**
   - Keep only these **10 keys** for temperature:  
     `t_frosty_min, t_cold_min, t_chilly_min, t_cool_min, t_mild_min, t_perfect_min, t_perfect_max, t_warm_max, t_hot_max, t_boiling_max`
   - Remove legacy/derived keys like `t_frosty_max`, `t_warm_min`, `t_boiling_min` (the card derives them).
   - If both `t_perfect_*` and `t_perf_*` are present, `t_perfect_*` **wins**.

3. **Presets** (`temp_preset`) replace implicit defaults.

4. **Editor Caps** (`cap_degrees`) replace fixed per‑field caps.

**Before (flat)**

```yaml
type: custom:simple-air-comfort-card
t_perfect_min: 20.5
t_perfect_max: 23.5
t_warm_max: 26
t_hot_max: 31
t_boiling_max: 42
# ...etc...
```

**After (grouped)**

```yaml
type: custom:simple-air-comfort-card
temperature_anchors:
  - t_boiling_max: 42.0
  - t_hot_max: 31.0
  - t_warm_max: 26.0
  - t_perfect_max: 23.5
  - t_perfect_min: 20.5
  - t_mild_min: 18.0
  - t_cool_min: 16.0
  - t_chilly_min: 12.0
  - t_cold_min: 8.0
  - t_frosty_min: 0.0
  - cap_degrees: 6.0
  - temp_preset: indoor
```

The card logs a **console warning** if legacy keys are detected so you can prune them.

---

## Accessibility

- The dial, axes, and key elements have ARIA labels.
- Axis labels glow on breach for additional non‑numeric cues.

---

## Styling Hooks (CSS Custom Properties)

Theme the card via CSS variables:

```css
/* Host */
simple-air-comfort-card {
  --sac-scale: 1;                  /* typography scale (auto set by card)           */
  --sac-temp-bg: #2a2a2a;          /* card background (auto tints by temperature)   */
  --sac-ring-border-base: 2.5px;   /* base thickness of outer ring border           */

  /* Palette used by inner gradient and axis glows */
  --sac-col-hot: rgba(255, 69, 0, 0.95);
  --sac-col-cold: rgba(0, 102, 255, 0.95);
  --sac-col-humid-alert: hotpink;
  --sac-col-inband: dimgray;

  /* Optional: center label colour used in the editor preview pill */
  --sac-center-green: #8ef0ae;
}
```

---

## Card Size Hints

The card exposes layout hints that Home Assistant may use:

- `getCardSize()` → ~3 masonry rows
- `getGridOptions()` → default 6 columns wide (12‑column grid), rows `auto`

---

## Developer Notes

- `src/simple-air-comfort-card.ts` is the Rollup entry point that wires the card and editor together and registers the custom elements.
- The card implementation lives in `src/card/` (dial physics, rendering, shared styles, and helpers).
- The GUI editor lives in `src/editor/` and imports the shared helpers so UI tweaks stay isolated from the runtime card.
- The build now compiles the TypeScript sources to `build/` via `npm run compile` (automatically executed by `npm run build`) before bundling with Rollup. The generated `dist/` bundle is git‑ignored so pull requests stay source-only, but the release workflow still ships plain JavaScript compatible with Home Assistant.
- Release commands (`npm run build && npm run release:dev -- <version>` and `npm run build && npm run release -- <version>`) use `github-release-helper.js`, which stages the source/docs changes and uploads the freshly built `dist/` assets to GitHub releases, so no extra steps are required.

---

## How It’s Calculated (Formulas)

- **Saturation vapour pressure** (Arden **Buck**)
- **Dew point**: bisection search inverts Buck to solve `es(T) = e`
- **BoM Apparent Temperature**: `AT = T + 0.33·e − 0.70·WS − 4.0`
  - `T` in °C, `e` in hPa, `WS` in m/s
- **Wind Chill** (NWS/Environment Canada): °C with wind in km/h
- **Heat Index** (Rothfusz) in °F then converted back to °C
- **Humidex**: `T + 0.5555 · (e − 10)` with `e` in hPa

All internal physics normalize units:

- Temperatures in °C
- Wind speed in m/s
- Vapour pressure in hPa

---

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

- **MOST PROBLEMS** Add the card from the UI and adjust all settings in the UI. Hit Save and the UI will produce the YAML.
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
