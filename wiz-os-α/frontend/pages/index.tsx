"use client";

import Layout from "../components/Layout";
import Orb from "../components/Orb";
import HUD from "../components/HUD";
import LogPanel from "../components/LogPanel";
import InputPanel from "../components/InputPanel";

import { useWizState } from "../hooks/useWizState";
import { useWizIntent } from "../hooks/useWizIntent";
import { useEvolution } from "../hooks/useEvolution";

export default function Home() {
  const { state } = useWizState();
  const { messages, sendIntent, loading } = useWizIntent();
  const { evolving, evolveUI, rollbackUI } = useEvolution();

  // SSR対策：stateがまだnullなら描画しない
  if (!state) return null;

  return (
    <Layout aura={state.aura} profile={state.profile}>
      {/* 中央のオーブ */}
      <Orb aura={state.aura} loading={loading || evolving} />

      {/* 右上のHUD（プロフィール・状態表示） */}
      <HUD aura={state.aura} profile={state.profile} />

      {/* 左側のログパネル（Wizの応答履歴） */}
      <LogPanel messages={messages} />

      {/* 下部の入力パネル */}
      <InputPanel
        onSend={sendIntent}
        loading={loading || evolving}
        onEvolve={evolveUI}
        onRollback={rollbackUI}
      />
    </Layout>
  );
}
