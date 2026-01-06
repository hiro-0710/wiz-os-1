export type WizIntent =
  | { type: "none" }
  | { type: "evaluate"; component: string }
  | { type: "evolve"; component: string }
  | { type: "rollback"; component: string; index: number }
  | { type: "edit"; component: string; code: string }
  | { type: "state.update"; key: string; value: any };

// -----------------------------
// 初期 Intent
// -----------------------------
export const defaultIntent: WizIntent = {
  type: "none",
};
