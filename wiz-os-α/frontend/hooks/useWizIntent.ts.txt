import { useState } from "react";
import { WizState } from "./useWizState";
import { WizLog } from "./useWizEvolutionLoop";

export type Aura = {
  pulse: number;
  color: string;
  noise: number;
};

export function useWizIntent(
  state: WizState,
  setState: (s: WizState) => void,
  pushLog: (msg: string) => void
) {
  const [aura, setAura] = useState<Aura>({
    pulse: 0.4,
    color: "#ffffff",
    noise: 0.05,
  });

  // ----------------------------------------
  // Intent を backend に送る
  // ----------------------------------------
  const sendIntent = async (intent: string) => {
    // thinking に遷移
    setState("thinking");

    // backend に送信
    const res = await fetch("/api/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent }),
    });

    const data = await res.json();

    // backend が返した aura を反映
    if (data.result?.aura) {
      setAura(data.result.aura);
    }

    // backend が返した state を反映
    if (data.result?.state) {
      setState(data.result.state as WizState);
    }

    // backend が返した message をログに追加
    if (data.result?.message) {
      pushLog(data.result.message);
    }

    // 最後に idle に戻す（必要なら）
    setTimeout(() => {
      setState("idle");
      setAura({
        pulse: 0.4,
        color: "#ffffff",
        noise: 0.05,
      });
    }, 1200);
  };

  return { aura, sendIntent };
}
