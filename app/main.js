// Canada by Numbers — router, charts and controls. No libraries, no network:
// every figure comes from ./data.js and every chart is hand-built SVG.

import {
  META, HEADLINE, SERIES, AGE_STRUCTURE, REGIONS,
  SECTORS, TRADE, HEALTH, EDUCATION, EDUCATION_BARS, SOCIETY,
} from "./data.js";

const view = document.getElementById("view");

// ---------- small helpers ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

const fmt = (n, digits = 1) =>
  Number(n).toLocaleString("en-CA", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function arrow(change, unit) {
  if (change > 0) return `<span class="k-change up">▲ ${fmt(Math.abs(change))}${esc(unit)} vs prior year</span>`;
  if (change < 0) return `<span class="k-change down">▼ ${fmt(Math.abs(change))}${esc(unit)} vs prior year</span>`;
  return `<span class="k-change flat">— unchanged</span>`;
}

// ---------- SVG charts ----------

// Line chart for a [{year, v}] series. `second` draws a second series in gold.
function lineChart(series, { height = 260, format = (v) => fmt(v), second = null, label = "" } = {}) {
  const W = 640, H = height, padL = 52, padR = 14, padT = 14, padB = 30;
  const all = second ? [...series, ...second] : series;
  const ys = all.map((p) => p.v);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  const span = hi - lo || 1;
  lo -= span * 0.12; hi += span * 0.12;
  const x = (i, n) => padL + ((W - padL - padR) * i) / Math.max(n - 1, 1);
  const y = (v) => padT + ((hi - v) / (hi - lo)) * (H - padT - padB);
  const path = (s) => s.map((p, i) => `${i ? "L" : "M"}${x(i, s.length).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const ticks = 4;
  let grid = "";
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    grid += `<line class="grid" x1="${padL}" y1="${y(v)}" x2="${W - padR}" y2="${y(v)}"/>` +
      `<text class="tick" x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${esc(format(v))}</text>`;
  }
  const years = series.map((p, i) =>
    `<text class="tick" x="${x(i, series.length)}" y="${H - 8}" text-anchor="middle">${p.year}</text>`).join("");
  const dots = series.map((p, i) =>
    `<circle class="dot" cx="${x(i, series.length)}" cy="${y(p.v)}" r="3.5"><title>${p.year}: ${esc(format(p.v))}</title></circle>`).join("");
  const secondPath = second
    ? `<path class="line2" d="${path(second)}"/>` + second.map((p, i) =>
        `<circle cx="${x(i, second.length)}" cy="${y(p.v)}" r="3" fill="#d9a441"><title>${p.year}: ${esc(format(p.v))}</title></circle>`).join("")
    : "";
  const area = `<path class="area" d="${path(series)} L${x(series.length - 1, series.length).toFixed(1)},${y(lo).toFixed(1)} L${x(0, series.length).toFixed(1)},${y(lo).toFixed(1)} Z"/>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} line chart">
    ${grid}${area}<path class="line" d="${path(series)}"/>${secondPath}${dots}${years}
    <line class="axis" x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}"/>
    <line class="axis" x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}"/>
  </svg>`;
}

// Horizontal bar chart for [{group/name, share}] items.
function barChart(items, { value = (d) => `${fmt(d.share)}%`, max = null, barClass = "" } = {}) {
  const W = 640, rowH = 34, padL = 170, padR = 64, padT = 8;
  const H = padT + items.length * rowH + 8;
  const top = max ?? Math.max(...items.map((d) => d.share));
  const rows = items.map((d, i) => {
    const y = padT + i * rowH;
    const w = ((W - padL - padR) * d.share) / top;
    const label = esc(d.group ?? d.name);
    return `<text class="bar-label" x="${padL - 8}" y="${y + 19}" text-anchor="end">${label}</text>` +
      `<rect class="bar ${barClass}" x="${padL}" y="${y + 5}" width="${Math.max(w, 2).toFixed(1)}" height="18" rx="4"/>` +
      `<text class="bar-value" x="${padL + w + 8}" y="${y + 19}">${esc(value(d))}</text>`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="bar chart">${rows}</svg>`;
}

// ---------- shared pieces ----------

