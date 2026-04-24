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
        <p className="text-lg font-bold gradient-text tracking-[0.3em] mb-1">
          富旅
        </p>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text tracking-wider">
          開運温泉巡りマップ
        </h1>
        <p className="text-xs text-kaiun-text-light mt-2 tracking-wider">
          あなたの星が導く、運気のhotspring
        </p>
      </div>

      {/* 装飾ライン */}
      <div className="mt-4 mx-auto w-48 h-[1px] bg-gradient-to-r from-transparent via-kaiun-gold to-transparent" />
    </header>
  );
}
