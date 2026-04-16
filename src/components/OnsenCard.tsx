"use client";

import type { Onsen } from "@/types";

interface OnsenCardProps {
  onsen: Onsen;
  onClick: () => void;
  isSelected: boolean;
}

export default function OnsenCard({
  onsen,
  onClick,
  isSelected,
}: OnsenCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all card-glow ${
        isSelected
          ? "border-kaiun-gold bg-gradient-to-br from-kaiun-gold-light/30 to-kaiun-purple-light/20 shadow-md"
          : "border-kaiun-purple-light/20 bg-white/80 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-bold text-kaiun-purple-deep">{onsen.name}</h4>
          <p className="text-xs text-kaiun-text-light mt-0.5">
            {onsen.prefecture}
          </p>
        </div>
      </div>

      {/* 運気バッジ */}
      <div className="flex gap-1 mt-2 flex-wrap">
        {onsen.unki.map((u) => (
          <span
            key={u}
            className={`unki-${u} text-[10px] px-2 py-0.5 rounded-full font-medium`}
          >
            {u}
          </span>
        ))}
      </div>

      {/* 泉質 */}
      <div className="flex gap-1 mt-1.5 flex-wrap">
        {onsen.senshitsu.map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded-full bg-kaiun-sky-light text-kaiun-text border border-kaiun-sky/30"
          >
            {s}
          </span>
        ))}
      </div>

      {/* 開運ポイント（短縮版） */}
      <p className="text-xs text-kaiun-text-light mt-2 line-clamp-2 leading-relaxed">
        {onsen.kaiunPoint}
      </p>
    </button>
  );
}
