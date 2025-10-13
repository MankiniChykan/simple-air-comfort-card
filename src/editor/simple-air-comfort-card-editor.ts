import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { fireEvent } from '../card/events';
import { TEMP_PRESETS, normalizePreset } from '../card/constants';
import type { HomeAssistant } from '../types/home-assistant';
import type { SimpleAirCardConfig } from '../types/simple-air-card-config';

export class SimpleAirComfortCardEditor extends LitElement {
  private _config?: (SimpleAirCardConfig & Record<string, unknown>);
  private _defaults: Record<string, number>;
  private _hass?: HomeAssistant;
  private _autoPicked = false;

  constructor() {
    super();
    this._defaults = {};
  }

  static properties = { hass:{type:Object}, _config:{state:true}, };
  static styles = css`
    .wrap{ padding:12px 12px 16px; }
    .row{
      /* title | value | buttons */
      display:grid;
      grid-template-columns:1fr auto auto; /* title | value | button group */
      align-items:center;
      gap:10px;
      padding:8px 0;
    }
    .panel {
      border: 1px solid var(--divider-color, #444);
      border-radius: 10px;
      margin: 8px 0 14px;
    }
    .panel > summary {
      cursor: pointer;
      padding: 10px 12px;
      font-weight: 600;
      list-style: none;
    }
    .panel[open] > summary {
      border-bottom: 1px solid var(--divider-color, #444);
    }
    .panel > *:not(summary) {
      padding: 10px 12px;
    }
    .name{ font-weight:600; }
    .helper{ grid-column:1 / -1; opacity:.8; font-size:.92em; margin:-2px 0 4px; }
    .btn{
      appearance:none;
      border:1px solid var(--divider-color, #444);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.08));
      color:var(--primary-text-color,#fff);
      padding:6px 10px;
      border-radius:10px;
      font-weight:600;
      cursor:pointer;
      display:inline-flex;
      align-items:center;
      gap:8px;
      box-shadow: 0 1px 0 rgba(255,255,255,.06) inset,
                  0 1px 8px rgba(0,0,0,.15);
      transition: transform .05s ease, box-shadow .15s ease, background .2s ease, opacity .2s ease;
    }
    .btn svg{ width:16px; height:16px; display:block; }
    /* icon-only button sizing */
    .btn.icon{
      width:34px;
      height:34px;
      padding:0;
      justify-content:center;
    }
    .btn:hover{
      box-shadow: 0 1px 0 rgba(255,255,255,.08) inset,
                  0 2px 12px rgba(0,0,0,.25);
    }
    .btn:active{ transform:translateY(1px); }
    .btn:focus-visible{
      outline:2px solid transparent;
      box-shadow:
        0 0 0 2px rgba(255,255,255,.15) inset,
        0 0 0 2px rgba(255,255,255,.15),
        0 0 0 4px rgba(3,169,244,.45);
    }
    .btn.ghost{
      background:transparent;
      border-color:rgba(255,255,255,.15);
    }
    .btn[disabled]{ opacity:.45; cursor:not-allowed; box-shadow:none; }
    .seg{ display:flex; gap:8px; justify-self:end; }  /* keep the buttons on the right */
    .value{
      font-variant-numeric:tabular-nums;
      font-weight:700;
      padding:2px 8px;
      border-radius:8px;
      background:rgba(255,255,255,.06);
      justify-self:end;   /* push the pill to the right edge of its grid cell */
      text-align:right;   /* align digits inside the pill to the right */
      min-width:6ch;      /* keeps width stable as numbers change */
      margin-right:2px;   /* tiny breathing room before the buttons */
      white-space:nowrap; /* prevent "°C" wrapping to next line */
    }
    /* band-tinted value pill (uses --pill-col provided inline) */
    .value.coloured{
      color: var(--pill-col);
      /* modern browsers: soft fill + subtle border from band color */
      background: color-mix(in srgb, var(--pill-col) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pill-col) 45%, transparent);
    }
    /* Center row styling (green) */
    .name--center{ color: var(--sac-center-green, #8ef0ae); font-weight:700; }
    .value--center{
      background: rgba(76,175,80,.18);
      color: var(--sac-center-green, #8ef0ae);
      box-shadow: inset 0 0 0 1px rgba(76,175,80,.35);
    }
    /* Placeholder segment to keep grid alignment without visible buttons */
    .seg--ghost{ visibility:hidden; }
    .title{ font-size:0.95em; opacity:.85; margin:12px 0 6px; }
    .actions{ display:flex; gap:8px; margin-top:10px; }
    .danger{ border-color:#a33; color:#fff; background:#702; }
  `;
  connectedCallback(){ super.connectedCallback(); window.loadCardHelpers?.().catch(()=>{}); }

  // When HA injects hass, we try to auto-pick temperature & humidity once
  // --- NEW: editor cap degrees (default ±6 °C); overridable via cap_degrees
  _capDegrees(): number {
    const v = Number(this._config?.cap_degrees);
    // clamp to a sensible range to avoid silly values
    return Number.isFinite(v) ? Math.max(0, Math.min(20, v)) : 6.0;
  }

  set hass(h: HomeAssistant | undefined){
    this._hass = h;
    this._autoFillDefaults(); // fill only if empty, only once
    this.requestUpdate();
  }
  get hass(): HomeAssistant | undefined { return this._hass; }

