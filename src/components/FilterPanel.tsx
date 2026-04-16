"use client";

import type { UnkiType, SenshitsuType } from "@/types";

const unkiTypes: { type: UnkiType; emoji: string }[] = [
  { type: "金運", emoji: "💰" },
  { type: "恋愛運", emoji: "💕" },
  { type: "仕事運", emoji: "💼" },
  { type: "健康運", emoji: "🌿" },
  { type: "美容運", emoji: "✨" },
  { type: "総合運", emoji: "🔮" },
  { type: "厄除け", emoji: "🛡️" },
];

const senshitsuTypes: SenshitsuType[] = [
  "硫黄泉",
  "塩化物泉",
  "含鉄泉",
  "炭酸水素塩泉",
  "放射能泉",
  "単純温泉",
  "硫酸塩泉",
  "酸性泉",
];

interface FilterPanelProps {
  selectedUnki: UnkiType[];
  onUnkiChange: (unki: UnkiType[]) => void;
  selectedSenshitsu: SenshitsuType[];
  onSenshitsuChange: (senshitsu: SenshitsuType[]) => void;
}

export default function FilterPanel({
  selectedUnki,
  onUnkiChange,
  selectedSenshitsu,
  onSenshitsuChange,
}: FilterPanelProps) {
  const toggleUnki = (type: UnkiType) => {
    if (selectedUnki.includes(type)) {
      onUnkiChange(selectedUnki.filter((u) => u !== type));
    } else {
      onUnkiChange([...selectedUnki, type]);
    }
  };

  const toggleSenshitsu = (type: SenshitsuType) => {
    if (selectedSenshitsu.includes(type)) {
      onSenshitsuChange(selectedSenshitsu.filter((s) => s !== type));
    } else {
      onSenshitsuChange([...selectedSenshitsu, type]);
    }
  };

  return (
    <div className="space-y-4">
      {/* 運気フィルター */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-kaiun-gold/20 shadow-sm">
        <h3 className="font-bold text-sm text-kaiun-purple-deep mb-3 flex items-center gap-2">
          <span>&#x1F52E;</span> ここから探す
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {unkiTypes.map(({ type, emoji }) => (
            <button
              key={type}
              onClick={() => toggleUnki(type)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedUnki.includes(type)
                  ? `unki-${type} border-transparent`
                  : "border-kaiun-purple-light/30 bg-white hover:bg-kaiun-purple-light/20 text-kaiun-text"
              }`}
            >
              <span>{emoji}</span>
              {type}
            </button>
          ))}
        </div>
        {selectedUnki.length > 0 && (
          <button
            onClick={() => onUnkiChange([])}
            className="mt-2 text-xs text-kaiun-text-light hover:text-kaiun-purple transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      {/* 泉質フィルター */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-kaiun-gold/20 shadow-sm">
        <h3 className="font-bold text-sm text-kaiun-purple-deep mb-3 flex items-center gap-2">
          <span>&#x2668;&#xFE0F;</span> 泉質から探す
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {senshitsuTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleSenshitsu(type)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedSenshitsu.includes(type)
                  ? "filter-active border-transparent"
                  : "border-kaiun-sky/50 bg-white hover:bg-kaiun-sky-light text-kaiun-text"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedSenshitsu.length > 0 && (
          <button
            onClick={() => onSenshitsuChange([])}
            className="mt-2 text-xs text-kaiun-text-light hover:text-kaiun-purple transition-colors"
          >
            クリア
          </button>
        )}
      </div>
    </div>
  );
}
