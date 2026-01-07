import Layout from "@/components/Layout";
import Orb from "@/components/Orb";
import HUD from "@/components/HUD";
import LogPanel from "@/components/LogPanel";
import InputPanel from "@/components/InputPanel";
import RollbackPanel from "@/components/RollbackPanel";

import { useWizState } from "@/hooks/useWizState";
import { useWizIntent } from "@/hooks/useWizIntent";
import { useEvolution } from "@/hooks/useEvolution";

export default function Home() {
  const { state } = useWizState();
  const { messages, sendIntent, loading } = useWizIntent();
  const { evolving, evolveUI, rollbackUI } = useEvolution();

  return (
    <Layout aura={state?.aura} profile={state?.profile}>
      {/* 中央のオーブ */}
      <Orb aura={state?.aura} loading={loading || evolving} />

      {/* 右上のHUD（プロフィール・状態表示） */}
      <HUD state={state} />

      {/* 左側のログパネル（Wizの応答履歴） */}
      <LogPanel messages={messages} />

      {/* 下部の入力パネル（ユーザー入力） */}
      <InputPanel onSend={sendIntent} loading={loading} />

      {/* 右下のロールバックパネル（UI進化管理） */}
      <RollbackPanel
        evolving={evolving}
        onEvolve={evolveUI}
        onRollback={rollbackUI}
      />
    </Layout>
  );
}
