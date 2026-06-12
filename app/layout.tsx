import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dehviz.lol 工作台",
  description: "个人品牌、工具集、项目展示与 AI 产品体验入口。",
  icons: {
    icon: "/corn_favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
