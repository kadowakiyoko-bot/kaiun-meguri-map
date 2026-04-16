"use client";

import type { Onsen } from "@/types";
import { senshitsuEffects } from "@/data/senshitsu";

interface OnsenDetailProps {
  onsen: Onsen;
  onClose: () => void;
}

export default function OnsenDetail({ onsen, onClose }: OnsenDetailProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${onsen.lat},${onsen.lng}`;

  // この温泉の泉質に対応する開運効果の詳細を取得
  const relevantEffects = senshitsuEffects.filter((e) =>
    onsen.senshitsu.includes(e.senshitsu)
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-kaiun-purple-deep/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル */}
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-kaiun-purple-deep via-kaiun-pink to-kaiun-gold p-4 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          >
            &#x2715;
          </button>
          <h2 className="text-xl font-bold">{onsen.name}</h2>
          <p className="text-sm opacity-90">
            {onsen.prefecture} {onsen.address}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4 space-y-4 custom-scrollbar">
          {/* 運気バッジ */}
          <div className="flex gap-2 flex-wrap">
            {onsen.unki.map((u) => (
              <span
                key={u}
                className={`unki-${u} text-sm px-3 py-1 rounded-full font-medium`}
              >
                {u}
              </span>
            ))}
          </div>

          {/* 説明 */}
          <p className="text-sm text-kaiun-text leading-relaxed">
            {onsen.description}
          </p>

          {/* 開運ポイント */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-kaiun-gold-light/40 to-kaiun-purple-light/20 border border-kaiun-gold/20">
            <h3 className="font-bold text-sm text-kaiun-purple-deep mb-2 flex items-center gap-2">
              &#x2728; 開運ポイント
            </h3>
            <p className="text-sm text-kaiun-text leading-relaxed">
              {onsen.kaiunPoint}
            </p>
          </div>

          {/* 泉質と効能 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-kaiun-purple-deep flex items-center gap-2">
              &#x2668;&#xFE0F; 泉質と開運効能
            </h3>
            {relevantEffects.map((effect) => (
              <div
                key={effect.senshitsu}
                className="p-3 rounded-xl bg-kaiun-sky-light/50 border border-kaiun-sky/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-kaiun-text">
                    {effect.senshitsu}
                  </span>
                  <div className="flex gap-1">
                    {effect.unki.map((u) => (
                      <span
                        key={u}
                        className={`unki-${u} text-[10px] px-1.5 py-0.5 rounded-full`}
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-kaiun-text-light leading-relaxed">
                  {effect.description}
                </p>
              </div>
            ))}
          </div>

          {/* 開運アクション */}
          <div className="p-4 rounded-2xl bg-kaiun-pink-light/30 border border-kaiun-pink/20">
            <h3 className="font-bold text-sm text-kaiun-purple-deep mb-2 flex items-center gap-2">
              &#x1F3AF; 開運アクション
            </h3>
            <p className="text-sm text-kaiun-text leading-relaxed">
              {onsen.kaiunAction}
            </p>
          </div>

          {/* パワースポット & 食 */}
          <div className="grid grid-cols-2 gap-3">
            {onsen.nearbyPowerSpot && (
              <div className="p-3 rounded-xl bg-kaiun-purple-light/20 border border-kaiun-purple/10">
                <h4 className="font-bold text-xs text-kaiun-purple-deep mb-1">
                  &#x26E9;&#xFE0F; 近くのパワースポット
                </h4>
                <p className="text-xs text-kaiun-text leading-relaxed">
                  {onsen.nearbyPowerSpot}
                </p>
              </div>
            )}
            {onsen.localFood && (
              <div className="p-3 rounded-xl bg-kaiun-gold-light/30 border border-kaiun-gold/10">
                <h4 className="font-bold text-xs text-kaiun-purple-deep mb-1">
                  &#x1F372; 地元のおすすめ
                </h4>
                <p className="text-xs text-kaiun-text leading-relaxed">
                  {onsen.localFood}
                </p>
              </div>
            )}
          </div>

          {/* アクセス */}
          <div className="p-3 rounded-xl bg-white border border-kaiun-purple-light/20">
            <h4 className="font-bold text-xs text-kaiun-purple-deep mb-1">
              &#x1F6A9; アクセス
            </h4>
            <p className="text-xs text-kaiun-text">{onsen.access}</p>
            {onsen.phone && (
              <p className="text-xs text-kaiun-text-light mt-1">
                TEL: {onsen.phone}
              </p>
            )}
          </div>

          {/* 経路ボタン */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-2xl bg-gradient-to-r from-kaiun-purple-deep to-kaiun-pink text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            &#x1F5FA;&#xFE0F; Google Mapsで経路を見る
          </a>

        </div>
      </div>
    </div>
  );
}
