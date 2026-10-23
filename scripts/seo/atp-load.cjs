// Carrega os CSV do AnswerThePublic de dados-seo/AnswerthePublic em uma lista unica. Uso: node scripts/seo/atp-load.cjs
const fs = require("node:fs"), path = require("node:path");
const DIR = path.resolve(__dirname, "../../dados-seo/AnswerthePublic");

function parseCsv(text) {
  const rows = []; let row = [], cur = "", q = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.length > 1) rows.push(row); row = []; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const vol = (s) => { s = String(s).trim(); if (!s || s === "-") return 0; const m = s.match(/^([\d.,]+)\s*([KkMm]?)$/); if (!m) return 0; let n = parseFloat(m[1].replace(",", ".")); if (m[2].toLowerCase() === "k") n *= 1000; if (m[2].toLowerCase() === "m") n *= 1e6; return Math.round(n); };
const cpc = (s) => { const n = parseFloat(String(s).replace(",", ".")); return Number.isFinite(n) ? n : 0; };

const all = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".csv"))) {
  const rows = parseCsv(fs.readFileSync(path.join(DIR, f), "utf8"));
  const head = rows[0];
  for (const r of rows.slice(1)) {
    const o = Object.fromEntries(head.map((h, i) => [h.trim(), r[i]]));
    all.push({ seed: o["Search Term"], platform: o["Platform"], type: o["Modifier Type"], mod: o["Modifier"], kw: (o["Keyword"] || "").trim().toLowerCase(), vol: vol(o["Search Vol."]), cpc: cpc(o["CPC (US$)"]) });
  }
}
module.exports = { all };
if (require.main === module) {
  console.log("linhas:", all.length);
  const by = (k) => all.reduce((m, r) => ((m[r[k]] = (m[r[k]] || 0) + 1), m), {});
  console.log("por plataforma:", by("platform")); console.log("por tipo:", by("type")); console.log("por semente:", by("seed"));
  const uniq = new Map(); for (const r of all) { const k = r.platform + "|" + r.kw; if (!uniq.has(k) || uniq.get(k).vol < r.vol) uniq.set(k, r); }
  console.log("termos únicos (plataforma+termo):", uniq.size, "| com volume > 0:", [...uniq.values()].filter((r) => r.vol > 0).length);
}
