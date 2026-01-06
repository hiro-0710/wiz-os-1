import React from "react";

type Props = {
  profile?: string;
  confidence?: number;
};

export const ProfileBadge: React.FC<Props> = ({ profile, confidence }) => {
  if (!profile) return null;

  const label = `${profile}-like`;

  return (
    <div
      className="fixed top-4 right-4 text-xs tracking-wide select-none"
      style={{
        opacity: 0.45,
        color: "#ffffff",
        background: "rgba(255,255,255,0.08)",
        padding: "6px 10px",
        borderRadius: "8px",
        backdropFilter: "blur(6px)",
        transition: "opacity 0.25s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
    >
      {label}
      {typeof confidence === "number" && (
        <span style={{ marginLeft: 6, opacity: 0.5 }}>
          {Math.round(confidence * 100)}%
        </span>
      )}
    </div>
  );
};
