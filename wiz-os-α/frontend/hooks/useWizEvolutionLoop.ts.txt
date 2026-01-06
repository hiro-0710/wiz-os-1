import { useState, useEffect } from "react";

export type WizLog = {
  timestamp: string;
  message: string;
};

export function useWizEvolutionLoop() {
  const [logs, setLogs] = useState<WizLog[]>([]);

  // ----------------------------------------
  // 初期ロード：バックエンドからログを取得
  // ----------------------------------------
  useEffect(() => {
    fetch("/api/logs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        }
      })
      .catch(() => {
        console.warn("Failed to load logs");
      });
  }, []);

  // ----------------------------------------
  // 新しいログを追加する関数（UI 内部用）
  // ----------------------------------------
  const pushLog = (message: string) => {
    const entry: WizLog = {
      timestamp: new Date().toISOString(),
      message,
    };
    setLogs((prev) => [...prev, entry]);
  };

  return { logs, pushLog };
}
