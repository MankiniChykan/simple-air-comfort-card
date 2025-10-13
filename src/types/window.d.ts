declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
    __sac_editor_prune_warned__?: boolean;
    loadCardHelpers?: () => Promise<unknown>;
  }
}

export {};
