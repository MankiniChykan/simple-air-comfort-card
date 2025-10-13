export const LEGACY_TEMP_KEYS = [
  't_frosty_max','t_cold_max','t_chilly_max','t_cool_max','t_mild_max',
  't_warm_min','t_hot_min','t_boiling_min',
  // old alias set
  't_perf_min','t_perf_max'
];

let warnedLegacy = false;
let warnedAliasConflict = false;

export const hasWarnedLegacy = () => warnedLegacy;
export const hasWarnedAliasConflict = () => warnedAliasConflict;
export const markLegacyWarned = () => { warnedLegacy = true; };
export const markAliasConflictWarned = () => { warnedAliasConflict = true; };

export const TEMP_PRESETS = {
  indoor: {
    t_boiling_max: 42.0,
    t_hot_max:     31.0,
    t_warm_max:    26.0,
    t_perfect_max: 23.5,
    t_perfect_min: 20.5,
    t_mild_min:    18.0,
    t_cool_min:    16.0,
    t_chilly_min:  12.0,
    t_cold_min:     8.0,
    t_frosty_min:   0.0,
  },
  outdoor: {
    t_boiling_max: 48.0,
    t_hot_max:     36.0,
    t_warm_max:    30.0,
    t_perfect_max: 26.0,
    t_perfect_min: 20.0,
    t_mild_min:    16.0,
    t_cool_min:    12.0,
    t_chilly_min:   6.0,
    t_cold_min:     2.0,
    t_frosty_min: -10.0,
  },
} as const;

export type TempPresetName = keyof typeof TEMP_PRESETS;

export const normalizePreset = (value: unknown): TempPresetName =>
  (String(value ?? '').toLowerCase() === 'outdoor' ? 'outdoor' : 'indoor');
