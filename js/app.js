/* ============================================================
   人类学思想史 — 交互与可视化
   三种视图：st 观点时间线 / pt 人物时间线 / pg 人物图谱
   ============================================================ */
(function () {
"use strict";

const D = window.ANTHRO_DATA;
const FONT = '-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif';

/* ---------------- 数据索引 ---------------- */
const people = D.people;
const personById = new Map();
const stmts = [];
people.forEach(p => {
  personById.set(p.id, p);
  p.stmtList = [];
  p.statements.forEach((s, i) => {
    s.person = p;
    if (!s.id) s.id = p.id + "-" + i;
    s.rel = [];
    p.stmtList.push(s);
    stmts.push(s);
  });
});
const stmtById = new Map(stmts.map(s => [s.id, s]));

/* 文献与地理元数据（js/meta.js） */
const META = window.ANTHRO_META || { homes: {}, sites: {}, works: {} };
stmts.forEach(s => { s.workEn = META.works[s.id] || ""; });
people.forEach(p => {
  p.home = META.homes[p.id] || null;
  p.sites = (META.sites[p.id] || []).map(a => ({ name: a[0], lon: a[1], lat: a[2] }));
});

const bornLabel = p => (p.bornApprox ? "约 " : "") + p.born;   // 生年不确定者标“约”

const edges = [];                    // 跨学者的观点级关系（画布、统计、导出使用）
const intraEdges = [];               // 同一学者内部的承接（只在详情/索引里显示，不画在画布上）
const seenEdge = new Set();
stmts.forEach(s => (s.links || []).forEach(l => {
  const t = stmtById.get(l.to);
  if (!t) { console.warn("未找到关联观点：", s.id, "->", l.to); return; }
  s.rel.push({ other: t, type: l.type, note: l.note });     // 详情抽屉用：含同一学者内部关系
  if (t.person === s.person) { intraEdges.push({ a: s, b: t, type: l.type, note: l.note }); return; }
  const k = (s.id < t.id ? s.id + "|" + t.id : t.id + "|" + s.id) + ":" + l.type;
  if (seenEdge.has(k)) return;                              // 双向重复只画一次
  seenEdge.add(k);
  edges.push({ a: s, b: t, type: l.type, note: l.note });
}));

const pEdgeMap = new Map();          // 人物级关系（聚合）
edges.forEach(e => {
  const a = e.a.person.id, b = e.b.person.id;
  if (a === b) return;
  const key = a < b ? a + "|" + b : b + "|" + a;
  let pe = pEdgeMap.get(key);
  if (!pe) { pe = { a: a < b ? a : b, b: a < b ? b : a, list: [] }; pEdgeMap.set(key, pe); }
  pe.list.push(e);
});
const pEdges = [...pEdgeMap.values()];
const pEdgeByPair = new Map(pEdges.map(pe => [pe.a + "|" + pe.b, pe]));

const branchById = new Map(D.branches.map(b => [b.id, b]));
const periodById = new Map(D.periods.map(p => [p.id, p]));
const starter = new Set(D.starter);
const peopleByBorn = [...people].sort((a, b) => a.born - b.born);

/* ---------------- 状态 ---------------- */
const state = {
  view: "st",
  branches: new Set(D.branches.map(b => b.id)),
  periods: new Set(D.periods.map(p => p.id)),
  edges: new Set(["agree", "disagree"]),
  basics: false,        // 只保留核心人物
  keys: true,           // 只保留每位学者的“要点”观点（默认开，点距更疏朗）
  labels: true,         // 画布上显示观点文字
  q: "",
  focus: null,          // {kind:"person"|"stmt", id}
  highlightStmt: null,
  dark: false
};

/* ---------------- 画布与相机 ---------------- */
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
let W = 0, H = 0, DPR = 1;
const cams = {
  st: { x: 1900, y: 0, s: 8, fitS: 8 },
  pt: { x: 1900, y: 0, s: 8, fitS: 8 },
  pg: { x: 0, y: 0, s: 3, fitS: 3 },
  mp: { x: 0, y: 0, s: 3, fitS: 3 }
};
const cam = () => cams[state.view] || cams.st;
const P = (wx, wy) => [ (wx - cam().x) * cam().s + W / 2, (wy - cam().y) * cam().s + H / 2 ];

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  render();
}

/* ---------------- 判定 ---------------- */
const qNorm = () => state.q.trim().toLowerCase();
function matchesQuery(s) {
  const q = qNorm(); if (!q) return true;
  const p = s.person;
  const hay = [p.name, p.en || "", (p.tags || []).join(" "), (p.regions || []).join(" "),
               p.summary, s.text, s.work || "", String(s.year), branchById.get(s.branch).label].join(" ").toLowerCase();
  return hay.includes(q);
}
function stmtActive(s) {
  if (!state.branches.has(s.branch)) return false;
  if (!state.periods.has(s.person.period)) return false;
  if (state.basics && !starter.has(s.person.id)) return false;
  if (state.keys && !s.key) return false;
  if (!matchesQuery(s)) return false;
  return true;
}
function focusSet() {
  if (!state.focus) return null;
  const f = state.focus;
  if (f.kind === "person") {
    const p = personById.get(f.id); if (!p) return null;
    const set = new Set([p.id]);
    p.stmtList.forEach(s => s.rel.forEach(r => set.add(r.other.person.id)));
    return { kind: "person", ids: set };
  }
  const s = stmtById.get(f.id); if (!s) return null;
  const set = new Set(stmts.filter(x => x.rel.some(r => r.other === s)).map(x => x.person.id));
  set.add(s.person.id);
  return { kind: "stmt", ids: set, stmt: s };
}
function alphaFor(s, fs) {
  const active = stmtActive(s);
  let a = active ? 1 : 0.05;
  if (a === 1 && fs) {
    if (fs.kind === "person") { if (!fs.ids.has(s.person.id)) a = 0.06; }
    else if (s !== fs.stmt && !s.rel.some(r => r.other === fs.stmt)) a = 0.06;
  }
  return a;
}

/* ---------------- 时间刻度：按内容密度自适应 ---------------- */
/* 年份 → 画布 x 的非线性映射（密度均衡）：观点与生年密集的年代占更宽的横向空间，
   稀疏年代被压缩但保底，整体跨度仍等于年份跨度（缩放、取景与 URL 参数逻辑不变）。 */
const TIME = (() => {
  const samples = [];
  stmts.forEach(s => { samples.push(s.year); if (s.key) samples.push(s.year); });   // 要点加权：默认视图只显要点
  people.forEach(p => samples.push(p.born));
  samples.sort((a, b) => a - b);
  const BIN = 5;                                     // 5 年一档数密度
  const y0 = Math.floor(samples[0] / 10) * 10 - 10;
  const y1 = Math.ceil(samples[samples.length - 1] / 10) * 10 + 10;
  const n = Math.round((y1 - y0) / BIN);
  const raw = new Array(n).fill(0);
  samples.forEach(y => { raw[Math.min(n - 1, Math.max(0, Math.floor((y - y0) / BIN)))]++; });
  const C = 2;                                       // 每档保底权重：空年代也不会被压成一条线
  const w = raw.map((c, i) => (raw[Math.max(0, i - 1)] + 2 * c + raw[Math.min(n - 1, i + 1)]) / 4 + C);
  let tot = 0; w.forEach(v => tot += v);
  const scale = (y1 - y0) / tot;
  const xs = [y0];
  w.forEach(v => xs.push(xs[xs.length - 1] + v * scale));
  return { y0: y0, y1: y1, BIN: BIN, xs: xs };
})();
function yearToX(y) {
  const t = (y - TIME.y0) / TIME.BIN, i = Math.floor(t), last = TIME.xs.length - 1;
  if (i < 0) return TIME.y0 + (y - TIME.y0);
  if (i >= last) return TIME.xs[last] + (y - TIME.y1);
  return TIME.xs[i] + (TIME.xs[i + 1] - TIME.xs[i]) * (t - i);
}
function xToYear(x) {
  const xs = TIME.xs, last = xs.length - 1;
  if (x <= xs[0]) return TIME.y0 + (x - xs[0]);
  if (x >= xs[last]) return TIME.y1 + (x - xs[last]);
  let lo = 0, hi = last;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) lo = mid; else hi = mid; }
  return TIME.y0 + (lo + (x - xs[lo]) / (xs[lo + 1] - xs[lo])) * TIME.BIN;
}

/* ---------------- 布局 ---------------- */
const layout = { st: null, pt: null, pg: null, medianYear: null };

/* ---------------- 时间轴横向舒展 ---------------- */
/* 两个时间线视图的纵向都被「行数」（领域 / 人物）卡死、横向却大量留白，
   于是把映射后的 x 再放大到「内容宽高比 ≈ 可视区宽高比」（上限见 KMAX）：
   点的横向间距随之拉开，画布也不再中间挤成一团。标尺与取点共用同一个系数。 */
const KMAX = { st: 1.8, pt: 6 };
const KT = { st: 1, pt: 1 };
let timeStretched = false;
function stretchTimeline() {
  if (timeStretched) return;
  timeStretched = true;
  const band = usableBand(), bh = Math.max(160, band.b - band.t);
  ["st", "pt"].forEach(v => {
    const p = VIEW_PAD(v), bw = Math.max(160, W - p.l - p.r);
    let minX = 1e9, maxX = -1e9;
    stmts.forEach(s => { const q = v === "st" ? s._st : s._pt;
      if (q.x < minX) minX = q.x; if (q.x > maxX) maxX = q.x; });
    const L = v === "st" ? layout.st : layout.pt;
    const cw = Math.max(1e-6, maxX - minX), ch = Math.max(1e-6, L.maxY - L.minY + 2);
    KT[v] = Math.max(1, Math.min(KMAX[v], (bw / bh) * (ch / cw)));
    if (KT[v] !== 1) stmts.forEach(s => { (v === "st" ? s._st : s._pt).x *= KT[v]; });
  });
  if (layout.medianYear != null) layout.medianYear = { st: layout.medianYear * KT.st, pt: layout.medianYear * KT.pt };
}