  // Build default config and keep default anchors for default ±6°C cap_degrees
  setConfig(config: Partial<SimpleAirCardConfig> & Record<string, unknown>){
    // --- NEW: accept grouped YAML and flatten it so the editor fields populate
    const asKV = (x) => {
      if (!x) return {};
      if (Array.isArray(x)) {
        const out = {};
        for (const item of x) if (item && typeof item === 'object') Object.assign(out, item);
        return out;
      }
      return typeof x === 'object' ? x : {};
    };
    const tAnch = asKV(config?.temperature_anchors);
    const hAnch = asKV(config?.humidity_alert_anchors);
    const card  = asKV(config?.card_options);
    const normalized = { ...(config ?? {}), ...tAnch, ...hAnch, ...card };
    const temp_preset = normalizePreset(normalized?.temp_preset);
    const BASE = TEMP_PRESETS[temp_preset];
    // -----------------------------------------------------------------------

    this._config = {
      name:'Area Name',
      temperature: undefined, humidity: undefined, windspeed: undefined,
      temp_display_unit:'auto',   // 'auto' | 'c' | 'f'
      wind_display_unit:'ms',     // 'ms' | 'kmh' | 'mph' | 'kn'
      feels_like:'bom',
      decimals:1, default_wind_speed:0.1,
      cap_degrees:6.0,
      temp_preset,
      icon_position:'left',

      // Comfort anchors (seed from preset; neighbors are derived below)
      t_frosty_min:  BASE.t_frosty_min,
      t_cold_min:    BASE.t_cold_min,
      t_chilly_min:  BASE.t_chilly_min,
      t_cool_min:    BASE.t_cool_min,
      t_mild_min:    BASE.t_mild_min,
      t_perfect_min: BASE.t_perfect_min,
      t_perfect_max: BASE.t_perfect_max,
      t_warm_max:    BASE.t_warm_max,
      t_hot_max:     BASE.t_hot_max,
      t_boiling_max: BASE.t_boiling_max,

      // Optional geometry calibration
      y_offset_pct: 0,

      // RH→X calibration (defaults)
      rh_left_inner_pct: 40.0,
      rh_right_inner_pct: 60.0,

      ...normalized,
    } as (SimpleAirCardConfig & Record<string, unknown>);

    // Capture defaults for default ±6°C movement cap_degrees (non-edge anchors)
    // Replace defaults with the chosen preset’s baseline
    this._defaults = {
      hot_max: BASE.t_hot_max,
      warm_max: BASE.t_warm_max,
      perf_max: BASE.t_perfect_max,
      perf_min: BASE.t_perfect_min,
      perfect_max: BASE.t_perfect_max,
      perfect_min: BASE.t_perfect_min,
      mild_min: BASE.t_mild_min,
      cool_min: BASE.t_cool_min,
      chilly_min: BASE.t_chilly_min,
      cold_min: BASE.t_cold_min,
    };
    // Derive neighbors for helpers (min/max with 0.1 °C gaps)
    this._config = this._applyTempsRowBiDirectional(this._config);
  }

   
  // --- Helper: reseed all 10 anchors from a preset and push live update ---
  _reseedAnchorsFromPreset(nextPreset){
    const temp_preset = normalizePreset(nextPreset);
    const BASE = TEMP_PRESETS[temp_preset];

    // 1) replace the 10 anchors with the preset’s baseline
    const out = { ...(this._config || {}) };
    out.temp_preset   = temp_preset;
    out.t_boiling_max = BASE.t_boiling_max;
    out.t_hot_max     = BASE.t_hot_max;
    out.t_warm_max    = BASE.t_warm_max;
    out.t_perfect_max = BASE.t_perfect_max;
    out.t_perfect_min = BASE.t_perfect_min;
    out.t_mild_min    = BASE.t_mild_min;
    out.t_cool_min    = BASE.t_cool_min;
    out.t_chilly_min  = BASE.t_chilly_min;
    out.t_cold_min    = BASE.t_cold_min;
    out.t_frosty_min  = BASE.t_frosty_min;

    // 2) refresh caps center (defaults) to the new preset
    this._defaults = {
      hot_max: BASE.t_hot_max,
      warm_max: BASE.t_warm_max,
      perf_max: BASE.t_perfect_max,
      perf_min: BASE.t_perfect_min,
      perfect_max: BASE.t_perfect_max,
      perfect_min: BASE.t_perfect_min,
      mild_min: BASE.t_mild_min,
      cool_min: BASE.t_cool_min,
      chilly_min: BASE.t_chilly_min,
      cold_min: BASE.t_cold_min,
    };

    // 3) re-derive neighbors (no caps here) and push to HA
    this._config = this._applyTempsRowBiDirectional(out, [
      't_boiling_max','t_hot_max','t_warm_max','t_perfect_max','t_perfect_min',
      't_mild_min','t_cool_min','t_chilly_min','t_cold_min','t_frosty_min'
    ]);
    fireEvent(this, 'config-changed', { config: this._persistKeys(this._config) });
  }


  // Render button UI for anchors + small ha-form for entities/misc
  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const capStr = `${this._capDegrees().toFixed(1)}°C`;

