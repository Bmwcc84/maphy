from __future__ import annotations

import base64
import json
import shutil
import subprocess
import tempfile
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SETS_DATA_PATH = (
    ROOT / "content" / "tests" / "class-12-board-2027-electrostatics-sets.json"
)
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public" / "downloads"
LEGACY_FILENAME = "class-12-board-2027-electrostatics-test.pdf"
LOGO_PATH = ROOT / "public" / "maphy-logo-mark.png"

CHROME_CANDIDATES = (
    Path("C:/Program Files/Google/Chrome/Application/chrome.exe"),
    Path("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"),
    Path("C:/Program Files/Microsoft/Edge/Application/msedge.exe"),
    Path("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"),
)


def find_browser() -> Path:
    for candidate in CHROME_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Chrome or Edge is required to generate the PDF")


def logo_data_uri() -> str:
    if not LOGO_PATH.exists():
        raise FileNotFoundError(f"MAPHY logo not found: {LOGO_PATH}")
    encoded = base64.b64encode(LOGO_PATH.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def bilingual_block(english: str, hindi: str, class_name: str) -> str:
    hindi_markup = ""
    if hindi != english:
        hindi_markup = f'<div class="{class_name}-hi" lang="hi">{escape(hindi)}</div>'
    return f'<div class="{class_name}-en">{escape(english)}</div>{hindi_markup}'


def question_markup(question: dict[str, object], index: int) -> str:
    options: list[str] = []
    for option_index, option in enumerate(question["options"]):
        letter = chr(65 + option_index)
        options.append(
            """
            <div class="option">
              <strong class="option-letter">{letter}.</strong>
              <div class="option-copy">{copy}</div>
            </div>
            """.format(
                letter=letter,
                copy=bilingual_block(option["en"], option["hi"], "option-text"),
            )
        )

    return """
    <section class="question">
      <div class="question-heading">
        <strong class="question-number">{index}.</strong>
        <div class="question-copy">{copy}</div>
      </div>
      <div class="options">{options}</div>
    </section>
    """.format(
        index=index,
        copy=bilingual_block(
            question["questionEn"], question["questionHi"], "question-text"
        ),
        options="".join(options),
    )


def build_html(data: dict[str, object]) -> str:
    set_number = int(data["number"])
    question_count = len(data["questions"])
    questions = "".join(
        question_markup(question, index)
        for index, question in enumerate(data["questions"], start=1)
    )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(data['titleEn'])}</title>
  <style>
    @page {{
      size: A4;
      margin: 14mm 16mm 19mm;
    }}

    * {{ box-sizing: border-box; }}

    html {{
      font-family: "Nirmala UI", "Noto Sans Devanagari", "Mangal", "Segoe UI", Arial, sans-serif;
      color: #07111f;
      font-synthesis: none;
    }}

    body {{ margin: 0; background: #ffffff; }}

    .page-header {{
      position: static;
      height: 15mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5mm;
      background: #07111f;
      color: #ffffff;
      margin-bottom: 6mm;
    }}

    .brand {{ display: flex; align-items: center; gap: 2.5mm; font-weight: 800; }}
    .brand img {{ width: 10mm; height: 10mm; object-fit: contain; }}
    .series {{ color: #a5f3fc; font-size: 7pt; font-weight: 700; }}

    .page-footer {{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 0.3mm solid #cbd5e1;
      padding-top: 2.5mm;
      color: #475569;
      font-size: 7pt;
      text-align: center;
      z-index: 10;
    }}

    .watermark {{
      position: fixed;
      top: 47%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-32deg);
      color: rgba(51, 65, 85, 0.055);
      font-size: 35pt;
      font-weight: 800;
      white-space: nowrap;
      z-index: -1;
    }}

    .cover {{ margin-bottom: 5mm; }}
    .cover h1 {{ margin: 0; font-size: 21pt; line-height: 1.25; }}
    .cover .title-hi {{ margin-top: 1.5mm; color: #087b91; font-size: 14pt; font-weight: 700; }}

    .meta {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      margin: 5mm 0;
      border: 0.3mm solid #cbd5e1;
      text-align: center;
    }}

    .meta > div {{ padding: 2.5mm; border-left: 0.3mm solid #cbd5e1; }}
    .meta > div:first-child {{ border-left: 0; }}
    .meta span {{ display: block; color: #475569; font-size: 7.5pt; font-weight: 700; }}
    .meta strong {{ display: block; margin-top: 1mm; font-size: 10pt; }}

    .instructions {{ margin: 0 0 4mm; color: #334155; font-size: 8.5pt; line-height: 1.5; }}
    .instructions p {{ margin: 1mm 0; }}

    .section-title {{
      margin: 0 0 4mm;
      padding: 2.5mm;
      background: #087b91;
      color: #ffffff;
      font-size: 10pt;
      font-weight: 800;
      text-align: center;
    }}

    .question {{
      break-inside: avoid;
      margin: 0 0 4.5mm;
      padding-bottom: 3mm;
      border-bottom: 0.25mm solid #dbe4ee;
    }}

    .question-heading {{ display: flex; gap: 2mm; font-size: 9.5pt; line-height: 1.45; }}
    .question-number {{ flex: 0 0 auto; color: #087b91; }}
    .question-copy {{ min-width: 0; }}
    .question-text-en {{ font-weight: 700; }}
    .question-text-hi {{ margin-top: 1mm; color: #334155; font-weight: 600; }}

    .options {{ margin: 2mm 0 0 7mm; }}
    .option {{
      display: flex;
      gap: 2mm;
      min-height: 6mm;
      padding: 1.2mm 2mm;
      border-top: 0.2mm solid #eef2f7;
      color: #334155;
      font-size: 8.4pt;
      line-height: 1.4;
    }}
    .option:first-child {{ border-top: 0; }}
    .option-letter {{ flex: 0 0 5mm; color: #087b91; }}
    .option-copy {{ min-width: 0; }}
    .option-text-hi {{ margin-top: 0.5mm; color: #475569; }}

  </style>
</head>
<body>
  <header class="page-header">
    <div class="brand"><img src="{logo_data_uri()}" alt=""><span>MAPHY</span></div>
    <div class="series">CLASS 12 BOARD 2027 | PHYSICS TEST SERIES</div>
  </header>
  <footer class="page-footer">www.maphy.in | Electrostatics Set {set_number:02d} | Bilingual Question Paper</footer>
  <div class="watermark">www.maphy.in</div>

  <main>
    <section class="cover">
      <h1>{escape(data['titleEn'])}</h1>
      <div class="title-hi" lang="hi">{escape(data['titleHi'])}</div>
    </section>

    <section class="meta">
      <div><span>Questions</span><strong>{question_count}</strong></div>
      <div><span>Marks</span><strong>{question_count}</strong></div>
      <div><span>Suggested time</span><strong>45 minutes</strong></div>
    </section>

    <section class="instructions">
      <p><strong>Instructions:</strong> Choose the most appropriate option. The answer key is available after submitting the online test on MAPHY.</p>
      <p lang="hi"><strong>निर्देश:</strong> सबसे उपयुक्त विकल्प चुनें। उत्तर-कुंजी और व्याख्या देखने के लिए MAPHY पर ऑनलाइन टेस्ट सबमिट करें।</p>
    </section>

    <div class="section-title">SECTION A - ELECTROSTATICS / स्थिर वैद्युतिकी</div>
    {questions}

  </main>
</body>
</html>
"""


def render_pdf(browser: Path, data: dict[str, object]) -> tuple[Path, Path]:
    set_number = int(data["number"])
    filename = f"class-12-board-2027-electrostatics-test-set-{set_number:02d}.pdf"
    output_path = OUTPUT_DIR / filename
    public_path = PUBLIC_DIR / filename
    html = build_html(data)

    with tempfile.TemporaryDirectory(prefix="maphy-board-pdf-") as temp_dir_value:
        temp_dir = Path(temp_dir_value)
        html_path = temp_dir / f"electrostatics-test-set-{set_number:02d}.html"
        profile_path = temp_dir / "chrome-profile"
        html_path.write_text(html, encoding="utf-8")

        command = [
            str(browser),
            "--headless=new",
            "--disable-gpu",
            "--disable-pdf-header-footer",
            "--no-pdf-header-footer",
            f"--user-data-dir={profile_path}",
            f"--print-to-pdf={output_path}",
            html_path.resolve().as_uri(),
        ]
        subprocess.run(command, check=True, timeout=120)

    if not output_path.exists() or output_path.stat().st_size == 0:
        raise RuntimeError(f"Browser did not create {filename}")

    shutil.copy2(output_path, public_path)
    return output_path, public_path


def build_pdf() -> None:
    payload = json.loads(SETS_DATA_PATH.read_text(encoding="utf-8"))
    tests = payload.get("tests", [])
    if len(tests) != 4:
        raise ValueError("Expected exactly four Electrostatics test sets")
    if any(len(test["questions"]) != 30 for test in tests):
        raise ValueError("Every Electrostatics set must contain exactly 30 questions")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    browser = find_browser()
    generated: list[tuple[Path, Path]] = []
    for test in tests:
        generated.append(render_pdf(browser, test))

    legacy_output = OUTPUT_DIR / LEGACY_FILENAME
    legacy_public = PUBLIC_DIR / LEGACY_FILENAME
    shutil.copy2(generated[0][0], legacy_output)
    shutil.copy2(generated[0][0], legacy_public)

    for output_path, public_path in generated:
        print(f"Created {output_path}")
        print(f"Published {public_path}")
    print(f"Updated legacy Set 01 download: {legacy_public}")


if __name__ == "__main__":
    build_pdf()