function kpiCards() {
  return `<div class="kpis">${HEADLINE.map((k) => `
    <div class="kpi">
      <div class="k-label">${esc(k.label)} · ${k.year}</div>
      <div class="k-value">${fmt(k.value, k.id === "gdp-pc" ? 0 : 1)} <small>${esc(k.unit)}</small></div>
      ${arrow(k.change, k.changeUnit)}
      <div class="k-note">${esc(k.note)}</div>
    </div>`).join("")}</div>`;
}

function yearChips(current, onPick) {
  const ranges = [[2015, "2015–2024"], [2019, "2019–2024"], [2020, "2020–2024"]];
  return `<div class="controls" role="group" aria-label="Year range">
    <span class="ctl-label">Show:</span>
    ${ranges.map(([from, label]) =>
      `<button class="chip" data-from="${from}" aria-pressed="${current === from}">${label}</button>`).join("")}
  </div>`;
}

function bindChips(container, render) {
  container.querySelectorAll(".chip[data-from]").forEach((chip) => {
    chip.addEventListener("click", () => render(Number(chip.dataset.from)));
  });
}

// Sortable, searchable regions table. `rows` is a copy of REGIONS.
function regionsTable(rows) {
  let sortKey = "pop", sortDir = -1, query = "";
  const wrap = document.createElement("div");
  const render = () => {
    // Remember whether the search box held focus before this re-render
    // (rebuilding innerHTML destroys it); restore focus only in that case.
    const hadFocus = wrap.querySelector(".search") === document.activeElement;
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) =>
      !q || r.name.toLowerCase().includes(q) || r.capital.toLowerCase().includes(q));
    list = [...list].sort((a, b) =>
      (typeof a[sortKey] === "string"
        ? a[sortKey].localeCompare(b[sortKey])
        : a[sortKey] - b[sortKey]) * sortDir);
    const total = list.reduce((s, r) => s + r.pop, 0);
    wrap.innerHTML = `
      <div class="controls">
        <input class="search" type="search" placeholder="Search a province or capital…" aria-label="Search provinces" value="${esc(query)}">
        <span class="source-note">${list.length} of ${rows.length} regions · populations in millions, 2024</span>
      </div>
      <div style="overflow-x:auto">
      <table class="data">
        <thead><tr>
          <th><button data-sort="name">Province / territory ${sortKey === "name" ? (sortDir === 1 ? "↑" : "↓") : ""}</button></th>
          <th><button data-sort="capital">Capital ${sortKey === "capital" ? (sortDir === 1 ? "↑" : "↓") : ""}</button></th>
          <th class="num"><button data-sort="pop">Population (M) ${sortKey === "pop" ? (sortDir === 1 ? "↑" : "↓") : ""}</button></th>
          <th class="num"><button data-sort="share">Share ${sortKey === "share" ? (sortDir === 1 ? "↑" : "↓") : ""}</button></th>
          <th class="num"><button data-sort="density">Density /km² ${sortKey === "density" ? (sortDir === 1 ? "↑" : "↓") : ""}</button></th>
        </tr></thead>
        <tbody>
          ${list.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.capital)}</td>
            <td class="num">${fmt(r.pop, 2)}</td><td class="num">${fmt(r.share)}%</td>
            <td class="num">${fmt(r.density, r.density < 1 ? 2 : 1)}</td></tr>`).join("")}
          <tr class="total"><td colspan="2">Shown total</td><td class="num">${fmt(total, 2)}</td>
            <td class="num">${fmt(list.reduce((s, r) => s + r.share, 0))}%</td><td class="num">—</td></tr>
        </tbody>
      </table>
      </div>
      <p class="source-note">Source: Statistics Canada 2024 population estimates, rounded.
      Density uses land area. The three territories together hold about 0.3% of Canadians.</p>`;
    wrap.querySelector(".search").addEventListener("input", (e) => { query = e.target.value; render(); });
    wrap.querySelectorAll("th button").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.sort;
      if (sortKey === k) sortDir *= -1;
      else { sortKey = k; sortDir = typeof rows[0][k] === "string" ? 1 : -1; }
      render();
    }));
    // Re-rendering rebuilds the input, so restore focus only when the user
    // was typing in it — sorting must not yank focus away from the button.
    if (hadFocus) {
      const input = wrap.querySelector(".search");
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  };
  render();
  return wrap;
}

// ---------- views ----------

function overview() {
  view.innerHTML = `
    <div class="hero">
      <h1>Canada, measured.</h1>
      <p class="lede">One country, ten years of numbers: how many Canadians there are,
      what the economy makes, how long people live, and how the provinces compare —
      from the World Bank, Statistics Canada and the OECD.</p>
      <p class="updated">Figures for 2024 unless noted · Updated ${esc(META.updated)} · Capital ${esc(META.capital)} · Area ${fmt(META.areaKm2, 0)} km²</p>
    </div>
    ${kpiCards()}
    <section>
      <h2>A decade of growth</h2>
      <p class="sub">Population in millions, 2015–2024. Growth sped up sharply after 2021.</p>
      <div class="card"><div id="pop-chart"></div></div>
    </section>
    <section>
      <h2>Where Canadians live</h2>
      <p class="sub">The five largest provinces hold 91% of the country.</p>
      <div class="card"><div id="prov-bars"></div></div>
    </section>
    <section>
      <h2>Canada at a glance</h2>
      <div class="grid-2">
        <div class="card"><h3>Society</h3>
          <ul class="facts">${SOCIETY.slice(0, 5).map((s) => `<li><span>${esc(s.label)} <span class="f-note">${s.year}</span></span><span class="f-value">${esc(s.value)}</span></li>`).join("")}</ul>
        </div>
        <div class="card"><h3>Money &amp; standing</h3>
          <ul class="facts">${SOCIETY.slice(5).map((s) => `<li><span>${esc(s.label)} <span class="f-note">${s.year}</span></span><span class="f-value">${esc(s.value)}</span></li>`).join("")}</ul>
        </div>
      </div>
      <div class="callout"><p><strong>Why this site?</strong> National statistics usually live in
      spreadsheets. Here the headline numbers, the ten-year trends and the provincial
      split sit on one page — and every figure names its source. Start with
      <a href="#/population">Population</a> or <a href="#/economy">Economy</a> to dig in.</p></div>
    </section>`;
  const popBox = view.querySelector("#pop-chart");
  const drawPop = (from) => {
    popBox.innerHTML = yearChips(from) + lineChart(SERIES.population.filter((p) => p.year >= from),
      { format: (v) => `${fmt(v, 0)}M`, label: "Population" });
    bindChips(popBox, drawPop);
  };
  drawPop(2015);
  view.querySelector("#prov-bars").innerHTML = barChart(
    [...REGIONS].sort((a, b) => b.pop - a.pop).slice(0, 5).map((r) => ({ group: r.name, share: r.pop })),
    { value: (d) => `${fmt(d.share, 1)}M`, max: 16.01, barClass: "alt" });
}

function population() {
  view.innerHTML = `
    <div class="hero"><h1>Population</h1>
      <p class="lede">41.29 million Canadians in 2024 — up 3.0% in a single year, the fastest
      growth since the 1950s. One in five Canadians is now 65 or older.</p></div>
    <section><h2>Growth, 2015–2024</h2>
      <p class="sub">Population in millions. Pick a range to zoom in.</p>
      <div class="card"><div id="pop-chart"></div></div></section>
    <section><h2>Who Canadians are</h2>
      <p class="sub">Age structure, 2024 — share of the population.</p>
      <div class="card"><div id="age-bars"></div>
      <p class="source-note">Source: World Bank. The 65+ share has nearly doubled since 1990.</p></div></section>
    <section><h2>Provinces &amp; territories</h2>
      <p class="sub">Sort any column, or search for a province or its capital.</p>
      <div class="card" id="regions-card"></div></section>`;
  const popBox = view.querySelector("#pop-chart");
  const drawPop = (from) => {
    popBox.innerHTML = yearChips(from) + lineChart(SERIES.population.filter((p) => p.year >= from),
      { format: (v) => `${fmt(v, 0)}M`, label: "Population" });
    bindChips(popBox, drawPop);
  };
  drawPop(2015);
  view.querySelector("#age-bars").innerHTML = barChart(AGE_STRUCTURE,
    { value: (d) => `${fmt(d.share)}%`, max: 40.2 });
  view.querySelector("#regions-card").appendChild(regionsTable(REGIONS));
}

function economy() {
  view.innerHTML = `
    <div class="hero"><h1>Economy</h1>
      <p class="lede">A US$2.24 trillion economy in 2024 — the world's 9th largest. Growth was
      1.6%, inflation fell back to 2.4%, and unemployment rose to 6.4%.</p></div>
    <section><h2>Output, 2015–2024</h2>
      <p class="sub">Switch between total GDP and GDP per person.</p>
      <div class="card"><div id="gdp-chart"></div></div></section>
    <section><h2>Jobs &amp; prices</h2>
      <p class="sub">Unemployment in red, inflation in gold — the 2020 COVID spike and the
      2022 inflation peak stand out.</p>
      <div class="card"><div id="jobs-chart"></div></div></section>
    <div class="grid-2">
      <section><h2>What Canada makes</h2>
        <div class="card"><div id="sector-bars"></div>
        <p class="source-note">Shares of GDP, approx. 2024. Services dominate; oil, gas and
        mining sit inside industry.</p></div></section>
      <section><h2>Who Canada trades with</h2>
        <div class="card"><div id="trade-bars"></div>
        <p class="source-note">Share of goods exports, 2024. Trade is 65.1% of GDP; the United
        States takes more than three quarters of exports.</p></div></section>
    </div>
    <div class="callout"><p><strong>Read it together:</strong> GDP grew in 2024, but GDP per person
    fell about 0.9% — the population grew faster than output. That gap is the story of
    Canada's economy right now.</p></div>`;
  const gdpBox = view.querySelector("#gdp-chart");
  let unit = "total";
  const drawGdp = (from) => {
    const series = SERIES.gdp.filter((p) => p.year >= from).map((p) => {
      if (unit === "total") return p;
      const pop = SERIES.population.find((q) => q.year === p.year);
      return { year: p.year, v: (p.v * 1000) / pop.v };
    });
    gdpBox.innerHTML = `<div class="controls" role="group" aria-label="GDP unit">
        <span class="ctl-label">Show:</span>
        <button class="chip" data-unit="total" aria-pressed="${unit === "total"}">Total GDP (US$B)</button>
        <button class="chip" data-unit="pc" aria-pressed="${unit === "pc"}">GDP per capita (US$)</button>
      </div>` + yearChips(from) +
      lineChart(series, { format: (v) => unit === "total" ? `$${fmt(v, 0)}B` : `$${fmt(v, 0)}`, label: "GDP" });
    gdpBox.querySelectorAll(".chip[data-unit]").forEach((c) =>
      c.addEventListener("click", () => { unit = c.dataset.unit; drawGdp(from); }));
    bindChips(gdpBox, drawGdp);
  };
  drawGdp(2015);
  const jobsBox = view.querySelector("#jobs-chart");
  const drawJobs = (from) => {
    jobsBox.innerHTML = yearChips(from) + lineChart(
      SERIES.unemployment.filter((p) => p.year >= from),
      { format: (v) => `${fmt(v)}%`, second: SERIES.inflation.filter((p) => p.year >= from), label: "Unemployment and inflation" });
    bindChips(jobsBox, drawJobs);
  };
  drawJobs(2015);
  view.querySelector("#sector-bars").innerHTML = barChart(SECTORS,
    { value: (d) => `${fmt(d.share)}%`, max: 70.2 });
  view.querySelector("#trade-bars").innerHTML = barChart(
    TRADE.topPartners.map((t) => ({ group: t.partner, share: t.share })),
    { value: (d) => `${fmt(d.share)}%`, max: 77.2, barClass: "alt" });
}

