import { useState, useRef } from "react";
import { ProfileBadge } from "../components/ProfileBadge";
import { ResponseBubble } from "../components/ResponseBubble";
import { auraColor } from "../lib/aura";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvas.toDataURL("image/jpeg");

    setFrame(dataUrl);
  };

  const sendToWiz = async () => {
    if (!frame) return;

    const res = await fetch("/api/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "ちゃんと見て",
        frame: frame,
        vision_mode: "auto"
      })
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div
      className="min-h-screen px-6 py-10 text-white"
      style={{
        backgroundColor: auraColor(
          response?.aura || "calm",
          response?.profile || "guest"
        ),
        transition: "background-color 0.6s ease",
      }}
    >
      <ProfileBadge
        profile={response?.profile}
        confidence={response?.confidence}
      />

      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold tracking-wide">Wiz Camera</h1>

        <video ref={videoRef} className="rounded mb-4" />

        <div className="space-x-3">
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition"
          >
            カメラ開始
          </button>

          <button
            onClick={captureFrame}
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition"
          >
            撮影
          </button>

          <button
            onClick={sendToWiz}
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition"
          >
            Wiz に送る
          </button>
        </div>

        {frame && (
          <img
            src={frame}
            className="mt-4 w-64 rounded border border-white/20"
          />
        )}

        {response && (
          <ResponseBubble
            message={response.message}
            profile={response.profile}
          />
        )}
      </div>
    </div>
  );
}