function buildSentenceLayout() {
  const rows = [];
  let y = 0;
  const SLOT_GAP = 2.4, ROW_PAD = 3.4, MIN_GAP = 3.0;
  D.branches.forEach(b => {
    const list = stmts.filter(s => s.branch === b.id).sort((p, q) => p.year - q.year);
    const slotLast = [];
    list.forEach(s => {
      let slot = 0;
      while (slot < slotLast.length && yearToX(s.year) - yearToX(slotLast[slot]) < MIN_GAP) slot++;
      if (slot === slotLast.length) slotLast.push(-1e9);
      slotLast[slot] = s.year;
      s._st = { x: yearToX(s.year), y: y + slot * SLOT_GAP };
    });
    const bandH = Math.max(slotLast.length, 1) * SLOT_GAP;
    rows.push({ branch: b, top: y, height: bandH, center: y + bandH / 2 });
    y += bandH + ROW_PAD;
  });
  layout.st = { rows, minY: 0, maxY: y };
}
function buildPeopleLayout() {
  const sorted = [...people].sort((a, b) => (a.born - b.born) || a.name.localeCompare(b.name));
  const ROW = 3.6, SLOT = 1.5, MIN_GAP = 2.2;
  let y = 0;
  sorted.forEach(p => {
    p._rowY = y;
    const list = [...p.stmtList].sort((a, b) => a.year - b.year);
    const slotLast = [];
    list.forEach(s => {
      let slot = 0;
      while (slot < slotLast.length && yearToX(s.year) - yearToX(slotLast[slot]) < MIN_GAP) slot++;
      if (slot === slotLast.length) slotLast.push(-1e9);
      slotLast[slot] = s.year;
      s._pt = { x: yearToX(s.year), y: y + (slot % 3) * SLOT };
    });
    y += ROW;
  });
  layout.pt = { order: sorted, minY: 0, maxY: y };
}
function buildGraph() {
  const nodes = people.map((p, i) => {
    const a = i * 2.399963, r = 8 * Math.sqrt(i + 1);
    return { p, x: Math.cos(a) * r * 1.4, y: Math.sin(a) * r, deg: 0 };
  });
  const byId = new Map(nodes.map(n => [n.p.id, n]));
  const links = pEdges.map(pe => ({ a: byId.get(pe.a), b: byId.get(pe.b), w: 1 + 0.45 * Math.min(3, pe.list.length - 1), pe }));
  links.forEach(l => { l.a.deg++; l.b.deg++; });
  const n = nodes.length, area = 470 * 330, k = Math.sqrt(area / n);
  for (let it = 0; it < 480; it++) {
    const alpha = 1 - it / 480;
    nodes.forEach(nd => { nd.dx = 0; nd.dy = 0; });
    for (let i = 0; i < n; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < n; j++) {
        const b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 0.01) { dx = (i + 1) * 0.01; dy = (j + 1) * 0.01; d2 = 0.01; }
        const d = Math.sqrt(d2), f = (k * k) / d;
        a.dx += (dx / d) * f; a.dy += (dy / d) * f;
        b.dx -= (dx / d) * f; b.dy -= (dy / d) * f;
      }
    }
    links.forEach(l => {
      let dx = l.b.x - l.a.x, dy = l.b.y - l.a.y;
      const d = Math.hypot(dx, dy) || 0.01;
      const f = ((d - k * 1.55) / d) * 0.35 * l.w;
      l.a.dx += dx * f; l.a.dy += dy * f;
      l.b.dx -= dx * f; l.b.dy -= dy * f;
    });
    nodes.forEach(nd => {
      nd.dx -= nd.x * 0.015; nd.dy -= nd.y * 0.015;
      const cap = k * 1.1;
      nd.dx = Math.max(-cap, Math.min(cap, nd.dx));
      nd.dy = Math.max(-cap, Math.min(cap, nd.dy));
      nd.x += nd.dx * alpha * 0.8; nd.y += nd.dy * alpha * 0.8;
    });
  }
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  nodes.forEach(nd => { minX = Math.min(minX, nd.x); maxX = Math.max(maxX, nd.x); minY = Math.min(minY, nd.y); maxY = Math.max(maxY, nd.y); });
  const pad = 14;
  layout.pg = { nodes, byId, links, minX: minX - pad, maxX: maxX + pad, minY: minY - pad, maxY: maxY + pad };
}
function buildMapLayout() {
  const topo = window.WORLD_TOPO;
  const path = new Path2D();
  if (topo && topo.transform) {
    const [kx, ky] = topo.transform.scale, [tx, ty] = topo.transform.translate;
    const arcs = topo.arcs.map(arc => {
      let x = 0, y = 0;
      return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * kx + tx, y * ky + ty]; });
    });
    const ringOf = idxs => {
      let pts = [];
      idxs.forEach((idx, i) => {
        let a = arcs[idx < 0 ? ~idx : idx];
        if (idx < 0) a = a.slice().reverse();
        pts = pts.concat(i ? a.slice(1) : a);
      });
      return pts;
    };
    const addRing = pts => {
      const p0 = mapPt(pts[0][0], pts[0][1]);
      path.moveTo(p0[0], p0[1]);
      for (let i = 1; i < pts.length; i++) { const q = mapPt(pts[i][0], pts[i][1]); path.lineTo(q[0], q[1]); }
      path.closePath();
    };
    topo.objects.countries.geometries.forEach(g => {
      const polys = g.type === "Polygon" ? [g.arcs] : g.arcs;
      polys.forEach(poly => poly.forEach(ri => addRing(ringOf(ri))));
    });
  }
  /* 海洋底色：投影边界（经度 ±180 的上下边界连成闭合轮廓） */
  const outline = new Path2D();
  for (let lat = -90; lat <= 90; lat += 2) {
    const q = mapPt(180, lat);
    if (lat === -90) outline.moveTo(q[0], q[1]); else outline.lineTo(q[0], q[1]);
  }
  for (let lat = 90; lat >= -90; lat -= 2) { const q = mapPt(-180, lat); outline.lineTo(q[0], q[1]); }
  outline.closePath();
  const siteMap = new Map();
  people.forEach(p => (p.sites || []).forEach(site => {
    const key = site.name + "|" + Math.round(site.lon) + "|" + Math.round(site.lat);
    let e = siteMap.get(key);
    if (!e) { e = { id: "site-" + siteMap.size, name: site.name, lon: site.lon, lat: site.lat, persons: [] }; siteMap.set(key, e); }
    e.persons.push(p);
  }));
  const homeMap = new Map();
  people.forEach(p => {
    if (!p.home) return;
    const key = p.home[0].toFixed(2) + "," + p.home[1].toFixed(2);
    let h = homeMap.get(key);
    if (!h) {
      h = { id: "home-" + homeMap.size, name: (META.cities && META.cities[key]) || key,
            lon: p.home[0], lat: p.home[1], persons: [] };
      homeMap.set(key, h);
    }
    h.persons.push(p);
  });
  layout.mp = {
    path, outline, sites: [...siteMap.values()], homes: [...homeMap.values()],
    bounds: { minX: mapX(-180), maxX: mapX(180), minY: mapY(90), maxY: mapY(-90) }
  };
}
function buildLayouts() {
  buildSentenceLayout(); buildPeopleLayout(); buildGraph(); buildMapLayout();
  const yrs = stmts.filter(s => s.key).map(s => s.year).sort((a, b) => a - b);
  layout.medianYear = yrs.length ? yearToX(yrs[Math.floor(yrs.length / 2)]) : null;   // 文字最密的一段（映射后，stretchTimeline 再乘 K）
}

/* 视图边距：fitView 用带页边距的一套；applyDefaultZoom 只留顶栏与底部图例实际占用的高度 */
const VIEW_PAD = v => v === "pg" ? { l: 100, r: 100, t: 96, b: 252 }
                   : v === "mp" ? { l: 120, r: 120, t: 100, b: 252 }
                   : v === "st" ? { l: 200, r: 80, t: 96 + AXIS_H, b: 252 }
                   : { l: 220, r: 80, t: 96 + AXIS_H, b: 252 };
const VIEW_TOP = 118, VIEW_BOTTOM = 150;

/* 顶栏与底部图例实际占用的高度：直接量 DOM，比写死数字稳（药丸换行或按钮出现时会变） */
const AXIS_H = 22;                     // 年份标尺占用的高度（st / pt 顶部）
const hasYearAxis = () => state.view === "st" || state.view === "pt";
const axisBaseY = () => usableBand().t - 6;            // 标尺线的 y（在内容带上方那条预留带里）
function usableBand() {
  const bar = document.getElementById("topControlBar"), hd = document.getElementById("header");
  const t = (bar ? bar.getBoundingClientRect().bottom : VIEW_TOP) + 10 + (hasYearAxis() ? AXIS_H : 0);
  const b = (hd ? hd.getBoundingClientRect().top : H - VIEW_BOTTOM) - 10;
  return { t: Math.max(0, t), b: Math.max(t + 120, b) };
}

/* 打开某个视图时默认比「适应屏幕」再放大一档（上限见下表，窗口越大越接近上限），
   但不能超过「顶栏与底部图例之间刚好装得下全部内容」——默认取景永远不把点藏到屏幕外或压在图例下。
   实际边界直接量 DOM（药丸换行、按钮出现都会改变占用高度）。「适应屏幕」按钮可一键回到带页边距的全景 */
const DEFAULT_ZOOM = { st: 1.42, pt: 1.18, pg: 1.3, mp: 1.16 };
function applyDefaultZoom(v) {
  const c = cams[v];
  if (!c || !c.fitS) return;
  const b = worldBounds(), p = VIEW_PAD(v);
  const band = usableBand();
  const bw = Math.max(1e-6, b.maxX - b.minX), bh = Math.max(1e-6, b.maxY - b.minY);
  const avW = Math.max(120, W - p.l - p.r), avH = Math.max(120, band.b - band.t);
  const z = Math.max(1, Math.min(DEFAULT_ZOOM[v] || 1, avW / (bw * c.fitS), avH / (bh * c.fitS)));
  c.s = c.fitS * z;
  // 横向：内容比可用区宽时从文字最密的年份看起，否则整段居中
  const wide = bw * c.s > avW;
  const mid = layout.medianYear && layout.medianYear[v];
  const wantX = (wide && mid != null) ? mid : (b.minX + b.maxX) / 2;
  c.x = wantX - ((p.l + avW / 2) - W / 2) / c.s;
  if (wide) {
    const halfW = W / 2 / c.s;
    c.x = Math.max(b.minX - 60 / c.s + halfW, Math.min(b.maxX + 60 / c.s - halfW, c.x));
  }
  // 纵向：内容在顶栏与底部图例之间居中
  c.y = (b.minY + b.maxY) / 2 - ((band.t + avH / 2) - H / 2) / c.s;
  render();
}

/* ---------------- 视图边界与适配 ---------------- */
function worldBounds() {
  if (state.view === "pg") { const g = layout.pg; return { minX: g.minX, maxX: g.maxX, minY: g.minY, maxY: g.maxY }; }
  if (state.view === "mp") return layout.mp.bounds;
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  stmts.forEach(s => {
    const pos = state.view === "st" ? s._st : s._pt;
    minX = Math.min(minX, pos.x); maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y); maxY = Math.max(maxY, pos.y);
  });
  if (state.view === "st") { minY = Math.min(minY, layout.st.minY); maxY = Math.max(maxY, layout.st.maxY); }
  else { minY = Math.min(minY, layout.pt.minY); maxY = Math.max(maxY, layout.pt.maxY + 2); }
  return { minX: minX - 4, maxX: maxX + 4, minY, maxY };
}
function fitView() {
  if (state.view === "ix") return;   // 索引视图为 HTML 列表，不需要画布适配
  const b = worldBounds();
  const pad = VIEW_PAD(state.view);
  const vw = Math.max(120, W - pad.l - pad.r), vh = Math.max(120, H - pad.t - pad.b);
  const s = Math.min(vw / Math.max(1e-6, b.maxX - b.minX), vh / Math.max(1e-6, b.maxY - b.minY));
  const c = cam();
  c.s = s; c.fitS = s;
  const cxS = pad.l + vw / 2, cyS = pad.t + vh / 2;
  c.x = (b.minX + b.maxX) / 2 - (cxS - W / 2) / s;
  c.y = (b.minY + b.maxY) / 2 - (cyS - H / 2) / s;
  render();
}
function zoomBy(factor, sx, sy) {
  const c = cam();
  const s0 = c.s;
  const s1 = Math.max(c.fitS * 0.45, Math.min(c.fitS * 26, s0 * factor));
  const wx = (sx - W / 2) / s0 + c.x, wy = (sy - H / 2) / s0 + c.y;
  c.s = s1;
  c.x = wx - (sx - W / 2) / s1; c.y = wy - (sy - H / 2) / s1;
  render();
}
function centerOn(wx, wy, minScale) {
  const c = cam();
  if (minScale) c.s = Math.max(c.s, minScale);
  const shift = drawer.hidden ? 0 : 210 / c.s;   // 抽屉占据右侧时，把目标移到剩余区域中心
  c.x = wx + shift; c.y = wy; render();
}

/* 当前被强调的人物/观点：悬停优先，其次是点击选中的焦点 */
function hotStmt() {
  if (hover && hover.kind === "stmt") return hover.item;
  if (state.highlightStmt) return stmtById.get(state.highlightStmt) || null;
  return null;
}
function hotKey() {
  if (hover && hover.kind === "person") return hover.item.id;
  const s = hotStmt(); if (s) return s.person.id;
  if (state.focus) {
    if (state.focus.kind === "person") return state.focus.id;
    const f = stmtById.get(state.focus.id); if (f) return f.person.id;
  }
  return null;
}
function edgeStyle(e, col) {
  const hs = hotStmt();
  if (hs) return (e.a === hs || e.b === hs) ? { a: 0.9, w: 1.7 } : { a: 0.04, w: 0.8 };
  const hp = hotKey();
  if (hp) return (e.a.person.id === hp || e.b.person.id === hp) ? { a: 0.5, w: 1.4 } : { a: 0.045, w: 0.8 };
  return { a: col.edgeA * 0.6, w: 0.9 };
}

