import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "data.js");
const src = fs.readFileSync(dataPath, "utf8");
const brokersMatch = src.match(/const BROKERS_RAW = (\[[\s\S]*?\n\]);/);
if (!brokersMatch) throw new Error("BROKERS_RAW not found");
const BROKERS_RAW = eval(brokersMatch[1]);

const FIRST = ["Nathan", "Olivia", "Ethan", "Sophia", "Lucas", "Mia", "Henry", "Ava", "Jackson", "Isabella", "Sebastian", "Charlotte", "Mateo", "Amelia", "Leo", "Harper", "Owen", "Evelyn", "Caleb", "Abigail", "Wyatt", "Emily", "Grayson", "Elizabeth", "Levi", "Sofia", "Julian", "Avery", "Aaron", "Ella", "Eli", "Scarlett", "Landon", "Grace", "Jonathan", "Chloe", "Nolan", "Victoria", "Hunter", "Riley", "Christian", "Aria", "Isaiah", "Lily"];
const LAST = ["Patterson", "Richardson", "Stevens", "Coleman", "Henderson", "Murphy", "Sullivan", "Butler", "Simmons", "Foster", "Bryant", "Russell", "Griffin", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Porter", "Hunter"];
const COS = ["Bridgewater CRE", "Summit Lending Partners", "Cornerstone Capital", "Redwood Finance", "Ironwood Advisory", "Clearview Mortgage", "Baypoint Capital", "Crestline Partners", "Oakmont Finance", "Silverline CRE"];
const ST = ["TX", "CA", "NY", "FL", "IL", "GA", "CO", "WA", "AZ", "NC", "NJ", "OH", "MN", "MA", "VA", "PA", "TN", "MO", "IN", "WI"];

function cloneBroker(base, i) {
  const fn = FIRST[i % FIRST.length];
  const ln = LAST[(i * 3) % LAST.length];
  const co = i < BROKERS_RAW.length ? base.company : COS[i % COS.length];
  const id = "brk-r" + String(i + 1).padStart(3, "0");
  return JSON.parse(JSON.stringify(base))
    .replace?.("") || Object.assign({}, base, {
    id,
    name: fn + " " + ln,
    company: co,
    state: ST[i % ST.length],
    city: ST[i % ST.length] === "NY" ? "New York" : "Dallas",
    email: fn.toLowerCase() + "." + ln.toLowerCase() + "@demo-cre.com",
    phone: "(555) 555-" + String(2000 + i).slice(-4),
    lastEmployer: co,
    volume2025: "$" + (30 + (i % 70)) + "M",
    yearsInCre: String(6 + (i % 15)),
    linkedin: "https://linkedin.com/in/" + fn.toLowerCase() + "-" + ln.toLowerCase(),
    personalizationHook: "CRE finance professional identified in broker roster upload.",
    leadSource: "Broker Roster Upload",
    classification: "CRE Broker / Advisor",
    sourcePlatform: "Excel Upload",
    title: i % 3 === 0 ? "Managing Director" : "Director, Debt Advisory",
  });
}

const roster = [];
for (let i = 0; i < 53; i++) {
  const base = BROKERS_RAW[i % BROKERS_RAW.length];
  const b = JSON.parse(JSON.stringify(base));
  if (i >= BROKERS_RAW.length) {
    const fn = FIRST[i % FIRST.length];
    const ln = LAST[(i * 3) % LAST.length];
    const co = COS[i % COS.length];
    Object.assign(b, {
      id: "brk-r" + String(i + 1).padStart(3, "0"),
      name: fn + " " + ln,
      company: co,
      state: ST[i % ST.length],
      city: "Metro",
      email: fn.toLowerCase() + "." + ln.toLowerCase() + "@demo-cre.com",
      phone: "(555) 555-" + String(2000 + i).slice(-4),
      lastEmployer: co,
      volume2025: "$" + (30 + (i % 70)) + "M",
      yearsInCre: String(6 + (i % 15)),
      linkedin: "https://linkedin.com/in/" + fn.toLowerCase() + "-" + ln.toLowerCase(),
      personalizationHook: "CRE finance professional identified in broker roster upload.",
      leadSource: "Broker Roster Upload",
      classification: "CRE Broker / Advisor",
      sourcePlatform: "Excel Upload",
      title: "Director, Debt Advisory",
    });
  } else {
    b.id = "brk-r" + String(i + 1).padStart(3, "0");
    b.leadSource = "Broker Roster Upload";
    b.classification = "CRE Broker / Advisor";
    b.sourcePlatform = "Excel Upload";
    b.title = "Managing Director";
  }
  roster.push(b);
}

const dirContacts = [];
for (let i = 0; i < 186; i++) {
  const fn = FIRST[(i + 5) % FIRST.length];
  const ln = LAST[(i + 7) % LAST.length];
  dirContacts.push({
    id: "dir-" + String(i + 1).padStart(3, "0"),
    name: fn + " " + ln.charAt(0) + ".",
    company: COS[i % COS.length],
    state: ST[i % ST.length],
    title: i % 4 === 0 ? "SVP, Capital Markets" : "Director",
    email: fn.toLowerCase() + "@dir-demo.com",
    phone: "(555) 100-" + String(1000 + i).slice(-4),
  });
}

const dirBrokers = [];
for (let i = 0; i < 145; i++) {
  const c = dirContacts[i];
  const scoreHint = 52 + ((i * 17) % 45);
  dirBrokers.push({
    id: "dir-b" + String(i + 1).padStart(3, "0"),
    name: c.name.replace(".", "") + (i > 20 ? " " + LAST[i % LAST.length].charAt(0) + "." : ""),
    company: c.company,
    state: c.state,
    city: "Metro",
    title: c.title,
    email: c.email,
    phone: c.phone,
    lastEmployer: c.company,
    onlyCreMortgage: "Yes",
    yearsInCre: String(4 + (i % 16)),
    volume2025: "$" + (15 + (i % 60)) + "M",
    linkedin: "https://linkedin.com/in/dir-" + i,
    activityLevel: scoreHint >= 75 ? "High" : "Medium",
    dealSignals: "Directory-sourced CRE professional with active deal signals.",
    affiliations: "MBA",
    personalizationHook: "Identified from association member directory upload.",
    confidence: scoreHint >= 78 ? "High" : scoreHint >= 62 ? "Medium" : "Low",
    evidenceNotes: "Matched via directory HTML extraction.",
    manualReviewFlag: i % 17 === 0,
    manualReviewReason: i % 17 === 0 ? "Employer affiliation unverified" : "",
    rowStatus: i % 17 === 0 ? "Review Required" : i % 9 === 0 ? "Partial" : "Complete",
    classification: "CRE Broker / Advisor",
    sourcePlatform: "HTML Directory",
    leadSource: "Association Member Directory",
    title: c.title,
    scoreInputs: {
      fullTimeCre: scoreHint >= 58,
      activeDealmaker: scoreHint >= 62,
      independent: i % 6 === 0,
      nationalFocus: i % 3 !== 0,
      usesTechnology: scoreHint >= 68,
      strongNetwork: scoreHint >= 70,
      contentCreator: i % 8 === 0,
      dealVolumeHigh: scoreHint >= 82,
      dealVolumeMedium: scoreHint >= 62 && scoreHint < 82,
    },
    evidenceSources: [{ label: c.company, url: "https://example-dir.com/" + i, tier: 2 }],
  });
}

fs.writeFileSync(
  path.join(__dirname, "broker-roster-data.js"),
  "/** Generated — 53 broker roster records */\nconst BROKER_ROSTER_RAW = " + JSON.stringify(roster, null, 2) + ";\n"
);
fs.writeFileSync(
  path.join(__dirname, "directory-data.js"),
  "/** Generated — 186 directory contacts, 145 qualified brokers */\nconst DIRECTORY_CONTACTS = " +
    JSON.stringify(dirContacts, null, 2) +
    ";\nconst DIRECTORY_BROKERS_RAW = " +
    JSON.stringify(dirBrokers, null, 2) +
    ";\n"
);
console.log("Generated broker-roster-data.js (53) and directory-data.js (186/145)");
