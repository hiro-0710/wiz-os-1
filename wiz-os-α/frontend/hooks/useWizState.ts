import { useState, useEffect } from "react";

export type WizState = "idle" | "thinking" | "evolving" | "error";

export function useWizState() {
  const [state, setState] = useState<WizState>("idle");

  // ----------------------------------------
  // 状態遷移の基本ロジック
  // （必要に応じて Intent Engine と同期）
  // ----------------------------------------
  useEffect(() => {
    // ここでは最小構成として idle のまま開始
    // Intent が送られたら useWizIntent 側で更新される
  }, []);

  return { state, setState };
}
