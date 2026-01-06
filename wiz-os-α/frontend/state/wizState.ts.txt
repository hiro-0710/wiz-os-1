export type WizFlags = {
  autoEvolution?: boolean;
  debug?: boolean;
  verbose?: boolean;
  [key: string]: boolean | undefined;
};

export type WizUIState = {
  selectedComponent?: string;
  lastAction?: string;
  [key: string]: any;
};

export type WizState = {
  mode: string; // "idle" | "thinking" | "evolving" | ...
  flags: WizFlags;
  ui: WizUIState;
};

// -----------------------------
// Default state
// -----------------------------
export const defaultWizState: WizState = {
  mode: "idle",
  flags: {
    autoEvolution: false,
    debug: false,
    verbose: false,
  },
  ui: {
    selectedComponent: "SampleComponent",
    lastAction: "none",
  },
};
