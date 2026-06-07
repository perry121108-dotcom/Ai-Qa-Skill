#!/usr/bin/env node
// schema-signature.mjs — 從 AI 輸出樣本擷取「結構簽章」，偵測 schema 漂移。
//
// 對應 SKILL.md 5.1 結構強固性 / OWASP LLM05。解的痛點：
// 模型改版後悄悄改欄位名、改型別、拿掉必填，下游無聲崩壞。
// 做法：把輸出的「欄位路徑 → 型別」固化成 golden 簽章，CI 比對，漂移即 fail。
//
// 零相依，跨平台。Node 16+。
//
// 用法：
//   產生簽章：  node schema-signature.mjs <output.json>            （印出簽章 JSON）
//   存成 golden：node schema-signature.mjs <output.json> > golden.json
//   CI 比對：    node schema-signature.mjs <output.json> --check golden.json
//   讀 stdin：   cat out.json | node schema-signature.mjs -
//
// 退出碼（--check）：無漂移 → 0；有漂移 → 1（可作 CI 門檻）。

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const checkIdx = args.indexOf("--check");
const goldenPath = checkIdx !== -1 ? args[checkIdx + 1] : null;
const inputPath = args.find((a, i) => a !== "--check" && args[i - 1] !== "--check");

if (!inputPath) {
  console.error("用法：node schema-signature.mjs <output.json> [--check golden.json]");
  process.exit(2);
}

function readJSON(path) {
  const raw = path === "-" ? readFileSync(0, "utf8") : readFileSync(path, "utf8");
  return JSON.parse(raw);
}

// 遞迴擷取「路徑 → 型別」。陣列以第一個元素取樣並標記 path[]。
function buildSig(node, prefix, out) {
  if (Array.isArray(node)) {
    out[prefix + "[]"] = "array";
    if (node.length) buildSig(node[0], prefix + "[]", out);
    return;
  }
  if (node && typeof node === "object") {
    if (prefix) out[prefix] = "object";
    for (const k of Object.keys(node)) {
      buildSig(node[k], prefix ? `${prefix}.${k}` : k, out);
    }
    return;
  }
  out[prefix] = node === null ? "null" : typeof node;
}

function signatureOf(data) {
  const out = {};
  buildSig(data, "", out);
  // 排序後輸出，確保穩定 diff
  return Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
}

const current = signatureOf(readJSON(inputPath));

if (!goldenPath) {
  // 產生模式：印出簽章供存成 golden
  console.log(JSON.stringify(current, null, 2));
  process.exit(0);
}

// 比對模式
const golden = readJSON(goldenPath);
const added = [];
const removed = [];
const changed = [];

for (const k of Object.keys(current)) {
  if (!(k in golden)) added.push(`${k}: ${current[k]}`);
  else if (golden[k] !== current[k]) changed.push(`${k}: ${golden[k]} → ${current[k]}`);
}
for (const k of Object.keys(golden)) {
  if (!(k in current)) removed.push(`${k}: ${golden[k]}`);
}

console.log("=== AI QA：Schema 漂移偵測 ===");
if (!added.length && !removed.length && !changed.length) {
  console.log("✅ 無 schema 漂移（與 golden 一致）");
  process.exit(0);
}
if (removed.length) console.log("\n[移除/改名 — 欄位消失]\n  - " + removed.join("\n  - "));
if (changed.length) console.log("\n[型別漂移]\n  ~ " + changed.join("\n  ~ "));
if (added.length)   console.log("\n[新增欄位]\n  + " + added.join("\n  + "));
console.log("\n⚠️ 偵測到 schema 漂移。若為預期變更，請更新 golden；否則視為破壞性變更需處理。");
process.exit(1);
