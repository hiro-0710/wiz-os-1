import Orb from "./Orb";
import HUD from "./HUD";
import Ambient from "./Ambient";

export default function Layout({
  aura,
  profile,
  children,
}: {
  aura: { pulse: number; color: string; noise: number };
  profile: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Ambient（空気・奥行き） */}
      <Ambient aura={aura} />

      {/* Wiz の存在（Orb + HUD） */}
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HUD aura={aura} profile={profile} />
        <Orb aura={aura} />
      </div>

      {/* UI パネル */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
