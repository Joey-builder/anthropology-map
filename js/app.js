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

const edges = [];                    // 观点级关系
stmts.forEach(s => (s.links || []).forEach(l => {
  const t = stmtById.get(l.to);
  if (!t) { console.warn("未找到关联观点：", s.id, "->", l.to); return; }
  s.rel.push({ other: t, type: l.type, note: l.note });
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

/* ---------------- 状态 ---------------- */
const state = {
  view: "st",
  branches: new Set(D.branches.map(b => b.id)),
  periods: new Set(D.periods.map(p => p.id)),
  edges: new Set(["agree", "disagree"]),
  basics: false,
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
const cam = () => cams[state.view];
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

/* ---------------- 布局 ---------------- */
const layout = { st: null, pt: null, pg: null };

function buildSentenceLayout() {
  const rows = [];
  let y = 0;
  const SLOT_GAP = 2.4, ROW_PAD = 3.4, MIN_GAP = 3.0;
  D.branches.forEach(b => {
    const list = stmts.filter(s => s.branch === b.id).sort((p, q) => p.year - q.year);
    const slotLast = [];
    list.forEach(s => {
      let slot = 0;
      while (slot < slotLast.length && s.year - slotLast[slot] < MIN_GAP) slot++;
      if (slot === slotLast.length) slotLast.push(-1e9);
      slotLast[slot] = s.year;
      s._st = { x: s.year, y: y + slot * SLOT_GAP };
    });
    const bandH = Math.max(slotLast.length, 1) * SLOT_GAP;
    rows.push({ branch: b, top: y, height: bandH, center: y + bandH / 2 });
    y += bandH + ROW_PAD;
  });
  layout.st = { rows, minY: 0, maxY: y };
}
function buildPeopleLayout() {
  const sorted = [...people].sort((a, b) => (a.born - b.born) || a.name.localeCompare(b.name));
  const ROW = 3.6, SLOT = 1.05, MIN_GAP = 2.2;
  let y = 0;
  sorted.forEach(p => {
    p._rowY = y;
    const list = [...p.stmtList].sort((a, b) => a.year - b.year);
    const slotLast = [];
    list.forEach(s => {
      let slot = 0;
      while (slot < slotLast.length && s.year - slotLast[slot] < MIN_GAP) slot++;
      if (slot === slotLast.length) slotLast.push(-1e9);
      slotLast[slot] = s.year;
      s._pt = { x: s.year, y: y + (slot % 3) * SLOT };
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
      path.moveTo(mapX(pts[0][0]), mapY(pts[0][1]));
      for (let i = 1; i < pts.length; i++) path.lineTo(mapX(pts[i][0]), mapY(pts[i][1]));
      path.closePath();
    };
    topo.objects.countries.geometries.forEach(g => {
      const polys = g.type === "Polygon" ? [g.arcs] : g.arcs;
      polys.forEach(poly => poly.forEach(ri => addRing(ringOf(ri))));
    });
  }
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
    path, sites: [...siteMap.values()], homes: [...homeMap.values()],
    bounds: { minX: mapX(-180), maxX: mapX(180), minY: mapY(80), maxY: mapY(-58) }
  };
}
function buildLayouts() { buildSentenceLayout(); buildPeopleLayout(); buildGraph(); buildMapLayout(); }

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
  const b = worldBounds();
  const pad = state.view === "pg" ? { l: 100, r: 100, t: 96, b: 252 }
            : state.view === "mp" ? { l: 120, r: 120, t: 100, b: 252 }
            : state.view === "st" ? { l: 200, r: 80, t: 96, b: 252 }
            : { l: 220, r: 80, t: 96, b: 252 };
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

const VIEW_LABELS = { st: "观点时间线", pt: "人物时间线", pg: "人物图谱", mp: "田野地图" };

/* ---------------- 颜色 ---------------- */
const C = () => state.dark
  ? { bg: "#101112", ink: "#f2f2f2", soft: "rgba(255,255,255,.16)", grid: "rgba(255,255,255,.07)",
      label: "rgba(255,255,255,.78)", sub: "rgba(255,255,255,.42)", dotRing: "#101112",
      agree: "#5fbf6a", disagree: "#d3706a", edgeA: 0.5 }
  : { bg: "#ffffff", ink: "#000000", soft: "rgba(0,0,0,.22)", grid: "rgba(0,0,0,.06)",
      label: "rgba(0,0,0,.8)", sub: "rgba(0,0,0,.45)", dotRing: "#ffffff",
      agree: "#4ea155", disagree: "#c4554f", edgeA: 0.45 };

/* ---------------- 渲染 ---------------- */
let hits = [];
let hover = null;   // {kind,x,y,item}
let hoverPerson = null;

function render() {
  if (!layout.st) return;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const col = C();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = col.bg; ctx.fillRect(0, 0, W, H);
  hits = [];
  const fs = focusSet();
  if (state.view === "st") renderSentence(col, fs);
  else if (state.view === "pt") renderPeople(col, fs);
  else if (state.view === "mp") renderMap(col, fs);
  else renderGraph(col, fs);
  updateStats();
  updateViewHint();
}

function drawYearAxis(col) {
  const c = cam();
  const minYear = Math.floor((c.x - (W / 2) / c.s) / 10) * 10;
  const maxYear = Math.ceil((c.x + (W / 2) / c.s) / 10) * 10;
  const steps = [5, 10, 20, 25, 50, 100];
  let step = steps.find(st => st * c.s >= 74) || 100;
  ctx.save();
  ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = minYear; y <= maxYear; y += step) {
    const x = P(y, 0)[0];
    ctx.moveTo(x, 0); ctx.lineTo(x, H - 34);
  }
  ctx.stroke();
  ctx.fillStyle = col.sub; ctx.font = `11px ${FONT}`; ctx.textAlign = "center";
  for (let y = minYear; y <= maxYear; y += step) {
    const x = P(y, 0)[0];
    ctx.fillText(String(y), x, H - 40);
  }
  ctx.strokeStyle = col.grid;
  ctx.beginPath(); ctx.moveTo(0, H - 34); ctx.lineTo(W, H - 34); ctx.stroke();
  ctx.restore();
}

function curve(p1, p2, bend) {
  const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2 + bend;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.quadraticCurveTo(mx, my, p2[0], p2[1]);
  ctx.stroke();
}

function renderSentence(col, fs) {
  drawYearAxis(col);
  const c = cam();
  // 行标签
  ctx.font = `600 12px ${FONT}`;
  layout.st.rows.forEach(row => {
    const yc = P(c.x, row.center)[1];
    if (yc < 40 || yc > H - 40) return;
    const n = stmts.filter(s => s.branch === row.branch.id && stmtActive(s)).length;
    const x = 88;
    ctx.save();
    ctx.globalAlpha = n > 0 ? 1 : 0.35;
    ctx.fillStyle = col.bg;
    ctx.fillRect(x - 6, yc - 11, 168, 22);
    ctx.fillStyle = row.branch.color;
    ctx.beginPath(); ctx.arc(x + 2, yc - 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = n > 0 ? col.ink : col.sub;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText(row.branch.label, x + 12, yc + 1);
    ctx.fillStyle = col.sub; ctx.font = `11px ${FONT}`;
    ctx.fillText(String(n), x + 12 + ctx.measureText(row.branch.label).width + 22, yc + 1);
    ctx.font = `600 12px ${FONT}`;
    ctx.restore();
  });
  // 关系线
  edges.forEach(e => {
    const a1 = alphaFor(e.a, fs), a2 = alphaFor(e.b, fs);
    if (a1 < 0.5 || a2 < 0.5) return;
    if (!state.edges.has(e.type)) return;
    const p1 = P(e.a._st.x, e.a._st.y), p2 = P(e.b._st.x, e.b._st.y);
    const hot = hover && hover.kind === "stmt" && (hover.item === e.a || hover.item === e.b);
    ctx.save();
    ctx.globalAlpha = hot ? 0.95 : col.edgeA * 0.8;
    ctx.strokeStyle = e.type === "agree" ? col.agree : col.disagree;
    ctx.lineWidth = hot ? 1.7 : 1;
    curve(p1, p2, -(Math.abs(p2[0] - p1[0]) * 0.12 + 12));
    ctx.restore();
  });
  // 观点点
  const zoomed = c.s > cam().fitS * 1.7;
  stmts.forEach(s => {
    const p = P(s._st.x, s._st.y);
    if (p[0] < -40 || p[0] > W + 40 || p[1] < -40 || p[1] > H + 40) return;
    const a = alphaFor(s, fs);
    const isHover = hover && hover.kind === "stmt" && hover.item === s;
    const isHi = state.highlightStmt === s.id;
    const r = isHover ? 5.5 : (isHi ? 5 : 4);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = branchById.get(s.branch).color;
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
    if (isHover || isHi) {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(p[0], p[1], r + 3, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    hits.push({ x: p[0], y: p[1], kind: "stmt", item: s });
    if ((zoomed && a > 0.5) || isHover) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, a + 0.1);
      ctx.font = `10.5px ${FONT}`; ctx.textAlign = "left";
      const nm = s.person.name.replace(/（.*?）/g, "").slice(0, 6);
      ctx.lineWidth = 3; ctx.strokeStyle = col.bg; ctx.strokeText(nm, p[0] + 8, p[1] + 3.5);
      ctx.fillStyle = col.sub; ctx.fillText(nm, p[0] + 8, p[1] + 3.5);
      ctx.restore();
    }
  });
}

function renderPeople(col, fs) {
  drawYearAxis(col);
  const L = layout.pt;
  const anchor = new Map();
  L.order.forEach(p => {
    let first = null, ys = [];
    p.stmtList.forEach(s => {
      const a = alphaFor(s, fs); if (a < 0.5) return;
      if (!first || s.year < first.year) first = s;
      ys.push(s._pt.y);
    });
    if (first) anchor.set(p.id, { x: first.year, y: ys.reduce((m, v) => m + v, 0) / ys.length });
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
    const hot = hover && hover.kind === "person" && (hover.item.id === pe.a || hover.item.id === pe.b);
    ctx.save();
    ctx.globalAlpha = hot ? 0.9 : (fs ? 0.16 : col.edgeA * 0.55);
    ctx.strokeStyle = type === "agree" ? col.agree : type === "disagree" ? col.disagree : col.soft;
    ctx.lineWidth = hot ? 2 : 1;
    curve(p1, p2, -(Math.abs(p2[0] - p1[0]) * 0.08 + 10));
    ctx.restore();
  });
  // 姓名与点
  ctx.font = `11.5px ${FONT}`;
  L.order.forEach(p => {
    const rowY = P(cam().x, p._rowY)[1];
    if (rowY < 30 || rowY > H - 44) return;
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
      ctx.beginPath(); ctx.arc(pos[0], pos[1], isHover ? 5.5 : 3.6, 0, Math.PI * 2); ctx.fill();
      if (isHover) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(pos[0], pos[1], 8.5, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
      hits.push({ x: pos[0], y: pos[1], kind: "stmt", item: s });
    });
    if (!n) return;
    const fsInfo = fs && fs.kind === "person" && !fs.ids.has(p.id);
    const labelX = Math.max(96, minX - 10);
    ctx.save();
    ctx.globalAlpha = fsInfo ? 0.3 : 0.96;
    const tw = ctx.measureText(p.name).width;
    ctx.fillStyle = col.bg;
    ctx.fillRect(Math.max(12, labelX - tw - 8), rowY - 8, tw + 10, 16);
    ctx.textAlign = "right";
    ctx.lineWidth = 3; ctx.strokeStyle = col.bg;
    ctx.strokeText(p.name, labelX, rowY + 4);
    ctx.fillStyle = col.label;
    ctx.fillText(p.name, labelX, rowY + 4);
    ctx.restore();
    const hp = { kind: "person", x: labelX - tw / 2, y: rowY, item: p };
    hits.push(hp);
  });
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
    const hot = hover && hover.kind === "person" && (hover.item.id === l.a.p.id || hover.item.id === l.b.p.id);
    const types = new Set(list.map(e => e.type));
    const type = types.size > 1 ? "mixed" : list[0].type;
    ctx.save();
    ctx.globalAlpha = hot ? 0.95 : (fs ? 0.14 : 0.4);
    ctx.strokeStyle = type === "agree" ? col.agree : type === "disagree" ? col.disagree : col.soft;
    ctx.lineWidth = hot ? 2 : Math.min(3, 0.8 + 0.35 * (list.length - 1));
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
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

/* 墨卡托投影：经度 → x，纬度 → y（屏幕坐标，向北为负） */
const DEG = Math.PI / 180;
const mapX = lon => lon * DEG;
const mapY = lat => -Math.log(Math.tan(Math.PI / 4 + Math.max(-60, Math.min(80, lat)) * DEG / 2));

function renderMap(col, fs) {
  const M = layout.mp, c = cam();
  /* 陆地底图（世界坐标为 经度 / -纬度） */
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(c.s, c.s); ctx.translate(-c.x, -c.y);
  ctx.fillStyle = state.dark ? "#17181a" : "#f4f5f7";
  ctx.strokeStyle = state.dark ? "#2b2d31" : "#e2e4e8";
  ctx.lineWidth = 0.7 / c.s;
  ctx.fill(M.path); ctx.stroke(M.path);
  ctx.restore();

  const activeP = p => personActive(p) && (!fs || fs.kind !== "person" || fs.ids.has(p.id));

  /* 线：主要机构所在地 → 田野点 */
  people.forEach(p => {
    if (!p.home || !p.sites.length) return;
    const on = activeP(p);
    const p1 = P(mapX(p.home[0]), mapY(p.home[1]));
    const colr = branchById.get(p.branches[0]).color;
    p.sites.forEach(site => {
      const hotArc = hover && hover.kind === "arc" && hover.item === p && hover.site === site.name;
      const hotSite = hover && hover.kind === "site" && hover.item.name === site.name;
      if (!on && !hotArc) return;
      const p2 = P(mapX(site.lon), mapY(site.lat));
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
    const p = P(mapX(site.lon), mapY(site.lat));
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
    const p = P(mapX(h.lon), mapY(h.lat));
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
    const p = P(mapX(site.lon), mapY(site.lat));
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
    const p = P(mapX(h.lon), mapY(h.lat));
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
  el.textContent = state.view === "mp"
    ? "实心圆 = 田野点（大小 = 学者数） · 空心圆 = 机构城市 · 曲线 = 从机构所在地到田野点"
    : state.view === "st" ? "曲线 = 观点之间的关系（绿：继承/同意 · 红：批评/分歧）"
    : state.view === "pt" ? "每行一位学者 · 圆点 = 其观点提出的年份"
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

function pick(x, y, maxDist) {
  let best = null, bd = maxDist;
  hits.forEach(h => {
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
    tooltipData = `<div class="tt-head"><span class="tt-name">${p.name}</span><span class="tt-year">${p.born}${p.died ? "–" + p.died : "–"}</span></div>
      <div class="tt-work">${p.en}</div>
      <div class="tt-text">田野点：${h.site}</div>
      <div class="tt-hint">点击查看人物详情</div>`;
  } else {
    const p = h.item;
    const years = p.died ? `${p.born}–${p.died}` : `${p.born}–`;
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
  const years = p.died ? `${p.born}—${p.died}` : `${p.born}—`;
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
        <span class="dr-stmt-year">${p.born}${p.died ? "–" + p.died : "–"}</span>
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
    p.id, p.name, p.en, p.born, p.died || "", p.country, periodById.get(p.period).label,
    p.branches.map(b => branchById.get(b).label).join("/"), st.id, st.year,
    branchById.get(st.branch).label, st.work || "", st.workEn || "", st.text
  ])));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  download("anthropology-tool-data.csv", "\ufeff" + csv, "text/csv;charset=utf-8");
}

function openAbout() {
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
      左下筛选可以按领域、时期、关系类型过滤；“入门”只保留最核心的十几位人物。点击任意圆点或节点查看文章与观点详情。</p>
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
      <p>本版收录 59 位学者、141 条观点、114 组关系，由编者依据公开学术文献整理与改述，用于学习与浏览。观点年份取该著作/论文的初版年，个别跨年度出版的著作取通行版本年份。</p>
      <div class="dr-section-title">下一步</div>
      <p class="muted">可扩展方向：接入你自己的数据、补充中国人类学史、加入“师承/田野地点”维度、多语言版本、导出引用等。欢迎提出想法。</p>
    </div>`);
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
    <span class="material-help" title="“入门”会只保留 16 位最核心的人物，便于先建立整体印象"></span>`;

  branchWrap.querySelectorAll(".item").forEach(el => el.onclick = () => {
    const id = el.dataset.id;
    if (state.branches.has(id)) { state.branches.delete(id); el.classList.remove("selected"); }
    else { state.branches.add(id); el.classList.add("selected"); }
    syncHash(); render(); updateAuxButtons();
  });
  periodWrap.querySelectorAll(".item").forEach(el => el.onclick = () => {
    const id = el.dataset.id;
    if (state.periods.has(id)) { state.periods.delete(id); el.classList.remove("selected"); }
    else { state.periods.add(id); el.classList.add("selected"); }
    syncHash(); render(); updateAuxButtons();
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
}
function updateAuxButtons() {
  const anyOff = state.branches.size !== D.branches.length || state.periods.size !== D.periods.length ||
                 state.edges.size !== 2 || state.basics || !!qNorm();
  document.getElementById("resetFiltersBtn").hidden = !anyOff;
  document.getElementById("clearFocusBtn").hidden = !state.focus;
}
function resetFilters() {
  state.branches = new Set(D.branches.map(b => b.id));
  state.periods = new Set(D.periods.map(p => p.id));
  state.edges = new Set(["agree", "disagree"]);
  state.basics = false; state.q = "";
  document.getElementById("search").value = "";
  document.getElementById("clearSearchBtn").style.display = "none";
  document.querySelectorAll(".branch-item,.period-item,.edge-item").forEach(el => el.classList.add("selected"));
  document.getElementById("basicsPill").classList.remove("selected");
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
  fitView(); syncHash();
}
function iconFor(v) {
  if (v === "st") return `<svg viewBox="0 0 18 14"><line x1="1" y1="4" x2="17" y2="4"/><line x1="1" y1="10" x2="17" y2="10"/><circle cx="6" cy="4" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/></svg>`;
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
    `<div class="result-item" data-kind="person" data-id="${p.id}"><span class="t">${p.name}</span><span class="s">${p.en} · ${p.born}</span></div>`).join("");
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
  if (v && ["st", "pt", "pg", "mp"].includes(v)) setViewSilent(v);
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
fitView();
updateAuxButtons();

/* 调试/集成接口 */
window.__anthro = {
  state, data: D, meta: META, layout, fitView, setView, openPerson, openSite, render,
  hits: () => hits, refsOf, bibtexOf, citeText, exportJSON, exportBib, exportCSV
};
})();
