"use client";

import React from "react";

interface AuraState {
  pulse: number;
  color: string;
  noise: number;
}

interface WizHUDProps {
  aura?: AuraState;
  profile?: string | null;
  width?: number;
}

export default function WizHUD({
  aura,
  profile,
  width = 260,
}: WizHUDProps) {
  return (
    <div
      style={{
        width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {profile && (
        <img
          src={profile}
          alt="wiz-hud"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            filter: aura
              ? `drop-shadow(0 0 ${aura.pulse * 2}px ${aura.color})`
              : "none",
          }}
        />
      )}
    </div>
  );
}
