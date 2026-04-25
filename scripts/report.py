"""監査結果をUTF-8でレポート出力（コンソール文字化け対策）"""
import json
from pathlib import Path
from collections import Counter

records = json.loads(Path("scripts/onsen_records.json").read_text(encoding="utf-8"))

SENSHITSU_TO_UNKI = {
    "硫黄泉": {"金運", "恋愛運"},
    "塩化物泉": {"仕事運", "厄除け"},
    "含鉄泉": {"金運", "健康運"},
    "炭酸水素塩泉": {"恋愛運", "美容運"},
    "二酸化炭素泉(炭酸泉)": {"健康運", "美容運"},
    "放射能泉": {"総合運", "健康運"},
    "単純温泉": {"総合運"},
    "硫酸塩泉": {"美容運", "仕事運", "健康運"},
    "含アルミニウム泉": {"健康運", "金運", "仕事運"},
    "酸性泉": {"厄除け", "健康運"},
}

out = []
out.append(f"# 温泉データ監査レポート (件数: {len(records)})\n")
out.append("## 都道府県別")
pc = Counter(r["prefecture"] for r in records)
for p, n in sorted(pc.items(), key=lambda x: -x[1]):
    out.append(f"  - {p}: {n}件")

out.append("\n## 運気別")
uc = Counter(u for r in records for u in r["unki"])
for u, n in sorted(uc.items(), key=lambda x: -x[1]):
    out.append(f"  - {u}: {n}件")

out.append("\n## 泉質別")
sc = Counter(s for r in records for s in r["senshitsu"])
for s, n in sorted(sc.items(), key=lambda x: -x[1]):
    out.append(f"  - {s}: {n}件")

# 泉質マッピングで説明しにくい運気
out.append("\n## 泉質では説明しにくい運気が付与されている温泉（要レビュー）")
flagged = []
for r in records:
    expected = set()
    for s in r["senshitsu"]:
        expected |= SENSHITSU_TO_UNKI.get(s, set())
    actual = set(r["unki"])
    unsupported = actual - expected - {"子宝運"}
    if unsupported:
        flagged.append((r["id"], r["name"], r["prefecture"], unsupported, r["senshitsu"]))
        out.append(f"  - {r['id']}: {r['name']}（{r['prefecture']}）")
        out.append(f"    持ってる泉質: {r['senshitsu']}")
        out.append(f"    付与運気: {r['unki']}")
        out.append(f"    泉質説明できない運気: {sorted(unsupported)}")
        out.append("")

# 子宝運候補（「子宝の湯」として歴史/効能で知られる温泉のリスト）
KOZURA_CANDIDATES = {
    # 歴史的に「子宝の湯」として明確に伝わるもの・婦人病効能を持つもの
    "shiobara": "塩原温泉郷（栃木）— 古来より「子宝の湯」として湯治場利用、婦人病効能（環境省国民保養温泉地）",
    "tamatsukuri": "玉造温泉（島根）— 出雲国風土記に女性の病に効能と記載、出雲大社の縁結びと出産安全",
    "ureshino": "嬉野温泉（佐賀）— 婦人病・冷え性効能で知られる三大美肌の湯",
    "nyuto": "乳頭温泉郷（秋田）— 鶴の湯に「子宝の湯」伝承、婦人病・冷え性効能",
    "yamanaka": "山中温泉（石川）— 環境省国民保養温泉地、婦人病効能の歴史的湯治場",
    "arima": "有馬温泉（兵庫）— 金泉（含鉄塩化物泉）が婦人病に効能、神功皇后伝説",
    "misasa": "三朝温泉（鳥取）— ラドン温泉のホルミシス効果、婦人病効能",
    "gero": "下呂温泉（岐阜）— 三名泉、婦人病・冷え性効能",
    "ikaho": "伊香保温泉（群馬）— 子宝の湯として歴史的に知られ、含鉄黄金の湯が女性に効能",
    "tsukioka": "月岡温泉（新潟）— 硫黄泉が婦人病に効能",
}

out.append("\n## 子宝運の付与候補（歴史/効能の根拠あり）")
for cid, reason in KOZURA_CANDIDATES.items():
    has = next((r for r in records if r["id"] == cid), None)
    if has:
        out.append(f"  - [{cid}] {reason}")
    else:
        out.append(f"  - [{cid}] (未登録) {reason}")

# 名前の重複や類似
out.append("\n## 同じ温泉地の別記載がないか")
nearby = []
for i, a in enumerate(records):
    for b in records[i+1:]:
        if a["prefecture"] == b["prefecture"]:
            la_diff = abs(a["lat"] - b["lat"])
            ln_diff = abs(a["lng"] - b["lng"])
            if la_diff < 0.05 and ln_diff < 0.05:
                nearby.append(f"  - {a['id']}（{a['name']}）と {b['id']}（{b['name']}）が同県で近接（lat差{la_diff:.4f}, lng差{ln_diff:.4f}）")
out.extend(nearby if nearby else ["  - なし"])

text = "\n".join(out)
Path("scripts/audit_report.md").write_text(text, encoding="utf-8")
print(f"-> scripts/audit_report.md ({len(text)} chars)")