/* ---------------- 画布文字层（观点文字 / 姓名） ---------------- */
let labelRects = [];
let labelCount = 0;
function reserveRect(x, y, w, h, pad) {
  if (!isFinite(x) || !isFinite(y) || !isFinite(w) || !isFinite(h)) return false;
  const pd = pad == null ? 2 : pad;
  const r = { x: x - pd, y: y - pd, w: w + pd * 2, h: h + pd * 2 };
  for (let i = 0; i < labelRects.length; i++) {
    const q = labelRects[i];
    if (!(r.x > q.x + q.w || r.x + r.w < q.x || r.y > q.y + q.h || r.y + r.h < q.y)) return false;
  }
  labelRects.push(r); return true;
}
function truncateToWidth(text, font, maxW) {
  ctx.font = font;
  if (ctx.measureText(text).width <= maxW) return text;
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ctx.measureText(text.slice(0, mid) + "…").width <= maxW) lo = mid; else hi = mid - 1;
  }
  return text.slice(0, lo) + "…";
}
function labelLevel() {           // 缩放越大，显示的文字越多
  const c = cam(), z = c.s / (c.fitS || 1);
  return z > 2.4 ? 3 : z > 1.45 ? 2 : 1;
}
function labelCandidates(fs, posOf) {
  const lvl = labelLevel(), max = lvl === 1 ? 140 : lvl === 2 ? 320 : 700;
  const out = [];
  stmts.forEach(s => {
    if (alphaFor(s, fs) < 0.5) return;
    const isHover = !!(hover && hover.kind === "stmt" && hover.item === s);
    const isHi = state.highlightStmt === s.id;
    const marked = !!s.key;
    if (!isHover && !isHi) {
      if (lvl === 1 && firstKeyOf.get(s.person.id) !== s) return;
      if (lvl === 2 && !marked && !(s.rel && s.rel.length)) return;
    }
    const p = posOf(s); if (!p) return;
    if (p[0] < -360 || p[0] > W + 360 || p[1] < -24 || p[1] > H + 24) return;
    out.push({ s, p, marked, isHover, isHi, deg: (s.rel || []).length });
  });
  out.sort((a, b) => (b.isHover - a.isHover) || (b.isHi - a.isHi) || (b.marked - a.marked)
                   || (b.deg - a.deg) || (a.s.year - b.s.year));
  return out.slice(0, max);
}
function drawStatementLabel(c, col) {
  const s = c.s;
  const tag = (s.person.tags && s.person.tags[0]) || branchById.get(s.branch).label;
  const tagFont = `10.5px ${FONT}`, textFont = c.marked ? `600 12px ${FONT}` : `12px ${FONT}`;
  const text = truncateToWidth(s.text, textFont, 460);
  ctx.font = tagFont; const tagW = ctx.measureText(tag).width + 9;
  ctx.font = textFont; const textW = ctx.measureText(text).width;
  const totalW = tagW + textW, h = 16;
  const offsets = [0, -15, 15, -30, 30, -45, 45, -60, 60];
  for (let i = 0; i < offsets.length; i++) {
    const dy = offsets[i];
    for (let k = 0; k < 2; k++) {
      const x = k === 0 ? c.p[0] + 9 : c.p[0] - 9 - totalW;
      const yBase = c.p[1] + dy;                      // 文字基线
      if (x < 6 || x + totalW > W - 6) continue;
      if (yBase < contentTop || yBase > H - 104) continue;
      if (yBase > H - 186 && x + totalW < 760) continue;   // 左下角留给标题与图例
      if (!reserveRect(x, yBase - 11, totalW, h)) continue;
      ctx.save();
      ctx.globalAlpha = c.isHover || c.isHi ? 1 : 0.94;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = tagFont; ctx.fillStyle = col.sub;
      ctx.fillText(tag, x, yBase);
      ctx.font = textFont; ctx.fillStyle = c.marked ? col.ink : col.label;
      ctx.fillText(text, x + tagW, yBase);
      ctx.restore();
      hits.push({ x: c.p[0], y: c.p[1], kind: "stmt", item: s,
                  rect: { x: x - 2, y: yBase - 12, w: totalW + 4, h: h + 2 } });
      labelCount++;
      return true;
    }
  }
  return false;
}
function drawPersonAnchorLabels(col, fs, posOf, order) {
  order.forEach(p => {
    const act = p.stmtList.filter(s => alphaFor(s, fs) > 0.5);
    if (!act.length) return;
    const anchor = act.reduce((a, b) => (b.year < a.year ? b : a), act[0]);
    const pos = posOf(anchor); if (!pos) return;
    if (pos[0] < -100 || pos[0] > W + 100 || pos[1] < 0 || pos[1] > H - 20) return;
    const years = p.died ? `${bornLabel(p)}—${p.died}` : `${bornLabel(p)}—`;
    const nameFont = `600 12.5px ${FONT}`, yearFont = `10.5px ${FONT}`;
    ctx.font = nameFont; const nw = ctx.measureText(p.name).width;
    ctx.font = yearFont; const yw = ctx.measureText(years).width;
    const totalW = nw + 6 + yw;
    const offsets = [-20, -35, 16, -50, 31, -65, 46];
    for (let i = 0; i < offsets.length; i++) {
      for (let k = 0; k < 2; k++) {
        const x = k === 0 ? pos[0] + 9 : pos[0] - 9 - totalW;
        const yBase = pos[1] + offsets[i];
        if (x < 6 || x + totalW > W - 6) continue;
        if (yBase < 16 || yBase > H - 26) continue;
        if (!reserveRect(x, yBase - 12, totalW, 17, 3)) continue;
        ctx.save();
        ctx.globalAlpha = fs && !fs.ids.has(p.id) ? 0.45 : 1;
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.strokeStyle = col.bg; ctx.lineWidth = 3;
        ctx.font = nameFont; ctx.strokeText(p.name, x, yBase);
        ctx.fillStyle = col.ink; ctx.fillText(p.name, x, yBase);
        ctx.font = yearFont; ctx.strokeText(years, x + nw + 6, yBase);
        ctx.fillStyle = col.sub; ctx.fillText(years, x + nw + 6, yBase);
        ctx.restore();
        hits.push({ x: x + nw / 2, y: yBase - 4, kind: "person", item: p,
                    rect: { x: x - 2, y: yBase - 13, w: totalW + 4, h: 18 } });
        return;
      }
    }
  });
}
function drawLabels(col, fs, posOf, order, withAnchors, preRects) {
  if (!state.labels) return;
  labelRects = preRects ? preRects.slice() : []; labelCount = 0;
  stmts.forEach(s => {                      // 先占位：所有可见圆点都不被文字压住
    if (alphaFor(s, fs) < 0.5) return;
    const p = posOf(s); if (!p) return;
    if (p[0] < -20 || p[0] > W + 20 || p[1] < -20 || p[1] > H + 20) return;
    reserveRect(p[0] - 5, p[1] - 5, 10, 10, 0);
  });
  if (withAnchors) drawPersonAnchorLabels(col, fs, posOf, order);
  labelCandidates(fs, posOf).forEach(c => drawStatementLabel(c, col));
}

const VIEW_LABELS = { st: "观点时间线", pt: "人物时间线", pg: "人物图谱", mp: "田野地图", ix: "观点索引" };

/* ---------------- 颜色 ---------------- */
const C = () => state.dark
  ? { bg: "#111316", ink: "#f2f2f2", soft: "rgba(255,255,255,.17)", grid: "rgba(255,255,255,.075)",
      label: "rgba(255,255,255,.8)", sub: "rgba(255,255,255,.44)", dotRing: "#111316",
      plate: "rgba(18,20,24,.74)", edgeA: 0.56, deep: "rgba(0,0,0,.5)",
      agree: "#5fbf6a", disagree: "#d3706a" }
  : { bg: "#fbf8f3", ink: "#16130f", soft: "rgba(40,32,20,.24)", grid: "rgba(60,45,25,.085)",
      label: "rgba(22,19,15,.82)", sub: "rgba(22,19,15,.46)", dotRing: "#fbf8f3",
      plate: "rgba(252,250,246,.8)", edgeA: 0.5, deep: "rgba(120,96,58,.10)",
      agree: "#4a9a52", disagree: "#c0524b" };

/* ---------------- 背景 ---------------- */
let bgCanvas = null, bgW = 0, bgH = 0, bgDPR = 0, bgDark = null;
function buildBackground() {
  bgW = W; bgH = H; bgDPR = DPR; bgDark = state.dark;
  bgCanvas = document.createElement("canvas");
  bgCanvas.width = Math.max(1, Math.round(W * DPR));
  bgCanvas.height = Math.max(1, Math.round(H * DPR));
  const g = bgCanvas.getContext("2d");
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const grd = g.createLinearGradient(0, 0, W * 0.45, H);
  if (state.dark) {
    grd.addColorStop(0, "#14171c"); grd.addColorStop(0.5, "#0e1013"); grd.addColorStop(1, "#0a0b0d");
  } else {
    grd.addColorStop(0, "#ffffff"); grd.addColorStop(0.5, "#fdfbf7"); grd.addColorStop(1, "#f7f2ea");
  }
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  const R = Math.max(W, H);
  const glow = (cx, cy, rad, c0) => {
    const q = g.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, rad);
    q.addColorStop(0, c0); q.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = q; g.fillRect(0, 0, W, H);
  };
  if (state.dark) {
    glow(0.82, 0.08, R * 0.60, "rgba(86,130,178,.17)");
    glow(0.08, 0.96, R * 0.58, "rgba(126,84,168,.10)");
  } else {
    glow(0.82, 0.06, R * 0.60, "rgba(255,196,116,.13)");
    glow(0.04, 0.98, R * 0.58, "rgba(146,196,224,.13)");
  }
  const vg = g.createRadialGradient(W * 0.5, H * 0.46, Math.min(W, H) * 0.28, W * 0.5, H * 0.46, R * 0.8);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, state.dark ? "rgba(0,0,0,.40)" : "rgba(126,102,64,.05)");
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const tile = document.createElement("canvas"); tile.width = 96; tile.height = 96;
  const tg = tile.getContext("2d");
  const img = tg.createImageData(96, 96);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() * 2 - 1) * 46;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 11;
  }
  tg.putImageData(img, 0, 0);
  g.globalAlpha = state.dark ? 0.4 : 0.42;
  g.fillStyle = g.createPattern(tile, "repeat");
  g.fillRect(0, 0, W, H);
  g.globalAlpha = 1;
}

/* ---------------- 渲染 ---------------- */
let hits = [];
let contentTop = 88;          // 正文文字的上边界（时间线视图里让开顶部年份标尺）
let hover = null;   // {kind,x,y,item}
let hoverPerson = null;

function render() {
  if (!layout.st) return;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const col = C();
  contentTop = hasYearAxis() ? usableBand().t + 4 : 88;
  ctx.clearRect(0, 0, W, H);
  if (!bgCanvas || bgW !== W || bgH !== H || bgDPR !== DPR || bgDark !== state.dark) buildBackground();
  ctx.drawImage(bgCanvas, 0, 0, W, H);
  hits = [];
  const isIndex = state.view === "ix";
  document.body.classList.toggle("index-mode", isIndex);
  indexPanel.hidden = !isIndex;
  indexPanel.classList.toggle("open", isIndex);
  if (isIndex) { renderIndex(); updateStats(); updateViewHint(); return; }
  const fs = focusSet();
  if (state.view === "st") renderSentence(col, fs);
  else if (state.view === "pt") renderPeople(col, fs);
  else if (state.view === "mp") renderMap(col, fs);
  else renderGraph(col, fs);
  updateStats();
  updateViewHint();
}

/* 年份标尺：刻度间隔随局部密度自适应——
   密集的年代每 10 年（甚至 5 年）一根刻度；稀疏的年代退到 50/100 年一根。
   先放粗刻度（百年），再让细刻度补空，任何两根刻度都至少隔开 TICK_MIN_PX。
   标尺画在顶栏正下方：底部那条被图例与统计文字压住的旧轴不再使用。 */
const TICK_LEVELS = [100, 50, 25, 10, 5], TICK_MIN_PX = 74;
let lastTicks = [];
function yearTicks(minYear, maxYear) {
  const out = [], placed = [];
  TICK_LEVELS.forEach(level => {
    for (let y = Math.ceil(minYear / level) * level; y <= maxYear; y += level) {
      if (y < TIME.y0 || y > TIME.y1) continue;      // 数据跨度之外不标年份
      const x = P(yearToX(y) * (KT[state.view] || 1), 0)[0];
      if (x < -40 || x > W + 40) continue;
      if (placed.some(px => Math.abs(px - x) < TICK_MIN_PX)) continue;
      placed.push(x); out.push({ y: y, x: x });
    }
  });
  return out.sort((a, b) => a.x - b.x);
}
function drawYearAxis(col) {
  const c = cam();
  const k = KT[state.view] || 1;
  const minYear = Math.floor(xToYear((c.x - (W / 2) / c.s) / k)) - 6;
  const maxYear = Math.ceil(xToYear((c.x + (W / 2) / c.s) / k)) + 6;
  const ticks = yearTicks(minYear, maxYear);
  lastTicks = ticks.map(t => t.y);
  const base = axisBaseY();                        // 标尺线：顶栏下、内容带上方的预留带内
  ctx.save();
  ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
  ctx.beginPath();
  ticks.forEach(t => { ctx.moveTo(t.x, base); ctx.lineTo(t.x, H - 34); });
  ctx.moveTo(0, base); ctx.lineTo(W, base);
  ctx.stroke();
  ctx.font = `11px ${FONT}`; ctx.textAlign = "center";
  ticks.forEach(t => {
    const label = String(t.y), w = ctx.measureText(label).width;
    ctx.fillStyle = col.plate;                                   // 底片：年份读得清
    ctx.fillRect(t.x - w / 2 - 3, base - 16, w + 6, 14);
  });
  ctx.fillStyle = col.sub;
  ticks.forEach(t => ctx.fillText(String(t.y), t.x, base - 5));
  ctx.restore();
}

/* 关系弧线：同意一律向下鼓、分歧一律向上鼓——两个家族各自成束，而不是缠成一团 */
function arcBend(p1, p2, type) {
  const d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  const mag = Math.min(150, 14 + d * 0.2);
  return type === "agree" ? mag : -mag;
}

function curve(p1, p2, bend) {
  const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2 + bend;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.quadraticCurveTo(mx, my, p2[0], p2[1]);
  ctx.stroke();
}

/* 观点时间线的“文字带”——与参考站一致：文字本身即节点，圆点画在文字起点上。
   横向位置严格等于观点年份；纵向按缩放级别贪心分行，未排到文字的观点仍是裸圆点。
   1 级＝每位学者 1 条代表作，2 级＝全部要点，3 级＝全部观点。 */
