"""
温泉データ全項目検証スクリプト
"""
import re
import json
from pathlib import Path
from collections import Counter

PREF_BBOX = {
    "北海道": (41.4, 45.5, 139.5, 145.5),
    "青森県": (40.2, 41.6, 139.5, 141.7),
    "岩手県": (38.7, 40.5, 140.6, 142.1),
    "宮城県": (37.7, 39.0, 140.3, 141.7),
    "秋田県": (38.9, 40.5, 139.7, 140.9),
    "山形県": (37.7, 39.0, 139.5, 140.6),
    "福島県": (36.8, 37.9, 139.1, 141.1),
    "栃木県": (36.2, 37.2, 139.3, 140.3),
    "群馬県": (35.9, 36.9, 138.4, 139.7),
    "茨城県": (35.7, 36.9, 139.7, 140.8),
    "埼玉県": (35.7, 36.3, 138.7, 139.9),
    "千葉県": (34.9, 36.1, 139.7, 140.9),
    "東京都": (34.0, 35.9, 138.9, 142.4),
    "神奈川県": (35.1, 35.7, 138.9, 139.8),
    "新潟県": (36.7, 38.6, 137.6, 139.7),
    "富山県": (36.2, 36.9, 136.7, 137.8),
    "石川県": (36.0, 37.6, 136.3, 137.4),
    "福井県": (35.3, 36.3, 135.4, 136.8),
    "山梨県": (35.2, 35.9, 138.2, 139.1),
    "長野県": (35.1, 37.0, 137.3, 138.9),
    "岐阜県": (35.1, 36.5, 136.3, 137.7),
    "静岡県": (34.5, 35.7, 137.4, 139.2),
    "愛知県": (34.5, 35.4, 136.6, 137.9),
    "三重県": (33.7, 35.3, 135.8, 136.9),
    "滋賀県": (34.7, 35.7, 135.7, 136.4),
    "京都府": (34.7, 35.8, 134.8, 136.0),
    "大阪府": (34.2, 35.0, 135.1, 135.7),
    "兵庫県": (34.1, 35.7, 134.2, 135.5),
    "奈良県": (33.8, 34.8, 135.6, 136.3),
    "和歌山県": (33.4, 34.4, 135.0, 136.0),
    "鳥取県": (35.1, 35.7, 133.1, 134.5),
    "島根県": (34.3, 35.6, 131.6, 133.4),
    "岡山県": (34.4, 35.5, 133.3, 134.5),
    "広島県": (34.0, 35.1, 132.0, 133.6),
    "山口県": (33.7, 34.7, 130.7, 132.5),
    "徳島県": (33.5, 34.3, 133.6, 134.9),
    "香川県": (34.0, 34.6, 133.4, 134.4),
    "愛媛県": (32.7, 34.3, 132.0, 133.7),
    "高知県": (32.6, 33.9, 132.4, 134.4),
    "福岡県": (33.0, 34.0, 130.0, 131.2),
    "佐賀県": (32.9, 33.6, 129.7, 130.5),
    "長崎県": (32.5, 34.7, 128.6, 130.4),
    "熊本県": (32.1, 33.3, 130.0, 131.3),
    "大分県": (32.7, 33.7, 130.7, 132.1),
    "宮崎県": (31.3, 32.8, 130.7, 131.9),
    "鹿児島県": (27.0, 32.2, 128.4, 131.2),
    "沖縄県": (24.0, 27.9, 122.9, 131.4),
}

VALID_UNKI = {"金運", "恋愛運", "仕事運", "健康運", "美容運", "総合運", "厄除け", "子宝運"}
VALID_SENSHITSU = {
    "硫黄泉", "塩化物泉", "含鉄泉", "炭酸水素塩泉",
    "二酸化炭素泉(炭酸泉)", "放射能泉", "単純温泉",
    "硫酸塩泉", "含アルミニウム泉", "酸性泉",
}

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

src_path = Path("src/data/onsen.ts")
src = src_path.read_text(encoding="utf-8")

