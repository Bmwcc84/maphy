import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bpscTre4AllQuestions } from "../lib/bpsc-tre-4-series.ts";

const root = resolve(import.meta.dirname, "..");
const outputDir = join(root, "output", "question-bank");
const publicDir = join(root, "public", "downloads");
const outputPath = join(outputDir, "bpsc-tre-4-all-extracted-questions.md");
const publicPath = join(publicDir, "bpsc-tre-4-all-extracted-questions.md");

const letters = ["A", "B", "C", "D"];
const sections = bpscTre4AllQuestions.map((question, index) => {
  const options = question.options.map(
    ([english, hindi], optionIndex) =>
      `${letters[optionIndex]}. ${english}\n   ${hindi}`,
  ).join("\n");
  const correct = question.options[question.correctOption];

  return `## Question ${index + 1}\n\n` +
    `**English:** ${question.question[0]}\n\n` +
    `**Hindi:** ${question.question[1]}\n\n` +
    `${options}\n\n` +
    `**Correct answer:** ${letters[question.correctOption]}. ${correct[0]} / ${correct[1]}\n\n` +
    `**Explanation:** ${question.explanation[0]}\n\n` +
    `**व्याख्या:** ${question.explanation[1]}\n\n` +
    `**Source page:** ${question.sourcePage}`;
});

const document = `# BPSC Teacher TRE 4.0 Physics - Extracted Question Bank\n\n` +
  `MAPHY | www.maphy.in\n\n` +
  `Total complete questions: ${bpscTre4AllQuestions.length}\n\n` +
  `Language: English + Hindi\n\n` +
  `This collection contains every complete question visible in Document 38. ` +
  `Fragments cut off at page boundaries are not included.\n\n---\n\n` +
  sections.join("\n\n---\n\n") + "\n";

mkdirSync(outputDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });
writeFileSync(outputPath, `\uFEFF${document}`, "utf8");
copyFileSync(outputPath, publicPath);
console.log(`Created ${outputPath}`);
console.log(`Published ${publicPath}`);