function health() {
  view.innerHTML = `
    <div class="hero"><h1>Health</h1>
      <p class="lede">Canadians live 82.1 years on average — 79.5 for men, 83.9 for women.
      Life expectancy dipped during COVID and has now climbed back.</p></div>
    <section><h2>Life expectancy, 2015–2024</h2>
      <p class="sub">Years at birth. The dip in 2020–2022 is the pandemic.</p>
      <div class="card"><div id="life-chart"></div></div></section>
    <section><h2>What health costs</h2>
      <p class="sub">Health spending as a share of GDP — the 2020 jump is pandemic spending.</p>
      <div class="card"><div id="spend-chart"></div></div></section>
    <section><h2>Health in numbers</h2>
      <div class="card"><ul class="facts">
        ${HEALTH.map((h) => `<li><span>${esc(h.label)} <span class="f-note">${h.year}</span></span><span class="f-value">${esc(h.value)}</span></li>`).join("")}
      </ul><p class="source-note">Sources: World Bank, OECD Health Statistics 2025.</p></div></section>`;
  const lifeBox = view.querySelector("#life-chart");
  const drawLife = (from) => {
    lifeBox.innerHTML = yearChips(from) + lineChart(SERIES.lifeExpectancy.filter((p) => p.year >= from),
      { format: (v) => `${fmt(v)} yrs`, label: "Life expectancy" });
    bindChips(lifeBox, drawLife);
  };
  drawLife(2015);
  const spendBox = view.querySelector("#spend-chart");
  const drawSpend = (from) => {
    spendBox.innerHTML = yearChips(from) + lineChart(SERIES.healthSpend.filter((p) => p.year >= from),
      { format: (v) => `${fmt(v)}%`, label: "Health spending" });
    bindChips(spendBox, drawSpend);
  };
  drawSpend(2015);
}

