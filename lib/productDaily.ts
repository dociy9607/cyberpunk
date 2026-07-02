import fs from "fs";
import path from "path";
import type { ProductDailyEntry, ProductDailyReport, ProductDailyTocItem } from "./types";

const REPORT_DIR = path.join(process.cwd(), "content", "product-daily");
const DATE_FILE_RE = /^\d{4}-\d{2}-\d{2}\.md$/;

type FrontMatter = Record<string, string>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value: string) {
  const ascii = value
    .toLowerCase()
    .replace(/[`*_~()[\]{}:：,，.。/\\|]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (ascii) return ascii;
  return Buffer.from(value).toString("hex").slice(0, 24);
}

function renderInline(value: string) {
  let text = escapeHtml(value);
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return text;
}

function readFrontMatter(markdown: string) {
  if (!markdown.startsWith("---")) return { meta: {}, body: markdown };
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: markdown };

  const raw = markdown.slice(3, end).trim();
  const meta = raw.split(/\r?\n/).reduce<FrontMatter>((result, line) => {
    const index = line.indexOf(":");
    if (index > -1) result[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^"|"$/g, "");
    return result;
  }, {});
  return { meta, body: markdown.slice(end + 4).trimStart() };
}

function inferKind(section: string): ProductDailyEntry["kind"] {
  if (section.includes("GitHub")) return "github";
  if (section.includes("产品/功能") || section.includes("产品")) return "product";
  if (section.includes("活动")) return "event";
  if (section.includes("借鉴")) return "pick";
  return "other";
}

function parseTocAndEntries(date: string, markdown: string) {
  const toc: ProductDailyTocItem[] = [];
  const entries: ProductDailyEntry[] = [];
  let currentSection = "";

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(#{2,4})\s+(.+)$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const title = match[2].trim();
    const id = `${date}-${slugify(title)}`;
    toc.push({ id, level, title });

    if (level === 2 || (level === 3 && title.includes("板块"))) currentSection = title;
    if (level >= 3 && !title.includes("板块") && title !== "目录") {
      entries.push({
        id,
        title,
        section: currentSection || "未分组",
        kind: inferKind(currentSection),
      });
    }
  }

  return { toc, entries };
}

function renderMarkdown(markdown: string, toc: ProductDailyTocItem[]) {
  const headingIds = new Map(toc.map((item) => [`${item.level}:${item.title}`, item.id]));
  const html: string[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) return;
    html.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  }

  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const title = heading[2].trim();
      const id = headingIds.get(`${level}:${title}`) || slugify(title);
      html.push(`<h${level} id="${id}">${renderInline(title)}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(`<li>${renderInline(trimmed.slice(2))}</li>`);
      continue;
    }

    flushList();
    if (trimmed.startsWith("> ")) {
      html.push(`<blockquote>${renderInline(trimmed.slice(2))}</blockquote>`);
    } else {
      html.push(`<p>${renderInline(trimmed)}</p>`);
    }
  }

  flushList();
  return html.join("\n");
}

function readReport(fileName: string): ProductDailyReport {
  const date = fileName.replace(/\.md$/, "");
  const sourcePath = `content/product-daily/${fileName}`;
  const raw = fs.readFileSync(path.join(REPORT_DIR, fileName), "utf8");
  const { meta, body } = readFrontMatter(raw);
  const title = meta.title || body.match(/^#\s+(.+)$/m)?.[1]?.trim() || `AI 产品日报 ${date}`;
  const summary = meta.summary || body.match(/^>\s+(.+)$/m)?.[1]?.trim() || "每日 AI 产品动态、开源项目与活动观察。";
  const { toc, entries } = parseTocAndEntries(date, body);

  return {
    date,
    title,
    summary,
    generatedAt: meta.generatedAt || "",
    sourcePath,
    markdown: body,
    contentHtml: renderMarkdown(body, toc),
    toc,
    entries,
  };
}

export function getProductDailyReports() {
  if (!fs.existsSync(REPORT_DIR)) return [];
  return fs
    .readdirSync(REPORT_DIR)
    .filter((fileName) => DATE_FILE_RE.test(fileName))
    .sort((a, b) => b.localeCompare(a))
    .map(readReport);
}

export function latestProductDailyReport() {
  return getProductDailyReports()[0] || null;
}
