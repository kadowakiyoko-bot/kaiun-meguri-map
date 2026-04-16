import { KyuseiInfo } from "@/types";

/**
 * 九星気学データ
 *
 * 出典:
 * - 「吉方位と凶方位とは？星ごとのおすすめスポット」吉方位通信（松平兼幸監修）
 *   https://column.hayaraku.com/good-bad-direction/
 * - 「五行と九星」九星気学 八雲院
 *   https://yakumoin.info/about/gogyou_and_kyusei
 * - 「吉方位の影響や効果の一覧表」占い師ミカタ
 *   https://www.mikatablog.com/
 * - 「パワースポット×九星気学」マナトピ
 *   https://manatopi.u-can.co.jp/life/150514_239.html
 * - 「8方位別の意味と効果」synchrorich
 *   https://synchrorich.com/houikouka/
 */
export const kyuseiData: KyuseiInfo[] = [
  {
    name: "一白水星",
    gogyo: "水",
    direction: "北",
    unkiEffect: ["恋愛運", "総合運"],
    recommendedSpots:
      "海・川・滝・温泉・水族館など水にまつわる場所が特に相性◎",
    recommendedFood: "魚介類、地酒",
    color: "#7EC8E3", // 水色
  },
  {
    name: "二黒土星",
    gogyo: "土",
    direction: "南西",
    unkiEffect: ["健康運", "仕事運"],
    recommendedSpots:
      "森・畑・山など自然豊かな場所。都市なら家庭的な小料理屋",
    recommendedFood: "米・酒・パン・野菜など大地の恵み、長い麺類",
    color: "#8B7355", // 土色
  },
  {
    name: "三碧木星",
    gogyo: "木",
    direction: "東",
    unkiEffect: ["仕事運", "総合運"],
    recommendedSpots:
      "木が生い茂る森林、ライブ会場、新しくオープンした施設",
    recommendedFood: "柑橘類、酸味のある食べ物",
    color: "#4CAF50", // 緑
  },
  {
    name: "四緑木星",
    gogyo: "木",
    direction: "南東",
    unkiEffect: ["恋愛運", "仕事運"],
    recommendedSpots:
      "城・テーマパーク・高層ビル・観光名所。定期的に通うのが吉",
    recommendedFood: "麺類、うどん・蕎麦など長いもの",
    color: "#66BB6A", // 黄緑
  },
  {
    name: "五黄土星",
    gogyo: "土",
    direction: "北東",
    unkiEffect: ["総合運", "厄除け"],
    recommendedSpots: "寺院・城・皇居・遺跡など歴史的建造物",
    recommendedFood: "甘いもの、発酵食品",
    color: "#FFD700", // ゴールド
  },
  {
    name: "六白金星",
    gogyo: "金",
    direction: "北西",
    unkiEffect: ["金運", "仕事運"],
    recommendedSpots:
      "神社などパワースポット、高級ホテル、ラグジュアリーな空間",
    recommendedFood: "高級食材、果物",
    color: "#C0C0C0", // シルバー
  },
  {
    name: "七赤金星",
    gogyo: "金",
    direction: "西",
    unkiEffect: ["金運", "恋愛運"],
    recommendedSpots:
      "煌びやかな空間、レジャー施設、飲食店、祭り・イベント",
    recommendedFood: "鶏肉、スイーツ、お酒",
    color: "#E91E63", // 赤ピンク
  },
  {
    name: "八白土星",
    gogyo: "土",
    direction: "北東",
    unkiEffect: ["金運", "健康運"],
    recommendedSpots:
      "高台・山など標高が高く視界が開ける場所、神社仏閣、温泉・足湯",
    recommendedFood: "牛肉、山の幸、芋類",
    color: "#F5F5DC", // ベージュ
  },
  {
    name: "九紫火星",
    gogyo: "火",
    direction: "南",
    unkiEffect: ["美容運", "仕事運"],
    recommendedSpots: "美術館・博物館・書店・サウナ・エステ・神社仏閣",
    recommendedFood: "小豆を使ったお菓子、辛いもの、ワイン",
    color: "#9C27B0", // 紫
  },
];

/**
 * 九星気学の節入り日（各月の区切り）
 * 出典: 日本フォーチュントラベル協会
 * https://kaiun-houi.com/getsumeisei-keisan/
 *
 * 実際は年により1〜2日前後するが、一般的な日付で判定
 */
