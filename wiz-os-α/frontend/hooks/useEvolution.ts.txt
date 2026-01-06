import { useState, useCallback } from "react";

export function useEvolution() {
  const [code, setCode] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">(
    "idle"
  );

  // -----------------------------
  // Load component code
  // -----------------------------
  const loadComponent = useCallback(async (name: string) => {
    const res = await fetch(`/api/component?component=${name}`);
    const json = await res.json();
    if (json.code) setCode(json.code);
  }, []);

  // -----------------------------
  // Save component code
  // -----------------------------
  const saveComponent = useCallback(async (name: string, newCode: string) => {
    await fetch(`/api/component`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ component: name, code: newCode }),
    });
  }, []);

  // -----------------------------
  // Evaluate UI
  // -----------------------------
  const evaluate = useCallback(async (name: string) => {
    const res = await fetch(`/api/evaluate-ui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ component: name }),
    });

    const json = await res.json();
    if (json.score) setScore(json.score);
    if (json.details) setDetails(json.details);
  }, []);

  // -----------------------------
  // Evolve UI
  // -----------------------------
  const evolve = useCallback(async (name: string) => {
    setStatus("running");

    const res = await fetch(`/api/evolve-ui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ component: name }),
    });

    const json = await res.json();

    if (json.status === "ok" && json.new_code) {
      setCode(json.new_code);
      setScore(json.score ?? null);
      setDetails(json.details ?? null);
      setStatus("done");
    } else {
      setStatus("error");
    }

    // refresh history
    fetchHistory(name);
  }, []);

  // -----------------------------
  // Load history
  // -----------------------------
  const fetchHistory = useCallback(async (name: string) => {
    const res = await fetch(`/api/history?component=${name}`);
    const json = await res.json();
    if (json.history) setHistory(json.history);
  }, []);

  // -----------------------------
  // Rollback
  // -----------------------------
  const rollback = useCallback(async (name: string, index: number) => {
    const res = await fetch(`/api/rollback-ui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ component: name, index }),
    });

    const json = await res.json();

    if (json.code) {
      setCode(json.code);
      setScore(json.score ?? null);
      setDetails(json.details ?? null);
    }

    fetchHistory(name);
  }, []);

  return {
    code,
    setCode,
    score,
    details,
    history,
    status,
    loadComponent,
    saveComponent,
    evaluate,
    evolve,
    rollback,
    fetchHistory,
  };
}