const firstKeyOf = new Map();
stmts.forEach(s => {
  if (!s.key) return;
  const k = s.person.id, cur = firstKeyOf.get(k);
  if (!cur || s.year < cur.year) firstKeyOf.set(k, s);
});
function timelinePack(fs, preRects) {
  const out = new Map();
  const put = (s, x, y, label) => out.set(s, { x, y, label });
  if (!state.labels) {
    stmts.forEach(s => { const p = P(s._st.x, s._st.y); put(s, p[0], p[1]); });
    return out;
  }
  labelRects = preRects ? preRects.slice() : []; labelCount = 0;
  const lvl = labelLevel();
  const bandYOf = new Map();
  layout.st.rows.forEach(r => bandYOf.set(r.branch.id, P(cam().x, r.center)[1]));
  const groups = new Map();
  stmts.forEach(s => {
    if (alphaFor(s, fs) < 0.5) return;
    const p = P(s._st.x, s._st.y);
    if (!isFinite(p[0]) || !isFinite(p[1])) return;
    const isHover = !!(hover && hover.kind === "stmt" && hover.item === s);
    const isHi = state.highlightStmt === s.id;
    if (!isHover && !isHi) {
      if (lvl === 1 && firstKeyOf.get(s.person.id) !== s) return;
      if (lvl === 2 && !s.key && !(s.rel && s.rel.length)) return;
    }
    if (p[0] < -700 || p[0] > W + 700) return;
    let g = groups.get(s.branch); if (!g) { g = []; groups.set(s.branch, g); }
    g.push({ s, p, isHover, isHi });
  });
  const LINE = 20, MAXROW = 24;
  groups.forEach((list, branchId) => {
    const bandY = bandYOf.get(branchId);
    if (bandY == null || bandY < -320 || bandY > H + 320) return;
    list.sort((a, b) => (b.isHover - a.isHover) || (b.isHi - a.isHi) || (a.p[0] - b.p[0]));
    const rows = [];
    list.forEach(c => {
      const st = c.s;
      const tag = st.person.name.replace(/（.*?）/g, "");
      const tagFont = `600 11px ` + FONT, textFont = `12px ` + FONT;
      ctx.font = tagFont;
      const nameW = ctx.measureText(tag).width;
      const boost = (c.isHover || c.isHi) ? 360 : 0;
      const maxW = (lvl === 1 ? 380 : lvl === 2 ? 520 : 640) + boost;
      const dotX = c.p[0] + 6, LEAD = 8, MID = 7;   // 行首色点 → 人名 → 正文
      let rev = false, avail;
      const roomR = (W - 12) - dotX - LEAD - nameW - MID;
      if (roomR >= 150) {
        avail = Math.min(maxW, roomR);
      } else {                                     // 右边放不下，整条文字改排到圆点左侧
        rev = true;
        avail = Math.min(maxW, dotX - 12 - nameW - MID);
        if (avail < 150) return;
      }
      const text = truncateToWidth(st.text, textFont, avail);
      ctx.font = textFont;
      const textW = ctx.measureText(text).width;
      const tagW = nameW + MID, h = 16;
      const totalW = LEAD + tagW + textW;
      const x = rev ? dotX - totalW : dotX + LEAD;
      for (let r = 0; r < MAXROW; r++) {
        while (rows.length <= r) rows.push([]);
        const off = r === 0 ? 0 : (r % 2 ? -1 : 1) * Math.ceil(r / 2) * LINE;
        const x0 = rev ? x - 4 : x, x1 = rev ? dotX : x + totalW;
        const yBase = c.p[1] + off;                    // 紧贴自己的圆点，仅在碰撞时上下挪
        if (yBase < contentTop || yBase > H - 104) continue;   // 避开顶部标尺与底部统计
        if (yBase > H - 186 && x1 < 760) continue;     // 左下角留给标题与筛选图例
        if (rows[r].some(iv => !(x0 > iv[1] + 14 || x1 < iv[0] - 14))) continue;
        if (!reserveRect(x - 6, yBase - 12, totalW + 8, h + 2)) continue;
        rows[r].push([x0, x1]);
        put(st, dotX, yBase + 0.5, { tag, tagW, nameW, text, textW, totalW, x, yBase, h, rev, LEAD, MID,
                                     hot: c.isHover || c.isHi, marked: !!st.key });
        labelCount++;
        break;
      }
    });
  });
  stmts.forEach(s => {                            // 未排到文字的：裸圆点，仍落在真实年份
    if (out.has(s)) return;
    const p = P(s._st.x, s._st.y);
    put(s, p[0], p[1]);
  });
  return out;
}

