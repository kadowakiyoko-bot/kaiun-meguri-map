"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Onsen } from "@/types";
import { unkiColors } from "@/data/onsen";

interface OnsenMapProps {
  onsenList: Onsen[];
  selectedOnsen: Onsen | null;
  onSelectOnsen: (onsen: Onsen) => void;
}

function createMarkerIcon(onsen: Onsen, isSelected: boolean): L.DivIcon {
  const primaryUnki = onsen.unki[0];
  const color = unkiColors[primaryUnki] || "#9B59B6";
  const size = isSelected ? 44 : 34;
  const borderWidth = isSelected ? 3 : 2;
  const fontSize = isSelected ? 11 : 9;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size + 12}px;
        cursor: pointer;
      ">
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: linear-gradient(135deg, ${color}, ${color}dd);
          border: ${borderWidth}px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3)${isSelected ? `, 0 0 20px ${color}60` : ""};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: ${fontSize}px;
            color: white;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">${onsen.unki[0].replace("運", "")}</span>
        </div>
      </div>
    `,
    iconSize: [size, size + 12],
    iconAnchor: [size / 2, size + 12],
    popupAnchor: [0, -(size + 8)],
  });
}

export default function OnsenMap({
  onsenList,
  selectedOnsen,
  onSelectOnsen,
}: OnsenMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 地図の初期化（1回だけ）
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const container = containerRef.current;

    // 日本の範囲
    const japanBounds = L.latLngBounds([24, 122], [46, 149]);

    const map = L.map(container, {
      center: [36.5, 137.5],
      zoom: 6,
      zoomControl: false,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: japanBounds,
      maxBoundsViscosity: 1.0,
    });

    // 国土地理院タイル（日本語表記・無料）
    L.tileLayer(
      "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
        maxZoom: 18,
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    // サイズ確定後にinvalidateSize → 再度setView で日本を強制表示
    setTimeout(() => {
      map.invalidateSize();
      map.setView([36.5, 137.5], 6);
    }, 300);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // マーカーの更新
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    onsenList.forEach((onsen) => {
      const isSelected = selectedOnsen?.id === onsen.id;
      const icon = createMarkerIcon(onsen, isSelected);

      const marker = L.marker([onsen.lat, onsen.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:200px;max-width:280px;font-family:sans-serif">
            <div style="font-size:15px;font-weight:bold;color:#6B3FA0;margin-bottom:4px">${onsen.name}</div>
            <div style="font-size:12px;color:#7A6B8A">${onsen.prefecture}</div>
            <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap">
              ${onsen.unki.map((u) => `<span style="font-size:11px;padding:3px 10px;border-radius:99px;color:white;background:${unkiColors[u]};font-weight:500">${u}</span>`).join("")}
            </div>
            <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap">
              ${onsen.senshitsu.map((s) => `<span style="font-size:10px;padding:2px 8px;border-radius:99px;color:#3D2B50;background:#E0F4FA;border:1px solid #B8E4F0">${s}</span>`).join("")}
            </div>
            <div style="font-size:12px;color:#3D2B50;margin-top:8px;line-height:1.6">${onsen.kaiunPoint.length > 80 ? onsen.kaiunPoint.slice(0, 80) + "..." : onsen.kaiunPoint}</div>
            <div style="margin-top:10px;text-align:center">
              <span style="font-size:11px;color:#9B72CF;cursor:pointer;font-weight:bold">▶ 詳しく見る</span>
            </div>
          </div>`,
          { maxWidth: 300 }
        )
        .on("click", () => onSelectOnsen(onsen));

      markersRef.current.push(marker);
    });
  }, [onsenList, selectedOnsen, onSelectOnsen]);

  // 選択された温泉にフォーカス
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedOnsen) return;

    map.setView([selectedOnsen.lat, selectedOnsen.lng], 9, {
      animate: true,
      duration: 0.5,
    });
  }, [selectedOnsen]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "600px", borderRadius: "16px", zIndex: 1 }}
    />
  );
}
