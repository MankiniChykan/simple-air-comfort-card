export type IconPosition = 'left' | 'right' | 'bottom';
export type TempDisplayUnit = 'auto' | 'c' | 'f';
export type WindDisplayUnit = 'ms' | 'kmh' | 'mph' | 'kn';
export type FeelsLikeMode = 'bom' | 'wind_chill' | 'heat_index' | 'humidex' | string;

export interface SimpleAirCardConfig {
  name?: string;
  temperature?: string;
  humidity?: string;
  windspeed?: string;
  temp_display_unit?: TempDisplayUnit;
  wind_display_unit?: WindDisplayUnit;
  feels_like?: FeelsLikeMode;
  temp_preset?: string;
  decimals?: number;
  ring_pct?: number;
  inner_pct?: number;
  center_pct?: number;
  y_offset_pct?: number;
  icon?: string;
  icon_position?: IconPosition;
  default_wind_speed?: number;
  rh_left_inner_pct?: number;
  rh_right_inner_pct?: number;
  cap_degrees?: number;
  [key: string]: unknown;
}