function renderSentence(col, fs) {
  // 领域行标签先算位置：它们占的左侧一列要留给文字避让
  const rowRects = [];
  layout.st.rows.forEach(row => {
    const yc = P(cam().x, row.center)[1];
    if (yc < 40 || yc > H - 40) return;
    rowRects.push({ x: 80, y: yc - 15, w: 190, h: 30 });
  });
  const packed = timelinePack(fs, rowRects);
  // 领域行标签
  ctx.font = `600 12px ` + FONT;
  layout.st.rows.forEach(row => {
    const yc = P(cam().x, row.center)[1];
    if (yc < 40 || yc > H - 40) return;
    const n = stmts.filter(s => s.branch === row.branch.id && stmtActive(s)).length;
    const x = 88;
    ctx.save();
    ctx.globalAlpha = n > 0 ? 1 : 0.35;
    ctx.fillStyle = col.plate;
    ctx.fillRect(x - 8, yc - 12, 182, 24);
    ctx.fillStyle = row.branch.color;
    ctx.beginPath(); ctx.arc(x + 2, yc - 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = n > 0 ? col.ink : col.sub;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText(row.branch.label, x + 12, yc + 1);
    ctx.fillStyle = col.sub; ctx.font = `11px ` + FONT;
    ctx.fillText(String(n), x + 12 + ctx.measureText(row.branch.label).width + 22, yc + 1);
    ctx.font = `600 12px ` + FONT;
    ctx.restore();
  });
  // 关系线：只画跨学者的关系，同意向下鼓、分歧向上鼓，默认细而浅
  edges.forEach(e => {
    if (alphaFor(e.a, fs) < 0.5 || alphaFor(e.b, fs) < 0.5) return;
    if (!state.edges.has(e.type)) return;
    const a = packed.get(e.a), b = packed.get(e.b);
    if (!a || !b) return;
    const p1 = [a.x, a.y], p2 = [b.x, b.y];
    if (Math.max(p1[0], p2[0]) < -60 || Math.min(p1[0], p2[0]) > W + 60) return;
    const stl = edgeStyle(e, col);
    ctx.save();
    ctx.globalAlpha = stl.a;
    ctx.strokeStyle = e.type === "agree" ? col.agree : col.disagree;
    ctx.lineWidth = stl.w;
    curve(p1, p2, arcBend(p1, p2, e.type));
    ctx.restore();
  });
  // 观点：有文字的画「人名 + 色点 + 正文」，没有文字的画裸圆点
  stmts.forEach(st => {
    const q = packed.get(st);
    if (!q) return;
    if (q.x < -60 || q.x > W + 60 || q.y < -60 || q.y > H + 60) return;
    const a = alphaFor(st, fs);
    const isHover = hover && hover.kind === "stmt" && hover.item === st;
    const isHi = state.highlightStmt === st.id;
    const color = branchById.get(st.branch).color;
    if (q.label) {
      const L = q.label;
      const nameX = L.rev ? L.x + L.textW + 6 : L.x + L.LEAD;
      const textX = L.rev ? L.x : L.x + L.LEAD + L.tagW;
      ctx.save();
      ctx.globalAlpha = (isHover || isHi) ? 1 : a;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.lineJoin = "round";
      ctx.strokeStyle = col.bg; ctx.lineWidth = 3.4;   // 白描边：压住背后的圆点与连线
      ctx.font = `600 11px ` + FONT;
      ctx.strokeText(L.tag, nameX, L.yBase);
      ctx.font = `12px ` + FONT;
      ctx.strokeText(L.text, textX, L.yBase);
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.9, 0, Math.PI * 2);
      ctx.fillStyle = col.bg; ctx.fill();
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.font = `600 11px ` + FONT; ctx.fillStyle = col.sub;
      ctx.fillText(L.tag, nameX, L.yBase);
      ctx.font = `12px ` + FONT;
      ctx.fillStyle = L.hot ? col.ink : (L.marked ? col.ink : col.label);
      ctx.fillText(L.text, textX, L.yBase);
      if (L.hot) {
        ctx.strokeStyle = col.ink; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(q.x, q.y, 5.6, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
      hits.push({ x: q.x, y: q.y, kind: "stmt", item: st,
                  rect: { x: L.x - 3, y: L.yBase - 13, w: L.totalW + 6, h: L.h + 3 } });
    } else {
      const r = isHover ? 5.5 : (isHi ? 5 : 3);
      ctx.save();
      ctx.globalAlpha = a * ((isHover || isHi) ? 1 : 0.55);
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); ctx.fill();
      if (isHover || isHi) {
        ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(q.x, q.y, r + 3, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
      hits.push({ x: q.x, y: q.y, kind: "stmt", item: st });
    }
  });
  drawYearAxis(col);
}

function renderPeople(col, fs) {
  const preRects = [];
  const L = layout.pt;
  const anchor = new Map();
  L.order.forEach(p => {
    let first = null, ys = [];
    p.stmtList.forEach(s => {
      const a = alphaFor(s, fs); if (a < 0.5) return;
      if (!first || s.year < first.year) first = s;
      ys.push(s._pt.y);
    });
    if (first) anchor.set(p.id, { x: first._pt.x, y: ys.reduce((m, v) => m + v, 0) / ys.length });
  });
  // 人物关系线
  pEdges.forEach(pe => {
    if (!state.edges.has("agree") && !state.edges.has("disagree")) return;
    const list = pe.list.filter(e => state.edges.has(e.type) && alphaFor(e.a, fs) > 0.5 && alphaFor(e.b, fs) > 0.5);
    if (!list.length) return;
    const a1 = anchor.get(pe.a), a2 = anchor.get(pe.b);
    if (!a1 || !a2) return;
    const types = new Set(list.map(e => e.type));
    const type = types.size > 1 ? "mixed" : list[0].type;
    const p1 = P(a1.x, a1.y), p2 = P(a2.x, a2.y);
    const hp = hotKey();
    const hot = hp ? (hp === pe.a || hp === pe.b) : !!(hover && hover.kind === "person" && (hover.item.id === pe.a || hover.item.id === pe.b));
    ctx.save();
    ctx.globalAlpha = hp ? (hot ? 0.5 : 0.045) : (fs ? 0.14 : col.edgeA * 0.36);
    ctx.strokeStyle = type === "agree" ? col.agree : type === "disagree" ? col.disagree : col.soft;
    ctx.lineWidth = hot ? 2 : 0.9;
    curve(p1, p2, arcBend(p1, p2, type));
    ctx.restore();
  });
  // 姓名与点（行太密时只给间隔够开的人署名，避免糊成一片）
  ctx.font = `11.5px ${FONT}`;
  let lastNamedY = -1e9;
  L.order.forEach(p => {
    const rowY = P(cam().x, p._rowY)[1];
    if (rowY < contentTop - 24 || rowY > H - 44) return;
    let minX = 1e9, n = 0;
    p.stmtList.forEach(s => {
      const a = alphaFor(s, fs);
      const pos = P(s._pt.x, s._pt.y);
      const isHover = hover && hover.kind === "stmt" && hover.item === s;
      if (a < 0.5 && !isHover) return;
      n++;
      minX = Math.min(minX, pos[0]);
      ctx.save();
      ctx.globalAlpha = isHover ? 1 : a;
      ctx.fillStyle = branchById.get(s.branch).color;
      ctx.beginPath(); ctx.arc(pos[0], pos[1], isHover ? 5.2 : 2.7, 0, Math.PI * 2); ctx.fill();
      if (isHover) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(pos[0], pos[1], 8, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
      hits.push({ x: pos[0], y: pos[1], kind: "stmt", item: s });
    });
    if (!n) return;
    const isHot = (hover && hover.kind === "person" && hover.item === p) ||
                  (fs && fs.kind === "person" && fs.ids.has(p.id));
    if (!isHot && rowY - lastNamedY < 13) return;      // 太挤就不署名
    lastNamedY = rowY;
    const fsInfo = fs && fs.kind === "person" && !fs.ids.has(p.id);
    const labelX = Math.max(96, minX - 10);
    ctx.save();
    ctx.globalAlpha = fsInfo ? 0.3 : 0.96;
    const tw = ctx.measureText(p.name).width;
    ctx.fillStyle = col.plate;
    ctx.fillRect(Math.max(12, labelX - tw - 8), rowY - 8, tw + 10, 16);
    ctx.textAlign = "right";
    ctx.lineWidth = 3; ctx.strokeStyle = col.bg;
    ctx.strokeText(p.name, labelX, rowY + 4);
    ctx.fillStyle = col.label;
    ctx.fillText(p.name, labelX, rowY + 4);
    ctx.restore();
    const hp = { kind: "person", x: labelX - tw / 2, y: rowY, item: p };
    hits.push(hp);
    preRects.push({ x: Math.max(12, labelX - tw - 8) - 3, y: rowY - 11, w: tw + 14, h: 22 });
  });
  // 观点文字
  drawLabels(col, fs, s => P(s._pt.x, s._pt.y), null, false, preRects);
  drawYearAxis(col);
}

function renderGraph(col, fs) {
  const G = layout.pg;
  const pos = new Map();
  G.nodes.forEach(nd => pos.set(nd.p.id, P(nd.x, nd.y)));
  // 边
  G.links.forEach(l => {
    const list = l.pe.list.filter(e => state.edges.has(e.type) && alphaFor(e.a, fs) > 0.5 && alphaFor(e.b, fs) > 0.5);
    if (!list.length) return;
    const p1 = pos.get(l.a.p.id), p2 = pos.get(l.b.p.id);
    const hpg = hotKey();
    const hot = hpg ? (hpg === l.a.p.id || hpg === l.b.p.id)
                    : !!(hover && hover.kind === "person" && (hover.item.id === l.a.p.id || hover.item.id === l.b.p.id));
    const types = new Set(list.map(e => e.type));
    const type = types.size > 1 ? "mixed" : list[0].type;
    ctx.save();
    ctx.globalAlpha = hpg ? (hot ? 0.55 : 0.04) : (fs ? 0.12 : 0.22);
    ctx.strokeStyle = type === "agree" ? col.agree : type === "disagree" ? col.disagree : col.soft;
    ctx.lineWidth = hot ? 2 : Math.min(2.4, 0.85 + 0.25 * (list.length - 1));
    curve(p1, p2, arcBend(p1, p2, type));
    ctx.restore();
  });
  // 节点
  const radiusOf = nd => 5 + Math.min(7, nd.p.stmtList.length * 0.9);
  G.nodes.forEach(nd => {
    const p = pos.get(nd.p.id);
    const anyActive = nd.p.stmtList.some(s => stmtActive(s));
    const faded = fs ? !fs.ids.has(nd.p.id) : false;
    const isHover = hover && hover.kind === "person" && hover.item === nd.p;
    const r = radiusOf(nd) + (isHover ? 2 : 0);
    ctx.save();
    ctx.globalAlpha = anyActive ? (faded ? 0.08 : 1) : 0.05;
    ctx.fillStyle = branchById.get(nd.p.branches[0]).color;
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col.dotRing; ctx.lineWidth = 1.4; ctx.stroke();
    if (isHover || (fs && fs.kind === "person" && fs.ids.has(nd.p.id))) {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(p[0], p[1], r + 4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    hits.push({ x: p[0], y: p[1], kind: "person", item: nd.p });
  });
  // 姓名标签：度数高者优先，自动避让重叠（悬停的名字总能显示）
  const drawnRects = [];
  const byDeg = [...G.nodes].sort((a, b) => b.deg - a.deg);
  ctx.font = `11.5px ${FONT}`; ctx.textAlign = "center";
  byDeg.forEach(nd => {
    const p = pos.get(nd.p.id);
    const isHover = hover && hover.kind === "person" && hover.item === nd.p;
    if (fs && !fs.ids.has(nd.p.id) && !isHover) return;
    const name = nd.p.name.replace(/（.*?）/g, "");
    const w = ctx.measureText(name).width;
    const r = radiusOf(nd), ly = p[1] + r + 15;
    const rect = { x: p[0] - w / 2 - 4, y: ly - 10, w: w + 8, h: 14 };
    const hit = drawnRects.some(q => !(rect.x > q.x + q.w || rect.x + rect.w < q.x || rect.y > q.y + q.h || rect.y + rect.h < q.y));
    if (hit && !isHover) return;
    drawnRects.push(rect);
    ctx.save();
    ctx.globalAlpha = isHover ? 1 : 0.94;
    ctx.lineWidth = 3; ctx.strokeStyle = col.bg;
    ctx.strokeText(name, p[0], ly);
    ctx.fillStyle = col.label;
    ctx.fillText(name, p[0], ly);
    ctx.restore();
  });
}

const personActive = p => p.stmtList.some(stmtActive);

/* 世界底图投影：Equal Earth（等面积伪圆柱，Šavrič 等 2018）。
   比墨卡托好在：两极不被拉长，全世界（含南极）一次就能完整装进宽屏，横向也更饱满。
   经度 → x 与纬度 → y 不再各自独立，统一用 mapPt(lon, lat) 取点（y 向下为正）。 */
const DEG = Math.PI / 180;
const EE = { A1: 1.340264, A2: -0.081106, A3: 0.000893, A4: 0.003796, M: Math.sqrt(3) / 2 };
function mapPt(lon, lat) {
  const theta = Math.asin(EE.M * Math.sin(Math.max(-90, Math.min(90, lat)) * DEG));
  const t2 = theta * theta, t6 = t2 * t2 * t2, t8 = t6 * t2;
  const denom = 3 * (9 * EE.A4 * t8 + 7 * EE.A3 * t6 + 3 * EE.A2 * t2 + EE.A1);
  const x = 2 * Math.sqrt(3) * lon * DEG * Math.cos(theta) / denom;
  const y = theta * (EE.A1 + EE.A2 * t2 + t6 * (EE.A3 + EE.A4 * t2));
  return [x, -y];
}
const mapX = lon => mapPt(lon, 0)[0];
const mapY = lat => mapPt(0, lat)[1];
const mapScreen = (lon, lat) => { const q = mapPt(lon, lat); return P(q[0], q[1]); };

function renderMap(col, fs) {
  const M = layout.mp, c = cam();
  /* 陆地底图（世界坐标为 经度 / -纬度） */
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(c.s, c.s); ctx.translate(-c.x, -c.y);
  ctx.fillStyle = state.dark ? "#131920" : "#e6eef4";          // 海洋
  ctx.strokeStyle = state.dark ? "#26313b" : "#d2dfe9";
  ctx.lineWidth = 0.8 / c.s;
  ctx.fill(M.outline); ctx.stroke(M.outline);
  ctx.fillStyle = state.dark ? "#1c1f24" : "#ecdfc7";          // 陆地
  ctx.strokeStyle = state.dark ? "#343a42" : "#d3c39f";
  ctx.fill(M.path); ctx.stroke(M.path);
  ctx.restore();

  const activeP = p => personActive(p) && (!fs || fs.kind !== "person" || fs.ids.has(p.id));

  /* 线：主要机构所在地 → 田野点 */
  people.forEach(p => {
    if (!p.home || !p.sites.length) return;
    const on = activeP(p);
    const p1 = mapScreen(p.home[0], p.home[1]);
    const colr = branchById.get(p.branches[0]).color;
    p.sites.forEach(site => {
      const hotArc = hover && hover.kind === "arc" && hover.item === p && hover.site === site.name;
      const hotSite = hover && hover.kind === "site" && hover.item.name === site.name;
      if (!on && !hotArc) return;
      const p2 = mapScreen(site.lon, site.lat);
      const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
      const bend = -(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * 0.18 + 10);
      ctx.save();
      ctx.globalAlpha = on ? (hotArc || hotSite ? 0.95 : (fs ? 0.3 : 0.42)) : 0.04;
      ctx.strokeStyle = colr;
      ctx.lineWidth = hotArc ? 1.8 : 1;
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]);
      ctx.quadraticCurveTo(mx, my + bend, p2[0], p2[1]);
      ctx.stroke();
      ctx.restore();
      hits.push({ x: (p1[0] + 2 * mx + p2[0]) / 4, y: (p1[1] + 2 * (my + bend) + p2[1]) / 4,
                  kind: "arc", item: p, site: site.name });
    });
  });

  /* 田野点（按学者聚合） */
  const ranked = M.sites.map(site => ({ site, act: site.persons.filter(activeP) }))
                        .sort((a, b) => b.act.length - a.act.length);
  ranked.forEach(({ site, act }) => {
    const p = mapScreen(site.lon, site.lat);
    const n = act.length;
    const hot = hover && hover.kind === "site" && hover.item === site;
    const r = 3.2 + 1.7 * Math.sqrt(n) + (hot ? 2 : 0);
    ctx.save();
    ctx.globalAlpha = n > 0 ? 1 : 0.12;
    ctx.fillStyle = n > 0 ? branchById.get(act[0].branches[0]).color : col.sub;
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col.dotRing; ctx.lineWidth = 1.2; ctx.stroke();
    if (hot) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p[0], p[1], r + 6, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
    hits.push({ x: p[0], y: p[1], kind: "site", item: site, activeCount: n });
  });

  /* 机构城市（空心圆） */
  const homeRank = M.homes.map(h => ({ h, act: h.persons.filter(activeP) })).sort((a, b) => b.act.length - a.act.length);
  homeRank.forEach(({ h, act }) => {
    const p = mapScreen(h.lon, h.lat);
    const hot = hover && hover.kind === "home" && hover.item === h;
    const r = 2.4 + 0.7 * Math.sqrt(act.length) + (hot ? 1.6 : 0);
    ctx.save();
    ctx.globalAlpha = act.length ? 0.9 : 0.15;
    ctx.fillStyle = col.bg; ctx.strokeStyle = col.sub; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (hot) { ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(p[0], p[1], r + 5, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
    hits.push({ x: p[0], y: p[1], kind: "home", item: h, activeCount: act.length });
  });

  /* 地名标签：学者数多者优先，自动避让；放大后显示单点标签 */
  const drawnRects = [];
  ctx.font = `11px ${FONT}`; ctx.textAlign = "center";
  const zoomed = c.s > cam().fitS * 1.7;
  ranked.forEach(({ site, act }) => {
    const hot = hover && hover.kind === "site" && hover.item === site;
    if (act.length < 1 && !hot) return;
    const p = mapScreen(site.lon, site.lat);
    const name = site.name.length > 14 ? site.name.slice(0, 13) + "…" : site.name;
    const w = ctx.measureText(name).width;
    const rect = { x: p[0] - w / 2 - 4, y: p[1] + 7, w: w + 8, h: 14 };
    const hit = drawnRects.some(q => !(rect.x > q.x + q.w || rect.x + rect.w < q.x || rect.y > q.y + q.h || rect.y + rect.h < q.y));
    if (hit && !hot) return;
    drawnRects.push(rect);
    ctx.save();
    ctx.globalAlpha = act.length ? (hot ? 1 : 0.9) : 0.25;
    ctx.lineWidth = 3; ctx.strokeStyle = col.bg;
    ctx.strokeText(name, p[0], p[1] + 16);
    ctx.fillStyle = col.label; ctx.fillText(name, p[0], p[1] + 16);
    ctx.restore();
  });
  ctx.font = `10.5px ${FONT}`;
  homeRank.forEach(({ h, act }) => {
    const hot = hover && hover.kind === "home" && hover.item === h;
    if (act.length < 3 && !hot) return;
    const p = mapScreen(h.lon, h.lat);
    const name = h.name + " · " + act.length;
    const w = ctx.measureText(name).width;
    const rect = { x: p[0] - w / 2 - 4, y: p[1] - 20, w: w + 8, h: 14 };
    const hit = drawnRects.some(q => !(rect.x > q.x + q.w || rect.x + rect.w < q.x || rect.y > q.y + q.h || rect.y + rect.h < q.y));
    if (hit && !hot) return;
    drawnRects.push(rect);
    ctx.save();
    ctx.globalAlpha = hot ? 1 : 0.85;
    ctx.lineWidth = 3; ctx.strokeStyle = col.bg;
    ctx.strokeText(name, p[0], p[1] - 10);
    ctx.fillStyle = col.sub; ctx.fillText(name, p[0], p[1] - 10);
    ctx.restore();
  });
}

/* ---------------- 观点索引视图（HTML 列表） ---------------- */
const indexPanel = document.getElementById("indexPanel");

function indexEntry(p, act) {
  const chips = [
    ...p.branches.map(b => `<span class="chip"><span class="legend-dot" style="background:${branchById.get(b).color}"></span>${branchById.get(b).label}</span>`),
    `<span class="chip">${periodById.get(p.period).label}</span>`,
    ...(p.tags || []).map(t => `<span class="chip"># ${t}</span>`)
  ].join("");
  const rows = act.map(s => {
    const b = branchById.get(s.branch);
    const rels = s.rel.map(r => `
      <div class="ix-rel">
        <span class="rel-mark ${r.type === "agree" ? "tt-agree" : "tt-disagree"}">${r.type === "agree" ? "继承/同意" : "批评/分歧"}</span>
        <span><a data-person="${r.other.person.id}">${r.other.person.name}</a> · ${r.note}</span>
      </div>`).join("");
    return `<div class="ix-stmt">
        <div class="ix-stmt-head">
          <span class="ix-year">${s.year}</span>
          <span class="ix-branch"><span class="legend-dot" style="background:${b.color}"></span>${b.label}</span>
          ${s.work ? `<span class="ix-work">${s.work}</span>` : ""}
          ${s.workEn ? `<span class="ix-work" style="font-style:italic">${s.workEn}</span>` : ""}
          <button class="ix-jump" data-stmt="${s.id}">定位</button>
        </div>
        <div class="ix-text">${s.text}</div>${rels}
      </div>`;
  }).join("");
  return `<section class="ix-person" id="ixp-${p.id}">
      <div class="ix-head">
        <span class="ix-name" data-person="${p.id}">${p.name}</span>
        <span class="ix-en">${p.en}</span>
        <span class="ix-years">${p.died ? `${bornLabel(p)}—${p.died}` : `${bornLabel(p)}—`}</span>
        <span class="ix-locate">
          <button class="ix-jump" data-focus="${p.id}">聚焦</button>
          <button class="ix-jump" data-zoom="${p.id}">时间线定位</button>
        </span>
      </div>
      <div class="ix-chips">${chips}</div>
      ${rows}
    </section>`;
}

function indexMarkdown(list, count) {
  const head = `# 人类学思想史 · 观点索引\n\n> ${list.length} 位学者 · ${count} 条观点；由 anthropology-map 导出（view=ix）。\n\n`;
  return head + list.map(p => {
    const act = p.stmtList.filter(stmtActive).sort((a, b) => a.year - b.year);
    const meta = [`${p.en}`, p.died ? `${bornLabel(p)}—${p.died}` : `${bornLabel(p)}—`, p.country,
                  periodById.get(p.period).label, p.branches.map(b => branchById.get(b).label).join("/")].join(" · ");
    const rows = act.map(s => {
      const b = branchById.get(s.branch);
      const rel = s.rel.map(r => `（${r.type === "agree" ? "继承/同意" : "批评/分歧"}：${r.other.person.name} · ${r.note}）`).join("");
      return `- **${s.year}** · ${b.label}${s.work ? ` · ${s.work}` : ""}${s.workEn ? ` / *${s.workEn}*` : ""}\n  ${s.text}${rel ? "\n  " + rel : ""}`;
    }).join("\n");
    return `## ${p.name}\n\n${meta}\n\n${rows}\n`;
  }).join("\n");
}

let indexSig = "";
function renderIndex() {
  const list = people.filter(personActive).sort((a, b) => a.born - b.born || a.name.localeCompare(b.name));
  const count = list.reduce((n, p) => n + p.stmtList.filter(stmtActive).length, 0);
  const sig = JSON.stringify([[...state.branches].sort(), [...state.periods].sort(), [...state.edges].sort(),
                              state.basics, qNorm(), list.map(p => p.id + ":" + p.stmtList.filter(stmtActive).length)]);
  if (sig === indexSig && indexPanel.firstChild) { updateStats(); return; }   // 内容未变则保留滚动位置
  indexSig = sig;
  const body = list.length
    ? list.map(p => indexEntry(p, [...p.stmtList].filter(stmtActive).sort((a, b) => a.year - b.year))).join("")
    : `<div class="ix-person"><div class="ix-text">当前筛选下没有条目，请调整左下筛选或清空搜索。</div></div>`;
  indexPanel.innerHTML = `<div class="ix-inner">
      <div class="ix-title"><span>观点索引</span>
        <span class="ix-meta">${list.length} 位学者 · ${count} 条观点 · 按生年排序</span>
        <button class="drawer-btn" id="ixExport">下载 Markdown</button>
      </div>${body}</div>`;
  const ex = document.getElementById("ixExport");
  if (ex) ex.onclick = () => {
    const md = indexMarkdown(list, count);
    download("anthropology-statements-index.md", md, "text/markdown;charset=utf-8");
  };
  indexPanel.querySelectorAll("[data-person]").forEach(el => el.onclick = () => openPerson(el.dataset.person));
  indexPanel.querySelectorAll("[data-focus]").forEach(el => el.onclick = e => {
    e.stopPropagation();
    state.focus = { kind: "person", id: el.dataset.focus };
    state.highlightStmt = null;
    syncHash(); render(); updateAuxButtons();
  });
  indexPanel.querySelectorAll("[data-zoom]").forEach(el => el.onclick = e => {
    e.stopPropagation();
    const p = personById.get(el.dataset.zoom);
    const first = [...p.stmtList].sort((a, b) => a.year - b.year)[0];
    state.focus = { kind: "person", id: p.id };
    state.highlightStmt = first ? first.id : null;
    setView("st");
    if (first) zoomToStmt(first);
  });
  indexPanel.querySelectorAll(".ix-jump[data-stmt]").forEach(el => el.onclick = e => {
    e.stopPropagation();
    const st = stmtById.get(el.dataset.stmt);
    state.focus = { kind: "stmt", id: st.id };
    state.highlightStmt = st.id;
    setView("st");
    zoomToStmt(st);
  });
}

function updateStats() {
  const n = stmts.filter(stmtActive).length;
  const ps = new Set(stmts.filter(stmtActive).map(s => s.person.id));
  const es = edges.filter(e => state.edges.has(e.type) && stmtActive(e.a) && stmtActive(e.b)).length;
  document.getElementById("statsText").textContent =
    `可见 ${n} 条观点 · ${ps.size} 位学者 · ${es} 组关联`;
}
function updateViewHint() {
  const el = document.getElementById("viewHint");
  if (!el) return;
  el.textContent = state.view === "ix"
    ? "按人物分组的全部观点列表 · 点击“定位”跳到观点时间线 · 顶栏可下载 Markdown"
    : state.view === "mp"
    ? "实心圆 = 田野点（大小 = 学者数） · 空心圆 = 机构城市 · 曲线 = 从机构所在地到田野点"
    : state.view === "st" ? "圆点 = 一条观点 · 文字 = 观点摘要（放大显示更多） · 悬停文字只高亮相关连线 · 绿：继承/同意 红：批评/分歧"
    : state.view === "pt" ? "每行一位学者 · 圆点 = 其观点提出的年份 · 文字 = 观点摘要（放大显示更多）"
    : "节点 = 人物（大小 = 观点数） · 连线 = 关系（绿：继承/同意 · 红：批评/分歧）";
}

/* ---------------- 交互：平移缩放 ---------------- */
let dragging = null, pointers = new Map(), pinch = null;
canvas.addEventListener("pointerdown", e => {
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) dragging = { x: e.clientX, y: e.clientY, cx: cam().x, cy: cam().y, moved: false };
  else if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: cam().s };
    dragging = null;
  }
  canvas.classList.add("dragging");
});
canvas.addEventListener("pointermove", e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size >= 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    const c = cam();
    const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    const s1 = Math.max(c.fitS * 0.45, Math.min(c.fitS * 26, pinch.s * (d / pinch.d)));
    const wx = (cx - W / 2) / c.s + c.x, wy = (cy - H / 2) / c.s + c.y;
    c.s = s1; c.x = wx - (cx - W / 2) / s1; c.y = wy - (cy - H / 2) / s1;
    render(); return;
  }
  if (dragging) {
    const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragging.moved = true;
    const c = cam();
    c.x = dragging.cx - dx / c.s; c.y = dragging.cy - dy / c.s;
    render(); return;
  }
  hoverTest(e.clientX, e.clientY);
});
canvas.addEventListener("pointerup", e => {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  canvas.classList.remove("dragging");
  if (dragging && !dragging.moved) {
    const h = pick(e.clientX, e.clientY, 16);
    if (h && h.kind === "stmt") { state.highlightStmt = h.item.id; openPerson(h.item.person.id); }
    else if (h && h.kind === "person") { openPerson(h.item.id); }
    else if (h && h.kind === "site") { openSite(h.item); }
    else if (h && h.kind === "home") { openSite(h.item, "home"); }
    else if (h && h.kind === "arc") { openPerson(h.item.id); }
    else if (state.focus) { clearFocus(); }
  } else if (dragging && dragging.moved) {
    hoverTest(e.clientX, e.clientY);
  }
  dragging = null;
});
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  zoomBy(Math.exp(-e.deltaY * 0.0016), e.clientX, e.clientY);
}, { passive: false });
canvas.addEventListener("dblclick", () => fitView());
canvas.addEventListener("pointerleave", () => { hideTooltip(); hover = null; render(); });

