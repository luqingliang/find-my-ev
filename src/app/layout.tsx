import type { Metadata } from "next";
import "./globals.css";
import { LanguageSync } from "@/components/language-sync";
import { SiteHeader } from "@/components/site-header";
import { CompareFab } from "@/components/compare-fab";
import { CompareSync } from "@/components/compare-sync";

export const metadata: Metadata = {
  title: "找到我的车",
  description: "纯前端电动车查询与对比网站"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageSync />
        <CompareSync />
        <SiteHeader />
        <CompareFab />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
