/** Chart.js dataset builders for executive dashboard */

function buildDashboardChartData(brokers, cfg) {
  const scores = brokers.map((b) => b.score).filter((s) => s != null);
  const buckets = { "0-49": 0, "50-64": 0, "65-74": 0, "75-84": 0, "85-100": 0 };
  scores.forEach((s) => {
    if (s < 50) buckets["0-49"]++;
    else if (s < 65) buckets["50-64"]++;
    else if (s < 75) buckets["65-74"]++;
    else if (s < 85) buckets["75-84"]++;
    else buckets["85-100"]++;
  });

  const classification = {};
  brokers.forEach((b) => {
    const c = b.classification || "CRE Broker / Advisor";
    classification[c] = (classification[c] || 0) + 1;
  });

  const companies = {};
  brokers.forEach((b) => { companies[b.company] = (companies[b.company] || 0) + 1; });
  const topCompanies = Object.entries(companies).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const states = {};
  brokers.forEach((b) => { states[b.state] = (states[b.state] || 0) + 1; });
  const topStates = Object.entries(states).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const sourceTypes = {};
  brokers.forEach((b) => {
    const s = b.sourcePlatform || cfg?.sourcePlatform || "AI";
    sourceTypes[s] = (sourceTypes[s] || 0) + 1;
  });

  return {
    scoreDistribution: {
      labels: Object.keys(buckets),
      data: Object.values(buckets),
    },
    classification: {
      labels: Object.keys(classification),
      data: Object.values(classification),
    },
    topCompanies: {
      labels: topCompanies.map((x) => truncateText(x[0], 22)),
      data: topCompanies.map((x) => x[1]),
    },
    topStates: {
      labels: topStates.map((x) => x[0]),
      data: topStates.map((x) => x[1]),
    },
    sourceTypes: {
      labels: Object.keys(sourceTypes),
      data: Object.values(sourceTypes),
    },
    timeline: {
      labels: ["Upload", "Extract", "Classify", "Research", "Score", "Reports"],
      data: [100, 88, 72, 55, 38, 12],
    },
  };
}

const CHART_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#64748b", "#0891b2", "#db2777"];

function renderBarChart(canvasId, labels, data, horizontal) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;
  if (canvas._chart) canvas._chart.destroy();
  canvas._chart = new Chart(canvas, {
    type: horizontal ? "bar" : "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderRadius: 6,
      }],
    },
    options: {
      indexAxis: horizontal ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: !horizontal } },
        y: { grid: { display: horizontal } },
      },
    },
  });
}

function renderDoughnutChart(canvasId, labels, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;
  if (canvas._chart) canvas._chart.destroy();
  canvas._chart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: CHART_COLORS, borderWidth: 0 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
    },
  });
}

function renderLineChart(canvasId, labels, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;
  if (canvas._chart) canvas._chart.destroy();
  canvas._chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.35,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { reverse: true, min: 0, max: 100 } },
    },
  });
}

function initDashboardCharts(brokers, cfg) {
  const d = buildDashboardChartData(brokers, cfg);
  renderBarChart("chart-scores", d.scoreDistribution.labels, d.scoreDistribution.data, false);
  renderDoughnutChart("chart-classification", d.classification.labels, d.classification.data);
  renderBarChart("chart-companies", d.topCompanies.labels, d.topCompanies.data, true);
  renderBarChart("chart-states", d.topStates.labels, d.topStates.data, false);
  renderDoughnutChart("chart-sources", d.sourceTypes.labels, d.sourceTypes.data);
  renderLineChart("chart-timeline", d.timeline.labels, d.timeline.data);
}

function animateFunnelBars() {
  document.querySelectorAll(".funnel-bar").forEach((bar, i) => {
    setTimeout(() => bar.classList.add("funnel-bar-visible"), 150 * i);
  });
}
