const CRM_PLACEHOLDER = "[INTERNAL — FILL FROM CRM]";

const EXTRACTED_BROKERS = [
  {
    "id": "ext-001",
    "name": "Marcus Whitfield",
    "company": "CBRE Capital Markets",
    "state": "TX",
    "email": "mwhitfield@cbre.com",
    "phone": "(214) 555-0182"
  },
  {
    "id": "ext-002",
    "name": "Jennifer Alvarez",
    "company": "JLL Debt Advisory",
    "state": "CA",
    "email": "jennifer.alvarez@jll.com",
    "phone": "(310) 555-0247"
  },
  {
    "id": "ext-003",
    "name": "David Chen",
    "company": "Walker & Dunlop",
    "state": "NY",
    "email": "dchen@walkerdunlop.com",
    "phone": "(212) 555-0391"
  },
  {
    "id": "ext-004",
    "name": "Rachel Thompson",
    "company": "Newmark",
    "state": "FL",
    "email": "rthompson@nmrk.com",
    "phone": "(305) 555-0564"
  },
  {
    "id": "ext-005",
    "name": "Michael O'Brien",
    "company": "Berkadia",
    "state": "IL",
    "email": "mobrien@berkadia.com",
    "phone": "(312) 555-0718"
  },
  {
    "id": "ext-006",
    "name": "Priya Sharma",
    "company": "HFF (JLL)",
    "state": "GA",
    "email": "psharma@jll.com",
    "phone": "(404) 555-0833"
  },
  {
    "id": "ext-007",
    "name": "James Rodriguez",
    "company": "Marcus & Millichap Capital",
    "state": "AZ",
    "email": "jrodriguez@marcusmillichap.com",
    "phone": "(602) 555-0946"
  },
  {
    "id": "ext-008",
    "name": "Sarah Kim",
    "company": "Eastdil Secured",
    "state": "WA",
    "email": "skim@eastdil.com",
    "phone": "(206) 555-1029"
  },
  {
    "id": "ext-009",
    "name": "Robert Hayes",
    "company": "Colliers Mortgage",
    "state": "CO",
    "email": "rhayes@colliers.com",
    "phone": "(303) 555-1157"
  },
  {
    "id": "ext-010",
    "name": "Amanda Foster",
    "company": "Northmarq",
    "state": "MN",
    "email": "afoster@northmarq.com",
    "phone": "(612) 555-1284"
  },
  {
    "id": "ext-011",
    "name": "Thomas Wright",
    "company": "Greystone",
    "state": "NC",
    "email": "twright@greystone.com",
    "phone": "(704) 555-1392"
  },
  {
    "id": "ext-012",
    "name": "Lisa Nguyen",
    "company": "Arbor Realty Trust",
    "state": "NV",
    "email": "lnguyen@arbor.com",
    "phone": "(702) 555-1468"
  }
];

