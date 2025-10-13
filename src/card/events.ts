export interface FireEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export const fireEvent = <T>(
  node: EventTarget | null | undefined,
  type: string,
  detail: T = {} as T,
  options: FireEventOptions = {},
): CustomEvent<T> => {
  const event = new CustomEvent<T>(type, {
    detail,
    bubbles: options.bubbles ?? true,
    cancelable: options.cancelable ?? false,
    composed: options.composed ?? true,
  });
  node?.dispatchEvent(event);
  return event;
};
