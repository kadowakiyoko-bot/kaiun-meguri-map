import type { Metadata } from "next";
import "./globals.css";
import TomitabiFooter from "@/components/TomitabiFooter";

export const metadata: Metadata = {
  title: "開運温泉巡りマップ | 九星気学 × 泉質で見つける あなたの開運の湯",
  description:
    "九星気学と温泉の泉質を掛け合わせ、あなたにぴったりの開運温泉を地図から探せるサイト。金運・恋愛運・仕事運・健康運・美容運別に全国の温泉を検索。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col mandala-bg text-kaiun-text font-sans">
        <div className="flex-1">{children}</div>
        <TomitabiFooter />
      </body>
    </html>
  );
}
