/** V2 scenario definitions — all counts driven from here (no hardcoded numbers in HTML) */

const DEMO_SCENARIOS = {
  broker_roster: {
    key: "broker_roster",
    label: "Broker Roster",
    sourceLabel: "Commercial Broker Directory",
    sourcePlatform: "Excel Upload",
    contactsProcessed: 53,
    qualifiedCount: 53,
    priorityCount: 12,
    highConfidenceCount: 41,
    reviewRequiredCount: 4,
    averageScore: 74,
    etaSeconds: 22,
    statLine: "53 Broker Records Found",
    eventFunnel: false,
  },
  directory: {
    key: "directory",
    label: "Directory Intelligence",
    sourceLabel: "Association Member Directory",
    sourcePlatform: "HTML Directory",
    contactsProcessed: 186,
    qualifiedCount: 145,
    priorityCount: 25,
    highConfidenceCount: 118,
    reviewRequiredCount: 9,
    averageScore: 74,
    etaSeconds: 24,
    statLine: "186 Directory Records Found",
    eventFunnel: false,
  },
  event: {
    key: "event",
    label: "Event Intelligence",
    sourceLabel: "Event Attendee List",
    sourcePlatform: "Event Platform",
    eventName: "Commercial Real Estate Finance Summit",
    contactsProcessed: 2211,
    qualifiedCount: 145,
    priorityCount: 25,
    brokerProspectsCount: 145,
    highlyQualifiedCount: 82,
    highConfidenceCount: 118,
    reviewRequiredCount: 9,
    averageScore: 74,
    etaSeconds: 25,
    statLine: "2,211 Event Attendees Found",
    eventFunnel: true,
  },
};

const DEMO_INPUT_PRESETS = {
  p1: {
    file: { name: "2026_Brokers_Production.xlsx", label: "Excel Upload" },
    url: { value: "https://www.walkerdunlop.com/about-us/our-team", label: "Public Website URL" },
  },
  p2: {
    file: { name: "NYU Attendee List.xlsx", label: "Excel Upload" },
    url: { value: "https://www.walkerdunlop.com/about-us/our-team", label: "Public Website URL" },
  },
};

function getDemoPreset(mode, kind) {
  return DEMO_INPUT_PRESETS[mode || "p1"][kind];
}

const PROCESSING_STEPS = [
  { id: "detect", label: "Input source detected", statKey: "statLine" },
  { id: "extract", label: "Extracting records", statKey: null },
  { id: "identify", label: "Identifying broker prospects", statKey: "qualifiedCount", statSuffix: " Broker Prospects" },
  { id: "linkedin", label: "Researching LinkedIn", statKey: null },
  { id: "website", label: "Researching company websites", statKey: null },
  { id: "deals", label: "Discovering recent transactions", statKey: null },
  { id: "score", label: "Calculating broker scores", statKey: null },
  { id: "reports", label: "Generating reports", statKey: null },
];

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Blake", "Cameron", "Drew", "Ellis", "Finley", "Harper", "Jamie", "Kendall", "Logan", "Parker", "Reese", "Sage"];
const LAST_NAMES = ["Hayes", "Brooks", "Foster", "Griffin", "Hudson", "Keller", "Lawson", "Mercer", "Nolan", "Pierce", "Quincy", "Reed", "Sutton", "Tanner", "Vance", "Walsh", "York", "Bennett", "Coleman", "Donovan"];
const COMPANIES = ["Summit Capital Advisors", "Pinnacle CRE Finance", "Meridian Debt Partners", "Atlas Lending Group", "Horizon Mortgage Advisors", "Sterling Bridge Capital", "Vanguard CRE Lending", "Keystone Finance Partners", "Lighthouse Capital Markets", "Northstar Advisory"];
const STATES = ["TX", "CA", "NY", "FL", "IL", "GA", "CO", "WA", "AZ", "NC", "NJ", "OH", "MN", "MA", "VA"];
const TITLES = ["Managing Director", "SVP, Capital Markets", "Director, Debt Advisory", "VP, CRE Finance", "Principal", "Senior Director", "First VP", "Executive Director"];
const CLASSIFICATIONS = ["CRE Broker / Advisor", "Lender / Capital Markets", "Investor / Sponsor", "Vendor / PropTech"];

