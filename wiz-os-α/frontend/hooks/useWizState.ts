import { useEffect, useState } from "react";
import axios from "axios";

export interface WizState {
  aura: {
    pulse: number;
    color: string;
    noise: number;
  };
  profile: string;
}

export function useWizState() {
  const [state, setState] = useState<WizState | null>(null);

  const fetchState = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/ui/state`
      );
      setState(res.data);
    } catch (err) {
      console.error("State fetch error:", err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  return { state, fetchState };
}