function education() {
  view.innerHTML = `
    <div class="hero"><h1>Education</h1>
      <p class="lede">Canada has the most educated working-age population in the OECD:
      57.5% of 25–64 year-olds hold a college or university credential.</p></div>
    <section><h2>Highest credential, ages 25–64</h2>
      <p class="sub">Share of the working-age population, 2021 Census.</p>
      <div class="card"><div id="edu-bars"></div>
      <p class="source-note">Source: Statistics Canada, 2021 Census. Shares sum to 100%.</p></div></section>
    <section><h2>Education in numbers</h2>
      <div class="card"><ul class="facts">
        ${EDUCATION.map((e) => `<li><span>${esc(e.label)}<span class="f-note">${esc(e.note)}</span></span><span class="f-value">${esc(e.value)}</span></li>`).join("")}
      </ul></div></section>
    <div class="callout"><p><strong>One to watch:</strong> Canada's expected years of schooling
    fell in global rankings even as attainment rose — the census counts credentials,
    not classroom years.</p></div>`;
  view.querySelector("#edu-bars").innerHTML = barChart(EDUCATION_BARS,
    { value: (d) => `${fmt(d.share)}%`, max: 32.9 });
}

function regions() {
  view.innerHTML = `
    <div class="hero"><h1>Regions</h1>
      <p class="lede">Ten provinces, three territories — and a very uneven map. Ontario alone
      holds 38.8% of Canadians; Nunavut holds 0.1% across a fifth of the land.</p></div>
    <section><h2>All provinces &amp; territories</h2>
      <p class="sub">Sort any column, or search for a province or its capital.</p>
      <div class="card" id="regions-card"></div></section>
    <div class="callout"><p><strong>Density tells the story:</strong> Prince Edward Island packs
    32 people into each square kilometre; Nunavut has 0.02. Canada is the world's
    second-largest country by area and one of its emptiest.</p></div>`;
  view.querySelector("#regions-card").appendChild(regionsTable(REGIONS));
}

