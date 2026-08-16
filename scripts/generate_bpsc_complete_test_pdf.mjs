import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import katex from "katex";
import { splitBpscMathText } from "../lib/bpsc-math.ts";
import { bpscTre4AllQuestions } from "../lib/bpsc-tre-4-series.ts";

const root = resolve(import.meta.dirname, "..");
const outputPath = join(root, "output", "pdf", "bpsc-tre-4-complete-test.pdf");
const publicPath = join(root, "public", "downloads", "bpsc-tre-4-complete-test.pdf");
const logoPath = join(root, "public", "maphy-logo-mark.png");
const browsers = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const dataUri = (path, type) => `data:${type};base64,${readFileSync(path).toString("base64")}`;
const mathTextHtml = (value) => splitBpscMathText(value).map((part) => part.kind === "text"
  ? escapeHtml(part.value)
  : katex.renderToString(part.value, { output:"html", throwOnError:false })).join("");
const bilingual = ([english, hindi], name) => `<div class="${name}-en">${mathTextHtml(english)}</div><div class="${name}-hi" lang="hi">${mathTextHtml(hindi)}</div>`;
const sourceImageCache = new Map();

function sourceImageData(sourceImage) {
  if (!sourceImageCache.has(sourceImage)) {
    const sourcePath = join(root, "public", sourceImage.replace(/^\//, "").replaceAll("/", "\\"));
    sourceImageCache.set(sourceImage, dataUri(sourcePath, "image/jpeg"));
  }

  return sourceImageCache.get(sourceImage);
}

function figureMarkup(question) {
  if (!question.figure) return "";

  const crop = question.figure;
  const scale = Math.min(118 / crop.width, 62 / crop.height);
  const mm = (value) => `${(value * scale).toFixed(2)}mm`;
  const masks = (crop.masks ?? []).map((mask) => `<span class="figure-mask" style="left:${mm(mask.x - crop.x)};top:${mm(mask.y - crop.y)};width:${mm(mask.width)};height:${mm(mask.height)}"></span>`).join("");

  return `<figure class="figure" style="width:${mm(crop.width)};height:${mm(crop.height)}"><img src="${sourceImageData(question.sourceImage)}" alt="${escapeHtml(crop.alt[0])}" style="left:-${mm(crop.x)};top:-${mm(crop.y)};width:${mm(992)}">${masks}</figure>`;
}

function questionMarkup(question, index) {
  const options = question.options.map((option, optionIndex) => `<div class="option"><strong>${String.fromCharCode(65 + optionIndex)}.</strong><div>${bilingual(option, "option")}</div></div>`).join("");
  return `<section class="question"><div class="qrow"><strong class="qnum">${index + 1}.</strong><div>${bilingual(question.question, "qtext")}</div></div>${figureMarkup(question)}<div class="options">${options}</div></section>`;
}

const logo = dataUri(logoPath, "image/png");
const katexCss = readFileSync(join(root, "node_modules", "katex", "dist", "katex.min.css"), "utf8");
const questions = bpscTre4AllQuestions.map(questionMarkup).join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${katexCss}
  @page { size:A4; margin:16mm 15mm 18mm; }
  * { box-sizing:border-box; }
  html { font-family:"Nirmala UI","Mangal","Segoe UI",Arial,sans-serif; color:#07111f; }
  body { margin:0; }
  .header { display:none; }
  .brand { display:flex; align-items:center; gap:2mm; }
  .brand img { width:8mm; height:8mm; object-fit:contain; }
  .footer { display:none; }
  .watermark { position:fixed; left:50%; top:48%; transform:translate(-50%,-50%) rotate(-32deg); color:rgba(15,23,42,.05); font-size:34pt; font-weight:900; white-space:nowrap; z-index:-1; }
  .cover { min-height:245mm; padding:24mm 12mm; background:#07111f; color:#fff; }
  .cover-logo { display:flex; align-items:center; gap:4mm; font-size:22pt; font-weight:900; }
  .cover-logo img { width:20mm; height:20mm; object-fit:contain; }
  .eyebrow { margin-top:28mm; color:#67e8f9; font-size:10pt; font-weight:900; text-transform:uppercase; }
  h1 { margin:4mm 0 0; max-width:155mm; font-size:30pt; line-height:1.15; }
  .cover-hi { margin-top:5mm; color:#fde68a; font-size:19pt; font-weight:800; }
  .cover p { margin-top:8mm; max-width:150mm; color:#cbd5e1; font-size:11pt; line-height:1.6; }
  .meta { display:grid; grid-template-columns:repeat(3,1fr); margin-top:18mm; border:.3mm solid #475569; }
  .meta div { padding:5mm; border-left:.3mm solid #475569; }
  .meta div:first-child { border-left:0; }
  .meta span { display:block; color:#94a3b8; font-size:7pt; font-weight:900; }
  .meta strong { display:block; margin-top:2mm; font-size:14pt; }
  .paper-heading { break-before:page; margin:0 0 5mm; padding:4mm; background:#087b91; color:#fff; text-align:center; font-size:13pt; font-weight:900; }
  .instructions { margin:0 0 6mm; padding:3mm; border-left:1mm solid #f97316; background:#fff7ed; color:#7c2d12; font-size:8.5pt; font-weight:700; }
  .question { break-inside:avoid; margin:0 0 5mm; padding:5mm; border:.3mm solid #dbe4ee; border-radius:2mm; background:#fff; }
  .qrow { display:flex; gap:2mm; font-size:9.5pt; line-height:1.45; }
  .qnum { color:#087b91; }
  .qtext-en { font-weight:800; }
  .qtext-hi { margin-top:1mm; color:#334155; font-weight:700; }
  .figure { position:relative; margin:3mm auto 0; overflow:hidden; border:.3mm solid #cbd5e1; border-radius:2mm; background:#fff; }
  .figure img { position:absolute; max-width:none; height:auto; }
  .figure-mask { position:absolute; display:block; background:#fff; }
  .options { display:grid; grid-template-columns:1fr 1fr; gap:2mm; margin:3mm 0 0 7mm; }
  .option { display:flex; gap:2mm; min-height:12mm; padding:2mm; border:.25mm solid #dbe4ee; border-radius:2mm; background:#f8fafc; color:#334155; font-size:8.4pt; line-height:1.4; }
  .option strong { flex:0 0 5mm; color:#087b91; }
  .option-hi { margin-top:.5mm; color:#475569; }
  .katex { font-size:1.08em; }
</style></head><body>
  <header class="header"><div class="brand"><img src="${logo}" alt=""><span>MAPHY</span></div><span>BPSC TEACHER TRE 4.0 | PHYSICS</span></header>
  <footer class="footer">www.maphy.in | Complete Bilingual Question Paper</footer><div class="watermark">www.maphy.in</div>
  <section class="cover"><div class="cover-logo"><img src="${logo}" alt=""><span>MAPHY</span></div><div class="eyebrow">BPSC Teacher TRE 4.0</div><h1>Complete Physics Online Test</h1><div class="cover-hi" lang="hi">संपूर्ण द्विभाषी भौतिकी ऑनलाइन टेस्ट</div><p>Document 38 ke saare complete questions ek hi test mein. Online attempt par questions har baar shuffle hote hain. Result aur bilingual explanations submit karte hi milte hain.</p><div class="meta"><div><span>QUESTIONS</span><strong>${bpscTre4AllQuestions.length}</strong></div><div><span>LANGUAGE</span><strong>EN + HI</strong></div><div><span>ACCESS</span><strong>30 DAYS</strong></div></div></section>
  <main><div class="paper-heading">COMPLETE BILINGUAL QUESTION PAPER / संपूर्ण द्विभाषी प्रश्नपत्र</div><div class="instructions">Online test ke same clean format mein English aur Hindi questions diye gaye hain. Diagrams sambandhit questions ke andar maujood hain.</div>${questions}</main>
</body></html>`;

const browser = browsers.find(existsSync);
if (!browser) throw new Error("Chrome or Edge is required.");
mkdirSync(resolve(outputPath, ".."), { recursive:true });
mkdirSync(resolve(publicPath, ".."), { recursive:true });
const workDir = join(tmpdir(), `maphy-bpsc-complete-${Date.now()}`);
mkdirSync(workDir, { recursive:true });
try {
  cpSync(join(root, "node_modules", "katex", "dist", "fonts"), join(workDir, "fonts"), { recursive:true });
  const htmlPath = join(workDir, "complete-test.html");
  const profilePath = join(workDir, "chrome-profile");
  writeFileSync(htmlPath, html, "utf8");
  if (existsSync(outputPath)) rmSync(outputPath);
  if (existsSync(publicPath)) rmSync(publicPath);
  const result = spawnSync(browser, ["--headless=new", "--disable-gpu", "--disable-pdf-header-footer", "--no-pdf-header-footer", `--user-data-dir=${profilePath}`, `--print-to-pdf=${outputPath}`, pathToFileURL(htmlPath).href], { encoding:"utf8", timeout:180000 });
  if (result.status !== 0 || !existsSync(outputPath)) throw new Error(result.stderr || "PDF generation failed.");
  copyFileSync(outputPath, publicPath);
  console.log(`Created ${publicPath}`);
} finally {
  rmSync(workDir, { recursive:true, force:true });
}
