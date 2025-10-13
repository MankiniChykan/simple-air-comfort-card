import { TEMP_PRESETS, normalizePreset } from './constants.js';

export type KvRecord = Record<string, unknown>;

export type TenAnchorSet = {
  t_frosty_min: number;
  t_cold_min: number;
  t_chilly_min: number;
  t_cool_min: number;
  t_mild_min: number;
  t_perfect_min: number;
  t_perfect_max: number;
  t_warm_max: number;
  t_hot_max: number;
  t_boiling_max: number;
};

export type ExpandedAnchorSet = TenAnchorSet & {
  t_frosty_max: number;
  t_cold_max: number;
  t_chilly_max: number;
  t_cool_max: number;
  t_mild_max: number;
  t_perf_min: number;
  t_perf_max: number;
  t_warm_min: number;
  t_hot_min: number;
  t_boiling_min: number;
};

export type ComfortBandKey =
  | 'FROSTY'
  | 'COLD'
  | 'CHILLY'
  | 'COOL'
  | 'MILD'
  | 'PERFECT'
  | 'WARM'
  | 'HOT'
  | 'BOILING';

export type ComfortBandMap = Record<ComfortBandKey, { min: number; max: number }>;

const STEP = 0.1;
const roundToTenth = (value: number): number => Math.round(value * 10) / 10;

const toNumber = (value: unknown, fallback: number): number => {
  const candidate = value ?? fallback;
  const numeric = Number(candidate);
  return Number.isFinite(numeric) ? numeric : Number(candidate);
};

const getRecordValue = (record: KvRecord, key: string): unknown =>
  (record as Record<string, unknown>)[key];

export const pickTenAnchors = (cfg: KvRecord, presetName: string | undefined): TenAnchorSet => {
  const presetKey = normalizePreset(presetName);
  const preset = TEMP_PRESETS[presetKey];
  const perfMinSource =
    getRecordValue(cfg, 't_perfect_min') ?? getRecordValue(cfg, 't_perf_min');
  const perfMaxSource =
    getRecordValue(cfg, 't_perfect_max') ?? getRecordValue(cfg, 't_perf_max');

  return {
    t_frosty_min:  Number(getRecordValue(cfg, 't_frosty_min')  ?? preset.t_frosty_min),
    t_cold_min:    Number(getRecordValue(cfg, 't_cold_min')    ?? preset.t_cold_min),
    t_chilly_min:  Number(getRecordValue(cfg, 't_chilly_min')  ?? preset.t_chilly_min),
    t_cool_min:    Number(getRecordValue(cfg, 't_cool_min')    ?? preset.t_cool_min),
    t_mild_min:    Number(getRecordValue(cfg, 't_mild_min')    ?? preset.t_mild_min),
    t_perfect_min: Number(perfMinSource ?? preset.t_perfect_min),
    t_perfect_max: Number(perfMaxSource ?? preset.t_perfect_max),
    t_warm_max:    Number(getRecordValue(cfg, 't_warm_max')    ?? preset.t_warm_max),
    t_hot_max:     Number(getRecordValue(cfg, 't_hot_max')     ?? preset.t_hot_max),
    t_boiling_max: Number(getRecordValue(cfg, 't_boiling_max') ?? preset.t_boiling_max),
  };
};

