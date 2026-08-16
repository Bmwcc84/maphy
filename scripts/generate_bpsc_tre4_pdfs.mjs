import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { bpscTre4Tests } from "../lib/bpsc-tre-4-series.ts";

const root = resolve(import.meta.dirname, "..");
const outputDir = join(root, "output", "pdf", "bpsc-tre-4");
const publicDir = join(root, "public", "downloads");
const logoPath = join(root, "public", "maphy-logo-mark.png");
const browsers = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function dataUri(path, type) {
  return `data:${type};base64,${readFileSync(path).toString("base64")}`;
}

function bilingual([english, hindi], className) {
  return `<div class="${className}-en">${escapeHtml(english)}</div><div class="${className}-hi" lang="hi">${escapeHtml(hindi)}</div>`;
}

function questionMarkup(question, index) {
  const options = question.options.map((option, optionIndex) => `
    <div class="option"><strong>${String.fromCharCode(65 + optionIndex)}.</strong><div>${bilingual(option, "option")}</div></div>
  `).join("");
  return `<section class="question"><div class="question-row"><strong class="number">${index + 1}.</strong><div>${bilingual(question.question, "question-text")}</div></div><div class="options">${options}</div></section>`;
}

function buildHtml(test) {
  const sourcePath = join(root, "public", test.sourceImage.replace(/^\//, "").replaceAll("/", "\\"));
  const sourceImage = dataUri(sourcePath, "image/jpeg");
  const logo = dataUri(logoPath, "image/png");
  const questions = test.questions.map(questionMarkup).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 16mm 15mm 18mm; }
    * { box-sizing: border-box; }
    html { font-family: "Nirmala UI", "Mangal", "Segoe UI", Arial, sans-serif; color: #07111f; }
    body { margin: 0; }
    .header { display:flex; align-items:center; justify-content:space-between; height:15mm; padding:0 5mm; margin-bottom:6mm; background:#07111f; color:#fff; }
    .brand { display:flex; align-items:center; gap:2.5mm; font-weight:900; }
    .brand img { width:10mm; height:10mm; object-fit:contain; }
    .series { color:#a5f3fc; font-size:7pt; font-weight:800; }
    .footer { position:fixed; left:0; right:0; bottom:0; border-top:.3mm solid #cbd5e1; padding-top:2.5mm; text-align:center; color:#475569; font-size:7pt; }
    .watermark { position:fixed; left:50%; top:48%; transform:translate(-50%,-50%) rotate(-32deg); color:rgba(15,23,42,.055); font-size:34pt; font-weight:900; white-space:nowrap; z-index:-1; }
    h1 { margin:0; font-size:20pt; line-height:1.2; }
    .title-hi { margin-top:1.5mm; color:#087b91; font-size:14pt; font-weight:800; }
    .meta { display:grid; grid-template-columns:repeat(3,1fr); margin:5mm 0; border:.3mm solid #cbd5e1; text-align:center; }
    .meta div { padding:2.5mm; border-left:.3mm solid #cbd5e1; }
    .meta div:first-child { border-left:0; }
    .meta span { display:block; color:#64748b; font-size:7pt; font-weight:800; }
    .meta strong { display:block; margin-top:1mm; font-size:10pt; }
    .source-page { break-after:page; }
    .source-label { margin:0 0 3mm; padding:2.5mm; background:#087b91; color:#fff; text-align:center; font-size:9pt; font-weight:900; }
    .source-page img { display:block; width:100%; max-height:176mm; object-fit:contain; border:.3mm solid #cbd5e1; }
    .section-title { margin:0 0 5mm; padding:3mm; background:#087b91; color:#fff; text-align:center; font-weight:900; font-size:10pt; }
    .question { break-inside:avoid; margin:0 0 5mm; padding-bottom:4mm; border-bottom:.25mm solid #dbe4ee; }
    .question-row { display:flex; gap:2mm; font-size:9.5pt; line-height:1.45; }
    .number { color:#087b91; }
    .question-text-en { font-weight:800; }
    .question-text-hi { margin-top:1mm; color:#334155; font-weight:700; }
    .options { margin:2mm 0 0 7mm; }
    .option { display:flex; gap:2mm; padding:1.2mm 2mm; border-top:.2mm solid #eef2f7; font-size:8.5pt; line-height:1.4; color:#334155; }
    .option:first-child { border-top:0; }
    .option strong { flex:0 0 5mm; color:#087b91; }
    .option-hi { margin-top:.5mm; color:#475569; }
    .note { margin-top:5mm; padding:3mm; border:.4mm solid #f97316; color:#7c2d12; text-align:center; font-size:8pt; font-weight:800; }
  </style></head><body>
    <footer class="footer">www.maphy.in | BPSC Physics TRE 4.0 | Test ${String(test.number).padStart(2, "0")}</footer>
    <div class="watermark">www.maphy.in</div>
    <header class="header"><div class="brand"><img src="${logo}" alt=""><span>MAPHY</span></div><div class="series">BPSC TEACHER TRE 4.0 | PHYSICS</div></header>
    <main>
      <h1>Test ${String(test.number).padStart(2, "0")}: ${escapeHtml(test.title[0])}</h1><div class="title-hi" lang="hi">टेस्ट ${String(test.number).padStart(2, "0")}: ${escapeHtml(test.title[1])}</div>
      <div class="meta"><div><span>QUESTIONS</span><strong>${test.questions.length}</strong></div><div><span>MARKS</span><strong>${test.questions.length}</strong></div><div><span>LANGUAGE</span><strong>EN + HI</strong></div></div>
      <section class="source-page"><div class="source-label">ORIGINAL SOURCE PAGE / मूल स्रोत पृष्ठ</div><img src="${sourceImage}" alt="Source page"></section>
      <div class="section-title">BILINGUAL QUESTION PAPER / द्विभाषी प्रश्नपत्र</div>${questions}
      <div class="note">Answers and bilingual explanations are available immediately after submitting this test at www.maphy.in.</div>
    </main>
  </body></html>`;
}

const browser = browsers.find(existsSync);
if (!browser) throw new Error("Chrome or Edge is required to generate PDFs.");
mkdirSync(outputDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

const workDir = join(tmpdir(), `maphy-bpsc-pdf-${Date.now()}`);
mkdirSync(workDir, { recursive: true });
try {
  const start = Number(process.argv[2] ?? 1);
  const end = Number(process.argv[3] ?? bpscTre4Tests.length);
  for (const test of bpscTre4Tests.filter((item) => item.number >= start && item.number <= end)) {
    const stem = `bpsc-tre-4-test-${String(test.number).padStart(2, "0")}`;
    const htmlPath = join(workDir, `${stem}.html`);
    const pdfPath = join(outputDir, `${stem}.pdf`);
    const publicPath = join(publicDir, `${stem}.pdf`);
    if (existsSync(pdfPath)) rmSync(pdfPath);
    if (existsSync(publicPath)) rmSync(publicPath);
    const profilePath = join(workDir, `profile-${test.number}`);
    writeFileSync(htmlPath, buildHtml(test), "utf8");
    const result = spawnSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--disable-pdf-header-footer",
      "--no-pdf-header-footer",
      `--user-data-dir=${profilePath}`,
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ], { encoding: "utf8", timeout: 120000 });
    if (result.status !== 0 || !existsSync(pdfPath)) {
      throw new Error(`PDF generation failed for ${stem}: ${result.stderr}`);
    }
    copyFileSync(pdfPath, publicPath);
    console.log(`Created ${stem}.pdf`);
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
