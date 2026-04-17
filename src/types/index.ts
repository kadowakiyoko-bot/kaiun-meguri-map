// 泉質タイプ
export type SenshitsuType =
  | "硫黄泉"
  | "塩化物泉"
  | "含鉄泉"
  | "炭酸水素塩泉"
  | "二酸化炭素泉"
  | "放射能泉"
  | "単純温泉"
  | "硫酸塩泉"
  | "含アルミニウム泉"
  | "酸性泉";

// 運気タイプ
export type UnkiType =
  | "金運"
  | "恋愛運"
  | "仕事運"
  | "健康運"
  | "美容運"
  | "総合運"
  | "厄除け";

// 九星タイプ
export type KyuseiType =
  | "一白水星"
  | "二黒土星"
  | "三碧木星"
  | "四緑木星"
  | "五黄土星"
  | "六白金星"
  | "七赤金星"
  | "八白土星"
  | "九紫火星";

// 五行タイプ
export type GogyoType = "水" | "土" | "木" | "金" | "火";

// 方位タイプ
export type DirectionType = "北" | "北東" | "東" | "南東" | "南" | "南西" | "西" | "北西";

// 温泉データ
export interface Onsen {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  lat: number;
  lng: number;
  senshitsu: SenshitsuType[];
  unki: UnkiType[];
  description: string;
  kaiunPoint: string; // 開運ポイント（根拠に基づく）
  kaiunAction: string; // 開運アクション豆知識
  nearbyPowerSpot?: string;
  localFood?: string;
  access: string;
  phone?: string;
  source: string; // 情報の出典
}

// 泉質→運気の対応
export interface SenshitsuEffect {
  senshitsu: SenshitsuType;
  unki: UnkiType[];
  description: string;
  source: string;
}

// 九星データ
export interface KyuseiInfo {
  name: KyuseiType;
  gogyo: GogyoType;
  direction: DirectionType;
  unkiEffect: UnkiType[];
  recommendedSpots: string;
  recommendedFood: string;
  color: string; // UIでの表示色
}
