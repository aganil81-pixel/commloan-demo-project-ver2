# Broker Intelligence & Scoring — CommLoan Demo

Build: 18 June 2026 · Sales-First V1 · Accuracy Fix

Interactive static prototype with **P1 Verify & Enrich** and **P2 Prospect & Score** modes.

## Open the demo

**Double-click `index.html`** — works in Chrome, Edge, or Firefox. No installation required.

## User journey

| Step | Screen | File |
|------|--------|------|
| 1 | Select P1/P2 + upload file or URL | `index.html` |
| 2 | Inline background processing (status on home page) | `index.html` |
| 3 | Executive dashboard (KPIs) | `dashboard.html` |
| 4 | Full sales results list + **Export Result** | `results.html` |
| 5 | Broker profile + card (P2 only) | `broker.html`, `card.html` |

## Modes

| | P1 — Verify & Enrich | P2 — Prospect & Score |
|--|----------------------|------------------------|
| **Use case** | Production roster / event verification | New prospect discovery |
| **Results** | Full enrichment columns | Full enrichment + Score + Priority Tier |
| **Profile drill-down** | No — list + export only | Yes — click name for profile |
| **Broker Card** | No | Yes — from profile page |
| **Export** | Full sales CSV | Full sales CSV with score + tier |

## Suggested walkthrough

**P1:** Home → Enter Demo → select P1 → **click** upload area (loads `2026_Brokers_Production.xlsx`) → Start → Dashboard → Results → **Export Result**

**P2:** Home → select P2 → **click** upload (loads `NYU Attendee List.xlsx`) or **click** URL field (Walker & Dunlop team page) → Start → Dashboard → Results → click a name for profile → **Broker Card** → **Export Result**

## Export

- **Export Result** — from Results page (selected rows or full filtered list); downloads `commloan-export-result.csv` (opens in Excel)

## Mock data scale

| Scenario | Contacts | Qualified | Priority |
|----------|----------|-----------|----------|
| Broker roster | 53 | 53 | subset |
| Directory | 186 | 145 | 25 |
| Event | 2,211 | 145 | 25 |

Click **Reset Demo** in the header between runs.
