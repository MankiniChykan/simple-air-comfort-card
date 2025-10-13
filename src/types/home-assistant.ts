export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService?(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  formatEntityState?(entityId: string): string;
  formatEntityAttributeValue?(entityId: string, attribute: string): string;
  formatNumber?(value: number, options?: Record<string, unknown>): string;
  localize?(key: string, ...args: unknown[]): string;
}
