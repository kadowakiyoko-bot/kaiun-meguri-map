"use client";

export default function Header() {
  return (
    <header className="relative overflow-hidden py-6 px-4 text-center">
      {/* 曼荼羅装飾 - 背景 */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] mandala-spin">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {[...Array(12)].map((_, i) => (
              <ellipse
                key={i}
                cx="100"
                cy="100"
                rx="90"
                ry="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                transform={`rotate(${i * 15} 100 100)`}
                className="text-kaiun-purple-deep"
              />
            ))}
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-kaiun-gold"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-kaiun-pink"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
            {[0,1,2,3,4].map((i) => {
              const angle = (i * 72 - 90) * (Math.PI / 180);
              const cx = 12 + 5.2 * Math.cos(angle);
              const cy = 12 + 5.2 * Math.sin(angle);
              return <circle key={i} cx={cx} cy={cy} r={3.5} fill="#CE3A2D" opacity={0.92} />;
            })}
            <circle cx={12} cy={12} r={2} fill="#C4941A" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text tracking-[0.18em]">
            富旅温泉
          </h1>
        </div>
        <p className="text-[10px] text-kaiun-text-light tracking-[0.18em] uppercase">
          TOMITABI ONSEN
        </p>
        <p className="text-xs text-kaiun-text-light mt-2 tracking-wider">
          九星気学×泉質で見つける開運の湯
        </p>
      </div>

      {/* 装飾ライン */}
      <div className="mt-4 mx-auto w-48 h-[1px] bg-gradient-to-r from-transparent via-kaiun-gold to-transparent" />
    </header>
  );
}