records = []
chunks = re.split(r'  \{\s*\n    id:', src)[1:]
for ch in chunks:
    rec = {}
    m = re.match(r'\s*"([^"]+)"', ch)
    if m:
        rec["id"] = m.group(1)
    for key in ["name", "prefecture", "address", "access", "phone", "source", "description", "kaiunPoint", "kaiunAction", "nearbyPowerSpot", "localFood"]:
        pattern = key + r':\s*"((?:[^"\\]|\\.)*)"'
        m = re.search(pattern, ch)
        if m:
            rec[key] = m.group(1)
    m = re.search(r'lat:\s*([\d.]+)', ch)
    if m:
        rec["lat"] = float(m.group(1))
    m = re.search(r'lng:\s*([\d.]+)', ch)
    if m:
        rec["lng"] = float(m.group(1))
    m = re.search(r'senshitsu:\s*\[([^\]]+)\]', ch)
    if m:
        rec["senshitsu"] = re.findall(r'"([^"]+)"', m.group(1))
    m = re.search(r'unki:\s*\[([^\]]+)\]', ch)
    if m:
        rec["unki"] = re.findall(r'"([^"]+)"', m.group(1))
    records.append(rec)

print(f"=== 総件数: {len(records)} ===\n")
issues = []

ids = [r["id"] for r in records]
dup = {x for x in ids if ids.count(x) > 1}
if dup:
    issues.append(f"[ID重複] {dup}")

for r in records:
    for k in ["id", "name", "prefecture", "address", "lat", "lng", "senshitsu", "unki", "description", "kaiunPoint", "access", "source"]:
        v = r.get(k)
        if v is None or (isinstance(v, list) and not v):
            issues.append(f"[必須欠損] {r.get('id', '?')} -> {k}")

for r in records:
    if "lat" in r and "lng" in r:
        if not (24.0 <= r["lat"] <= 46.0):
            issues.append(f"[lat範囲外] {r['id']} {r['lat']}")
        if not (122.0 <= r["lng"] <= 149.0):
            issues.append(f"[lng範囲外] {r['id']} {r['lng']}")
        bbox = PREF_BBOX.get(r.get("prefecture", ""))
        if bbox:
            la0, la1, lo0, lo1 = bbox
            if not (la0 <= r["lat"] <= la1 and lo0 <= r["lng"] <= lo1):
                issues.append(f"[県と座標不整合] {r['id']} ({r['name']}) {r['prefecture']}: lat={r['lat']}, lng={r['lng']} (期待: {la0}-{la1}, {lo0}-{lo1})")

for r in records:
    for s in r.get("senshitsu", []):
        if s not in VALID_SENSHITSU:
            issues.append(f"[不正な泉質] {r['id']} {s}")

for r in records:
    for u in r.get("unki", []):
        if u not in VALID_UNKI:
            issues.append(f"[不正な運気] {r['id']} {u}")

for r in records:
    expected = set()
    for s in r.get("senshitsu", []):
        expected |= SENSHITSU_TO_UNKI.get(s, set())
    actual = set(r.get("unki", []))
    unsupported = actual - expected - {"子宝運"}
    if unsupported:
        issues.append(f"[運気が泉質で説明しにくい] {r['id']} ({r.get('name', '?')}): {unsupported} - 持つ泉質={r.get('senshitsu')}")

names = [r.get("name", "") for r in records]
nm_dup = {x for x in names if names.count(x) > 1}
if nm_dup:
    issues.append(f"[名前重複] {nm_dup}")

print("=== 都道府県別 ===")
pc = Counter(r.get("prefecture", "?") for r in records)
for p, n in sorted(pc.items(), key=lambda x: -x[1]):
    print(f"  {p}: {n}")

print("\n=== 運気別 ===")
uc = Counter()
for r in records:
    for u in r.get("unki", []):
        uc[u] += 1
for u, n in sorted(uc.items(), key=lambda x: -x[1]):
    print(f"  {u}: {n}")

print("\n=== 泉質別 ===")
sc = Counter()
for r in records:
    for s in r.get("senshitsu", []):
        sc[s] += 1
for s, n in sorted(sc.items(), key=lambda x: -x[1]):
    print(f"  {s}: {n}")

print("\n" + "=" * 60)
print(f"Issues found: {len(issues)}")
print("=" * 60)
for i in issues:
    print(i)

Path("scripts/onsen_records.json").write_text(
    json.dumps(records, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"\n-> scripts/onsen_records.json に {len(records)} 件保存")
