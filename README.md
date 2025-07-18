Simple Air Comfort Card
A fully dynamic, visually responsive Home Assistant Lovelace card for visualizing thermal and humidity comfort using temperature, humidity, and dew point.



✨ Features
Comfort zone visualization with animated floating dot

Blinking alert when readings are outside the comfort zone

Dynamic background and ring gradients for temperature and dew point

Custom comfort texts for temperature, humidity, and dew point

Responsive layout with metric chips

CO₂ display (optional)

Full JavaScript (LitElement) rewrite — no templates or picture-elements required

Color overrides via card config

HACS-ready structure with GitHub Actions CI and release workflow

🛠 Installation
Via HACS (recommended)
Go to HACS > Frontend > Custom Repositories

Add: https://github.com/MankiniChykan/simple-air-comfort-card as a Lovelace repo

Install Simple Air Comfort Card

Add to your Lovelace resources:

yaml
Copy
Edit
url: /hacsfiles/simple-air-comfort-card/simple-air-comfort-card.js
type: module
Manual
Download simple-air-comfort-card.js from the dist/ folder

Place it in www/simple-air-comfort-card/ inside Home Assistant config

Add to Lovelace resources:

yaml
Copy
Edit
url: /local/simple-air-comfort-card/simple-air-comfort-card.js
type: module
🧾 Lovelace Example
yaml
Copy
Edit
type: custom:simple-air-comfort-card
temperature: sensor.living_temperature
humidity: sensor.living_humidity
co2: sensor.living_co2
colorOverrides:
  dotNormal: "#00ff00"
  dotAlert: "#ff0000"
  temperatureMap:
    HOT: "#ff5722"
  dewpointMap:
    "MUGGY": "#ffa500"
🔧 Required Sensors
sensor.living_temperature → temperature in °C

sensor.living_humidity → relative humidity %

Optional: sensor.living_co2

For dew point, no separate sensor is required — the card computes it internally.

🎨 Configuration Options
Option	Description	Required
temperature	Entity ID for temperature sensor	✅
humidity	Entity ID for humidity sensor	✅
co2	CO₂ sensor (ppm)	❌
colorOverrides	Customize alert and gradient colors	❌

🧠 How It Works
Uses Buck dew point formula internally

Categorizes comfort levels based on temperature/humidity breakpoints

Dot moves according to live readings and blinks on alert

Radial gradients adapt the background and outer ring

Entire UI is rendered in Lit without dependencies

📦 Developer Notes
This card is built using LitElement and bundled via esbuild.

To build:

bash
Copy
Edit
npm install
npm run build
📮 Feedback & Contributions
Open issues or PRs directly on GitHub.

This project is tailored for serious climate tinkerers — if you're using advanced climate macros, this card is for you.

Would you like me to generate the assets/example-card.png or include GitHub badges (build status, HACS compatibility, license, etc.)?

