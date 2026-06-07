#!/usr/bin/env node
// find-untested.mjs — 掃描專案中「沒有對應測試檔」的原始檔，輸出覆蓋缺口。
//
// 用途：QA 開工前快速找出測試空白區，對齊 SKILL.md「覆蓋缺口」要求。
// 零相依，跨平台。Node 16+。
//
// 用法：
//   node skills/ai-qa-skill/scripts/find-untested.mjs [掃描根目錄]
//   node skills/ai-qa-skill/scripts/find-untested.mjs src
//
// 退出碼：有未測檔 → 1（可作 CI 門檻）；全部有測試 → 0。
//
// 啟發式：以「檔名基底」比對是否存在對應測試檔，例如
//   user.ts        → user.test.ts / user.spec.ts
//   service.py     → test_service.py / service_test.py
// 為粗略掃描，非精確覆蓋率；精確覆蓋率仍以 npm test --coverage / pytest --cov 為準。

import { readdirSync, statSync } from "node:fs";
import { join, extname, basename, relative, sep } from "node:path";

const ROOT = process.argv[2] || ".";

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "out", "coverage",
  ".next", ".nuxt", ".venv", "venv", "__pycache__", ".pytest_cache",
  ".turbo", ".cache", "vendor", ".idea", ".vscode",
]);

const SRC_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py"]);

const isTestFile = (name) =>
  /\.(test|spec)\.[mc]?[jt]sx?$/.test(name) ||      // *.test.ts / *.spec.tsx ...
  /^test_.*\.py$/.test(name) ||                       // test_foo.py
  /_test\.py$/.test(name);                            // foo_test.py

const isSkippableSrc = (name) =>
  /\.d\.ts$/.test(name) ||                            // 型別宣告
  /\.(config|conf)\.[mc]?[jt]s$/.test(name) ||        // *.config.ts
  /^(conftest|setup|__init__)\.py$/.test(name) ||
  /\.stories\.[jt]sx?$/.test(name);                   // storybook

const allFiles = [];
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) {
      if (!IGNORE_DIRS.has(e) && !e.startsWith(".")) walk(p);
    } else {
      allFiles.push(p);
    }
  }
}
walk(ROOT);

// 收集所有測試檔的「基底名」集合，供比對。
const testBaseNames = new Set();
for (const f of allFiles) {
  const name = basename(f);
  if (!isTestFile(name)) continue;
  // user.test.ts → user ; test_service.py → service ; service_test.py → service
  let base = name
    .replace(/\.(test|spec)\.[mc]?[jt]sx?$/, "")
    .replace(/^test_/, "")
    .replace(/_test\.py$/, "")
    .replace(/\.py$/, "");
  testBaseNames.add(base.toLowerCase());
}

const srcFiles = allFiles.filter((f) => {
  const name = basename(f);
  return SRC_EXT.has(extname(f)) && !isTestFile(name) && !isSkippableSrc(name);
});

const untested = [];
for (const f of srcFiles) {
  const base = basename(f).replace(/\.[mc]?[jt]sx?$/, "").replace(/\.py$/, "").toLowerCase();
  if (!testBaseNames.has(base)) untested.push(f);
}

const total = srcFiles.length;
const tested = total - untested.length;
const pct = total === 0 ? 100 : Math.round((tested / total) * 1000) / 10;

console.log("=== AI QA：測試覆蓋缺口掃描 ===");
console.log(`掃描根目錄：${ROOT}`);
console.log(`原始檔：${total}  有對應測試：${tested}  缺測試：${untested.length}  （檔案層粗估 ${pct}%）`);

if (untested.length) {
  console.log("\n--- 缺少對應測試的原始檔 ---");
  for (const f of untested.sort()) {
    console.log("  ⨯ " + relative(ROOT, f).split(sep).join("/"));
  }
  console.log(
    "\n建議：依 SKILL.md 為上列檔案補可執行測試（正向/反向/邊界/異常），" +
    "並以 npm test --coverage / pytest --cov 取得精確覆蓋率。"
  );
  process.exit(1);
} else {
  console.log("\n✅ 每個原始檔都有對應測試檔（檔名層比對）。仍請以實際覆蓋率報告確認行覆蓋。");
  process.exit(0);
}
