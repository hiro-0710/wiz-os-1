"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface WizState {
  aura: string | null;
  profile: string | null;
  hud: string | null;
  orb: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API_URL が undefined のまま使われると本番で /undefined/... にアクセスして壊れる
if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL が設定されていません。画像や状態が取得できません。");
}

export function useWizState() {
  const [state, setState] = useState<WizState>({
    aura: null,
    profile: null,
    hud: null,
    orb: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchState() {
      try {
        if (!API_URL) {
          console.error("API_URL が undefined のため、WizState を取得できません。");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_URL}/ui/state`);

        // API が返す画像URLが相対パスの場合、絶対URLに変換する
        const fixUrl = (url: string | null) => {
          if (!url) return null;
          if (url.startsWith("http")) return url;
          return `${API_URL}${url}`;
        };

        setState({
          aura: fixUrl(res.data.aura),
          profile: fixUrl(res.data.profile),
          hud: fixUrl(res.data.hud),
          orb: fixUrl(res.data.orb),
        });
      } catch (err) {
        console.error("State fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchState();
  }, []);

  return { state, loading };
}
