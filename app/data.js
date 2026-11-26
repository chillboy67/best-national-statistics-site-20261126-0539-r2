// Canada by Numbers — the figures behind the site.
//
// Every number below is a published figure, rounded for display. Sources are
// named per table: World Bank World Development Indicators (2024 vintage),
// Statistics Canada (2021 Census, 2024 population estimates), UNECE country
// profiles and OECD Health Statistics 2025. Nothing here is fetched at run
// time; the site works offline from these files alone.

export const META = {
  country: "Canada",
  capital: "Ottawa",
  areaKm2: 9984670,
  updated: "November 2026",
  sources: [
    "World Bank, World Development Indicators (2024 vintage)",
    "Statistics Canada, 2021 Census and 2024 population estimates",
    "UNECE Countries in Figures — Canada",
    "OECD Health Statistics 2025",
  ],
};

// Headline indicators shown on the overview page. `change` is the move on the
// previous year, in the same units as `value` unless noted otherwise.
export const HEADLINE = [
  { id: "population", label: "Population", value: 41.29, unit: "million", year: 2024, change: +3.0, changeUnit: "%", note: "Fastest growth in decades, driven by immigration" },
  { id: "gdp", label: "GDP", value: 2243.6, unit: "US$ billion", year: 2024, change: +1.6, changeUnit: "%", note: "9th largest economy in the world" },
  { id: "gdp-pc", label: "GDP per capita", value: 54531, unit: "US$", year: 2024, change: -0.9, changeUnit: "%", note: "Down per person as population outgrew output" },
  { id: "life", label: "Life expectancy", value: 82.1, unit: "years", year: 2024, change: +0.2, changeUnit: "yrs", note: "Men 79.5 years, women 83.9 years (2023)" },
  { id: "unemployment", label: "Unemployment rate", value: 6.4, unit: "%", year: 2024, change: +1.0, changeUnit: "pts", note: "Youth unemployment 13.0%" },
  { id: "inflation", label: "Inflation (CPI)", value: 2.4, unit: "%", year: 2024, change: -1.5, changeUnit: "pts", note: "Back inside the Bank of Canada's 1–3% band" },
];

// Yearly series used by the charts. Years run 2015–2024 unless noted.
export const SERIES = {
  population: [
    { year: 2015, v: 35.7 }, { year: 2016, v: 36.1 }, { year: 2017, v: 36.5 },
    { year: 2018, v: 37.1 }, { year: 2019, v: 37.6 }, { year: 2020, v: 38.0 },
    { year: 2021, v: 38.2 }, { year: 2022, v: 39.0 }, { year: 2023, v: 40.1 },
    { year: 2024, v: 41.3 },
  ],
  gdp: [
    { year: 2015, v: 1556 }, { year: 2016, v: 1530 }, { year: 2017, v: 1649 },
    { year: 2018, v: 1725 }, { year: 2019, v: 1744 }, { year: 2020, v: 1648 },
    { year: 2021, v: 2000 }, { year: 2022, v: 2142 }, { year: 2023, v: 2240 },
    { year: 2024, v: 2244 },
  ],
  unemployment: [
    { year: 2015, v: 6.9 }, { year: 2016, v: 7.0 }, { year: 2017, v: 6.3 },
    { year: 2018, v: 5.8 }, { year: 2019, v: 5.7 }, { year: 2020, v: 9.6 },
    { year: 2021, v: 7.5 }, { year: 2022, v: 5.3 }, { year: 2023, v: 5.4 },
    { year: 2024, v: 6.4 },
  ],
  inflation: [
    { year: 2015, v: 1.1 }, { year: 2016, v: 1.4 }, { year: 2017, v: 1.6 },
    { year: 2018, v: 2.3 }, { year: 2019, v: 1.9 }, { year: 2020, v: 0.7 },
    { year: 2021, v: 3.4 }, { year: 2022, v: 6.8 }, { year: 2023, v: 3.9 },
    { year: 2024, v: 2.4 },
  ],
  lifeExpectancy: [
    { year: 2015, v: 82.0 }, { year: 2016, v: 82.0 }, { year: 2017, v: 82.0 },
    { year: 2018, v: 82.1 }, { year: 2019, v: 82.1 }, { year: 2020, v: 81.7 },
    { year: 2021, v: 81.6 }, { year: 2022, v: 81.3 }, { year: 2023, v: 81.9 },
    { year: 2024, v: 82.1 },
  ],
  healthSpend: [
    { year: 2015, v: 10.6 }, { year: 2016, v: 10.8 }, { year: 2017, v: 10.7 },
    { year: 2018, v: 10.8 }, { year: 2019, v: 10.7 }, { year: 2020, v: 12.9 },
    { year: 2021, v: 12.3 }, { year: 2022, v: 11.7 }, { year: 2023, v: 11.4 },
    { year: 2024, v: 11.3 },
  ],
};

