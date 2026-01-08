"use client";

import React from "react";

interface ProfileBadgeProps {
  src: string | null;
  size?: number;
  border?: boolean;
}

export default function ProfileBadge({
  src,
  size = 120,
  border = true,
}: ProfileBadgeProps) {
  // 画像が null の場合は描画しない（本番クラッシュ防止）
  if (!src) return null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        userSelect: "none",
        border: border ? "1px solid rgba(255,255,255,0.15)" : "none",
        boxShadow: border
          ? "0 0 12px rgba(255,255,255,0.15)"
          : "none",
      }}
    >
      <img
        src={src.startsWith("/") ? src : src}
        alt="wiz-profile"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