/* 该项此刻是否真的在图上：被筛掉、只剩 0.05 透明度的点不该被悬停/点击碰到 */
function hitLive(h) {
  if (h.kind === "stmt") return stmtActive(h.item);
  if (h.kind === "person") return h.item.stmtList.some(stmtActive);
  return true;
}
function pick(x, y, maxDist) {
  // 1) 贴着某个圆点/节点时，永远先命中它，不会被压在上面的文字抢走
  let best = null, bd = Math.min(maxDist, 9);
  hits.forEach(h => {
    if (h.rect || !hitLive(h)) return;
    const d = Math.hypot(h.x - x, h.y - y);
    if (d < bd) { bd = d; best = h; }
  });
  if (best) return best;
  // 2) 其次看文字标签
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    if (h.rect && x >= h.rect.x && x <= h.rect.x + h.rect.w && y >= h.rect.y && y <= h.rect.y + h.rect.h) return h;
  }
  // 3) 兜底：最近的一个可见对象
  bd = maxDist;
  hits.forEach(h => {
    if (!hitLive(h)) return;
    const d = Math.hypot(h.x - x, h.y - y);
    if (d < bd) { bd = d; best = h; }
  });
  return best;
}
function hoverTest(x, y) {
  const h = pick(x, y, 14);
  const changed = (h && h.item) !== (hover && hover.item);
  hover = h ? { kind: h.kind, x: h.x, y: h.y, item: h.item } : null;
  canvas.classList.toggle("pointing", !!h);
  if (h) showTooltip(h, x, y); else hideTooltip();
  if (changed) render(); else positionTooltip(x, y);
}

/* ---------------- 提示气泡 ---------------- */
const tooltipEl = document.getElementById("tooltip");
let tooltipData = null;
function showTooltip(h, x, y) {
  const col = C();
  if (h.kind === "stmt") {
    const s = h.item;
    const rels = s.rel.map(r => `<span class="${r.type === "agree" ? "tt-agree" : "tt-disagree"}">${r.type === "agree" ? "同" : "异"}</span> ${r.other.person.name}`);
    tooltipData = `<div class="tt-head"><span class="tt-name">${s.person.name}</span><span class="tt-year">${s.year}</span></div>
      ${s.work || s.workEn ? `<div class="tt-work">${s.work || ""}${s.work && s.workEn ? " · " : ""}${s.workEn ? s.workEn : ""}</div>` : ""}
      <div class="tt-text">${s.text}</div>
      ${rels.length ? `<div class="tt-rel">与 ${rels.join("、")} 的观点相连</div>` : ""}
      <div class="tt-hint">点击查看人物与全部观点</div>`;
  } else if (h.kind === "site") {
    const site = h.item;
    const act = site.persons.filter(personActive);
    const names = act.slice(0, 8).map(p => p.name).join("、");
    tooltipData = `<div class="tt-head"><span class="tt-name">${site.name}</span><span class="tt-year">${act.length} 位学者</span></div>
      <div class="tt-text">${names}${act.length > 8 ? " 等" : ""}</div>
      <div class="tt-hint">点击查看该田野点的学者清单</div>`;
  } else if (h.kind === "home") {
    const city = h.item;
    const act = city.persons.filter(personActive);
    tooltipData = `<div class="tt-head"><span class="tt-name">${city.name}</span><span class="tt-year">${act.length} 位学者</span></div>
      <div class="tt-text">${act.slice(0, 8).map(p => p.name).join("、")}${act.length > 8 ? " 等" : ""}</div>
      <div class="tt-hint">点击查看以该城市为基地的学者</div>`;
  } else if (h.kind === "arc") {
    const p = h.item;
    tooltipData = `<div class="tt-head"><span class="tt-name">${p.name}</span><span class="tt-year">${bornLabel(p)}${p.died ? "–" + p.died : "–"}</span></div>
      <div class="tt-work">${p.en}</div>
      <div class="tt-text">田野点：${h.site}</div>
      <div class="tt-hint">点击查看人物详情</div>`;
  } else {
    const p = h.item;
    const years = p.died ? `${bornLabel(p)}–${p.died}` : `${bornLabel(p)}–`;
    tooltipData = `<div class="tt-head"><span class="tt-name">${p.name}</span><span class="tt-year">${years}</span></div>
      <div class="tt-work">${p.en}</div>
      <div class="tt-text">${p.stmtList.length} 条观点 · ${p.branches.map(b => branchById.get(b).label).join(" / ")}</div>
      <div class="tt-hint">点击查看人物详情</div>`;
  }
  tooltipEl.innerHTML = tooltipData;
  tooltipEl.hidden = false;
  tooltipEl.classList.add("visible");
  positionTooltip(x, y);
}
function positionTooltip(x, y) {
  const r = tooltipEl.getBoundingClientRect();
  let left = x + 16, top = y + 16;
  if (left + r.width > W - 12) left = x - r.width - 16;
  if (top + r.height > H - 12) top = Math.max(12, y - r.height - 16);
  tooltipEl.style.left = left + "px"; tooltipEl.style.top = top + "px";
}
function hideTooltip() { tooltipEl.classList.remove("visible"); tooltipEl.hidden = true; }

/* ---------------- 抽屉 ---------------- */
const drawer = document.getElementById("drawer");
const drawerInner = document.getElementById("drawerInner");
function openDrawer(html) {
  hideTooltip(); hover = null;
  drawerInner.innerHTML = `<div class="drawer-close" id="drawerClose"><svg class="icon" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></div>` + html;
  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add("open"));
  const btn = document.getElementById("drawerClose");
  if (btn) btn.onclick = closeDrawer;
  const xj = document.getElementById("exJson");
  if (xj) xj.onclick = exportJSON;
  const xb = document.getElementById("exBib");
  if (xb) xb.onclick = exportBib;
  const xc = document.getElementById("exCsv");
  if (xc) xc.onclick = exportCSV;
  drawerInner.scrollTop = 0;
}
function closeDrawer() { drawer.classList.remove("open"); setTimeout(() => { drawer.hidden = true; }, 260); }

function openPerson(id) {
  const p = personById.get(id); if (!p) return;
  state.focus = { kind: "person", id };
  const chips = [
    ...p.branches.map(b => `<span class="chip"><span class="legend-dot" style="background:${branchById.get(b).color}"></span>${branchById.get(b).label}</span>`),
    `<span class="chip">${periodById.get(p.period).label}</span>`,
    ...(p.regions || []).map(r => `<span class="chip">${r}</span>`),
    ...(p.tags || []).map(t => `<span class="chip"># ${t}</span>`)
  ].join("");
  const years = p.died ? `${bornLabel(p)}—${p.died}` : `${bornLabel(p)}—`;
  const stmtHtml = [...p.stmtList].sort((a, b) => a.year - b.year).map(s => {
    const active = stmtActive(s);
    const b = branchById.get(s.branch);
    const rels = s.rel.map(r => `
      <div class="dr-rel">
        <span class="rel-mark ${r.type === "agree" ? "tt-agree" : "tt-disagree"}">${r.type === "agree" ? "继承/同意" : "批评/分歧"}</span>
        <span><a data-person="${r.other.person.id}">${r.other.person.name}</a> · ${r.note}</span>
      </div>`).join("");
    return `<div class="dr-stmt ${active ? "" : "inactive"}">
        <div class="dr-stmt-head">
          <span class="dr-stmt-year">${s.year}</span>
          <span class="dr-stmt-branch"><span class="legend-dot" style="background:${b.color}"></span>${b.label}</span>
          ${s.work ? `<span class="dr-stmt-work">${s.work}</span>` : ""}
          ${s.workEn ? `<span class="dr-stmt-work" style="font-style:italic">${s.workEn}</span>` : ""}
          <button class="cite-btn" data-cite="${s.id}" title="复制引用信息">引用</button>
        </div>
        <div class="dr-stmt-text">${s.text}</div>
        ${rels}
      </div>`;
  }).join("");
  openDrawer(`
    <div class="dr-name">${p.name}</div>
    <div class="dr-en">${p.en} · ${years} · ${p.country}</div>
    <div class="dr-chips">${chips}</div>
    <div class="dr-actions">
      <button class="drawer-btn" id="drFocusBtn">聚焦此人</button>
      <button class="drawer-btn" id="drCopyCite">复制此人文献</button>
      <button class="drawer-btn" id="drExportBib">导出 BibTeX</button>
      ${state.focus ? `<button class="drawer-btn" id="drClearFocus">清除聚焦</button>` : ""}
    </div>
    <div class="dr-summary">${p.summary}</div>
    <div class="dr-section-title">Ideas · 观点与关联</div>
    ${stmtHtml}
  `);
  const fb = document.getElementById("drFocusBtn");
  if (fb) fb.onclick = () => { state.focus = { kind: "person", id }; render(); };
  const cc = document.getElementById("drCopyCite");
  if (cc) cc.onclick = () => copyText(refsOf([p]).join("\n"), "已复制 " + refsOf([p]).length + " 条文献");
  const eb = document.getElementById("drExportBib");
  if (eb) eb.onclick = () => download("refs-" + p.id + ".bib", bibtexOf([p]), "text/plain;charset=utf-8");
  drawerInner.querySelectorAll("button.cite-btn").forEach(btn => {
    btn.onclick = () => {
      const st = stmtById.get(btn.dataset.cite);
      copyText(citeText(p, st), "已复制引用");
    };
  });
  const cb = document.getElementById("drClearFocus");
  if (cb) cb.onclick = () => { clearFocus(); };
  drawerInner.querySelectorAll("a[data-person]").forEach(a => {
    a.onclick = () => { openPerson(a.dataset.person); centerPerson(a.dataset.person); };
  });
  updateAuxButtons();
  render();
}
function openSite(site, kind) {
  const persons = [...site.persons].sort((a, b) => a.born - b.born);
  const isHome = kind === "home";
  const rows = persons.map(p => `
    <div class="dr-stmt">
      <div class="dr-stmt-head">
        <span class="dr-stmt-year">${bornLabel(p)}${p.died ? "–" + p.died : "–"}</span>
        <span class="dr-stmt-work">${p.country}</span>
        <span class="dr-stmt-branch">${p.branches.map(b => `<span class="legend-dot" style="background:${branchById.get(b).color}"></span>`).join("")}</span>
      </div>
      <div class="dr-stmt-text"><a data-person="${p.id}" style="cursor:pointer;text-decoration:underline">${p.name}</a> <span class="dr-stmt-work">${p.en}</span></div>
      <div class="dr-rel"><span>${p.tags.join(" · ")}</span></div>
    </div>`).join("");
  openDrawer(`
    <div class="dr-name">${site.name}</div>
    <div class="dr-en">${isHome ? "机构城市" : "田野点 / 研究区域"} · 经纬度 ${site.lon.toFixed(1)}, ${site.lat.toFixed(1)}</div>
    <div class="dr-section-title">Scholars · ${isHome ? "以此为基地的学者" : "在此研究的学者"}（${persons.length}）</div>
    ${rows}
    <div class="dr-section-title">说明</div>
    <p class="muted">${isHome ? "空心圆代表机构所在地；从该城市出发的曲线通往各学者做田野的地方。" : "地图曲线表示学者从主要任教/研究机构所在地前往该田野点；坐标为近似值，用于示意。"}</p>
  `);
  drawerInner.querySelectorAll("a[data-person]").forEach(a => {
    a.onclick = () => { openPerson(a.dataset.person); };
  });
}

