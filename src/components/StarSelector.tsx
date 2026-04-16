"use client";

import { useState } from "react";
import { kyuseiData, getHonmeisei, getGetsumeisei } from "@/data/kyusei";
import type { KyuseiType } from "@/types";

interface StarSelectorProps {
  selectedStar: KyuseiType | null;
  onSelect: (star: KyuseiType | null) => void;
}

export default function StarSelector({
  selectedStar,
  onSelect,
}: StarSelectorProps) {
  const [birthDate, setBirthDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [getsumeisei, setGetsumeisei] = useState<string | null>(null);

  const handleDateSubmit = () => {
    if (!birthDate) return;
    const [y, m, d] = birthDate.split("-").map(Number);
    if (!y || !m || !d) return;

    const honmei = getHonmeisei(y, m, d);
    const getsu = getGetsumeisei(y, m, d);
    onSelect(honmei.name);
    setGetsumeisei(getsu.name);
  };

  const selectedData = selectedStar
    ? kyuseiData.find((k) => k.name === selectedStar)
    : null;

  const getsuData = getsumeisei
    ? kyuseiData.find((k) => k.name === getsumeisei)
    : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-kaiun-gold/20 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">&#x2728;</span>
          <span className="font-bold text-sm text-kaiun-purple-deep">
            あなたの本命星
          </span>
        </div>
        <span
          className={`text-kaiun-text-light transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          &#9662;
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* 生年月日から自動判定 */}
          <div>
            <label className="text-xs text-kaiun-text-light mb-1 block">
              生年月日を入力（立春基準で正確に判定します）
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-kaiun-purple-light/50 bg-white focus:outline-none focus:border-kaiun-purple focus:ring-1 focus:ring-kaiun-purple/30"
                min="1920-01-01"
                max="2026-12-31"
              />
              <button
                onClick={handleDateSubmit}
                className="px-4 py-2 text-sm bg-gradient-to-r from-kaiun-purple-deep to-kaiun-pink text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                鑑定
              </button>
            </div>
            <p className="text-[10px] text-kaiun-text-light/60 mt-1">
              ※1/1〜2/3生まれは前年で判定、各月は節入り日基準で判定
            </p>
          </div>

          {/* または直接選択 */}
          <div>
            <p className="text-xs text-kaiun-text-light mb-1.5">
              または本命星を直接選択：
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {kyuseiData.map((kyusei) => (
                <button
                  key={kyusei.name}
                  onClick={() => {
                    onSelect(
                      selectedStar === kyusei.name ? null : kyusei.name
                    );
                    setGetsumeisei(null);
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg border transition-all ${
                    selectedStar === kyusei.name
                      ? "filter-active border-transparent"
                      : "border-kaiun-purple-light/30 bg-white hover:bg-kaiun-purple-light/20 text-kaiun-text"
                  }`}
                >
                  {kyusei.name}
                </button>
              ))}
            </div>
          </div>

          {/* クリアボタン */}
          {selectedStar && (
            <button
              onClick={() => {
                onSelect(null);
                setGetsumeisei(null);
              }}
              className="w-full text-xs text-kaiun-text-light hover:text-kaiun-purple transition-colors"
            >
              選択をクリア
            </button>
          )}

          {/* 鑑定結果 */}
          {selectedData && (
            <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-kaiun-purple-light/30 to-kaiun-pink-light/30 border border-kaiun-gold/20">
              {/* 本命星 */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedData.color }}
                />
                <span className="font-bold text-sm text-kaiun-purple-deep">
                  本命星: {selectedData.name}
                </span>
                <span className="text-xs text-kaiun-text-light">
                  （{selectedData.gogyo}の気・{selectedData.direction}）
                </span>
              </div>

              {/* 月命星 */}
              {getsuData && (
                <div className="flex items-center gap-2 mt-1.5 mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getsuData.color }}
                  />
                  <span className="font-bold text-sm text-kaiun-purple-deep">
                    月命星: {getsuData.name}
                  </span>
                  <span className="text-xs text-kaiun-text-light">
                    （{getsuData.gogyo}の気）
                  </span>
                </div>
              )}

              <p className="text-xs text-kaiun-text-light leading-relaxed mt-1">
                {selectedData.recommendedSpots}
              </p>
              <p className="text-xs text-kaiun-text-light mt-1">
                <span className="font-medium">おすすめ食:</span>{" "}
                {selectedData.recommendedFood}
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {selectedData.unkiEffect.map((u) => (
                  <span
                    key={u}
                    className={`unki-${u} text-[10px] px-2 py-0.5 rounded-full`}
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 折りたたみ時の選択表示 */}
      {!isExpanded && selectedStar && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor:
                kyuseiData.find((k) => k.name === selectedStar)?.color,
            }}
          />
          <span className="text-sm text-kaiun-purple-deep font-medium">
            {selectedStar}
            {getsumeisei && (
              <span className="text-kaiun-text-light font-normal">
                {" "}
                / 月命星: {getsumeisei}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