const BROKERS_RAW = [
  {
    "id": "brk-001",
    "name": "Marcus Whitfield",
    "company": "CBRE Capital Markets",
    "state": "TX",
    "city": "Dallas",
    "email": "mwhitfield@cbre.com",
    "phone": "(214) 555-0182",
    "lastEmployer": "CBRE Capital Markets",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "18",
    "volume2025": "$450M+",
    "linkedin": "https://linkedin.com/in/marcuswhitfield-cre",
    "activityLevel": "High",
    "dealSignals": "Closed $85M Dallas office portfolio refi (Q1 2025); $42M industrial acquisition loan (Nov 2024)",
    "affiliations": "CCIM, MBA, ULI",
    "personalizationHook": "Recently closed an $85M Dallas office portfolio refinancing.",
    "confidence": "High",
    "evidenceNotes": "Verified via CBRE team page, NMLS, and LinkedIn.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": true,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": false,
      "dealVolumeHigh": true
    },
    "evidenceSources": [
      {
        "label": "CBRE Team Page",
        "url": "https://www.cbre.com/people/marcus-whitfield",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-002",
    "name": "Jennifer Alvarez",
    "company": "JLL Debt Advisory",
    "state": "CA",
    "city": "Los Angeles",
    "email": "jennifer.alvarez@jll.com",
    "phone": "(310) 555-0247",
    "lastEmployer": "JLL",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "14",
    "volume2025": "$320M",
    "linkedin": "https://linkedin.com/in/jennifer-alvarez-cre",
    "activityLevel": "High",
    "dealSignals": "$62M multifamily bridge loan (Jan 2025); $28M retail center permanent financing (Sep 2024)",
    "affiliations": "MBA, ICSC, ULI",
    "personalizationHook": "Recently closed a $62M multifamily bridge loan in Southern California.",
    "confidence": "High",
    "evidenceNotes": "JLL bio page and California DRE license verified.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": true,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": true,
      "dealVolumeHigh": true
    },
    "evidenceSources": [
      {
        "label": "JLL Bio Page",
        "url": "https://www.us.jll.com/en/people/jennifer-alvarez",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-003",
    "name": "David Chen",
    "company": "Walker & Dunlop",
    "state": "NY",
    "city": "New York",
    "email": "dchen@walkerdunlop.com",
    "phone": "(212) 555-0391",
    "lastEmployer": "Walker & Dunlop",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "22",
    "volume2025": "$580M+",
    "linkedin": "https://linkedin.com/in/davidchen-cre",
    "activityLevel": "High",
    "dealSignals": "$120M Manhattan mixed-use refinancing (Feb 2025); Speaker at CREF Summit 2024",
    "affiliations": "CCIM, MBA, SIOR",
    "personalizationHook": "Speaker at CREF Summit 2024; closed $120M Manhattan mixed-use refinancing.",
    "confidence": "High",
    "evidenceNotes": "Walker & Dunlop team page and CREF Summit speaker listing.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": true,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": true,
      "dealVolumeHigh": true
    },
    "evidenceSources": [
      {
        "label": "Walker & Dunlop Team",
        "url": "https://www.walkerdunlop.com/team/david-chen",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-004",
    "name": "Rachel Thompson",
    "company": "Newmark",
    "state": "FL",
    "city": "Miami",
    "email": "rthompson@nmrk.com",
    "phone": "(305) 555-0564",
    "lastEmployer": "Newmark",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "9",
    "volume2025": "$180M",
    "linkedin": "https://linkedin.com/in/rachel-thompson-cre",
    "activityLevel": "Medium",
    "dealSignals": "$35M hospitality acquisition loan (Dec 2024)",
    "affiliations": "MBA, ULI",
    "personalizationHook": "Recently closed a $35M hospitality acquisition loan in South Florida.",
    "confidence": "High",
    "evidenceNotes": "Newmark team page and Florida licensing verified.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": false,
      "dealVolumeMedium": true
    },
    "evidenceSources": [
      {
        "label": "Newmark Team Page",
        "url": "https://www.nmrk.com/people/rachel-thompson",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-005",
    "name": "Michael O'Brien",
    "company": "Berkadia",
    "state": "IL",
    "city": "Chicago",
    "email": "mobrien@berkadia.com",
    "phone": "(312) 555-0718",
    "lastEmployer": "Berkadia",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "16",
    "volume2025": "$275M",
    "linkedin": "https://linkedin.com/in/michael-obrien-cre",
    "activityLevel": "Medium",
    "dealSignals": "$48M affordable housing FHA loan (Oct 2024)",
    "affiliations": "MBA, CCIM",
    "personalizationHook": "Specializes in affordable housing FHA — closed $48M deal in Q4 2024.",
    "confidence": "High",
    "evidenceNotes": "Berkadia bio and HUD FHA announcement.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": false,
      "dealVolumeMedium": true
    },
    "evidenceSources": [
      {
        "label": "Berkadia Profile",
        "url": "https://www.berkadia.com/people/michael-obrien",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-006",
    "name": "Priya Sharma",
    "company": "HFF (JLL)",
    "state": "GA",
    "city": "Atlanta",
    "email": "psharma@jll.com",
    "phone": "(404) 555-0833",
    "lastEmployer": "HFF / JLL",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "11",
    "volume2025": "$210M",
    "linkedin": "https://linkedin.com/in/priya-sharma-cre",
    "activityLevel": "High",
    "dealSignals": "$55M industrial portfolio refinancing (Mar 2025)",
    "affiliations": "CCIM, SIOR, MBA",
    "personalizationHook": "Recently closed a $55M industrial portfolio refinancing in Atlanta.",
    "confidence": "High",
    "evidenceNotes": "JLL team page and CCIM member directory.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": true,
      "dealVolumeMedium": true
    },
    "evidenceSources": [
      {
        "label": "JLL Team Page",
        "url": "https://www.us.jll.com/en/people/priya-sharma",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-007",
    "name": "James Rodriguez",
    "company": "Marcus & Millichap Capital",
    "state": "AZ",
    "city": "Phoenix",
    "email": "jrodriguez@marcusmillichap.com",
    "phone": "(602) 555-0946",
    "lastEmployer": "Marcus & Millichap",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "7",
    "volume2025": "$95M",
    "linkedin": "https://linkedin.com/in/james-rodriguez-cre",
    "activityLevel": "Medium",
    "dealSignals": "$18M self-storage acquisition financing (Aug 2024)",
    "affiliations": "MBA",
    "personalizationHook": "Active in Phoenix self-storage — closed $18M acquisition financing.",
    "confidence": "Medium",
    "evidenceNotes": "M&M team page verified. Volume from partial disclosures.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Partial",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": false,
      "strongNetwork": false,
      "contentCreator": false
    },
    "evidenceSources": [
      {
        "label": "M&M Bio",
        "url": "https://www.marcusmillichap.com/advisors/james-rodriguez",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-008",
    "name": "Sarah Kim",
    "company": "Eastdil Secured",
    "state": "WA",
    "city": "Seattle",
    "email": "skim@eastdil.com",
    "phone": "(206) 555-1029",
    "lastEmployer": "Eastdil Secured",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "13",
    "volume2025": "$390M+",
    "linkedin": "https://linkedin.com/in/sarah-kim-cre",
    "activityLevel": "High",
    "dealSignals": "$95M Seattle tech campus debt placement (Jan 2025)",
    "affiliations": "MBA, ULI, CCIM",
    "personalizationHook": "Recently placed $95M debt on a Seattle tech campus.",
    "confidence": "High",
    "evidenceNotes": "Eastdil team page and press releases.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": true,
      "usesTechnology": true,
      "strongNetwork": true,
      "contentCreator": false,
      "dealVolumeHigh": true
    },
    "evidenceSources": [
      {
        "label": "Eastdil Secured Team",
        "url": "https://www.eastdilsecured.com/people/sarah-kim",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-009",
    "name": "Robert Hayes",
    "company": "Colliers Mortgage",
    "state": "CO",
    "city": "Denver",
    "email": "rhayes@colliers.com",
    "phone": "(303) 555-1157",
    "lastEmployer": "Colliers Mortgage",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "10",
    "volume2025": "Not Publicly Disclosed",
    "linkedin": "https://linkedin.com/in/robert-hayes-cre",
    "activityLevel": "Low",
    "dealSignals": "No recent deal signals found in last 12 months",
    "affiliations": "MBA",
    "personalizationHook": "No personalization signal found.",
    "confidence": "Medium",
    "evidenceNotes": "Colliers team page confirms employment. Volume unverified.",
    "manualReviewFlag": true,
    "manualReviewReason": "Volume not publicly disclosed; no recent deal signals",
    "rowStatus": "Review Required",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": false,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": true,
      "strongNetwork": false,
      "contentCreator": false
    },
    "evidenceSources": [
      {
        "label": "Colliers Team",
        "url": "https://www.colliers.com/en/people/robert-hayes",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-010",
    "name": "Amanda Foster",
    "company": "Northmarq",
    "state": "MN",
    "city": "Minneapolis",
    "email": "afoster@northmarq.com",
    "phone": "(612) 555-1284",
    "lastEmployer": "Northmarq",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "8",
    "volume2025": "$140M",
    "linkedin": "https://linkedin.com/in/amanda-foster-cre",
    "activityLevel": "Medium",
    "dealSignals": "$22M multifamily agency loan (Jul 2024)",
    "affiliations": "MBA, ICSC",
    "personalizationHook": "Recently closed a $22M multifamily agency loan in Twin Cities.",
    "confidence": "High",
    "evidenceNotes": "Northmarq bio and Freddie Mac lender list.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Complete",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": true,
      "strongNetwork": false,
      "contentCreator": false,
      "dealVolumeMedium": true
    },
    "evidenceSources": [
      {
        "label": "Northmarq Profile",
        "url": "https://www.northmarq.com/people/amanda-foster",
        "tier": 1
      }
    ]
  },
  {
    "id": "brk-011",
    "name": "Thomas Wright",
    "company": "Greystone",
    "state": "NC",
    "city": "Charlotte",
    "email": "twright@greystone.com",
    "phone": "(704) 555-1392",
    "lastEmployer": "Unknown",
    "onlyCreMortgage": "Unverified — Manual Review",
    "yearsInCre": "Unknown",
    "volume2025": "Unknown",
    "linkedin": "Not Publicly Listed",
    "activityLevel": "Unknown",
    "dealSignals": "No deal signals found",
    "affiliations": "None identified",
    "personalizationHook": "No personalization signal found.",
    "confidence": "Low",
    "evidenceNotes": "Only Tier 3 aggregator source found. Identity unverified.",
    "manualReviewFlag": true,
    "manualReviewReason": "Identity unverified — only Tier 3 aggregator source",
    "rowStatus": "No Match",
    "scoreInputs": {
      "fullTimeCre": false,
      "activeDealmaker": false,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": false,
      "strongNetwork": false,
      "contentCreator": false
    },
    "evidenceSources": [
      {
        "label": "CRE Aggregator",
        "url": "https://www.loopnet.com/commercial-brokers/thomas-wright",
        "tier": 3
      }
    ]
  },
  {
    "id": "brk-012",
    "name": "Lisa Nguyen",
    "company": "Arbor Realty Trust",
    "state": "NV",
    "city": "Las Vegas",
    "email": "lnguyen@arbor.com",
    "phone": "(702) 555-1468",
    "lastEmployer": "Arbor Realty Trust",
    "onlyCreMortgage": "Yes",
    "yearsInCre": "6",
    "volume2025": "$75M",
    "linkedin": "https://linkedin.com/in/lisa-nguyen-cre",
    "activityLevel": "Medium",
    "dealSignals": "$15M multifamily loan (May 2024)",
    "affiliations": "MBA",
    "personalizationHook": "Recently closed a $15M multifamily loan in Las Vegas.",
    "confidence": "Medium",
    "evidenceNotes": "Arbor team page verified.",
    "manualReviewFlag": false,
    "manualReviewReason": "",
    "rowStatus": "Partial",
    "scoreInputs": {
      "fullTimeCre": true,
      "activeDealmaker": true,
      "independent": false,
      "nationalFocus": false,
      "usesTechnology": false,
      "strongNetwork": false,
      "contentCreator": false
    },
    "evidenceSources": [
      {
        "label": "Arbor Realty Team",
        "url": "https://www.arbor.com/team/lisa-nguyen",
        "tier": 1
      }
    ]
  }
];