function about() {
  view.innerHTML = `
    <div class="hero"><h1>Sources &amp; methods</h1>
      <p class="lede">Where every number comes from, and what was rounded.</p></div>
    <section><h2>Sources</h2>
      <div class="card"><ul class="facts">
        ${META.sources.map((s) => `<li><span>${esc(s)}</span><span class="f-value">Primary</span></li>`).join("")}
      </ul></div></section>
    <section><h2>Methods</h2>
      <div class="card">
        <p>Figures are the latest published values at the time of writing
        (${esc(META.updated)}), rounded to one decimal place unless shown otherwise.
        Population and GDP series are calendar-year values; provincial populations are
        Statistics Canada's 2024 estimates. GDP per capita in the Economy view is computed
        from the GDP and population series shown on this site, so it may differ by a few
        dollars from the published per-capita figure through rounding.</p>
        <p>Education figures are from the 2021 Census (ages 25–64). Health spending and
        life expectancy follow the World Bank's 2024 vintage and OECD Health Statistics 2025.</p>
        <p class="source-note">This is an independent, original site. It is not affiliated
        with Statistics Canada, the World Bank, the OECD or the Government of Canada, and it
        copies no other site's design, text or images.</p>
      </div></section>`;
}

// ---------- router ----------

const ROUTES = { overview, population, economy, health, education, regions, about };

function route() {
  const name = (location.hash.replace(/^#\/?/, "") || "overview").split("/")[0];
  (ROUTES[name] || overview)();
  document.querySelectorAll(".main-nav a").forEach((a) =>
    a.classList.toggle("active", a.dataset.nav === name));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