/* ---------------- 引用与导出 ---------------- */
function citeText(p, st) {
  const title = st.workEn || st.work || "";
  return `${p.en} (${st.year}). ${title}.` + (st.work && st.workEn ? `  中译/题名：${st.work}` : "");
}
function refsOf(list) {
  const out = [], seen = new Set();
  list.forEach(p => p.stmtList.forEach(st => {
    const key = st.workEn || st.work;
    const k = p.id + "|" + st.year + "|" + key;
    if (seen.has(k)) return;
    seen.add(k); out.push(citeText(p, st));
  }));
  return out.sort();
}
function bibKey(p, st) {
  const w = (st.workEn || st.work || "work").replace(/[^A-Za-z0-9]/g, "").slice(0, 14) || "work";
  return (p.id.replace(/[^a-z]/gi, "") + st.year + w).toLowerCase();
}
function bibtexOf(list) {
  const out = [], seen = new Set();
  list.forEach(p => p.stmtList.forEach(st => {
    const k = bibKey(p, st);
    if (seen.has(k)) return;
    seen.add(k);
    out.push("@misc{" + k + ",\n" +
      "  author = {" + p.en + "},\n" +
      "  title  = {" + (st.workEn || st.work || "") + "},\n" +
      "  year   = {" + st.year + "},\n" +
      "  note   = {" + p.name + "｜" + (st.work || "") + "｜" + branchById.get(st.branch).label + "}\n}");
  }));
  return out.sort().join("\n\n");
}
function copyText(txt, label) {
  const done = () => toast((label || "已复制") + " ✓");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(done, () => { fallbackCopy(txt); done(); });
  } else { fallbackCopy(txt); done(); }
}
function fallbackCopy(txt) {
  const ta = document.createElement("textarea");
  ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
}
function download(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 120);
}
let toastTimer = null;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}
function exportJSON() {
  const data = {
    meta: D.meta,
    branches: D.branches,
    periods: D.periods,
    geoCitations: {
      homes: META.homes, sites: META.sites, works: META.works
    },
    people: people.map(p => ({
      id: p.id, name: p.name, en: p.en, born: p.born, died: p.died,
      country: p.country, period: p.period, branches: p.branches,
      regions: p.regions, tags: p.tags, summary: p.summary,
      home: p.home, sites: p.sites,
      statements: p.stmtList.map(st => ({
        id: st.id, year: st.year, branch: st.branch, work: st.work, workEn: st.workEn,
        text: st.text, links: (st.links || []).map(l => ({ to: l.to, type: l.type, note: l.note }))
      }))
    }))
  };
  download("anthropology-tool-data.json", JSON.stringify(data, null, 2), "application/json");
}
function exportBib() { download("anthropology-references.bib", bibtexOf(people), "text/plain;charset=utf-8"); }
function exportCSV() {
  const rows = [["人物id", "姓名", "原文名", "生", "卒", "国别", "时期", "领域", "观点id", "年份", "领域", "中文题名", "原题", "观点"]];
  people.forEach(p => p.stmtList.forEach(st => rows.push([
    p.id, p.name, p.en, bornLabel(p), p.died || "", p.country, periodById.get(p.period).label,
    p.branches.map(b => branchById.get(b).label).join("/"), st.id, st.year,
    branchById.get(st.branch).label, st.work || "", st.workEn || "", st.text
  ])));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  download("anthropology-tool-data.csv", "\ufeff" + csv, "text/csv;charset=utf-8");
}

function openAbout() {
  const _nP = people.length, _nS = stmts.length, _nE = edges.length;
  openDrawer(`
    <div class="dr-about">
      <div class="dr-name">关于这个项目</div>
      <div class="dr-en">中文世界的一幅“人类学思想地图”</div>
      <div class="dr-section-title">定位</div>
      <p>把人类学一百多年的理论脉络压缩成一张可以自由浏览的地图：每条观点落在时间轴上，观点之间用“继承/同意”与“批评/分歧”两种关系相连。它模仿的是 <span class="k">History of Philosophy — Summarized &amp; Visualized</span> 的组织方式，内容换成了社会/文化人类学与相关领域。</p>
      <div class="dr-section-title">怎么用</div>
      <p><span class="k">观点时间线</span>：横轴是年份，按领域分行，曲线表示观点之间的关系。<br>
      <span class="k">人物时间线</span>：每位学者一行，圆点是他/她在某一年提出的观点。<br>
      <span class="k">人物图谱</span>：人物按关联强度布局，绿线为继承/同意，红线为批评/分歧。<br>
      <span class="k">观点索引</span>：按人物分组的全部观点列表（含关系说明），可一键“定位”到时间线，并可下载 Markdown 全文。<br>
      左下筛选可以按领域、时期、关系类型过滤；“入门”只保留最核心的二十位人物，“要点”只保留每位学者 2–3 条代表性观点，“文字”控制是否在图上直接写出观点摘要。<br>
      图上默认把代表性观点直接写成文字，悬停某句时只有与它相关的连线会亮起，其余淡出——这是主要的阅读方式：顺着一位学者的要点，看他/她与谁呼应、与谁争论。放大到更近会显示更多次要观点。<br>
      点击任意圆点、文字或节点查看文章与观点详情。</p>
      <div class="dr-section-title">田野地图</div>
      <p><span class="k">圆点</span>是田野点/研究区域，大小代表在此做过研究的学者数；<span class="k">曲线</span>从学者主要任教或研究机构所在地连向田野点，可以直观看到二十世纪人类学的"从大都市到田野"结构。扶手椅学者（如弗雷泽）没有田野点，这一空白本身就是学科史的一部分。</p>
      <div class="dr-section-title">导出与引用</div>
      <p>每条观点都带原始题名，可复制引用或导出文献；下面是整库导出：</p>
      <div class="dr-actions">
        <button class="drawer-btn" id="exJson">导出全部数据 JSON</button>
        <button class="drawer-btn" id="exBib">导出全部文献 BibTeX</button>
        <button class="drawer-btn" id="exCsv">导出表格 CSV</button>
      </div>
      <p class="muted">导出内容为编者整理的二次文献信息（作者、年份、题名），正式引用前请核对原书版本与页码。</p>
      <div class="dr-section-title">数据说明</div>
      <p>本版收录 __N_PEOPLE__ 位学者、__N_STMT__ 条观点、__N_EDGE__ 组关系，由编者依据公开学术文献整理与改述，用于学习与浏览。观点年份取该著作/论文的初版年，个别跨年度出版的著作取通行版本年份。少数生年不易确证者标“约”。</p>
      <div class="dr-section-title">下一步</div>
      <p class="muted">可扩展方向：接入你自己的数据、补充中国人类学史、加入“师承/田野地点”维度、多语言版本、导出引用等。欢迎提出想法。</p>
    </div>`.replace("__N_PEOPLE__", _nP).replace("__N_STMT__", _nS).replace("__N_EDGE__", _nE));
}

/* ---------------- 筛选药丸与控件 ---------------- */
function buildPills() {
  const branchWrap = document.getElementById("branchPills");
  branchWrap.innerHTML = D.branches.map(b =>
    `<div class="item branch-item selected" data-id="${b.id}" title="${b.desc}"><span class="legend-dot" style="background:${b.color}"></span>${b.label}</div>`
  ).join("");
  const periodWrap = document.getElementById("periodPills");
  periodWrap.innerHTML = D.periods.map(p =>
    `<div class="item period-item selected" data-id="${p.id}">${p.label}</div>`
  ).join("");
  const edgeWrap = document.getElementById("edgePills");
  edgeWrap.innerHTML = `
    <div class="item edge-item selected" data-edge="agree" title="继承、影响、同意">继承 / 同意</div>
    <div class="item edge-item selected" data-edge="disagree" title="批评、分歧、论战">批评 / 分歧</div>`;
  const basicsWrap = document.getElementById("basicsPills");
  basicsWrap.innerHTML = `
    <div class="item basics-item" id="basicsPill" title="只保留最核心的入门人物">入门</div>
    <div class="item basics-item selected" id="keysPill" title="只显示每位学者 2–3 条代表性观点（默认开启，关掉可看全部 347 条观点）">要点</div>
    <div class="item basics-item selected" id="labelsPill" title="在圆点旁直接写出观点摘要；缩放到更近时会显示更多">文字</div>
    <span class="material-help" title="“入门”只保留 20 位最核心的人物；“要点”只保留每位学者 2–3 条代表性观点，其余观点可关掉“要点”查看；“文字”控制是否在图上直接显示观点摘要，放大后会出现更多句。"></span>`;

  /* 单击 = 只看这一个（其余的点直接消失）；再点一次 = 全部；Shift/⌘ 点击 = 多选 */
  const soloClick = (key, allIds) => (el, ev) => {
    const id = el.dataset.id;
    const set = state[key];          // 每次点击都从 state 取：重置筛选/URL 状态会换掉整个 Set
    const multi = ev.shiftKey || ev.metaKey || ev.ctrlKey;
    if (multi) {
      if (set.has(id)) set.delete(id); else set.add(id);
      if (!set.size) allIds.forEach(x => set.add(x));
    } else if (set.size === 1 && set.has(id)) {
      allIds.forEach(x => set.add(x));
    } else {
      set.clear(); set.add(id);
    }
    syncPillStates(); syncHash(); render(); updateAuxButtons();
    keepActiveInView();
  };
  const branchSolo = soloClick("branches", D.branches.map(b => b.id));
  branchWrap.querySelectorAll(".item").forEach(el => {
    el.title = el.title + " ｜ 单击只看这一个领域，再点一次恢复全部；Shift/⌘ 点击可多选";
    el.onclick = ev => branchSolo(el, ev);
  });
  const periodSolo = soloClick("periods", D.periods.map(p => p.id));
  periodWrap.querySelectorAll(".item").forEach(el => {
    el.title = "单击只看这个时期（其余的点会消失），再点一次恢复全部；Shift/⌘ 点击可多选";
    el.onclick = ev => periodSolo(el, ev);
  });
  edgeWrap.querySelectorAll(".item").forEach(el => el.onclick = () => {
    const t = el.dataset.edge;
    if (state.edges.has(t)) { state.edges.delete(t); el.classList.remove("selected"); }
    else { state.edges.add(t); el.classList.add("selected"); }
    syncHash(); render(); updateAuxButtons();
  });
  const bp = document.getElementById("basicsPill");
  bp.onclick = () => {
    state.basics = !state.basics;
    bp.classList.toggle("selected", state.basics);
    syncHash(); render(); updateAuxButtons();
  };
  const kp = document.getElementById("keysPill");
  kp.onclick = () => {
    state.keys = !state.keys;
    kp.classList.toggle("selected", state.keys);
    syncHash(); render(); updateAuxButtons();
  };
  const lp = document.getElementById("labelsPill");
  lp.onclick = () => {
    state.labels = !state.labels;
    lp.classList.toggle("selected", state.labels);
    syncHash(); render(); updateAuxButtons();
  };
}
function syncPillStates() {
  document.querySelectorAll(".branch-item").forEach(el => el.classList.toggle("selected", state.branches.has(el.dataset.id)));
  document.querySelectorAll(".period-item").forEach(el => el.classList.toggle("selected", state.periods.has(el.dataset.id)));
  document.querySelectorAll(".edge-item").forEach(el => el.classList.toggle("selected", state.edges.has(el.dataset.edge)));
}
function updateAuxButtons() {
  const anyOff = state.branches.size !== D.branches.length || state.periods.size !== D.periods.length ||
                 state.edges.size !== 2 || state.basics || !state.keys || !state.labels || !!qNorm();
  document.getElementById("resetFiltersBtn").hidden = !anyOff;
  document.getElementById("clearFocusBtn").hidden = !state.focus;
}