const SETSUIRI_DATES: [number, number][] = [
  [2, 4],   // 1月→2月の境: 立春（2月4日頃）
  [3, 6],   // 2月→3月の境: 啓蟄
  [4, 5],   // 3月→4月の境: 清明
  [5, 6],   // 4月→5月の境: 立夏
  [6, 6],   // 5月→6月の境: 芒種
  [7, 7],   // 6月→7月の境: 小暑
  [8, 8],   // 7月→8月の境: 立秋
  [9, 8],   // 8月→9月の境: 白露
  [10, 8],  // 9月→10月の境: 寒露
  [11, 8],  // 10月→11月の境: 立冬
  [12, 7],  // 11月→12月の境: 大雪
  [1, 6],   // 12月→1月の境: 小寒
];

/**
 * 九星気学での「年」を算出（立春基準）
 * 1月1日〜2月3日生まれは前年扱い
 *
 * 出典: 日本フォーチュントラベル協会
 * https://kaiun-houi.com/honmeisei-keisan/
 */
function getKigakuYear(year: number, month: number, day: number): number {
  // 立春（2月4日頃）より前なら前年
  if (month < 2 || (month === 2 && day < 4)) {
    return year - 1;
  }
  return year;
}

/**
 * 九星気学での「月」を算出（節入り基準）
 * 各月の節入り日より前なら前月扱い
 *
 * 出典: 日本フォーチュントラベル協会
 * https://kaiun-houi.com/getsumeisei-keisan/
 */
function getKigakuMonth(month: number, day: number): number {
  // 節入り日の配列 index=0 は「立春(2/4)」
  // 月とindex: 2月→0, 3月→1, ...
  const setsuIndex = month - 2;

  if (setsuIndex >= 0 && setsuIndex < SETSUIRI_DATES.length) {
    const [, setsuDay] = SETSUIRI_DATES[setsuIndex];
    if (day < setsuDay) {
      // 節入り前 → 前月
      return month === 1 ? 12 : month - 1;
    }
  } else if (month === 1) {
    // 1月: 小寒(1/6)より前なら12月扱い
    if (day < 6) return 12;
    return 1; // 1/6以降は1月（気学の1月）
  }

  return month;
}

/**
 * 各桁を1桁になるまで足す
 */
function digitSum(n: number): number {
  let sum = Math.abs(n);
  while (sum >= 10) {
    sum = String(sum)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return sum;
}

/**
 * 本命星を算出する（生年月日から）
 *
 * 計算方法:
 * ① 西暦の各桁を1桁になるまで足す
 * ② 11 - ① の結果が本命星の番号
 * ③ 1月1日〜2月3日生まれは前年で計算
 *
 * 出典: 日本フォーチュントラベル協会
 * https://kaiun-houi.com/honmeisei-keisan/
 */
export function getHonmeisei(
  year: number,
  month: number,
  day: number
): KyuseiInfo {
  const kigakuYear = getKigakuYear(year, month, day);
  const sum = digitSum(kigakuYear);
  let index = 11 - sum;
  // 10以上の場合はさらに桁を足す（例: 11-1=10 → 1+0=1）
  if (index >= 10) {
    index = digitSum(index);
  }
  // 0になった場合は9
  if (index === 0) index = 9;
  return kyuseiData[index - 1];
}

/**
 * 月命星を算出する
 *
 * グループ分け:
 *   A（キー19）: 一白水星・四緑木星・七赤金星
 *   B（キー13）: 二黒土星・五黄土星・八白土星
 *   C（キー16）: 三碧木星・六白金星・九紫火星
 *
 * 計算: キーナンバー - 気学月（1月は13として計算）
 * マイナスを除去し、10以上なら桁を足す
 *
 * 出典: 日本フォーチュントラベル協会
 * https://kaiun-houi.com/getsumeisei-keisan/
 */
export function getGetsumeisei(
  year: number,
  month: number,
  day: number
): KyuseiInfo {
  const honmeisei = getHonmeisei(year, month, day);
  const kigakuMonth = getKigakuMonth(month, day);

  // グループ判定
  const groupA = ["一白水星", "四緑木星", "七赤金星"];
  const groupB = ["二黒土星", "五黄土星", "八白土星"];
  // groupC は上記以外（三碧木星、六白金星、九紫火星）

  let keyNumber: number;
  if (groupA.includes(honmeisei.name)) {
    keyNumber = 19;
  } else if (groupB.includes(honmeisei.name)) {
    keyNumber = 13;
  } else {
    keyNumber = 16;
  }

  // 1月は13として計算
  const calcMonth = kigakuMonth === 1 ? 13 : kigakuMonth;
  const raw = keyNumber - calcMonth;
  let result = Math.abs(raw);
  if (result >= 10) {
    result = digitSum(result);
  }
  if (result === 0) result = 9;

  return kyuseiData[result - 1];
}

/** 後方互換: 年のみの簡易判定 */
export function getKyuseiFromYear(year: number): KyuseiInfo {
  return getHonmeisei(year, 6, 15); // 6月15日（立春後なので年がそのまま使われる）
}
