import { SimpleAirComfortCard } from './card/simple-air-comfort-card';
import { SimpleAirComfortCardEditor } from './editor/simple-air-comfort-card-editor';

if (!customElements.get('simple-air-comfort-card')) {
  customElements.define('simple-air-comfort-card', SimpleAirComfortCard);
}

if (!customElements.get('simple-air-comfort-card-editor')) {
  customElements.define('simple-air-comfort-card-editor', SimpleAirComfortCardEditor);
}

const SAC_CARD_VERSION = '__VERSION__';

window.customCards ??= [];
window.customCards.push({
  type: 'simple-air-comfort-card',
  name: 'Simple Air Comfort Card',
  description: 'Dew point + AT dial, comfort words, moving dot.',
  preview: true,
  documentationURL: 'https://github.com/MankiniChykan/simple-air-comfort-card'
});

console.info(
  `%c SIMPLE AIR COMFORT CARD %c v${SAC_CARD_VERSION} `,
  'color:white;background:#2a2a2a;padding:2px 6px;border-radius:4px 0 0 4px;',
  'color:#2a2a2a;background:#c9c9c9;padding:2px 6px;border-radius:0 4px 4px 0;'
);

export { SimpleAirComfortCard, SimpleAirComfortCardEditor };