export const expandFromTen = (ten: Partial<TenAnchorSet>, presetName: string | undefined): ExpandedAnchorSet => {
  const presetKey = normalizePreset(presetName);
  const base = TEMP_PRESETS[presetKey];
  const P = {
    frosty_min: roundToTenth(toNumber(ten.t_frosty_min,  base.t_frosty_min)),
    cold_min:   roundToTenth(toNumber(ten.t_cold_min,    base.t_cold_min)),
    chilly_min: roundToTenth(toNumber(ten.t_chilly_min,  base.t_chilly_min)),
    cool_min:   roundToTenth(toNumber(ten.t_cool_min,    base.t_cool_min)),
    mild_min:   roundToTenth(toNumber(ten.t_mild_min,    base.t_mild_min)),
    perf_min:   roundToTenth(toNumber(ten.t_perfect_min, base.t_perfect_min)),
    perf_max:   roundToTenth(toNumber(ten.t_perfect_max, base.t_perfect_max)),
    warm_max:   roundToTenth(toNumber(ten.t_warm_max,    base.t_warm_max)),
    hot_max:    roundToTenth(toNumber(ten.t_hot_max,     base.t_hot_max)),
    boiling_max:roundToTenth(toNumber(ten.t_boiling_max, base.t_boiling_max)),
  };

  P.cold_min   = Math.max(roundToTenth(P.frosty_min + STEP), P.cold_min);
  P.chilly_min = Math.max(roundToTenth(P.cold_min   + STEP), P.chilly_min);
  P.cool_min   = Math.max(roundToTenth(P.chilly_min + STEP), P.cool_min);
  P.mild_min   = Math.max(roundToTenth(P.cool_min   + STEP), P.mild_min);
  P.perf_min   = Math.max(
    roundToTenth(P.mild_min + STEP),
    Math.min(P.perf_min, roundToTenth(P.perf_max - STEP)),
  );
  P.perf_max   = Math.max(
    roundToTenth(P.perf_min + STEP),
    Math.min(P.perf_max, roundToTenth(P.warm_max - STEP)),
  );
  P.warm_max   = Math.max(
    roundToTenth(P.perf_max + STEP),
    Math.min(P.warm_max, roundToTenth(P.hot_max - STEP)),
  );
  P.hot_max    = Math.max(
    roundToTenth(P.warm_max + STEP),
    Math.min(P.hot_max,  roundToTenth(P.boiling_max - STEP)),
  );

  return {
    t_frosty_min: P.frosty_min,
    t_cold_min:   P.cold_min,
    t_chilly_min: P.chilly_min,
    t_cool_min:   P.cool_min,
    t_mild_min:   P.mild_min,
    t_perf_min:   P.perf_min,
    t_perf_max:   P.perf_max,
    t_warm_max:   P.warm_max,
    t_hot_max:    P.hot_max,
    t_boiling_max:P.boiling_max,
    t_perfect_min: P.perf_min,
    t_perfect_max: P.perf_max,
    t_frosty_max: roundToTenth(P.cold_min   - STEP),
    t_cold_max:   roundToTenth(P.chilly_min - STEP),
    t_chilly_max: roundToTenth(P.cool_min   - STEP),
    t_cool_max:   roundToTenth(P.mild_min   - STEP),
    t_mild_max:   roundToTenth(P.perf_min   - STEP),
    t_warm_min:   roundToTenth(P.perf_max   + STEP),
    t_hot_min:    roundToTenth(P.warm_max   + STEP),
    t_boiling_min:roundToTenth(P.hot_max    + STEP),
  };
};

const comfortBandOrder: ComfortBandKey[] = [
  'FROSTY','COLD','CHILLY','COOL','MILD','PERFECT','WARM','HOT','BOILING'
];

export const buildComfortBandMap = (
  config: KvRecord,
  fallback: ExpandedAnchorSet,
): ComfortBandMap => {
  const record = config as Record<string, unknown>;
  const r1 = (value: unknown, fallbackValue: number): number => {
    const numeric = Number(value);
    const resolved = Number.isFinite(numeric) ? numeric : fallbackValue;
    return roundToTenth(resolved);
  };

  const bands: ComfortBandMap = {
    FROSTY: { min: r1(record.t_frosty_min,    fallback.t_frosty_min),  max: r1(record.t_frosty_max,   fallback.t_frosty_max) },
    COLD:   { min: r1(record.t_cold_min,      fallback.t_cold_min),    max: r1(record.t_cold_max,     fallback.t_cold_max) },
    CHILLY: { min: r1(record.t_chilly_min,    fallback.t_chilly_min),  max: r1(record.t_chilly_max,   fallback.t_chilly_max) },
    COOL:   { min: r1(record.t_cool_min,      fallback.t_cool_min),    max: r1(record.t_cool_max,     fallback.t_cool_max) },
    MILD:   { min: r1(record.t_mild_min,      fallback.t_mild_min),    max: r1(record.t_mild_max,     fallback.t_mild_max) },
    PERFECT:{
      min: r1(record.t_perf_min ?? record.t_perfect_min, fallback.t_perf_min),
      max: r1(record.t_perf_max ?? record.t_perfect_max, fallback.t_perf_max),
    },
    WARM:   { min: r1(record.t_warm_min,      fallback.t_warm_min),    max: r1(record.t_warm_max,     fallback.t_warm_max) },
    HOT:    { min: r1(record.t_hot_min,       fallback.t_hot_min),     max: r1(record.t_hot_max,      fallback.t_hot_max) },
    BOILING:{ min: r1(record.t_boiling_min,   fallback.t_boiling_min), max: r1(record.t_boiling_max,  fallback.t_boiling_max) },
  };

  for (let i = 0; i < comfortBandOrder.length; i += 1) {
    const key = comfortBandOrder[i];
    const prevKey = comfortBandOrder[i - 1];
    if (prevKey) {
      const prev = bands[prevKey];
      const current = bands[key];
      const minAllowed = roundToTenth(prev.max + STEP);
      if (current.min < minAllowed) current.min = minAllowed;
      if (current.max < current.min) current.max = current.min;
    } else {
      const current = bands[key];
      if (current.max < current.min) current.max = current.min;
    }
  }

  return bands;
};
