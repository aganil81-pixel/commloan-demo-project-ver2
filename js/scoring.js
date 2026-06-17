/** Broker score engine — 7 criteria (25/20/15/10/10/10/10) */

const SCORE_CRITERIA = [
  { key: "full_time_cre", label: "Full-Time CRE Broker", max: 25 },
  { key: "active_dealmaker", label: "Active Dealmaker", max: 20 },
  { key: "independent", label: "Independent / Entrepreneurial", max: 15 },
  { key: "national_focus", label: "National Lending Focus", max: 10 },
  { key: "technology", label: "Uses Technology", max: 10 },
  { key: "network", label: "Strong Network Presence", max: 10 },
  { key: "education", label: "Educational Content Creator", max: 10 },
];

function calculateBrokerScore(inputs) {
  const breakdown = {
    full_time_cre: inputs.fullTimeCre ? 25 : 0,
    active_dealmaker: inputs.activeDealmaker
      ? inputs.dealVolumeHigh ? 20 : inputs.dealVolumeMedium ? 15 : 10
      : 0,
    independent: inputs.independent ? 15 : 5,
    national_focus: inputs.nationalFocus ? 10 : 4,
    technology: inputs.usesTechnology ? 10 : 3,
    network: inputs.strongNetwork ? 10 : 4,
    education: inputs.contentCreator ? 10 : 3,
  };

  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return { total, breakdown, priorityTier: getPriorityTier(total) };
}

function getPriorityTier(score) {
  if (score >= 75) return "Priority";
  if (score >= 50) return "Nurture";
  return "Low Priority";
}

function getScoreColorClass(score) {
  if (score >= 75) return "score-high";
  if (score >= 50) return "score-mid";
  return "score-low";
}

function getTierBadgeClass(tier) {
  if (tier === "Priority") return "badge-priority";
  if (tier === "Nurture") return "badge-nurture";
  return "badge-low";
}

function enrichBroker(broker) {
  const scoreInputs = broker.scoreInputs || {};
  const scored = calculateBrokerScore(scoreInputs);
  return { ...broker, score: scored.total, scoreBreakdown: scored.breakdown, priorityTier: scored.priorityTier };
}

function enrichAllBrokers(brokers) {
  return brokers.map(enrichBroker);
}

/** Cap Priority tier count and align High confidence to scenario funnel (e.g. 82 / 25 event). */
function normalizeScenarioTiers(brokers, cfg) {
  if (!brokers.length) return brokers;
  const priorityCap = cfg.priorityCount ?? brokers.length;
  const highlyCap = cfg.highlyQualifiedCount ?? null;
  const sorted = [...brokers].sort((a, b) => (b.score || 0) - (a.score || 0));
  const priorityIds = new Set(sorted.slice(0, priorityCap).map((b) => b.id));
  const highlyIds = highlyCap != null
    ? new Set(sorted.slice(0, highlyCap).map((b) => b.id))
    : null;

  return brokers.map((b) => {
    const score = b.score || 0;
    let priorityTier = "Low Priority";
    if (priorityIds.has(b.id)) priorityTier = "Priority";
    else if (score >= 50) priorityTier = "Nurture";

    let confidence = b.confidence;
    if (highlyIds) {
      confidence = highlyIds.has(b.id) ? "High" : (confidence === "High" ? "Medium" : confidence);
    }

    return { ...b, priorityTier, confidence };
  });
}
