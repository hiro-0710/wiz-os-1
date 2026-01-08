"use client";

import React from "react";

interface WizHUDProps {
  src: string | null;
  width?: number;
}

export default function WizHUD({ src, width = 260 }: WizHUDProps) {
  // 画像が null の場合は描画しない（本番クラッシュ防止）
  if (!src) return null;

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
      <img
        src={src.startsWith("/") ? src : src}
        alt="wiz-hud"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
