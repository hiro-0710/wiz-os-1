import { useState } from "react";
import axios from "axios";

export function useEvolution() {
  const [evolving, setEvolving] = useState(false);

  const evolveUI = async () => {
    setEvolving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/ui/evolve`);
    } catch (err) {
      console.error("UI evolve error:", err);
    }
    setEvolving(false);
  };

  const rollbackUI = async () => {
    setEvolving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/ui/rollback`);
    } catch (err) {
      console.error("UI rollback error:", err);
    }
    setEvolving(false);
  };

  return {
    evolving,
    evolveUI,
    rollbackUI
  };
}
