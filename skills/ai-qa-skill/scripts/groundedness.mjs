#!/usr/bin/env node
// groundedness.mjs — 確定性 groundedness 基線檢查：逐條主張對 context 比對，揪出無依據（幻覺）主張。
//
// 對應 SKILL.md 5.3 誠信邊界 / OWASP LLM09（錯誤資訊）。概念取自 RAGAS faithfulness：
// 把 AI 回答拆成原子主張，逐條檢查是否被提供的 context 支撐；無依據者判定為幻覺。
//
// ⚠️ 定位：這是「確定性 token 重疊基線」，適合**擷取式/事實型**輸出做快速 CI 門檻。
//    語意改寫、同義詞、推理型主張請改用 LLM-as-judge（見 GROUNDEDNESS_QA_RULES.md）。
//
// 零相依，跨平台。Node 16+。
//
// 輸入 JSON（檔案或 stdin "-"）：
//   { "context": "...文字..." | ["片段1","片段2"], "claims": ["主張1","主張2"] }
//
// 用法：
//   node groundedness.mjs input.json
//   node groundedness.mjs input.json --threshold 0.6
//   cat input.json | node groundedness.mjs -
//
// 退出碼：全部主張有依據 → 0；有無依據主張 → 1（可作 CI 門檻）。

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const tIdx = args.indexOf("--threshold");
const threshold = tIdx !== -1 ? parseFloat(args[tIdx + 1]) : 0.6;
const inputPath = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--threshold");

if (!inputPath) {
  console.error('用法：node groundedness.mjs <input.json> [--threshold 0.6]');
  console.error('input.json: { "context": string|string[], "claims": string[] }');
  process.exit(2);
}

const STOP = new Set([
  // en
  "the","a","an","is","are","was","were","of","to","in","on","and","or","for","with","as","at","by","it","this","that","be","you","your","i",
  // zh 常見虛詞
  "的","了","是","在","和","與","也","就","都","而","及","或","你","我","他","它","這","那","有","會","可以","請","把",
]);

function tokenize(text) {
  const lower = String(text).toLowerCase();
  const tokens = [];
  // 拉丁字詞 + 數字
  for (const m of lower.matchAll(/[a-z0-9]+/g)) tokens.push(m[0]);
  // CJK 單字
  for (const m of lower.matchAll(/[一-鿿]/g)) tokens.push(m[0]);
  return tokens.filter((t) => t.length > 1 || /[一-鿿0-9]/.test(t)).filter((t) => !STOP.has(t));
}

const data = JSON.parse(inputPath === "-" ? readFileSync(0, "utf8") : readFileSync(inputPath, "utf8"));
const contextText = Array.isArray(data.context) ? data.context.join(" ") : (data.context || "");
const contextSet = new Set(tokenize(contextText));
const claims = data.claims || [];

if (!claims.length) {
  console.error("input 無 claims 可檢查");
  process.exit(2);
}

const results = claims.map((claim) => {
  const toks = tokenize(claim);
  const hit = toks.filter((t) => contextSet.has(t));
  const ratio = toks.length ? hit.length / toks.length : 0;
  return { claim, ratio, supported: ratio >= threshold };
});

console.log("=== AI QA：Groundedness 基線檢查 ===");
console.log(`門檻：${threshold}　主張數：${results.length}`);
let unsupported = 0;
for (const r of results) {
  const tag = r.supported ? "✅ 有依據" : "⨯ 無依據(疑似幻覺)";
  if (!r.supported) unsupported++;
  console.log(`  ${tag}  [${r.ratio.toFixed(2)}]  ${r.claim}`);
}
if (unsupported) {
  console.log(`\n⚠️ ${unsupported} 條主張無 context 依據（疑似幻覺）。請補來源、改為「待確認」，或改用 LLM-as-judge 複核。`);
  process.exit(1);
} else {
  console.log("\n✅ 所有主張皆有 context 依據（基線）。語意型主張建議再以 LLM-as-judge 複核。");
  process.exit(0);
}
