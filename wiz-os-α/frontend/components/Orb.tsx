"use client";

import React from "react";

interface WizOrbProps {
  src: string | null;
  size?: number;
}

export default function WizOrb({ src, size = 120 }: WizOrbProps) {
  // 画像が null の場合は何も描画しない（本番でのクラッシュ防止）
  if (!src) return null;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={src.startsWith("/") ? src : src}
        alt="wiz-orb"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
