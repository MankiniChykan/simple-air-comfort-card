import { RingTile } from "./simple-air-comfort";
import { addFonts } from "./helpers/ringTileFonts";
import { RtInfo } from "./rt-info";
import { RtRing } from "./rt-ring";
import { RtRingSvg } from "./rt-ring-svg";
import * as pkg from "../package.json";

console.info(
  `%c simple-air-comfort-card %c v${pkg.version} `,
  'color: yellow; font-weight: bold; background: darkblue',
  'color: white; font-weight: bold; background: dimgray',
);

addFonts();

customElements.define("simple-air-comfort", RingTile);
customElements.define("rt-info", RtInfo);
customElements.define("rt-ring", RtRing);
customElements.define("rt-ring-svg", RtRingSvg);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "simple-air-comfort",
  name: "Simple Air Comfort Card",
  preview: true,
  description:
    "Add a ring to your sensor tile cards to visualise sensor state.",
});
