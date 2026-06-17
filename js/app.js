/** CommLoan V2 — unified AI assistant prototype with P1/P2 modes */

const STORAGE_KEY = "commloan_prototype_v2";
const PRIVATE_URL_PATTERN = /grip|swapcard|brella|event\.|\/auth\/|login|linkedin\.com/i;
const SETTINGS_KEY = "commloan_settings";

const DEFAULT_SETTINGS = {
  maxCrawlPages: 50,
  pagination: 25,
  brokerScoring: true,
  contactIntelligence: true,
  eventDiscovery: true,
  htmlSizeLimit: 50,
};

const AppState = {
  get() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  },
  set(partial) {
    const next = { ...this.get(), ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
  isDemo() { return !!this.get().demoEntered; },
  enterDemo() { return this.set({ demoEntered: true }); },
  getMode() { return this.get().mode || null; },
  setMode(mode) {
    return this.set({
      mode,
      brokers: null,
      scenario: null,
      processingComplete: false,
      previewApproved: false,
    });
  },
  getScenario() { return this.get().scenario || null; },
  getScenarioConfig() {
    const key = this.getScenario();
    return key ? getScenarioConfig(key) : null;
  },
  getBrokers() {
    const state = this.get();
    if (state.brokers && state.brokers.length) return state.brokers;
    if (state.scenario) return loadBrokersForRun(state.scenario);
    return [];
  },
  setBrokers(brokers) { return this.set({ brokers }); },
  getProcessingComplete() { return !!this.get().processingComplete; },
  setProcessingComplete(v) { return this.set({ processingComplete: v }); },
  getRunMeta() {
    const s = this.get();
    const cfg = getScenarioConfig(s.scenario || "event");
    return {
      scenario: s.scenario,
      sourceLabel: s.sourceLabel || cfg.sourceLabel,
      inputFileName: s.inputFileName || "",
      inputUrl: s.inputUrl || "",
      inputType: s.inputType || "",
      inputTypeLabel: s.inputTypeLabel || "",
      extractionMethod: s.extractionMethod || "",
      urlAuthenticated: !!s.urlAuthenticated,
      contactsProcessed: cfg.contactsProcessed,
      qualifiedCount: cfg.qualifiedCount,
      priorityCount: cfg.priorityCount,
      highConfidenceCount: cfg.highConfidenceCount,
      reviewRequiredCount: cfg.reviewRequiredCount,
      averageScore: cfg.averageScore,
      generatedAt: s.generatedAt || new Date().toISOString(),
    };
  },
};

function isP2() { return AppState.getMode() === "p2"; }
function isP1() { return AppState.getMode() === "p1"; }
function modeLabel() { return isP2() ? "P2 — Prospect & Score" : "P1 — Verify & Enrich"; }

function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

function startProcessingRun(opts) {
  const scenario = detectScenario(opts);
  const cfg = getScenarioConfig(scenario);
  const inputInfo = detectInputType(opts);
  const urlAuth = !!(opts.urlAuthenticated || AppState.get().urlAuthenticated);
  AppState.set({
    scenario,
    sourceLabel: cfg.sourceLabel,
    inputFileName: opts.fileName || "",
    inputUrl: opts.url || "",
    inputType: inputInfo.key,
    inputTypeLabel: inputInfo.label,
    extractionMethod: mapExtractionMethod(inputInfo.key, urlAuth),
    urlAuthenticated: urlAuth,
    processingComplete: false,
    previewApproved: true,
    generatedAt: new Date().toISOString(),
  });
  const brokers = loadBrokersForRun(scenario);
  AppState.setBrokers(brokers);
  return scenario;
}

function detectInputType(opts) {
  const file = (opts.fileName || "").toLowerCase();
  const url = (opts.url || "").trim();
  if (/\.xlsx?$/.test(file)) return { key: "excel", label: "Excel Upload" };
  if (/\.csv$/.test(file)) return { key: "csv", label: "CSV Upload" };
  if (/\.html?$/.test(file)) return { key: "html", label: "HTML Upload" };
  if (url) {
    return isPrivateUrl(url)
      ? { key: "url_private", label: "Private Website URL" }
      : { key: "url_public", label: "Public Website URL" };
  }
  if (/attendee|directory|cref|\.html/i.test(file)) return { key: "html", label: "HTML Upload" };
  if (/broker|production|roster|\.xls/i.test(file)) return { key: "excel", label: "Excel Upload" };
  return { key: "excel", label: "Excel Upload" };
}

function mapExtractionMethod(inputTypeKey, urlAuthenticated) {
  const map = {
    excel: "Excel workbook",
    csv: "CSV file",
    html: "HTML file",
    url_public: "Public URL crawl",
    url_private: urlAuthenticated ? "Authenticated URL session" : "Private URL crawl",
  };
  return map[inputTypeKey] || "Excel workbook";
}

function isPrivateUrl(url) { return PRIVATE_URL_PATTERN.test(url || ""); }
function isLoginGatedUrl(url) { return isPrivateUrl(url); }

function stripScoring(broker) {
  const { score, scoreBreakdown, priorityTier, ...rest } = broker;
  return { ...rest, score: null, scoreBreakdown: null, priorityTier: null };
}

function loadBrokersForRun(scenarioKey) {
  const key = scenarioKey || AppState.getScenario() || "event";
  const cfg = getScenarioConfig(key);
  const p2 = isP2();

  let raw = [];

  if (key === "broker_roster") {
    raw = (typeof BROKER_ROSTER_RAW !== "undefined" ? BROKER_ROSTER_RAW : BROKERS_RAW).map(withCrmFields);
  } else if (key === "directory") {
    raw = typeof DIRECTORY_BROKERS_RAW !== "undefined" ? DIRECTORY_BROKERS_RAW : [];
  } else if (key === "event") {
    if (typeof PRIORITY_TARGETS_RAW !== "undefined") raw = PRIORITY_TARGETS_RAW.slice();
    const need = cfg.qualifiedCount - raw.length;
    if (need > 0) {
      raw = raw.concat(
        buildSyntheticBrokers(need, {
          idPrefix: "evt-syn-",
          sourcePlatform: cfg.sourcePlatform,
          leadSource: "Event — " + (cfg.eventName || EVENT_SUMMARY?.eventName || "CRE Finance Summit"),
          priority: cfg.priorityCount,
          qualified: need,
        })
      );
    }
    raw = raw.map((b) => ({
      ...b,
      classification: b.classification || "CRE Broker / Advisor",
      sourcePlatform: b.sourcePlatform || cfg.sourcePlatform,
      title: b.title || "Director, Debt Advisory",
    }));
  } else {
    raw = buildSyntheticBrokers(12, { idPrefix: "syn-" });
  }

  if (p2) return enrichAllBrokers(raw);
  return raw.map((b) => withCrmFields(stripScoring({ ...b })));
}

function loadBrokersForScenario(scenarioKey) {
  return loadBrokersForRun(scenarioKey);
}

function approveAndLoadBrokers() {
  const brokers = loadBrokersForRun();
  AppState.setBrokers(brokers);
  AppState.set({ previewApproved: true });
  return brokers;
}

function computeRunMetrics(brokers) {
  const cfg = AppState.getScenarioConfig() || getScenarioConfig("event");
  const scored = brokers.filter((b) => b.score != null);
  const avg = scored.length
    ? Math.round(scored.reduce((s, b) => s + b.score, 0) / scored.length)
    : (isP2() ? cfg.averageScore : "—");
  const priority = brokers.filter((b) => b.priorityTier === "Priority").length;
  const highConf = brokers.filter((b) => b.confidence === "High").length;
  const review = brokers.filter((b) => b.rowStatus === "Review Required" || b.manualReviewFlag).length;

  return {
    totalContacts: cfg.contactsProcessed,
    qualifiedBrokers: cfg.qualifiedCount,
    priorityTargets: isP2() ? (priority || cfg.priorityCount) : cfg.priorityCount,
    averageScore: avg,
    highConfidence: highConf || cfg.highConfidenceCount,
    reviewRequired: review || cfg.reviewRequiredCount,
  };
}

function requireDemo() {
  if (!AppState.isDemo()) { window.location.href = "index.html"; return false; }
  return true;
}

function requireRun() {
  if (!requireDemo()) return false;
  if (!AppState.getMode()) { window.location.href = "index.html"; return false; }
  if (!AppState.getScenario()) { window.location.href = "index.html"; return false; }
  return true;
}

function withCrmFields(broker) {
  return {
    ...broker,
    leadSource: broker.leadSource || CRM_PLACEHOLDER,
    fundedVolume: broker.fundedVolume || CRM_PLACEHOLDER,
    appraisalVolume: broker.appraisalVolume || CRM_PLACEHOLDER,
  };
}

const CONTACT_SENTINEL_PATTERN = /not publicly listed|unverified|not publicly disclosed|^unknown$/i;

function isContactSentinel(value) {
  const s = String(value == null ? "" : value).trim();
  return !s || CONTACT_SENTINEL_PATTERN.test(s);
}

function maskSeedHash(seed, field) {
  const str = String(seed || "") + ":" + field;
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MASK_WORDS = ["lara", "kven", "mshra", "brtn", "elna", "vasq", "marc", "tmas", "wrgt", "drek", "fona", "greg", "hann", "ian", "jlia", "kevn", "cbre", "jll", "nmrk"];

function scrambleToken(seed, field) {
  const h = maskSeedHash(seed, field);
  return MASK_WORDS[h % MASK_WORDS.length] + " " + MASK_WORDS[(h >> 4) % MASK_WORDS.length];
}

function maskContactEmail(email, seed) {
  const s = String(email == null ? "" : email).trim();
  if (!s || isContactSentinel(s)) return s || "Not publicly listed";
  return scrambleToken(seed, "email").replace(/\s+/g, "") + "@enc";
}

function maskContactPhone(phone, seed) {
  const s = String(phone == null ? "" : phone).trim();
  if (!s || isContactSentinel(s)) return s || "Not publicly listed";
  const p = scrambleToken(seed, "phone").split(" ");
  return "(•••) " + p[0] + "-" + p[1];
}

function maskLinkedIn(url, seed) {
  const s = String(url == null ? "" : url).trim();
  if (!s || isContactSentinel(s)) return s || "Not publicly listed";
  if (!s.toLowerCase().startsWith("http")) return s;
  return "linkedin.com/in/" + scrambleToken(seed, "linkedin").replace(/\s+/g, "-");
}

function formatMaskedEmailHtml(email, seed) {
  return `<span class="text-muted">${maskContactEmail(email, seed)}</span>`;
}

function formatMaskedLinkedInHtml(url, seed) {
  return `<span class="text-muted">${maskLinkedIn(url, seed)}</span>`;
}

function formatEvidenceSourceHtml(source) {
  const url = source.url || "";
  if (/linkedin\.com\/in\//i.test(url)) {
    return `${source.label} <span class="badge badge-low">Tier ${source.tier}</span>`;
  }
  return `<a href="${url}" target="_blank" rel="noopener">${source.label}</a> <span class="badge badge-low">Tier ${source.tier}</span>`;
}

function formatEvidenceSourceRow(source) {
  const url = source.url || "#";
  const tier = `<span class="badge badge-low">Tier ${source.tier}</span>`;
  if (/linkedin\.com\/in\//i.test(url)) {
    return `<div class="evidence-link-row">${source.label} ${tier}</div>`;
  }
  return `<a href="${url}" target="_blank" rel="noopener" class="evidence-link-row"><span class="evidence-link-label">${source.label}</span>${tier}</a>`;
}

function formatEvidenceSourcesForExport(sources, seed) {
  return (sources || []).map((s) => {
    if (/linkedin\.com\/in\//i.test(s.url || "")) return s.label + " (" + maskLinkedIn(s.url, seed) + ")";
    return s.label + " (" + s.url + ")";
  }).join("; ");
}

function truncateText(text, maxLen) {
  const s = String(text == null ? "" : text);
  return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + "…";
}

function showToast(message, duration) {
  let el = document.getElementById("app-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add("hidden"), duration || 3000);
}

function renderHeader(activePage) {
  const el = document.getElementById("site-header");
  if (!el) return;
  const hasRun = !!AppState.getScenario();
  const mode = AppState.getMode();
  const nav = [
    { href: "index.html", label: "Home", id: "index.html" },
    { href: "dashboard.html", label: "Dashboard", id: "dashboard.html", needsRun: true },
    { href: "results.html", label: "Results", id: "results.html", needsRun: true },
  ];

  el.innerHTML = `
    <a href="index.html" class="logo">
      <span class="logo-icon">CL</span>
      <span class="logo-text">
        <span class="logo-title">Broker Intelligence &amp; Scoring</span>
        <span class="logo-sub">AI-powered CRE broker research, enrichment &amp; prioritization</span>
      </span>
    </a>
    <div class="header-nav">
      ${mode ? `<span class="mode-pill">${mode.toUpperCase()}</span>` : ""}
      ${nav.filter((n) => !n.needsRun || hasRun).map((n) =>
        `<a href="${n.href}" class="btn btn-ghost btn-sm${activePage === n.id ? " nav-active" : ""}">${n.label}</a>`
      ).join("")}
      ${AppState.isDemo() ? `<button class="btn btn-ghost btn-sm" onclick="AppState.clear();location.href='index.html'">Reset Demo</button>` : ""}
    </div>
  `;
}

function statusBadge(status) {
  const map = { Complete: "badge-complete", Partial: "badge-partial", "Review Required": "badge-review", "No Match": "badge-low" };
  return `<span class="badge ${map[status] || "badge-low"}">${status}</span>`;
}

function confidenceBadge(conf) {
  const map = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
  return `<span class="badge ${map[conf] || "badge-low"}">${conf}</span>`;
}

function activityBadge(level) {
  const map = { High: "badge-high", Medium: "badge-medium", Low: "badge-low", Unknown: "badge-low" };
  return `<span class="badge ${map[level] || "badge-low"}">${level || "—"}</span>`;
}

function getSalesExportHeaders() {
  const shared = [
    "Name", "Company", "State", "Last Employer", "Only CRE", "Years in CRE", "Est. Volume",
    "Email", "Phone", "LinkedIn", "Activity", "Deal Signals", "Affiliations", "Personalization Hook",
    "Confidence", "Status"
  ];
  if (!isP2()) return shared;
  return [
    "Name", "Company", "State", "Broker Score", "Priority Tier", "Last Employer", "Only CRE",
    "Years in CRE", "Est. Volume", "Email", "Phone", "LinkedIn", "Activity", "Deal Signals",
    "Affiliations", "Personalization Hook", "Confidence", "Status"
  ];
}

function brokerToSalesExportRow(b) {
  const shared = [
    b.name, b.company, b.state, b.lastEmployer || "", b.onlyCreMortgage || "", b.yearsInCre || "",
    b.volume2025 || "", maskContactEmail(b.email, b.id), maskContactPhone(b.phone, b.id),
    maskLinkedIn(b.linkedin, b.id), b.activityLevel || "", b.dealSignals || "", b.affiliations || "",
    b.personalizationHook || "", b.confidence, b.rowStatus
  ];
  if (!isP2()) return shared;
  return [
    b.name, b.company, b.state, b.score ?? "", b.priorityTier || "", b.lastEmployer || "",
    b.onlyCreMortgage || "", b.yearsInCre || "", b.volume2025 || "",
    maskContactEmail(b.email, b.id), maskContactPhone(b.phone, b.id), maskLinkedIn(b.linkedin, b.id),
    b.activityLevel || "", b.dealSignals || "", b.affiliations || "", b.personalizationHook || "",
    b.confidence, b.rowStatus
  ];
}

function tierBadge(tier) {
  if (!tier) return "—";
  const cls = tier === "Priority" ? "badge-priority" : tier === "Nurture" ? "badge-nurture" : "badge-low";
  return `<span class="badge ${cls}">${tier}</span>`;
}

function getBrokerById(id) {
  if (!id) return null;
  let list = AppState.getBrokers();
  let found = list.find((b) => b.id === id);
  if (!found) {
    approveAndLoadBrokers();
    list = AppState.getBrokers();
    found = list.find((b) => b.id === id);
  }
  return found || null;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function csvEscape(val) {
  const s = String(val == null ? "" : val);
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCSV(rows) {
  exportResult(rows);
}

function exportResult(rows) {
  const brokers = rows || AppState.getBrokers();
  const headers = getSalesExportHeaders();
  const lines = brokers.map((b) => brokerToSalesExportRow(b).map(csvEscape).join(","));
  downloadFile("commloan-export-result.csv", [headers.join(","), ...lines].join("\n"), "text/csv");
  showToast("Export Result downloaded");
}

function exportExcelMock(rows) {
  exportResult(rows);
}

function exportResearchPack() {
  const brokers = AppState.getBrokers();
  const content = brokers.map((b) => [
    `=== ${b.name} | ${b.company} ===`,
    `Score: ${b.score ?? "—"} | Tier: ${b.priorityTier ?? "—"} | Confidence: ${b.confidence}`,
    `Deal Signals: ${b.dealSignals}`,
    `Sources: ${formatEvidenceSourcesForExport(b.evidenceSources, b.id)}`,
  ].join("\n")).join("\n---\n");
  downloadFile("broker-research-pack.json", content, "application/json");
  showToast("Research pack downloaded");
}

function exportPriorityReport() {
  const brokers = AppState.getBrokers().filter((b) => b.priorityTier === "Priority");
  exportCSV(brokers);
  showToast("Priority Broker Report downloaded");
}

function exportDirectoryReport() {
  showToast("Directory Intelligence Report downloaded (mock)");
  downloadFile("directory-intelligence-report.pdf", "Mock directory report", "text/plain");
}

function exportEventReport() {
  showToast("Event Prospect Report downloaded (mock)");
  downloadFile("event-prospect-report.pdf", "Mock event prospect report", "text/plain");
}

function exportDashboardSummary() {
  const m = computeRunMetrics(AppState.getBrokers());
  const content = `CommLoan Executive Dashboard Export
Generated: ${new Date().toLocaleString()}
Mode: ${modeLabel()}
Total Contacts: ${m.totalContacts}
Qualified Brokers: ${m.qualifiedBrokers}
Priority Targets: ${m.priorityTargets}
Average Score: ${m.averageScore}
High Confidence: ${m.highConfidence}
Review Required: ${m.reviewRequired}
`;
  downloadFile("broker-summary-dashboard.json", content, "application/json");
  showToast("Dashboard exported");
}

function getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); }

function sortBrokers(brokers, key, dir) {
  const mult = dir === "desc" ? -1 : 1;
  return [...brokers].sort((a, b) => {
    if (key === "score") return ((a.score || 0) - (b.score || 0)) * mult;
    const av = String(a[key] || "").toLowerCase();
    const bv = String(b[key] || "").toLowerCase();
    if (av < bv) return -1 * mult;
    if (av > bv) return 1 * mult;
    return 0;
  });
}

function requireMode() { return requireRun(); }