/* 筛选后如果视野里一个点都不剩，就把镜头平移到剩下这些点的中间（st/pt 横轴是年份，缩放不变） */
function keepActiveInView() {
  if (state.view !== "st" && state.view !== "pt") return;
  const band = usableBand();
  const onScreen = hits.some(h => h.kind === "stmt" && hitLive(h) &&
                                 h.x > 0 && h.x < W && h.y > band.t && h.y < band.b);
  if (onScreen) return;
  const act = stmts.filter(s => stmtActive(s));
  if (!act.length) return;
  const key = state.view === "st" ? "_st" : "_pt";
  const mid = arr => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];
  const c = cam();
  c.x = mid(act.map(s => s[key].x));
  c.y = mid(act.map(s => s[key].y));
  render();
}
function resetFilters() {
  state.branches = new Set(D.branches.map(b => b.id));
  state.periods = new Set(D.periods.map(p => p.id));
  state.edges = new Set(["agree", "disagree"]);
  state.basics = false; state.keys = true; state.labels = true; state.q = "";
  document.getElementById("search").value = "";
  document.getElementById("clearSearchBtn").style.display = "none";
  document.querySelectorAll(".branch-item,.period-item,.edge-item").forEach(el => el.classList.add("selected"));
  document.getElementById("basicsPill").classList.remove("selected");
  document.getElementById("keysPill").classList.add("selected");
  document.getElementById("labelsPill").classList.add("selected");
  syncHash(); render(); updateAuxButtons();
}
function clearFocus() {
  state.focus = null; state.highlightStmt = null;
  syncHash(); render(); updateAuxButtons();
}
document.getElementById("resetFiltersBtn").onclick = resetFilters;
document.getElementById("clearFocusBtn").onclick = clearFocus;

/* 视图切换 */
const viewSelector = document.getElementById("viewSelector");
viewSelector.querySelector(".selected-view").onclick = () => viewSelector.classList.toggle("open");
viewSelector.querySelectorAll(".dropdown-item").forEach(el => el.onclick = () => {
  setView(el.dataset.view);
  viewSelector.classList.remove("open");
});
document.addEventListener("click", e => {
  if (!viewSelector.contains(e.target)) viewSelector.classList.remove("open");
  const sc = document.querySelector(".topbar-search-container");
  if (sc && !sc.contains(e.target)) document.getElementById("searchResultContainer").classList.remove("open");
});
function setView(v) {
  state.view = v;
  viewSelector.querySelector(".selected-view .text").textContent = VIEW_LABELS[v] || VIEW_LABELS.st;
  viewSelector.querySelectorAll(".dropdown-item").forEach(el => el.classList.toggle("selected", el.dataset.view === v));
  viewSelector.querySelector(".selected-view .view-icon").innerHTML = iconFor(v);
  hover = null; hideTooltip();
  fitView(); applyDefaultZoom(v);
  if (state.view === "ix") render();     // 索引视图是 HTML 列表，fitView/默认取景都会提前返回，这里补一次渲染
  syncHash();
}
function iconFor(v) {
  if (v === "st") return `<svg viewBox="0 0 18 14"><line x1="1" y1="4" x2="17" y2="4"/><line x1="1" y1="10" x2="17" y2="10"/><circle cx="6" cy="4" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/></svg>`;
  if (v === "ix") return `<svg viewBox="0 0 18 14"><circle cx="2.6" cy="2.6" r="1.6" fill="currentColor" stroke="none"/><line x1="6.5" y1="2.6" x2="16.5" y2="2.6"/><circle cx="2.6" cy="7" r="1.6" fill="currentColor" stroke="none"/><line x1="6.5" y1="7" x2="16.5" y2="7"/><circle cx="2.6" cy="11.4" r="1.6" fill="currentColor" stroke="none"/><line x1="6.5" y1="11.4" x2="16.5" y2="11.4"/></svg>`;
  if (v === "mp") return `<svg viewBox="0 0 18 18"><circle cx="9" cy="9" r="7"/><ellipse cx="9" cy="9" rx="3.2" ry="7"/><line x1="2" y1="9" x2="16" y2="9"/></svg>`;
  if (v === "pt") return `<svg viewBox="0 0 18 14"><line x1="3" y1="2" x2="3" y2="12"/><circle cx="3" cy="4" r="1.7" fill="currentColor" stroke="none"/><circle cx="3" cy="10" r="1.7" fill="currentColor" stroke="none"/><circle cx="13" cy="4" r="1.7" fill="currentColor" stroke="none"/><circle cx="13" cy="10" r="1.7" fill="currentColor" stroke="none"/><path d="M3 4 L13 10"/><path d="M3 10 L13 4"/></svg>`;
  return `<svg viewBox="0 0 18 14"><line x1="4" y1="4" x2="13" y2="10"/><line x1="4" y1="10" x2="13" y2="4"/><circle cx="4" cy="4" r="2" fill="currentColor" stroke="none"/><circle cx="4" cy="10" r="2" fill="currentColor" stroke="none"/><circle cx="14" cy="7" r="2" fill="currentColor" stroke="none"/></svg>`;
}

/* 工具栏 */
document.getElementById("zoominButton").onclick = () => zoomBy(1.45, W / 2, H / 2);
document.getElementById("zoomoutButton").onclick = () => zoomBy(1 / 1.45, W / 2, H / 2);
document.getElementById("fitToScreenButton").onclick = () => fitView();
document.getElementById("darkModeToggleBtn").onclick = () => {
  state.dark = !state.dark;
  document.body.classList.toggle("dark-mode", state.dark);
  canvas.classList.toggle("dark-mode", state.dark);
  render();
};
document.getElementById("aboutBtn").onclick = openAbout;

/* ---------------- 搜索 ---------------- */
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("searchResultContainer");
const clearSearchBtn = document.getElementById("clearSearchBtn");
let searchTimer = null;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q = searchInput.value;
    clearSearchBtn.style.display = state.q ? "flex" : "none";
    document.querySelector(".topbar-search-container").classList.toggle("active", !!state.q);
    renderSearchResults();
    syncHash(); render(); updateAuxButtons();
  }, 160);
});
searchInput.addEventListener("focus", () => { if (qNorm()) renderSearchResults(); });
function clearSearchFilter() {
  searchInput.value = ""; state.q = ""; clearSearchBtn.style.display = "none";
  document.querySelector(".topbar-search-container").classList.remove("active");
  searchResults.classList.remove("open"); syncHash(); render(); updateAuxButtons();
}
clearSearchBtn.onclick = clearSearchFilter;
function renderSearchResults() {
  const q = qNorm();
  if (!q) { searchResults.classList.remove("open"); searchResults.querySelector(".list").innerHTML = ""; return; }
  const ppl = people.filter(p => [p.name, p.en || "", (p.tags || []).join(" "), p.summary].join(" ").toLowerCase().includes(q)).slice(0, 6);
  const st = stmts.filter(s => [s.text, s.work || ""].join(" ").toLowerCase().includes(q)).slice(0, 8);
  let html = "";
  if (ppl.length) html += `<div class="group-title">人物</div>` + ppl.map(p =>
    `<div class="result-item" data-kind="person" data-id="${p.id}"><span class="t">${p.name}</span><span class="s">${p.en} · ${bornLabel(p)}</span></div>`).join("");
  if (st.length) html += `<div class="group-title">观点</div>` + st.map(s =>
    `<div class="result-item" data-kind="stmt" data-id="${s.id}"><span class="t">${s.person.name}</span><span class="s">${s.year} · ${s.text}</span></div>`).join("");
  if (!html) html = `<div class="empty">没有匹配的条目</div>`;
  searchResults.querySelector(".list").innerHTML = html;
  searchResults.classList.add("open");
  searchResults.querySelectorAll(".result-item").forEach(el => el.onclick = () => {
    const id = el.dataset.id;
    clearSearchFilter();
    if (el.dataset.kind === "person") { openPerson(id); centerPerson(id); }
    else { const st = stmtById.get(id); state.highlightStmt = st.id; openPerson(st.person.id); centerStmt(st); }
  });
}
function centerPerson(id) {
  const p = personById.get(id); if (!p) return;
  if (state.view === "pg") { const nd = layout.pg.byId.get(id); if (nd) centerOn(nd.x, nd.y, cam().fitS * 2.2); return; }
  const pos = p.stmtList.map(s => state.view === "st" ? s._st : s._pt);
  if (!pos.length) return;
  const x = pos.reduce((m, v) => m + v.x, 0) / pos.length;
  const y = pos.reduce((m, v) => m + v.y, 0) / pos.length;
  centerOn(x, y, cam().fitS * 2.6);
}
function zoomToStmt(s) {   // 以“可读但不过分放大”的比例定位到某条观点（供索引视图跳转）
  const pos = state.view === "st" ? s._st : s._pt;
  const c = cam();
  c.s = c.fitS * 1.15;
  centerOn(pos.x, pos.y);
}

function centerStmt(s) {
  if (state.view === "pg") { const nd = layout.pg.byId.get(s.person.id); if (nd) centerOn(nd.x, nd.y, cam().fitS * 2.2); return; }
  const pos = state.view === "st" ? s._st : s._pt;
  centerOn(pos.x, pos.y, cam().fitS * 3.2);
}

/* ---------------- 拖拽画布时按 Esc 关闭 ---------------- */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeDrawer(); clearFocus(); hideTooltip(); }
});

/* ---------------- 地址栏状态 ---------------- */
function syncHash() {
  const parts = [];
  parts.push("view=" + state.view);
  if (state.branches.size !== D.branches.length) parts.push("cats=" + [...state.branches].join(","));
  if (state.periods.size !== D.periods.length) parts.push("periods=" + [...state.periods].join(","));
  if (state.edges.size !== 2) parts.push("edges=" + [...state.edges].join(","));
  if (state.basics) parts.push("basics=1");
  if (!state.keys) parts.push("keys=0");
  if (!state.labels) parts.push("labels=0");
  if (qNorm()) parts.push("q=" + encodeURIComponent(state.q));
  if (state.focus) parts.push("focus=" + state.focus.kind + ":" + state.focus.id);
  const hash = "#" + parts.join("&");
  try { history.replaceState(null, "", hash); } catch (err) { location.hash = hash; }
}
function readHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return;
  const params = new URLSearchParams(h);
  const v = params.get("view");
  if (v && ["st", "pt", "pg", "mp", "ix"].includes(v)) setViewSilent(v);
  const cats = params.get("cats");
  if (cats) {
    state.branches = new Set(cats.split(",").filter(x => branchById.has(x)));
    document.querySelectorAll(".branch-item").forEach(el => el.classList.toggle("selected", state.branches.has(el.dataset.id)));
  }
  const periods = params.get("periods");
  if (periods) {
    state.periods = new Set(periods.split(",").filter(x => periodById.has(x)));
    document.querySelectorAll(".period-item").forEach(el => el.classList.toggle("selected", state.periods.has(el.dataset.id)));
  }
  const e = params.get("edges");
  if (e) {
    state.edges = new Set(e.split(",").filter(x => x === "agree" || x === "disagree"));
    document.querySelectorAll(".edge-item").forEach(el => el.classList.toggle("selected", state.edges.has(el.dataset.edge)));
  }
  if (params.get("basics")) { state.basics = true; document.getElementById("basicsPill").classList.add("selected"); }
  if (params.get("keys") === "0") { state.keys = false; document.getElementById("keysPill").classList.remove("selected"); }
  if (params.get("labels") === "0") { state.labels = false; document.getElementById("labelsPill").classList.remove("selected"); }
  const q = params.get("q");
  if (q) { state.q = q; searchInput.value = q; clearSearchBtn.style.display = "flex"; document.querySelector(".topbar-search-container").classList.add("active"); }
  const f = params.get("focus");
  if (f) {
    const [kind, id] = f.split(":");
    if ((kind === "person" && personById.has(id)) || (kind === "stmt" && stmtById.has(id))) {
      state.focus = { kind, id };
      if (kind === "person") openPerson(id);
    }
  }
}
function setViewSilent(v) {
  state.view = v;
  viewSelector.querySelector(".selected-view .text").textContent = VIEW_LABELS[v] || VIEW_LABELS.st;
  viewSelector.querySelectorAll(".dropdown-item").forEach(el => el.classList.toggle("selected", el.dataset.view === v));
  viewSelector.querySelector(".selected-view .view-icon").innerHTML = iconFor(v);
}

/* ---------------- 启动 ---------------- */
buildPills();
buildLayouts();
readHash();
window.addEventListener("resize", resize);
resize();
stretchTimeline();
fitView();
applyDefaultZoom(state.view);
updateAuxButtons();

/* 调试/集成接口 */
window.__anthro = {
  state, data: D, meta: META, layout, fitView, setView, openPerson, openSite, render,
  hits: () => hits, refsOf, bibtexOf, citeText, exportJSON, exportBib, exportCSV,
  debug: () => ({ labelCount, labelRects: labelRects.length, cam: cam(), W, H, lastCand: window.__lastCand, ticks: lastTicks, time: TIME })
};
})();