    return html`
      <div class="wrap">
        <!-- Entities -->
        <div class="title">Card Title</div>

        <!-- Name + Temperature entity -->
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            { name:'name', selector:{ text:{} } },
            { name:'temperature', required:true, selector:{ entity:{ domain:'sensor', device_class:'temperature' } } },
          ]}
          .computeLabel=${this._label}
          .computeHelper=${this._helper}
          @value-changed=${this._onMiscChange}>
        </ha-form>

        <!-- Temperature Unit (after temperature) -->
        <details class="panel">
          <summary>Temperature Display Unit</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'temp_display_unit',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'auto', label:'Auto (follow sensor)' },
                  { value:'c',    label:'Celsius (°C)' },
                  { value:'f',    label:'Fahrenheit (°F)' },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Temperature Anchors (dropdown under Temperature entity) -->
        <details class="panel">
          <summary>Temperature Anchors</summary>

          ${this._anchorRow('t_boiling_max', 'BOILING.max → Top of Card (100%)',
            html`Changes how far (HOT.max) is from the edge of the card.<br>${this._slimDerivedHelper('t_hot_max')}`, false)}
          ${this._anchorRow('t_hot_max', 'HOT.max (Scales with BOILING.max)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_warm_max')}`, true)}
          ${this._anchorRow('t_warm_max', 'WARM.max → Outer Ring Top',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_perfect_max')}`, true)}
          ${this._anchorRow('t_perfect_max', 'PERFECT.max → Inner Comfort Circle Top',
            html`High Temperature Alert :<br>Cap ±${capStr} from default.`, true)}

          ${(() => {
            const center = this._centerTemp();
            const min = Number(this._config?.t_perfect_min);
            const max = Number(this._config?.t_perfect_max);
            const helper = (Number.isFinite(min) && Number.isFinite(max))
              ? html`Midpoint of PERFECT band: (${min.toFixed(1)} → ${max.toFixed(1)}).<br>Updates automatically when either edge changes.`
              : html`Read-only. Midpoint of PERFECT band. Set PERFECT.min and PERFECT.max to compute.`;
            return html`
              <div class="row">
                <div class="name name--center">Calculated PERFECT midpoint</div>
                <div class="value value--center" title=${center}>${center}</div>
                <div class="seg seg--ghost"><button class="btn icon" aria-hidden="true"></button></div>
                <div class="helper">${helper}</div>
              </div>
            `;
          })()}

          ${this._anchorRow('t_perfect_min', 'PERFECT.min → Inner Comfort Circle Bottom',
            html`Low Temperature Alert Limit :<br>Cap±${capStr} from default. ${this._slimDerivedHelper('t_perfect_min')}`, true)}
          ${this._anchorRow('t_mild_min', 'MILD.min → Outer Ring Bottom',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_mild_min')}`, true)}
          ${this._anchorRow('t_cool_min', 'COOL.min (Scales with FROSTY.min)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_cool_min')}`, true)}
          ${this._anchorRow('t_chilly_min', 'CHILLY.min (Scales with FROSTY.min)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_chilly_min')}`, true)}
          ${this._anchorRow('t_cold_min', 'COLD.min (Scales with FROSTY.min)',
            html`Cap ±${capStr} from default. ${this._slimDerivedHelper('t_cold_min')}`, true)}
          ${this._anchorRow('t_frosty_min', 'FROSTY.min → Bottom of Card (0%)',
            'Changes how far (COOL.min → COLD.min) is from the edge of the card.', false)}

          <!-- Temperature Comfort Scale Preset (just above Reset) -->
          <div class="title">Temperature Comfort Scale Preset</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'temp_preset',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'indoor',  label:'Indoor Temp Comfort Scale' },
                  { value:'outdoor', label:'Outdoor Temp Comfort Scale' },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>

          <div class="actions">
            <button class="btn danger" @click=${this._resetDefaults}>Default Current Preset</button>
          </div>

          <!-- NEW: Anchor Cap (±°C) — placed below all band rows, above Reset -->
          <div class="title">Anchor Cap (±°C)</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'cap_degrees',
                selector:{ number:{ min:0, max:20, step:0.5, mode:'box', unit_of_measurement:'°C' } }
              },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Humidity entity ONLY (so we can place anchors directly below it) -->
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            { name:'humidity', required:true, selector:{ entity:{ domain:'sensor', device_class:'humidity' } } },
          ]}
          .computeLabel=${this._label}
          .computeHelper=${this._helper}
          @value-changed=${this._onMiscChange}>
        </ha-form>

        <!-- Humidity Alert Anchors (immediately below Humidity entity) -->
        <details class="panel">
          <summary>Humidity Alert Anchors</summary>
          ${this._rhRow('rh_left_inner_pct',  'Low Humidity Alert (%)')}
          ${this._rhRow('rh_right_inner_pct', 'High Humidity Alert (%)')}
        </details>

          <!-- Feels Like (still "under humidity") -->
        <details class="panel">
          <summary>Feels Like Formula</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'feels_like',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'bom',        label:'Apparent Temperature (BoM, T+RH+Wind)' },
                  { value:'wind_chill', label:'Wind Chill (T+Wind, cold)' },
                  { value:'heat_index', label:'Heat Index (T+RH, hot)' },
                  { value:'humidex',    label:'Humidex (T+RH, hot)' },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Wind entity + default wind speed (default sits under windspeed) -->
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            { name:'windspeed', selector:{ entity:{ domain:'sensor', device_class:'wind_speed' } } },
            { name:'default_wind_speed', selector:{ number:{
                min:0, max:200, step:0.1, mode:'box',
                unit_of_measurement: ({ ms:'m/s', kmh:'km/h', mph:'mph', kn:'kn' }[this._config?.wind_display_unit || 'ms'])
            } } },
          ]}
          .computeLabel=${this._label}
          .computeHelper=${this._helper}
          @value-changed=${this._onMiscChange}>
        </ha-form>

        <!-- Wind Unit -->
        <details class="panel">
          <summary>Wind Display Unit</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'wind_display_unit',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'ms',  label:'m/s'  },
                  { value:'kmh', label:'km/h' },
                  { value:'mph', label:'mph'  },
                  { value:'kn',  label:'kn'   },
                ]}} },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>

        <!-- Card Options -->
        <details class="panel">
          <summary>Card Options</summary>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              { name:'icon', selector:{ icon:{} } },
              { name:'icon_position',
                selector:{ select:{ mode:'dropdown', options:[
                  { value:'left',   label:'Left (default)' },
                  { value:'right',  label:'Right' },
                  { value:'bottom', label:'Bottom' },
                ]}} },
              { name:'decimals', selector:{ number:{ min:0, max:3, step:1, mode:'box' } } },
              { name:'y_offset_pct', selector:{ number:{ min:-30, max:30, step:0.5, mode:'box', unit_of_measurement:'%' } } },
            ]}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onMiscChange}>
          </ha-form>
        </details>
      </div>
    `;
  }



  // Human labels for misc (non-temperature) fields in the editor
  _label = (s) => {
    const id = s.name;
    const windUnit = ({ ms:'m/s', kmh:'km/h', mph:'mph', kn:'kn' }[this._config?.wind_display_unit || 'ms']);
    const base = ({
      name:'Name', temperature:'Temperature entity', humidity:'Humidity entity', windspeed:'Wind speed entity (optional)',
      feels_like:'Feels-like formula',
      temp_preset:'Temperature preset',
      // show label with the currently selected wind unit
      default_wind_speed:`Default wind speed (${windUnit})`,
      decimals:'Decimals',
      rh_left_inner_pct:'Inner circle left RH (%)',
      rh_right_inner_pct:'Inner circle right RH (%)',
      icon:'Icon',
      icon_position:'Icon puck position',
      y_offset_pct:'Vertical dot offset (%)',
    })[id];
    return base ?? id;
  };
  
  // Map band key to the same colours the card uses
  _bandBaseColour(name){
    const t = String(name || '').toLowerCase();
    if (t==='frosty')  return 'mediumblue';
    if (t==='cold')    return 'dodgerblue';
    if (t==='chilly')  return 'deepskyblue';
    if (t==='cool')    return 'mediumaquamarine';
    if (t==='mild')    return 'seagreen';
    if (t==='perfect') return 'limegreen';
    if (t==='warm')    return 'gold';
    if (t==='hot')     return 'orange';
    if (t==='boiling') return 'crimson';
    return 'dimgray';
  }

  // Which band colour to use for each anchor row's value pill
  _bandForAnchor(anchorName){
    switch(anchorName){
      case 't_boiling_max': return 'boiling';
      case 't_hot_max':     return 'hot';
      case 't_warm_max':    return 'warm';
      case 't_perfect_max':
      case 't_perfect_min': return 'perfect';
      case 't_mild_min':    return 'mild';
      case 't_cool_min':    return 'cool';
      case 't_chilly_min':  return 'chilly';
      case 't_cold_min':    return 'cold';
      case 't_frosty_min':  return 'frosty';
      default:              return null;
    }
  }
  // Show the derived neighbor on the row that DEFINES it, e.g.:
  // MILD.min helper also shows "COOL.max = 13.9°C"
  _fmtC(v){ return Number.isFinite(v) ? `${Number(v).toFixed(1)}°C` : '—'; }
  _slimDerivedHelper(anchorName){
    const C = this._config || {};
    const pair = ({
      t_hot_max:     ['BOILING.min', C.t_boiling_min],
      t_warm_max:    ['HOT.min',     C.t_hot_min],
      t_perfect_max: ['WARM.min',    C.t_warm_min],
      t_perfect_min: ['MILD.max',    C.t_mild_max],
      t_mild_min:    ['COOL.max',    C.t_cool_max],
      t_cool_min:    ['CHILLY.max',  C.t_chilly_max],
      t_chilly_min:  ['COLD.max',    C.t_cold_max],
      t_cold_min:    ['FROSTY.max',  C.t_frosty_max],
    })[anchorName];
    return pair ? html`${pair[0]} = ${this._fmtC(pair[1])}` : nothing;
  }
  // Button row factory (name, title, helper, limited?)
  _anchorRow(name, title, helper, limited){
    const v = Number(this._config?.[name]);
    const display = Number.isFinite(v) ? `${v.toFixed(1)} °C` : '—';
    const band = this._bandForAnchor(name);
    const col  = band ? this._bandBaseColour(band) : null;
    const cap = limited ? this._capFor(name) : null;
    const atLo = cap ? v <= cap.lo : false;
    const atHi = cap ? v >= cap.hi : false;
    return html`
      <div class="row">
        <div class="name">${title}</div>
        <div class="value ${col ? 'coloured' : ''}" style=${col ? `--pill-col:${col}` : nothing} title=${display}>${display}</div>
        <div class="seg">
          <button
            class="btn icon ghost"
            type="button"
            ?disabled=${atLo}
            @click=${() => this._bump(name, -0.1, limited)}
            aria-label="${title} down"
            title="Decrease by 0.1 °C"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="btn icon"
            type="button"
            ?disabled=${atHi}
            @click=${() => this._bump(name, +0.1, limited)}
            aria-label="${title} up"
            title="Increase by 0.1 °C"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="helper">${helper}</div>
      </div>
    `;
  }

  // Humidity rows styled like temperature anchors
  _rhRow(name, title){
    const v = Number(this._config?.[name]);
    const display = Number.isFinite(v) ? `${v.toFixed(1)} %` : '—';
    const col = 'hotpink';              // same alert hue used in the card
    const step = 0.1;

    const L = Number(this._config?.rh_left_inner_pct  ?? 40);
    const R = Number(this._config?.rh_right_inner_pct ?? 60);

    // Disable buttons at sensible limits and keep L < R by 0.1%
    let atLo = false, atHi = false;
    if (name === 'rh_left_inner_pct'){
      atLo = v <= 0;
      atHi = v >= (R - step);           // cannot cross right anchor
    } else { // rh_right_inner_pct
      atLo = v <= (L + step);           // cannot cross left anchor
      atHi = v >= 100;
    }

    const helper = this._helper({ name }); // reuse your existing helper copy

    return html`
      <div class="row">
        <div class="name">${title}</div>
        <div class="value coloured" style="--pill-col:${col}" title=${display}>${display}</div>
        <div class="seg">
          <button
            class="btn icon ghost"
            type="button"
            ?disabled=${atLo}
            @click=${() => this._bump(name, -step, /*limited*/false)}
            aria-label="${title} down"
            title="Decrease by ${step} %">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="btn icon"
            type="button"
            ?disabled=${atHi}
            @click=${() => this._bump(name, +step, /*limited*/false)}
            aria-label="${title} up"
            title="Increase by ${step} %">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="helper">${helper}</div>
      </div>
    `;
  }

  // Helper/tooltips for each field (shows under the input)
  _helper = (s) => {
    const st   = (key: string) => {
      const entityId = this._config?.[key];
      return entityId ? this.hass?.states?.[String(entityId)] : undefined;
    };
    const unit = (key) => st(key)?.attributes?.unit_of_measurement ?? "";
    const id = s.name; // ← needed so switch(id) works

    // Non-band helpers
    switch (id) {
      case 'name':
        return 'Shown as the small grey title at the top of the card.';
      case 'temperature':
        return `Pick an indoor temperature sensor. ${unit('temperature') ? `Current unit: ${unit('temperature')}.` : ''}`;
      case 'temp_display_unit':
        return 'Choose the temperature unit used for display. Calculations always normalize internally.';
      case 'humidity':
        return `Pick a relative humidity sensor (0–100%). ${unit('humidity') ? `Current unit: ${unit('humidity')}.` : ''}`;
      case 'windspeed':
        return 'Optional. If set, Feels Like Temperature uses this wind; if empty, the “Default wind speed” below is used.';
      case 'wind_display_unit':
        return 'Unit for showing the default wind value below (YAML-safe tokens). Physics converts to m/s internally.';
      case 'default_wind_speed':
        return 'Indoor fallback for Feels Like Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 in the chosen unit.';
      case 'feels_like':
        return 'Choose the formula for the top-right “Feels like” value. BoM uses T+RH+Wind; Wind Chill uses T+Wind (cold); Heat Index/Humidex use T+RH (hot).';
      case 'cap_degrees':
        return '±°C limit for the editor’s +/- buttons on non-edge anchors. Not applied to FROSTY.min or BOILING.max.';
      case 'temp_preset':
        return 'Default Current Preset. Seeds the 10 temperature anchors from Indoor or Outdoor defaults.  Missing/invalid → Indoor.';
      case 'decimals':
        return 'How many decimal places to show for temperatures and humidity.';
      case 'rh_left_inner_pct':
        return 'Maps RH to the inner-comfort-circle LEFT intersection horizontally';
      case 'rh_right_inner_pct':
        return 'Maps RH to the inner-comfort-circle RIGHT intersection horizontally';
      case 'icon':
        return 'Select the MDI icon rendered in the temp-tinted puck layer. Example: mdi:home-account';
      case 'icon_position':
        return 'Choose where the temperature-tinted puck (with icon) sits: left, right, or bottom.';
      case 'y_offset_pct':
        return 'Fine-tune the dot’s vertical position in % of card height (positive moves up). Temperature Anchors are what positions the dot, this setting is only fine tuning';

    }

    // Band helpers with your exact drag semantics
    const gap = '0.1 °C';
    if (id === 't_boiling_max')
      return 'BOILING.max → top (100%). Dragging down stops at BOILING.min (tracks HOT.max+0.1). Dragging up increases the scale.';
    if (id === 't_hot_max')
      return 'HOT.max. Drags BOILING.min with it up/down (BOILING.min = HOT.max+0.1). HOT.max ≤ BOILING.max−0.1 and ≥ WARM.max+0.1.';
    if (id === 't_warm_max')
      return 'WARM.max → outer-top. Drags HOT.min with it (HOT.min = WARM.max+0.1). WARM.max ≤ HOT.max−0.1 and ≥ PERFECT.max+0.1.';
    if (id === 't_perfect_max')
      return 'PERFECT.max → inner-top. Drags WARM.min (WARM.min = PERFECT.max+0.1). PERFECT.max ≤ WARM.max−0.1 and ≥ PERFECT.min+0.1.';
    if (id === 't_perfect_min')
      return 'PERFECT.min → inner-bottom. Drags MILD.max (MILD.max = PERFECT.min−0.1). PERFECT.min ≤ PERFECT.max−0.1 and ≥ MILD.min+0.1.';
    if (id === 't_mild_min')
      return 'MILD.min → outer-bottom. Drags COOL.max (COOL.max = MILD.min−0.1). MILD.min ≤ PERFECT.min and ≥ COOL.min+0.1.';
    if (id === 't_cool_min')
      return 'COOL.min. Drags CHILLY.max (CHILLY.max = COOL.min−0.1). COOL.min ≤ MILD.min and ≥ CHILLY.min+0.1.';
    if (id === 't_chilly_min')
      return 'CHILLY.min. Drags COLD.max (COLD.max = CHILLY.min−0.1). CHILLY.min ≤ COOL.min and ≥ COLD.min+0.1.';
    if (id === 't_cold_min')
      return 'COLD.min. Drags FROSTY.max (FROSTY.max = COLD.min−0.1). COLD.min ≤ CHILLY.min and ≥ FROSTY.min+0.1.';
    if (id === 't_frosty_min')
      return 'FROSTY.min → bottom (0%). Dragging up stops at FROSTY.max (COLD.max−0.1). Dragging down increases the scale lower.';
    if (/^t_.*_(min|max)$/.test(id))
      return `All band edges keep contiguous ${gap} gaps automatically.`;
    return 'Tip: values update immediately; click Save when done.';
  };

  // Mirror user edits → ignore min or max → sanitize → notify HA
  // --- New: exact PERFECT midpoint for display (no rounding of value itself) ---
  _centerTemp(){
    const a = this._config || {};
    const lo = Number(a.t_perfect_min);
    const hi = Number(a.t_perfect_max);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return '—';
    return `${((lo + hi) / 2).toFixed(2)} °C`;
  }

  // --- New: cap helper so buttons disable at ±cap_degrees°C from defaults ---
  _capFor(name){
    const defKey = name.replace('t_', '');
    // support both perf_* and perfect_* in _defaults
    const def =
      this._defaults[defKey] ??
      (defKey.startsWith('perfect_')
        ? this._defaults[defKey.replace('perfect_', 'perf_')]
        : undefined);
    if (def === undefined) return null; // edges (t_boiling_max, t_frosty_min): no caps
    const r1 = (x) => Math.round(x * 10) / 10;
    const CAP = this._capDegrees(); // use UI-configurable cap instead of fixed 4.0
    return { lo: r1(def - CAP), hi: r1(def + CAP) };
  }

  // Reset visible anchors to defaults, re-derive neighbors, emit
  _resetDefaults = () => {
    const out = { ...(this._config || {}) };
    // Restore the 10 exposed handles to the *selected preset* defaults
    const PRE = TEMP_PRESETS[normalizePreset(this._config?.temp_preset)];
    out.t_boiling_max = PRE.t_boiling_max;
    out.t_hot_max     = PRE.t_hot_max;
    out.t_warm_max    = PRE.t_warm_max;
    out.t_perfect_max = PRE.t_perfect_max;
    out.t_perfect_min = PRE.t_perfect_min;
    out.t_mild_min    = PRE.t_mild_min;
    out.t_cool_min    = PRE.t_cool_min;
    out.t_chilly_min  = PRE.t_chilly_min;
    out.t_cold_min    = PRE.t_cold_min;
    out.t_frosty_min  = PRE.t_frosty_min;
    const derived = this._applyTempsRowBiDirectional(out, [
      't_boiling_max','t_hot_max','t_warm_max','t_perfect_max','t_perfect_min',
      't_mild_min','t_cool_min','t_chilly_min','t_cold_min','t_frosty_min'
    ]);
    // Refresh defaults so caps center on the preset we reset to
    this._defaults = {
      hot_max: PRE.t_hot_max,
      warm_max: PRE.t_warm_max,
      perf_max: PRE.t_perfect_max,
      perf_min: PRE.t_perfect_min,
      perfect_max: PRE.t_perfect_max,
      perfect_min: PRE.t_perfect_min,
      mild_min: PRE.t_mild_min,
      cool_min: PRE.t_cool_min,
      chilly_min: PRE.t_chilly_min,
      cold_min: PRE.t_cold_min,
    };
    this._config = derived;
    fireEvent(this, 'config-changed', { config: this._persistKeys(derived) });
  };

  // --- Wind unit helpers for editor conversions (ms|kmh|mph|kn) ---
  _toDisplayWind(v_mps, unit){
    if (!Number.isFinite(v_mps)) return 0;
    switch(unit){ case 'kmh': return v_mps * 3.6; case 'mph': return v_mps / 0.44704; case 'kn': return v_mps / 0.514444; default: return v_mps; }
  }
  _fromDisplayWind(v, unit){
    if (!Number.isFinite(v)) return 0;
    switch(unit){ case 'kmh': return v / 3.6; case 'mph': return v * 0.44704; case 'kn': return v * 0.514444; default: return v; }
  }

  // Adjust default_wind_speed value when wind_display_unit changes (preserve physical value)
  _onMiscChange = (ev) => {
    ev.stopPropagation();
    const delta = { ...(ev.detail?.value || {}) };
    if (!Object.keys(delta).length) return;

    // If the preset changed → reseed anchors LIVE (ignore +/- caps) and return
    if ('temp_preset' in delta) {
      const next = normalizePreset(delta.temp_preset);
      const prev = normalizePreset(this._config?.temp_preset);
      if (next !== prev) {
        this._reseedAnchorsFromPreset(next);
        return; // reseed already emitted config-changed
      }
    }

    // If unit changes, convert the numeric field to the new unit for display
    if ('wind_display_unit' in delta && this._config?.default_wind_speed != null){
      const prevU = this._config.wind_display_unit || 'ms';
      const nextU = delta.wind_display_unit || prevU;
      if (prevU !== nextU){
        const prevVal = Number(this._config.default_wind_speed);
        const asMps = this._fromDisplayWind(prevVal, prevU);
        delta.default_wind_speed = this._toDisplayWind(asMps, nextU);
      }
    }

    const merged = { ...(this._config || {}), ...delta };
    this._config = merged;
    fireEvent(this, 'config-changed', { config: this._persistKeys(merged) });
  };


  // Button click → bump a single handle by delta, apply caps & derive neighbors
  _bump(name, delta, limited){
    const r1 = (x) => Math.round(x * 10) / 10;
    const cfg = { ...(this._config || {}) };
    const before = Number(cfg[name]);
    if (!Number.isFinite(before)) return;

    // ±cap_degrees caps for limited anchors based on defaults
    let next = r1(before + delta);

    // Map to defaults keys (we stored without 't_'; build a lookup)
    const mapDef = {
      t_hot_max:'t_hot_max',
      t_warm_max:'t_warm_max',
      t_perfect_max:'t_perfect_max',
      t_perfect_min:'t_perfect_min',
      t_mild_min:'t_mild_min',
      t_cool_min:'t_cool_min',
      t_chilly_min:'t_chilly_min',
      t_cold_min:'t_cold_min',
    };
    if (limited && mapDef[name]){
      const defVal = this._defaults[mapDef[name].replace('t_','')];
      if (Number.isFinite(defVal)){
        const CAP = this._capDegrees(); // dynamic ±cap (e.g., 6.0)
        const lo = r1(defVal - CAP);
        const hi = r1(defVal + CAP);
        next = Math.min(hi, Math.max(lo, next));
      }
    }

    const merged = { ...cfg, [name]: next };
    const derived = this._applyTempsRowBiDirectional(merged, [name]);
    this._config = derived;
    fireEvent(this, 'config-changed', { config: this._persistKeys(derived) });
  }

  // Clamp only the edited handles against *their local neighbors*; then update derived neighbors.
  _applyTempsRowBiDirectional(cfgIn, changedKeys = []){
    // round to 0.1 and coerce
    const r1 = (v) => Math.round((Number(v) || 0) * 10) / 10;
    const step = 0.1;

    // Pull GUI fields (only the 10 exposed)
    // Use the incoming cfgIn.temp_preset first (important during reseed),
    // then fall back to current this._config.temp_preset.
    const BASE = TEMP_PRESETS[normalizePreset(cfgIn?.temp_preset ?? this._config?.temp_preset)];
    const P = {
      boiling_max: r1(cfgIn.t_boiling_max ?? BASE.t_boiling_max),
      hot_max:     r1(cfgIn.t_hot_max     ?? BASE.t_hot_max),
      warm_max:    r1(cfgIn.t_warm_max    ?? BASE.t_warm_max),
      perf_max:    r1(cfgIn.t_perfect_max ?? BASE.t_perfect_max),
      perf_min:    r1(cfgIn.t_perfect_min ?? BASE.t_perfect_min),
      mild_min:    r1(cfgIn.t_mild_min    ?? BASE.t_mild_min),
      cool_min:    r1(cfgIn.t_cool_min    ?? BASE.t_cool_min),
      chilly_min:  r1(cfgIn.t_chilly_min  ?? BASE.t_chilly_min),
      cold_min:    r1(cfgIn.t_cold_min    ?? BASE.t_cold_min),
      frosty_min:  r1(cfgIn.t_frosty_min  ?? BASE.t_frosty_min),
    };

    // Map config field -> our P keys
    const keyMap = {
      t_boiling_max: 'boiling_max',
      t_hot_max:     'hot_max',
      t_warm_max:    'warm_max',
      t_perfect_max: 'perf_max',
      t_perfect_min: 'perf_min',
      t_mild_min:    'mild_min',
      t_cool_min:    'cool_min',
      t_chilly_min:  'chilly_min',
      t_cold_min:    'cold_min',
      t_frosty_min:  'frosty_min',
    };

    // If HA batches more than one, clamp each edited field *independently* against its immediate neighbors.
    const targets = (changedKeys && changedKeys.length) ? changedKeys : Object.keys(keyMap);
    const ks = targets.map(k => keyMap[k] || k).filter(Boolean);

    const clampEdited = (k) => {
      switch (k) {
        case 'boiling_max':
          // Drag down stops at BOILING.min (= HOT.max + 0.1). Drag up grows scale.
          P.boiling_max = Math.max(P.boiling_max, r1(P.hot_max + step));
          break;
        case 'hot_max':
          // HOT.max ∈ [WARM.max+0.1, BOILING.max-0.1]
          P.hot_max = Math.max(r1(P.warm_max + step), Math.min(P.hot_max, r1(P.boiling_max - step)));
          break;
        case 'warm_max':
          // WARM.max ∈ [PERFECT.max+0.1, HOT.max-0.1]
          P.warm_max = Math.max(r1(P.perf_max + step), Math.min(P.warm_max, r1(P.hot_max - step)));
          break;
        case 'perf_max':
          // PERFECT.max ∈ [PERFECT.min+0.1, WARM.max-0.1]
          P.perf_max = Math.max(r1(P.perf_min + step), Math.min(P.perf_max, r1(P.warm_max - step)));
          break;
        case 'perf_min':
          // PERFECT.min ∈ [MILD.min+0.1, PERFECT.max-0.1]
          P.perf_min = Math.max(r1(P.mild_min + step), Math.min(P.perf_min, r1(P.perf_max - step)));
          break;
        case 'mild_min':
          // MILD.min ∈ [COOL.min+0.1, PERFECT.min]
          P.mild_min = Math.max(r1(P.cool_min + step), Math.min(P.mild_min, r1(P.perf_min - step)));
          break;
        case 'cool_min':
          // COOL.min ∈ [CHILLY.min+0.1, MILD.min]
          P.cool_min = Math.max(r1(P.chilly_min + step), Math.min(P.cool_min, r1(P.mild_min - step)));
          break;
        case 'chilly_min':
          // CHILLY.min ∈ [COLD.min+0.1, COOL.min]
          P.chilly_min = Math.max(r1(P.cold_min + step), Math.min(P.chilly_min, r1(P.cool_min - step)));
          break;
        case 'cold_min':
          // COLD.min ∈ [FROSTY.min+0.1, CHILLY.min]
          P.cold_min = Math.max(r1(P.frosty_min + step), Math.min(P.cold_min, r1(P.chilly_min - step)));
          break;
        case 'frosty_min':
          // FROSTY.min ≤ COLD.min − 0.1 (dragging down increases scale)
          P.frosty_min = Math.min(P.frosty_min, r1(P.cold_min - step));
          break;
      }
    };
    ks.forEach(clampEdited);

    // 3) Apply the explicit drag couplings by deriving “hidden” neighbors
    // Apply the explicit drag couplings by deriving “hidden” neighbors
    const out = { ...cfgIn };
    out.t_boiling_max = P.boiling_max;
    out.t_hot_max     = P.hot_max;
    out.t_warm_max    = P.warm_max;
    out.t_perfect_max = P.perf_max;
    out.t_perfect_min = P.perf_min;
    out.t_mild_min    = P.mild_min;
    out.t_cool_min    = P.cool_min;
    out.t_chilly_min  = P.chilly_min;
    out.t_cold_min    = P.cold_min;
    out.t_frosty_min  = P.frosty_min;

    // Derived neighbors (follow spec: min/max pairs maintain 0.1 °C gaps)
    out.t_boiling_min = r1(P.hot_max    + step); // HOT.max ↔ BOILING.min
    out.t_hot_min     = r1(P.warm_max   + step); // WARM.max ↔ HOT.min
    out.t_warm_min    = r1(P.perf_max   + step); // PERFECT.max ↔ WARM.min
    out.t_mild_max    = r1(P.perf_min   - step); // PERFECT.min ↔ MILD.max
    out.t_cool_max    = r1(P.mild_min   - step); // MILD.min ↔ COOL.max
    out.t_chilly_max  = r1(P.cool_min   - step); // COOL.min ↔ CHILLY.max
    out.t_cold_max    = r1(P.chilly_min - step); // CHILLY.min ↔ COLD.max
    out.t_frosty_max  = r1(P.cold_min   - step); // COLD.min ↔ FROSTY.max

    // 4) RH calibration passthrough (unchanged)
    const clamp01 = v => Math.min(100, Math.max(0, r1(v)));
    out.rh_left_inner_pct  = clamp01(out.rh_left_inner_pct  ?? 40);
    out.rh_right_inner_pct = clamp01(out.rh_right_inner_pct ?? 60);
    if (out.rh_right_inner_pct <= out.rh_left_inner_pct){
      out.rh_right_inner_pct = clamp01(out.rh_left_inner_pct + 0.1);
    }
    return out;
  }

  // Persist in grouped YAML shape (temperature_anchors, humidity_alert_anchors, card_options)
  _persistKeys(cfg){
    const out = {
      type: 'custom:simple-air-comfort-card',
      name: cfg.name,
      temperature: cfg.temperature,
      temp_display_unit: cfg.temp_display_unit,

      temperature_anchors: [
        { t_boiling_max: cfg.t_boiling_max },
        { t_hot_max:     cfg.t_hot_max },
        { t_warm_max:    cfg.t_warm_max },
        { t_perfect_max: cfg.t_perfect_max ?? cfg.t_perf_max },
        { t_perfect_min: cfg.t_perfect_min ?? cfg.t_perf_min },
        { t_mild_min:    cfg.t_mild_min },
        { t_cool_min:    cfg.t_cool_min },
        { t_chilly_min:  cfg.t_chilly_min },
        { t_cold_min:    cfg.t_cold_min },
        { t_frosty_min:  cfg.t_frosty_min },
        ...(cfg.cap_degrees != null ? [{ cap_degrees: cfg.cap_degrees }] : []),
        // keep preset WITH the anchors (mirrors editor placement)
        { temp_preset: normalizePreset(cfg.temp_preset) },
      ],

      humidity: cfg.humidity,
      humidity_alert_anchors: [
        { rh_left_inner_pct:  cfg.rh_left_inner_pct },
        { rh_right_inner_pct: cfg.rh_right_inner_pct },
      ],

      feels_like: cfg.feels_like,
      windspeed: cfg.windspeed,
      wind_display_unit: cfg.wind_display_unit,
      default_wind_speed: cfg.default_wind_speed,

      card_options: [
        { decimals:     cfg.decimals },
        { y_offset_pct: cfg.y_offset_pct },
        ...(cfg.icon ? [{ icon: cfg.icon }] : []),
        { icon_position: cfg.icon_position || 'left' },
      ],
    };
    if (!window.__sac_editor_prune_warned__) {
      console.info(
        'simple-air-comfort-card-editor: Writing grouped YAML ' +
        '(temperature_anchors, humidity_alert_anchors, card_options).'
      );
      window.__sac_editor_prune_warned__ = true;
    }
    return out;
  }

  _autoFillDefaults(){
    if (this._autoPicked || !this.hass || !this._config) return;

    const states = this.hass.states;

    const firstEntity = (pred) => {
      for (const [id, st] of Object.entries(states)) { if (pred(id, st)) return id; }
      return undefined;
    };
    const devClass = (st) => st?.attributes?.device_class;

    if (!this._config.temperature) {
      this._config.temperature = firstEntity((id, st) =>
        id.startsWith('sensor.') && devClass(st) === 'temperature'
      ) || this._config.temperature;
    }

    if (!this._config.humidity) {
      this._config.humidity = firstEntity((id, st) =>
        id.startsWith('sensor.') && devClass(st) === 'humidity'
      ) || this._config.humidity;
    }

    this._autoPicked = true;
    fireEvent(this, 'config-changed', { config: this._persistKeys(this._config) });
  }
}