// Age structure, 2024 (share of population, World Bank).
export const AGE_STRUCTURE = [
  { group: "0–14 years", share: 15.1 },
  { group: "15–24 years", share: 11.4 },
  { group: "25–54 years", share: 40.2 },
  { group: "55–64 years", share: 13.5 },
  { group: "65+ years", share: 19.8 },
];

// Provinces and territories, 2024 population estimates (Statistics Canada,
// rounded). Density uses each province's land area.
export const REGIONS = [
  { name: "Ontario", capital: "Toronto", pop: 16.01, share: 38.8, density: 17.6 },
  { name: "Quebec", capital: "Quebec City", pop: 9.03, share: 21.9, density: 6.6 },
  { name: "British Columbia", capital: "Victoria", pop: 5.65, share: 13.7, density: 6.0 },
  { name: "Alberta", capital: "Edmonton", pop: 4.94, share: 12.0, density: 7.5 },
  { name: "Manitoba", capital: "Winnipeg", pop: 1.47, share: 3.6, density: 2.7 },
  { name: "Saskatchewan", capital: "Regina", pop: 1.23, share: 3.0, density: 2.1 },
  { name: "Nova Scotia", capital: "Halifax", pop: 1.07, share: 2.6, density: 20.4 },
  { name: "New Brunswick", capital: "Fredericton", pop: 0.86, share: 2.1, density: 12.1 },
  { name: "Newfoundland and Labrador", capital: "St. John's", pop: 0.54, share: 1.3, density: 1.5 },
  { name: "Prince Edward Island", capital: "Charlottetown", pop: 0.18, share: 0.4, density: 32.0 },
  { name: "Northwest Territories", capital: "Yellowknife", pop: 0.045, share: 0.1, density: 0.04 },
  { name: "Yukon", capital: "Whitehorse", pop: 0.045, share: 0.1, density: 0.09 },
  { name: "Nunavut", capital: "Iqaluit", pop: 0.04, share: 0.1, density: 0.02 },
];

// Economy: shares of GDP by sector (approx., 2024) and trade (2024).
export const SECTORS = [
  { name: "Services", share: 70.2 },
  { name: "Industry", share: 27.9 },
  { name: "Agriculture, forestry & fishing", share: 1.9 },
];
export const TRADE = {
  exportsShare: 32.4, // % of GDP, 2024
  importsShare: 32.7, // % of GDP, 2024
  tradeShare: 65.1, // % of GDP, 2024
  topPartners: [
    { partner: "United States", share: 77.2, direction: "exports" },
    { partner: "China", share: 4.1, direction: "exports" },
    { partner: "United Kingdom", share: 2.6, direction: "exports" },
    { partner: "Japan", share: 2.2, direction: "exports" },
    { partner: "Mexico", share: 1.4, direction: "exports" },
  ],
};

// Health detail (2024 unless noted).
export const HEALTH = [
  { label: "Health spending", value: "11.3% of GDP", year: 2024 },
  { label: "Infant mortality", value: "4.7 per 1,000 live births", year: 2024 },
  { label: "Life expectancy, men", value: "79.5 years", year: 2023 },
  { label: "Life expectancy, women", value: "83.9 years", year: 2023 },
  { label: "Maternal mortality", value: "12 per 100,000 live births", year: 2023 },
  { label: "Hospital beds", value: "2.5 per 1,000 people", year: 2023 },
];

// Education (2021 Census, ages 25–64, unless noted).
export const EDUCATION = [
  { label: "Bachelor's degree or higher", value: "32.9%", note: "Up from 28.5% in 2016" },
  { label: "College or university credential", value: "57.5%", note: "Highest share in the OECD" },
  { label: "Apprenticeship certificate", value: "10.8%", note: "Trades credentials" },
  { label: "High school diploma as highest credential", value: "21.4%", note: "2021 Census" },
  { label: "No certificate, diploma or degree", value: "10.3%", note: "2021 Census" },
  { label: "Expected years of schooling", value: "16.0 years", note: "UNDP Human Development Report" },
];
export const EDUCATION_BARS = [
  { group: "Bachelor's or higher", share: 32.9 },
  { group: "College diploma", share: 24.6 },
  { group: "High school only", share: 21.4 },
  { group: "Apprenticeship", share: 10.8 },
  { group: "No credential", share: 10.3 },
];

// Society snapshot (2024 unless noted).
export const SOCIETY = [
  { label: "Urban population", value: "82.7%", year: 2024 },
  { label: "Fertility rate", value: "1.3 children per woman", year: 2023 },
  { label: "Median age", value: "41.6 years", year: 2024 },
  { label: "Population density", value: "4.6 people per km²", year: 2023 },
  { label: "Internet users", value: "94.4% of population", year: 2024 },
  { label: "Labour force participation", value: "65.2%", year: 2024 },
  { label: "Government debt", value: "64.9% of GDP", year: 2024 },
  { label: "GNI per capita (Atlas)", value: "US$53,340", year: 2024 },
  { label: "GDP per capita (PPP)", value: "US$64,610", year: 2024 },
  { label: "Human Development Index", value: "0.939", year: 2023 },
];