function detectScenario(opts) {
  const fileName = (opts.fileName || "").toLowerCase();
  const url = (opts.url || "").toLowerCase();
  const combined = fileName + " " + url;

  if (/grip|swapcard|brella|event\.grip|nyu|attendee.*summit|cref.*event/i.test(combined)) return "event";
  if (/directory|cref|attendee|member.*list|speaker|html|\.htm/.test(combined)) return "directory";
  if (/broker|production|2026|roster|signup/.test(combined)) return "broker_roster";
  if (opts.hasFile) return "broker_roster";
  if (url) return "directory";
  return "event";
}

function getScenarioConfig(key) {
  const cfg = DEMO_SCENARIOS[key] || DEMO_SCENARIOS.event;
  if (cfg.inherits) return { ...DEMO_SCENARIOS[cfg.inherits], ...cfg, key: cfg.key };
  return cfg;
}

function formatCount(n) {
  return typeof n === "number" ? n.toLocaleString("en-US") : n;
}

function getProcessingStatForStep(step, cfg) {
  if (!step.statKey) return null;
  const val = cfg[step.statKey];
  if (val == null) return null;
  if (step.statKey === "statLine") return val;
  if (step.statKey === "qualifiedCount") return formatCount(val) + (step.statSuffix || "");
  return formatCount(val);
}

function hashSeed(n) {
  return ((n * 2654435761) >>> 0) % 10000;
}

function buildSyntheticBrokerRow(index, opts) {
  const h = hashSeed(index);
  const fn = FIRST_NAMES[h % FIRST_NAMES.length];
  const ln = LAST_NAMES[(h >> 4) % LAST_NAMES.length];
  const company = COMPANIES[(h >> 8) % COMPANIES.length];
  const state = STATES[(h >> 12) % STATES.length];
  const scoreHint = 55 + (h % 40);
  const isPriority = opts.priority && index < opts.priority;
  const isQualified = opts.qualified == null || index < opts.qualified;
  const tier = isPriority ? "Priority" : scoreHint >= 50 ? "Nurture" : "Low Priority";
  const confidence = scoreHint >= 80 ? "High" : scoreHint >= 65 ? "Medium" : "Low";
  const rowStatus = confidence === "Low" ? "Review Required" : h % 11 === 0 ? "Partial" : "Complete";

  return {
    id: (opts.idPrefix || "syn-") + String(index + 1).padStart(3, "0"),
    name: fn + " " + ln.charAt(0) + ".",
    company,
    state,
    city: state === "NY" ? "New York" : state === "CA" ? "Los Angeles" : "Dallas",
    title: TITLES[h % TITLES.length],
    email: fn.toLowerCase() + "." + ln.toLowerCase() + "@example-cre.com",
    phone: "(555) 555-" + String(1000 + (h % 9000)).slice(-4),
    lastEmployer: company,
    onlyCreMortgage: "Yes",
    yearsInCre: String(5 + (h % 18)),
    volume2025: "$" + (20 + (h % 80)) + "M",
    linkedin: "https://linkedin.com/in/" + fn.toLowerCase() + "-" + ln.toLowerCase(),
    activityLevel: scoreHint >= 75 ? "High" : scoreHint >= 60 ? "Medium" : "Low",
    dealSignals: "Recent CRE financing activity identified via public sources.",
    affiliations: h % 2 === 0 ? "MBA, CCIM" : "ULI",
    personalizationHook: "Active CRE debt advisor with recent transaction signals.",
    confidence,
    evidenceNotes: "Verified via company website and public licensing records.",
    manualReviewFlag: rowStatus === "Review Required",
    manualReviewReason: rowStatus === "Review Required" ? "Volume not publicly disclosed" : "",
    rowStatus,
    classification: CLASSIFICATIONS[h % 2],
    sourcePlatform: opts.sourcePlatform || "AI Discovery",
    leadSource: opts.leadSource || "AI Processing Run",
    scoreInputs: {
      fullTimeCre: scoreHint >= 60,
      activeDealmaker: scoreHint >= 65,
      independent: h % 5 === 0,
      nationalFocus: h % 3 !== 0,
      usesTechnology: scoreHint >= 70,
      strongNetwork: scoreHint >= 72,
      contentCreator: h % 7 === 0,
      dealVolumeHigh: scoreHint >= 85,
      dealVolumeMedium: scoreHint >= 65 && scoreHint < 85,
    },
    evidenceSources: [{ label: company + " Team Page", url: "https://example-cre.com/team/" + fn.toLowerCase(), tier: 1 }],
  };
}

function buildSyntheticBrokers(count, opts) {
  const rows = [];
  for (let i = 0; i < count; i++) rows.push(buildSyntheticBrokerRow(i, opts));
  return rows;
}
