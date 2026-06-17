/** Inline background processing UI — shared by index.html */

function runInlineProcessing(opts) {
  const cfg = opts.cfg || AppState.getScenarioConfig();
  const meta = opts.meta || AppState.getRunMeta();
  const root = document.getElementById(opts.containerId || "inline-processing");
  if (!root || !cfg) return;

  const feed = root.querySelector("#activity-feed");
  const bar = root.querySelector("#progress-bar");
  const etaLabel = root.querySelector("#eta-label");
  const pctLabel = root.querySelector("#progress-pct");
  const subtitle = root.querySelector("#proc-subtitle");
  const dynamicStats = root.querySelector("#dynamic-stats");

  if (subtitle) {
    const inputLabel = meta.inputTypeLabel ? "Input detected: " + meta.inputTypeLabel : "";
    subtitle.textContent = [
      inputLabel,
      meta.sourceLabel || cfg.sourceLabel,
      meta.inputFileName || (meta.inputUrl ? meta.inputUrl : ""),
    ].filter(Boolean).join(" · ");
  }

  const steps = PROCESSING_STEPS;
  let eta = cfg.etaSeconds;
  let stepIdx = 0;

  if (etaLabel) etaLabel.textContent = "Estimated time remaining: " + eta + "s";
  if (feed) feed.innerHTML = "";
  if (dynamicStats) dynamicStats.innerHTML = "";

  function addFeedItem(text) {
    if (!feed) return;
    const li = document.createElement("li");
    li.className = "activity-item active";
    li.innerHTML = `<span class="activity-icon">○</span><span>${text}</span>`;
    feed.appendChild(li);
    requestAnimationFrame(() => li.classList.add("visible"));
  }

  function showDynamicStat(text) {
    if (!dynamicStats) return;
    const el = document.createElement("div");
    el.className = "dynamic-stat-card";
    el.textContent = text;
    dynamicStats.appendChild(el);
  }

  const stepInterval = setInterval(() => {
    if (stepIdx > 0 && feed && feed.children[stepIdx - 1]) {
      const prev = feed.children[stepIdx - 1];
      prev.classList.remove("active");
      prev.classList.add("done");
      const icon = prev.querySelector(".activity-icon");
      if (icon) icon.textContent = "✓";
    }
    if (stepIdx >= steps.length) {
      clearInterval(stepInterval);
      finishProcessing();
      return;
    }
    const step = steps[stepIdx];
    let stepLabel = step.label;
    if (step.id === "detect" && meta.inputTypeLabel) {
      stepLabel = "Input detected: " + meta.inputTypeLabel;
    }
    addFeedItem(stepLabel);
    let stat = getProcessingStatForStep(step, cfg);
    if (step.id === "detect" && meta.extractionMethod) stat = meta.extractionMethod;
    if (stat) showDynamicStat(stat);
    stepIdx++;
    const progress = Math.round((stepIdx / steps.length) * 100);
    if (bar) bar.style.width = progress + "%";
    if (pctLabel) pctLabel.textContent = progress + "%";
  }, Math.max(400, (cfg.etaSeconds * 1000) / steps.length));

  const etaInterval = setInterval(() => {
    eta = Math.max(0, eta - 1);
    if (etaLabel) etaLabel.textContent = eta > 0 ? "Estimated time remaining: " + eta + "s" : "Finishing up…";
    if (eta <= 0) clearInterval(etaInterval);
  }, 1000);

  function finishProcessing() {
    AppState.setProcessingComplete(true);
    if (bar) bar.style.width = "100%";
    if (pctLabel) pctLabel.textContent = "100%";
    if (typeof opts.onComplete === "function") opts.onComplete();
    else setTimeout(() => { window.location.href = "dashboard.html"; }, 2000);
  }
}
