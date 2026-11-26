# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/chillboy67/best-national-statistics-site-20261126-0539-r2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/chillboy67/best-national-statistics-site-20261126-0539-r2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Canada by Numbers** — a national statistics site for Canada, built for make.fun's
“Make the best national statistics site” bounty. Population, economy, health,
education and regions in one offline site: headline indicators for 2024, ten years
of trends (2015–2024), and a sortable, searchable table of all ten provinces and
three territories. Every figure is a real published value from the World Bank,
Statistics Canada, UNECE or the OECD, and every chart is drawn from those figures
with hand-built SVG — no libraries, no network requests, no tracking.

## What's inside

- **Overview** — six headline indicators (population 41.29M, GDP US$2.24T, GDP per
  capita US$54,531, life expectancy 82.1 years, unemployment 6.4%, inflation 2.4%),
  a population trend chart and the five largest provinces.
- **Population** — growth 2015–2024, age structure, and the full regions table.
- **Economy** — GDP total vs per capita (switchable), unemployment vs inflation,
  sectors of the economy, and Canada's top export partners.
- **Health** — life expectancy and health spending trends, plus key health figures.
- **Education** — attainment from the 2021 Census, led by the OECD's highest
  tertiary rate.
- **Regions** — every province and territory, sortable by population, share or
  density, with a live search.
- **Sources** — where each number comes from and what was rounded.

## Run it

```sh
python3 -m http.server 8000 --directory app
# open http://localhost:8000
```

Or hand the entry in exactly as the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library. The site is static files
under `app/` with no build step and works on desktop and phone. Its design is
original — a deep-spruce and maple-red palette, system fonts only — and it loads
nothing from the network, so it renders the same offline.

## Screenshots

Real renders of the site's own code, in `screenshots/` — overview, economy,
regions, and the overview at phone size (390 × 844).

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
