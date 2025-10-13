import assert from 'node:assert/strict';
import { TEMP_PRESETS, normalizePreset } from '../card/constants.js';
import {
  pickTenAnchors,
  expandFromTen,
  buildComfortBandMap,
  type ComfortBandKey,
  type KvRecord,
} from '../card/anchors.js';

const roundToTenth = (value: number) => Math.round(value * 10) / 10;
const STEP = 0.1;

(() => {
  const presetName = normalizePreset('indoor');
  const base = TEMP_PRESETS[presetName];
  const anchors = pickTenAnchors({} as KvRecord, presetName);

  (Object.keys(base) as Array<keyof typeof base>).forEach(key => {
    assert.strictEqual(anchors[key], base[key], `baseline ${String(key)} should match preset`);
  });
})();

(() => {
  const presetName = normalizePreset('indoor');
  const anchors = pickTenAnchors({
    t_perfect_min: 21.2,
    t_perfect_max: 22.8,
    t_perf_min: 19,
    t_perf_max: 27,
  } as KvRecord, presetName);

  assert.strictEqual(anchors.t_perfect_min, 21.2, 'prefers t_perfect_min over t_perf_min');
  assert.strictEqual(anchors.t_perfect_max, 22.8, 'prefers t_perfect_max over t_perf_max');
})();

(() => {
  const presetName = normalizePreset('indoor');
  const base = TEMP_PRESETS[presetName];
  const anchors = pickTenAnchors({} as KvRecord, presetName);
  const expanded = expandFromTen(anchors, presetName);

  assert.strictEqual(expanded.t_frosty_min, base.t_frosty_min);
  assert.strictEqual(expanded.t_frosty_max, roundToTenth(base.t_cold_min - STEP));
  assert.strictEqual(expanded.t_perf_min, base.t_perfect_min);
  assert.strictEqual(expanded.t_perf_max, base.t_perfect_max);
  assert.strictEqual(expanded.t_warm_min, roundToTenth(base.t_perfect_max + STEP));
  assert.strictEqual(expanded.t_boiling_min, roundToTenth(base.t_hot_max + STEP));
})();

(() => {
  const presetName = normalizePreset('indoor');
  const warped = pickTenAnchors({
    t_frosty_min: -20,
    t_cold_min: -18,
    t_chilly_min: -5,
    t_cool_min: -4,
    t_mild_min: -3,
    t_perfect_min: 40,
    t_perfect_max: 5,
    t_warm_max: 6,
    t_hot_max: 7,
    t_boiling_max: 8,
  } as KvRecord, presetName);
  const expanded = expandFromTen(warped, presetName);

  const ordered = [
    expanded.t_frosty_min,
    expanded.t_cold_min,
    expanded.t_chilly_min,
    expanded.t_cool_min,
    expanded.t_mild_min,
    expanded.t_perf_min,
    expanded.t_perf_max,
    expanded.t_warm_max,
    expanded.t_hot_max,
    expanded.t_boiling_max,
  ];

  for (let i = 1; i < ordered.length; i += 1) {
    assert.ok(
      ordered[i] >= roundToTenth(ordered[i - 1] + STEP),
      'expanded anchors maintain 0.1 °C separation',
    );
  }
  assert.ok(expanded.t_perf_max <= roundToTenth(expanded.t_warm_max - STEP));
  assert.ok(expanded.t_warm_max <= roundToTenth(expanded.t_hot_max - STEP));
})();

(() => {
  const presetName = normalizePreset('indoor');
  const baseAnchors = pickTenAnchors({} as KvRecord, presetName);
  const fallback = expandFromTen(baseAnchors, presetName);

  const aliasOnly = { ...fallback } as KvRecord;
  delete (aliasOnly as Record<string, unknown>).t_perf_min;
  delete (aliasOnly as Record<string, unknown>).t_perf_max;
  (aliasOnly as Record<string, unknown>).t_perfect_min = 20.6;
  (aliasOnly as Record<string, unknown>).t_perfect_max = 23.6;
  const aliases = buildComfortBandMap(aliasOnly, fallback);
  assert.strictEqual(aliases.PERFECT.min, 20.6);
  assert.strictEqual(aliases.PERFECT.max, 23.6);

  const clampOnly = { ...aliasOnly } as KvRecord;
  (clampOnly as Record<string, unknown>).t_perfect_min = 19.2;
  const clamped = buildComfortBandMap(clampOnly, fallback);
  assert.strictEqual(clamped.PERFECT.min, fallback.t_perf_min, 'values below guardrail clamp to preset ladder');

  const messyInput = buildComfortBandMap({
    t_frosty_min: 0,
    t_frosty_max: 0,
    t_cold_min: -5,
    t_cold_max: -4,
    t_chilly_min: -10,
    t_chilly_max: -9,
    t_cool_min: -20,
    t_cool_max: -19,
    t_mild_min: -30,
    t_mild_max: -29,
    t_perf_min: 5,
    t_perf_max: 4,
    t_warm_min: 3,
    t_warm_max: 2,
    t_hot_min: 1,
    t_hot_max: 0,
    t_boiling_min: -1,
    t_boiling_max: -2,
  } as KvRecord, fallback);

  const order: ComfortBandKey[] = ['FROSTY','COLD','CHILLY','COOL','MILD','PERFECT','WARM','HOT','BOILING'];
  let previous = messyInput[order[0]];
  assert.ok(previous.max >= previous.min);

  for (let i = 1; i < order.length; i += 1) {
    const current = messyInput[order[i]];
    const minAllowed = roundToTenth(previous.max + STEP);
    assert.ok(current.min >= minAllowed, `${order[i]} min respects contiguous spacing`);
    assert.ok(current.max >= current.min, `${order[i]} max >= min`);
    previous = current;
  }
})();

console.log('anchor parity checks passed');
