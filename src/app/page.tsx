"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import StarSelector from "@/components/StarSelector";
import FilterPanel from "@/components/FilterPanel";
import OnsenCard from "@/components/OnsenCard";
import OnsenDetail from "@/components/OnsenDetail";
import { onsenData } from "@/data/onsen";
import { kyuseiData } from "@/data/kyusei";
import { senshitsuEffects } from "@/data/senshitsu";
import type { KyuseiType, UnkiType, SenshitsuType, Onsen } from "@/types";

// Leaflet は SSR不可なので dynamic import
const OnsenMap = dynamic(() => import("@/components/OnsenMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] rounded-2xl bg-kaiun-sky-light/30 flex items-center justify-center">
      <span className="text-kaiun-text-light text-sm animate-pulse">
        地図を読み込み中...
      </span>
    </div>
  ),
});

export default function Home() {
  const [selectedStar, setSelectedStar] = useState<KyuseiType | null>(null);
  const [selectedUnki, setSelectedUnki] = useState<UnkiType[]>([]);
  const [selectedSenshitsu, setSelectedSenshitsu] = useState<SenshitsuType[]>(
    []
  );
  const [selectedOnsen, setSelectedOnsen] = useState<Onsen | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // フィルタリングロジック
  const filteredOnsen = useMemo(() => {
    let result = onsenData;

    // 運気フィルター
    if (selectedUnki.length > 0) {
      result = result.filter((o) =>
        selectedUnki.some((u) => o.unki.includes(u))
      );
    }

    // 泉質フィルター
    if (selectedSenshitsu.length > 0) {
      result = result.filter((o) =>
        selectedSenshitsu.some((s) => o.senshitsu.includes(s))
      );
    }

    // 九星フィルター: 選択された星の運気効果に合う温泉を優先表示
    if (selectedStar) {
      const starData = kyuseiData.find((k) => k.name === selectedStar);
      if (starData) {
        // 星の運気効果に合う泉質を特定
        const matchingSenshitsu = senshitsuEffects
          .filter((e) =>
            e.unki.some((u) => starData.unkiEffect.includes(u))
          )
          .map((e) => e.senshitsu);

        // スコア計算: 星との相性度でソート
        result = [...result].sort((a, b) => {
          const scoreA = a.senshitsu.filter((s) =>
            matchingSenshitsu.includes(s)
          ).length;
          const scoreB = b.senshitsu.filter((s) =>
            matchingSenshitsu.includes(s)
          ).length;
          return scoreB - scoreA;
        });
      }
    }

    return result;
  }, [selectedUnki, selectedSenshitsu, selectedStar]);

  const handleSelectOnsen = useCallback((onsen: Onsen) => {
    setSelectedOnsen(onsen);
    setShowDetail(true);
  }, []);

  const activeFilterCount =
    selectedUnki.length +
    selectedSenshitsu.length +
    (selectedStar ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col md:flex-row gap-4 px-4 pb-4 max-w-[1400px] mx-auto w-full">
        {/* 左パネル（デスクトップ） - スクロール可能 */}
        <aside className="hidden md:flex flex-col gap-4 w-[320px] shrink-0 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-1">
          <StarSelector
            selectedStar={selectedStar}
            onSelect={setSelectedStar}
          />
          <FilterPanel
            selectedUnki={selectedUnki}
            onUnkiChange={setSelectedUnki}
            selectedSenshitsu={selectedSenshitsu}
            onSenshitsuChange={setSelectedSenshitsu}
          />

          {/* 温泉一覧 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-kaiun-gold/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-kaiun-purple-deep">
                &#x2668;&#xFE0F; 温泉一覧
              </h3>
              <span className="text-xs text-kaiun-text-light">
                {filteredOnsen.length}件
              </span>
            </div>
            <div className="space-y-2">
              {filteredOnsen.map((onsen) => (
                <OnsenCard
                  key={onsen.id}
                  onsen={onsen}
                  onClick={() => handleSelectOnsen(onsen)}
                  isSelected={selectedOnsen?.id === onsen.id}
                />
              ))}
              {filteredOnsen.length === 0 && (
                <p className="text-sm text-kaiun-text-light text-center py-8">
                  条件に合う温泉が見つかりませんでした
                </p>
              )}
            </div>
          </div>

          {/* 出典表示 */}
          <div className="text-[10px] text-kaiun-text-light/50 leading-relaxed p-3">
            <p className="font-medium mb-1">情報出典:</p>
            <p>※当サイトの情報は、風水・九星気学の複数文献を参考に独自に編集したものです</p>
          </div>
        </aside>

        {/* モバイル：フィルターボタン */}
        <div className="md:hidden flex gap-2 items-center">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-kaiun-gold/20 text-sm font-medium text-kaiun-purple-deep flex items-center justify-center gap-2"
          >
            &#x1F50D; ここから探す
            {activeFilterCount > 0 && (
              <span className="bg-kaiun-purple-deep text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* モバイル：フィルターパネル */}
        {showMobileFilters && (
          <div className="md:hidden space-y-4">
            <StarSelector
              selectedStar={selectedStar}
              onSelect={setSelectedStar}
            />
            <FilterPanel
              selectedUnki={selectedUnki}
              onUnkiChange={setSelectedUnki}
              selectedSenshitsu={selectedSenshitsu}
              onSenshitsuChange={setSelectedSenshitsu}
            />
          </div>
        )}

        {/* 地図エリア - 画面に固定 */}
        <div className="flex-1 flex flex-col gap-4 md:sticky md:top-4 md:self-start">
          <div className="rounded-2xl overflow-hidden border-2 border-kaiun-gold/20 shadow-lg">
            <OnsenMap
              onsenList={filteredOnsen}
              selectedOnsen={selectedOnsen}
              onSelectOnsen={handleSelectOnsen}
            />
          </div>

          {/* モバイル：温泉カード一覧 */}
          <div className="md:hidden space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-kaiun-purple-deep">
                &#x2668;&#xFE0F; 温泉一覧
              </h3>
              <span className="text-xs text-kaiun-text-light">
                {filteredOnsen.length}件
              </span>
            </div>
            {filteredOnsen.map((onsen) => (
              <OnsenCard
                key={onsen.id}
                onsen={onsen}
                onClick={() => handleSelectOnsen(onsen)}
                isSelected={selectedOnsen?.id === onsen.id}
              />
            ))}

            {/* モバイル出典 */}
            <div className="text-[10px] text-kaiun-text-light/50 leading-relaxed p-3">
              <p className="font-medium mb-1">情報出典:</p>
              <p>※当サイトの情報は、風水・九星気学の複数文献を参考に独自に編集したものです</p>
            </div>
          </div>
        </div>
      </main>

      {/* 詳細モーダル */}
      {showDetail && selectedOnsen && (
        <OnsenDetail
          onsen={selectedOnsen}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
