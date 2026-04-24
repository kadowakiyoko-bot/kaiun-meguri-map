"use client";

const SISTER_APPS = [
  { name: "富旅AIマイルコーチ", en: "TOMITABI MILE COACH", desc: "マイル・旅・開運の24時間AI相談", url: "https://tomitabi-ai-coach.vercel.app" },
  { name: "富旅暦", en: "TOMITABI KOYOMI", desc: "二十四節気七十二候で暮らす", url: "https://tomitabi-koyomi.vercel.app" },
  { name: "富旅一の宮巡り", en: "TOMITABI ICHINOMIYA MEGURI", desc: "全国一の宮102社めぐり", url: "https://kaiun-ichinomiya.vercel.app" },
];

function UmeFlower({ size = 14 }: { size?: number }) {
  const petalDistance = 5.2;
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return { cx: 12 + petalDistance * Math.cos(angle), cy: 12 + petalDistance * Math.sin(angle) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "inline-block", flexShrink: 0 }}>
      {petals.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={3.5} fill="#CE3A2D" opacity={0.92} />
      ))}
      <circle cx={12} cy={12} r={2} fill="#C4941A" />
    </svg>
  );
}

export default function TomitabiFooter() {
  return (
    <footer style={{ background: "#FAFAFA", borderTop: "1px solid #E8E8E8", padding: "32px 16px 24px", marginTop: "40px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "#E8E8E8" }} />
          <UmeFlower />
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#666666", letterSpacing: "0.25em", margin: 0 }}>富旅シリーズ</p>
          <UmeFlower />
          <div style={{ flex: 1, height: "1px", background: "#E8E8E8" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          {SISTER_APPS.map((app) => (
            <a key={app.url} href={app.url} target="_blank" rel="noopener noreferrer"
               style={{ display: "block", background: "#FFFFFF", border: "1px solid #E8E8E8", padding: "16px 18px", textDecoration: "none", transition: "border-color 0.2s" }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CE3A2D"; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E8E8"; }}>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>{app.name}</p>
              <p style={{ fontSize: "0.6rem", color: "#999999", letterSpacing: "0.18em", margin: "0 0 6px 0", textTransform: "uppercase" }}>{app.en}</p>
              <p style={{ fontSize: "0.75rem", color: "#666666", margin: 0 }}>{app.desc} →</p>
            </a>
          ))}
        </div>
        <p style={{ fontSize: "0.7rem", color: "#999999", textAlign: "center", marginTop: "20px", letterSpacing: "0.1em" }}>
          © 富旅 TOMITABI All rights reserved.
        </p>
      </div>
    </footer>
  );
}
