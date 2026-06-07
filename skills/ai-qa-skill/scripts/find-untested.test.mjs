#!/usr/bin/env node
// find-untested.test.mjs — find-untested.mjs 的回歸測試（零相依，Node 內建 node:test）。
//
// 以身作則：本專案唯一的程式碼也要有可執行測試，符合 SKILL.md
// 「每個原始檔都要有對應測試」鐵律。
//
// 執行：node --test skills/ai-qa-skill/scripts/find-untested.test.mjs
//
// 策略：在臨時目錄建假專案 fixture，以子行程實跑 find-untested.mjs，
// 斷言其 stdout 與 exit code（黑箱、不依賴內部實作）。

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "find-untested.mjs");

// 建立臨時 fixture 目錄，files 為 { 相對路徑: 內容 } 映射。
function makeFixture(files) {
  const root = mkdtempSync(join(tmpdir(), "find-untested-"));
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content ?? "");
  }
  return root;
}

// 以子行程實跑腳本，回傳 { code, stdout }。
function run(root) {
  const r = spawnSync(process.execPath, [SCRIPT, root], { encoding: "utf8" });
  return { code: r.status, stdout: r.stdout || "" };
}

test("正向：原始檔有對應測試 → exit 0", () => {
  const root = makeFixture({
    "src/user.ts": "export const u = 1;",
    "src/user.test.ts": "test('u', () => {});",
  });
  try {
    const { code, stdout } = run(root);
    assert.equal(code, 0, "全部有測試應 exit 0");
    assert.match(stdout, /每個原始檔都有對應測試檔/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("反向：原始檔缺測試 → exit 1 並列出該檔", () => {
  const root = makeFixture({
    "src/orphan.ts": "export const x = 1;",
  });
  try {
    const { code, stdout } = run(root);
    assert.equal(code, 1, "有未測檔應 exit 1（可作 CI 門檻）");
    assert.match(stdout, /缺測試：1/);
    assert.match(stdout, /orphan\.ts/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Python 命名：service.py + test_service.py → 視為已測", () => {
  const root = makeFixture({
    "pkg/service.py": "def f(): ...",
    "pkg/test_service.py": "def test_f(): ...",
  });
  try {
    const { code } = run(root);
    assert.equal(code, 0, "test_*.py 應被認得為對應測試");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("邊界：node_modules 等忽略目錄不計入原始檔", () => {
  const root = makeFixture({
    "src/app.ts": "export const a = 1;",
    "src/app.test.ts": "test('a', () => {});",
    "node_modules/dep/index.js": "module.exports = {};", // 不應被當成未測原始檔
  });
  try {
    const { code, stdout } = run(root);
    assert.equal(code, 0, "node_modules 內檔案不應導致 exit 1");
    assert.doesNotMatch(stdout, /node_modules/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("邊界：型別宣告/設定檔等 skippable 檔不算需測原始檔", () => {
  const root = makeFixture({
    "types.d.ts": "export {};",
    "vite.config.ts": "export default {};",
    "pkg/__init__.py": "",
  });
  try {
    const { code, stdout } = run(root);
    assert.equal(code, 0, ".d.ts / .config.ts / __init__.py 應被略過");
    assert.match(stdout, /原始檔：0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("異常：空專案（無原始檔）→ exit 0、覆蓋率 100%", () => {
  const root = makeFixture({ "README.md": "# empty" });
  try {
    const { code, stdout } = run(root);
    assert.equal(code, 0);
    assert.match(stdout, /原始檔：0/);
    assert.match(stdout, /100%/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
