/* ==========================================================================
   CreditSamarth National Credit Portal - Multi-Page Engine & Utilities
   ========================================================================== */

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? "http://localhost:8000/api"
  : "/api";

let appState = {
  wizardStep: 1,
  language: 'en',
  user: null,
  grvUserType: 'applicant',
  loanData: {
    fullName: "Rahul Kumar",
    fatherName: "Ramesh Kumar",
    dob: "1995-06-15",
    mobile: "9876543210",
    email: "rahul.kumar@shreegeneral.in",
    state: "Jharkhand",
    district: "Ranchi",
    businessName: "Shree General Store",
    businessType: "Retail Shop",
    businessVintage: "3 Years",
    annualTurnover: 600000,
    loanAmount: 500000,
    loanPurpose: "Business Expansion",
    selectedScheme: "MUDRA",
    repaymentTenure: 36,
    estimatedEmi: 16209,
    applicationId: "MUDRA-2026-08421",
    currentStatus: "Under Review",
    transactionRef: "TXN354927502"
  },
  documents: [
    { id: "aadhaar", name: "Aadhaar Card", category: "Identity Proof", status: "Verified", fileName: "aadhaar_rahul.pdf", fileSize: "1.2 MB" },
    { id: "pan", name: "PAN Card", category: "Tax ID", status: "Verified", fileName: "pan_card.pdf", fileSize: "840 KB" },
    { id: "bank_statement", name: "Bank Statement", category: "Financial Proof", status: "Verified", fileName: "sbi_statement.pdf", fileSize: "3.4 MB" },
    { id: "udyam", name: "Udyam Certificate", category: "Business Reg.", status: "Verified", fileName: "udyam_reg.pdf", fileSize: "910 KB" },
    { id: "gst", name: "GST Certificate", category: "Tax Return", status: "Needs Review", fileName: "gst_cert.pdf", fileSize: "1.8 MB" },
    { id: "business_proof", name: "Business Proof", category: "Establishment", status: "Verified", fileName: "shop_license.pdf", fileSize: "1.5 MB" }
  ]
};

// SCHEMES DATABASE DICTIONARY FOR SCHEME-DETAIL.HTML (FULL 17 SCHEMES)
const SCHEMES_DATABASE = {
  "PMAY": {
    name: "Pradhan Mantri Awas Yojana (Urban 2.0)",
    categoryBadge: "HOUSING LOAN SUBSIDY SCHEME",
    ministry: "Ministry of Housing and Urban Affairs (MoHUA), Govt. of India",
    overview: "Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U 2.0) is a flagship Central Credit-Linked Subsidy Scheme (CLSS) providing upfront interest subvention on home loans for Economically Weaker Section (EWS), Low Income Group (LIG), and Middle Income Group (MIG) families constructing or purchasing their first permanent (pucca) house.",
    maxLimit: "₹ 2,67,000 Subsidy",
    subsidyCover: "Up to 6.5% Interest Subvention",
    eligibility: [
      "Beneficiary family should not own a pucca house in any part of India.",
      "Annual household income limit: EWS (up to ₹3 Lakh), LIG (₹3 Lakh to ₹6 Lakh), MIG (₹6 Lakh to ₹18 Lakh).",
      "Female ownership or co-ownership is mandatory for EWS/LIG categories.",
      "Loan tenure up to 20 years with upfront interest subsidy credited directly to beneficiary bank loan account."
    ],
    documents: [
      { name: "Aadhaar Card", desc: "For all family members" },
      { name: "Income Certificate / Salary Slip", desc: "Proof of annual household income" },
      { name: "Property Documents", desc: "Sale deed / Approved building plan" },
      { name: "Bank Passbook", desc: "For direct subsidy credit" }
    ]
  },
  "MUDRA": {
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    categoryBadge: "BUSINESS LOAN SCHEME",
    ministry: "Department of Financial Services, Ministry of Finance, Govt. of India",
    overview: "Pradhan Mantri MUDRA Yojana (PMMY) enables non-corporate, non-farm micro and small enterprises to access credit up to ₹10 Lakhs with 100% collateral-free guarantee under CGTMSE. Loans are categorized into Shishu (up to ₹50k), Kishor (₹50k to ₹5L), and Tarun (₹5L to ₹10L).",
    maxLimit: "₹ 10,00,000",
    subsidyCover: "100% Collateral-Free Cover",
    eligibility: [
      "Any Indian citizen having a viable business plan for non-farm income generating activity.",
      "Micro units engaged in manufacturing, processing, trading, or service sector.",
      "Applicant should not be a defaulter to any bank or financial institution."
    ],
    documents: [
      { name: "Aadhaar Card", desc: "Identity & Residence Proof" },
      { name: "PAN Card", desc: "Income Tax Identifier" },
      { name: "Bank Statement", desc: "Last 6 Months Bank Statement" },
      { name: "Udyam Registration", desc: "MSME Registration Certificate" }
    ]
  },
  "PMEGP": {
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    categoryBadge: "CAPITAL SUBSIDY SCHEME",
    ministry: "Ministry of Micro, Small and Medium Enterprises (MSME), Govt. of India",
    overview: "PMEGP is a credit-linked capital subsidy scheme offering 15% to 35% margin money subsidy for establishing new micro-enterprises in non-farm sector. Administered by Khadi and Village Industries Commission (KVIC).",
    maxLimit: "₹ 50,00,000",
    subsidyCover: "Up to 35% Margin Subsidy",
    eligibility: [
      "Any individual above 18 years of age.",
      "At least VIII standard pass for projects costing above ₹10 Lakh in manufacturing.",
      "Self Help Groups (SHGs) and Charitable Trusts are also eligible."
    ],
    documents: [
      { name: "Project Report", desc: "Detailed Project Report (DPR)" },
      { name: "Aadhaar & PAN Card", desc: "Personal KYC Files" },
      { name: "Educational Certificate", desc: "Class 8th / 10th Certificate" },
      { name: "Caste / Special Category Certificate", desc: "For higher subsidy claim" }
    ]
  },
  "PMFME": {
    name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
    categoryBadge: "FOOD PROCESSING SCHEME",
    ministry: "Ministry of Food Processing Industries (MoFPI), Govt. of India",
    overview: "PMFME provides financial, technical, and business support for micro food processing units under the One District One Product (ODOP) framework with 35% credit-linked capital subsidy up to ₹10 Lakhs.",
    maxLimit: "₹ 10,00,000",
    subsidyCover: "35% Credit-Linked Capital Subsidy",
    eligibility: [
      "Existing micro food processing units or new food enterprises.",
      "Individual entrepreneurs, Farmer Producer Organizations (FPOs), SHGs, and Co-operatives.",
      "Applicant must contribute minimum 10% of project cost."
    ],
    documents: [
      { name: "Food License (FSSAI)", desc: "FSSAI Registration / License" },
      { name: "Aadhaar & PAN", desc: "Personal KYC" },
      { name: "Bank Statement", desc: "Last 6 Months Bank Statement" },
      { name: "Business Location Proof", desc: "Rent Agreement / Electricity Bill" }
    ]
  },
  "CMEGP": {
    name: "Chief Minister Employment Generation Programme (CMEGP)",
    categoryBadge: "STATE SUBSIDY SCHEME",
    ministry: "Department of Industries, State Government & Nodal Agency",
    overview: "Chief Minister Employment Generation Programme (CMEGP) is a state-sponsored self-employment scheme providing soft loan seed capital, margin money grants, and interest subvention for local youth establishing micro enterprises.",
    maxLimit: "₹ 25,00,000",
    subsidyCover: "Soft Loan Seed Capital & 20%-35% Subsidy",
    eligibility: [
      "Domicile resident of the state aged between 18 and 45 years.",
      "Minimum 7th standard pass.",
      "Project must be in manufacturing, service, or retail trade."
    ],
    documents: [
      { name: "Domicile Certificate", desc: "State Resident Proof" },
      { name: "Aadhaar Card", desc: "Biometric KYC" },
      { name: "Project Outline", desc: "Simple Business Proposal" }
    ]
  },
  "SVANidhi": {
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    categoryBadge: "URBAN MICRO CREDIT SCHEME",
    ministry: "Ministry of Housing and Urban Affairs (MoHUA), Govt. of India",
    overview: "PM SVANidhi provides working capital credit up to ₹50,000 for urban street vendors with 7% interest subsidy upon timely repayment and monthly digital transaction cashback rewards.",
    maxLimit: "₹ 50,000",
    subsidyCover: "7% Interest Subsidy + Cashbacks",
    eligibility: [
      "Street vendors vending in urban areas on or before March 24, 2020.",
      "Vendors possessing Certificate of Vending / Identity Card issued by Urban Local Bodies (ULB)."
    ],
    documents: [
      { name: "Vendor ID Card", desc: "Issued by Municipal Corporation" },
      { name: "Aadhaar Card", desc: "KYC Identifier" },
      { name: "Bank Passbook", desc: "For direct cashback credit" }
    ]
  },
  "StandUp": {
    name: "Stand Up India Scheme",
    categoryBadge: "SC/ST & WOMEN ENTREPRENEUR SCHEME",
    ministry: "Department of Financial Services, Ministry of Finance, Govt. of India",
    overview: "Stand Up India facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    maxLimit: "₹ 1,00,00,000",
    subsidyCover: "Credit Guarantee Cover & Concessional Rate",
    eligibility: [
      "SC/ST and/or woman entrepreneur above 18 years of age.",
      "Loans under the scheme are available for greenfield projects only (first time venture).",
      "In non-individual enterprises, 51% shareholding must be held by SC/ST or Woman."
    ],
    documents: [
      { name: "Caste Certificate", desc: "SC/ST Certificate (if applicable)" },
      { name: "Aadhaar & PAN Card", desc: "Identity Proof" },
      { name: "Detailed Project Report", desc: "Technical & Financial Viability Plan" }
    ]
  },
  "SRMS": {
    name: "Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS)",
    categoryBadge: "REHABILITATION CREDIT SCHEME",
    ministry: "Ministry of Social Justice and Empowerment, Govt. of India",
    overview: "SRMS provides capital subsidy up to ₹3.25 Lakhs and soft credit for the financial rehabilitation of identified manual scavengers and their dependents into alternative dignified livelihoods.",
    maxLimit: "₹ 15,00,000",
    subsidyCover: "Capital Subsidy up to ₹ 3,25,000",
    eligibility: [
      "Identified manual scavengers and their dependents.",
      "Age of beneficiary must be 18 years or above."
    ],
    documents: [
      { name: "Target Group Certificate", desc: "Identification Certificate" },
      { name: "Aadhaar Card", desc: "Identity Proof" }
    ]
  },
  "KCC": {
    name: "Agri Loan – Kisan Credit Card (KCC)",
    categoryBadge: "AGRICULTURAL CREDIT SCHEME",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    overview: "Kisan Credit Card (KCC) provides farmers, animal husbandry rearers, and fisheries farmers with timely short-term credit at concessional interest rates of 4% (with prompt repayment subvention of 3%).",
    maxLimit: "₹ 3,00,000",
    subsidyCover: "3% Prompt Repayment Interest Subvention",
    eligibility: [
      "Owner cultivators, tenant farmers, sharecroppers, and SHGs of farmers.",
      "Fisheries farmers and animal husbandry owners.",
      "Collateral-free credit limit up to ₹1.60 Lakhs (extended up to ₹3 Lakhs)."
    ],
    documents: [
      { name: "Land Record Document", desc: "Parcha / Khatian / Land Receipt" },
      { name: "Aadhaar Card", desc: "Biometric KYC Proof" },
      { name: "Cropping Pattern Declaration", desc: "Details of crops cultivated" }
    ]
  },
  "AIF": {
    name: "Agriculture Infrastructure Fund (AIF)",
    categoryBadge: "AGRI INFRASTRUCTURE SCHEME",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    overview: "Agriculture Infrastructure Fund (AIF) provides medium to long-term debt financing for post-harvest management infrastructure and community farming assets with 3% annual interest subvention up to ₹2 Crore.",
    maxLimit: "₹ 2,00,00,000",
    subsidyCover: "3% Interest Subvention + CGTMSE Guarantee",
    eligibility: [
      "Farmers, Agri-Entrepreneurs, FPOs, SHGs, Joint Liability Groups, and Primary Agricultural Credit Societies (PACS)."
    ],
    documents: [
      { name: "DPR for Post-Harvest Infra", desc: "Warehouse / Cold Storage Plan" },
      { name: "Entity KYC", desc: "PAN / Registration" }
    ]
  },
  "PMMSY": {
    name: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    categoryBadge: "FISHERIES INFRASTRUCTURE SCHEME",
    ministry: "Department of Fisheries, Ministry of Fisheries, Animal Husbandry, Govt. of India",
    overview: "PMMSY is designed to address critical gaps in fish production, productivity, quality, technology, post-harvest infrastructure, and management modernization with financial support up to 60%.",
    maxLimit: "₹ 50,00,000",
    subsidyCover: "Up to 60% Govt Subsidy Cover",
    eligibility: [
      "Fishers, Fish Farmers, Fish Workers, Fish Vendors, FPOs, and Fisheries Cooperatives."
    ],
    documents: [
      { name: "Waterbody / Land Proof", desc: "Pond Lease / Land Deed" },
      { name: "Aadhaar & Bank Passbook", desc: "Direct Subsidy Credit" }
    ]
  },
  "AHIDF": {
    name: "Animal Husbandry Infrastructure Development Fund (AHIDF)",
    categoryBadge: "DAIRY & LIVESTOCK INFRA SCHEME",
    ministry: "Department of Animal Husbandry and Dairying, Govt. of India",
    overview: "AHIDF incentivizes investments by individual entrepreneurs, private companies, MSMEs, and FPOs to establish dairy processing, meat processing, and animal feed plants with 3% interest subvention.",
    maxLimit: "₹ 10,00,00,000",
    subsidyCover: "3% Interest Subvention + 25% Credit Guarantee",
    eligibility: [
      "Individual Entrepreneurs, Private Companies, FPOs, and Section 8 Companies."
    ],
    documents: [
      { name: "Project DPR", desc: "Plant Capacity & Financial DPR" },
      { name: "Company KYC", desc: "GST & Incorporation Certificate" }
    ]
  },
  "Solar": {
    name: "PM-Surya Ghar: Muft Bijli Yojana (Rooftop Solar)",
    categoryBadge: "RENEWABLE ENERGY SCHEME",
    ministry: "Ministry of New and Renewable Energy (MNRE), Govt. of India",
    overview: "PM-Surya Ghar provides financial assistance and collateral-free concessional bank loans for installing rooftop solar systems to generate free electricity up to 300 units per month.",
    maxLimit: "₹ 6,00,000",
    subsidyCover: "Central Financial Subsidy up to ₹ 78,000",
    eligibility: [
      "Residential households and micro business enterprise premises.",
      "Premises must have suitable rooftop space for solar panel installation."
    ],
    documents: [
      { name: "Electricity Bill", desc: "Recent Consumer Bill" },
      { name: "Aadhaar Card", desc: "Applicant Identity" }
    ]
  },
  "KUSUM": {
    name: "PM-KUSUM Solar Scheme for Farmers",
    categoryBadge: "SOLAR FARMING SCHEME",
    ministry: "Ministry of New and Renewable Energy (MNRE), Govt. of India",
    overview: "PM-KUSUM supports farmers to install solar water pumps and solarize existing grid-connected agricultural pumps with up to 60% government subsidy support.",
    maxLimit: "₹ 15,00,000",
    subsidyCover: "60% Combined Central & State Subsidy",
    eligibility: [
      "Individual farmers, Panchayats, Farmer Producer Organizations (FPOs)."
    ],
    documents: [
      { name: "Khatian / Land Record", desc: "Farm Land Ownership" },
      { name: "Aadhaar & Bank Details", desc: "KYC Files" }
    ]
  },
  "SATAT": {
    name: "Compressed Bio-Gas (CBG) SATAT Scheme",
    categoryBadge: "BIO-GAS INFRASTRUCTURE SCHEME",
    ministry: "Ministry of Petroleum and Natural Gas, Govt. of India",
    overview: "SATAT encourages entrepreneurs to set up Compressed Bio-Gas (CBG) production plants from agricultural residual waste with assured commercial off-take by PSU Oil Marketing Companies.",
    maxLimit: "₹ 5,00,00,000",
    subsidyCover: "Commercial Off-take Guarantee + Subvention",
    eligibility: [
      "Entrepreneurs, Companies, and Cooperative Societies."
    ],
    documents: [
      { name: "LOI from Oil Marketing Co.", desc: "Letter of Intent" },
      { name: "Feasibility Project Report", desc: "Biomass Supply & Financial DPR" }
    ]
  },
  "NRLM": {
    name: "Deendayal Antyodaya Yojana - NRLM",
    categoryBadge: "RURAL LIVELIHOOD SCHEME",
    ministry: "Ministry of Rural Development (MoRD), Govt. of India",
    overview: "DAY-NRLM provides interest subvention and collateral-free credit linkages for rural women Self Help Groups (SHGs) and individual micro-enterprises to promote sustainable livelihoods.",
    maxLimit: "₹ 20,00,000",
    subsidyCover: "Concessional 7% Interest Subvention",
    eligibility: [
      "Rural women Self Help Groups (SHGs) and micro entrepreneurs."
    ],
    documents: [
      { name: "SHG Passbook", desc: "Group Bank Account Record" },
      { name: "Aadhaar Cards", desc: "Group Member KYC" }
    ]
  },
  "NULM": {
    name: "Deendayal Antyodaya Yojana - NULM",
    categoryBadge: "URBAN LIVELIHOOD SCHEME",
    ministry: "Ministry of Housing and Urban Affairs (MoHUA), Govt. of India",
    overview: "DAY-NULM addresses urban poverty by enabling urban poor entrepreneurs to access micro-credit for self-employment ventures with interest subvention over and above 7%.",
    maxLimit: "₹ 10,00,000",
    subsidyCover: "Interest Subvention over 7% p.a.",
    eligibility: [
      "Urban poor individuals, urban micro-enterprises, and SHGs."
    ],
    documents: [
      { name: "Urban Identity Certificate", desc: "Resident Proof" },
      { name: "Aadhaar Card", desc: "Biometric KYC" }
    ]
  }
};

async function apiCall(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (appState.user?.access_token) {
      options.headers["Authorization"] = `Bearer ${appState.user.access_token}`;
    }
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend API ${endpoint} fallback:`, err.message);
    return null;
  }
}

// SCHEME DETAIL TAB SWITCHING
function switchDetailTab(tabId, el) {
  document.querySelectorAll('.grv-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');

  const tabs = ['overview', 'eligibility', 'documents', 'faqs'];
  tabs.forEach(t => {
    const box = document.getElementById(`detail-tab-${t}`);
    if (box) box.style.display = t === tabId ? 'block' : 'none';
  });
}

// DYNAMICALLY LOAD SCHEME-DETAIL.HTML DATA
function loadSchemeDetailData() {
  const urlParams = new URLSearchParams(window.location.search);
  const schemeId = urlParams.get('id') || 'MUDRA';
  const scheme = SCHEMES_DATABASE[schemeId] || SCHEMES_DATABASE['MUDRA'];

  document.title = `${scheme.name} | CreditSamarth`;

  const breadTitle = document.getElementById('detail-breadcrumb-title');
  if (breadTitle) breadTitle.innerText = scheme.name;

  const catBadge = document.getElementById('detail-category-badge');
  if (catBadge) catBadge.innerText = scheme.categoryBadge;

  const titleEl = document.getElementById('detail-scheme-title');
  if (titleEl) titleEl.innerText = scheme.name;

  const minEl = document.getElementById('detail-scheme-ministry');
  if (minEl) minEl.innerText = `Nodal Ministry: ${scheme.ministry}`;

  const overEl = document.getElementById('detail-full-overview');
  if (overEl) overEl.innerText = scheme.overview;

  const maxLimEl = document.getElementById('detail-max-limit');
  if (maxLimEl) maxLimEl.innerText = scheme.maxLimit;

  const subCovEl = document.getElementById('detail-subsidy-cover');
  if (subCovEl) subCovEl.innerText = scheme.subsidyCover;

  const sideTitle = document.getElementById('side-scheme-title');
  if (sideTitle) sideTitle.innerText = scheme.name;

  const sideMax = document.getElementById('side-max-limit');
  if (sideMax) sideMax.innerText = scheme.maxLimit;

  const sideSub = document.getElementById('side-subsidy');
  if (sideSub) sideSub.innerText = scheme.subsidyCover;

  const applyTopBtn = document.getElementById('detail-apply-top-btn');
  if (applyTopBtn) applyTopBtn.href = `apply.html?step=2&scheme=${schemeId}`;

  const sideApplyBtn = document.getElementById('side-apply-btn');
  if (sideApplyBtn) sideApplyBtn.href = `apply.html?step=2&scheme=${schemeId}`;

  // Populate Eligibility List
  const eligList = document.getElementById('detail-eligibility-list');
  if (eligList && scheme.eligibility) {
    eligList.innerHTML = scheme.eligibility.map(item => `
      <li style="display:flex; gap:0.75rem; align-items:flex-start;">
        <span style="color:#059669; font-weight:900;">✓</span>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // Populate Docs Checklist
  const docsGrid = document.getElementById('detail-docs-checklist');
  if (docsGrid && scheme.documents) {
    docsGrid.innerHTML = scheme.documents.map(d => `
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1rem; border-radius:8px; display:flex; align-items:center; gap:0.75rem;">
        <span style="font-size:1.5rem;">📄</span>
        <div>
          <div style="font-weight:800; font-size:0.88rem; color:#1e3a8a;">${d.name}</div>
          <div style="font-size:0.72rem; color:#64748b;">${d.desc}</div>
        </div>
      </div>
    `).join('');
  }

  if (appState.language === 'hi') applyTranslation('hi');
}

// SCHEME CATALOG PAGE FILTER & SEARCH FUNCTIONS
function filterSchemeCategory(category, el) {
  document.querySelectorAll('.scheme-filter-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');

  const cards = document.querySelectorAll('.scheme-clean-card, .scheme-rich-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countBadge = document.getElementById('scheme-count-status');
  if (countBadge) {
    countBadge.innerText = `Showing ${visibleCount} of ${cards.length} Schemes`;
  }
  if (appState.language === 'hi') applyTranslation('hi');
}

function filterSchemesList(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.scheme-clean-card, .scheme-rich-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const txt = card.innerText.toLowerCase();
    if (!q || txt.includes(q)) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countBadge = document.getElementById('scheme-count-status');
  if (countBadge) {
    countBadge.innerText = `Showing ${visibleCount} of ${cards.length} Schemes matching "${query}"`;
  }
  if (appState.language === 'hi') applyTranslation('hi');
}

// HOMEPAGE TRACKING INPUT
function trackFromHomeInput() {
  const val = document.getElementById('home-track-input').value.trim();
  if (!val) {
    showToast("⚠️ Please enter Application Reference ID.");
    return;
  }
  window.location.href = `apply.html?step=8&appId=${encodeURIComponent(val)}`;
}

function toggleFaqAccordion(num) {
  const ans = document.getElementById(`faq-ans-${num}`);
  const icon = document.getElementById(`faq-icon-${num}`);
  if (ans) {
    const isHidden = ans.style.display === 'none';
    ans.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.innerText = isHidden ? '➖' : '➕';
  }
}

// 8-STEP WIZARD ENGINE FOR apply.html
function setWizardStep(stepNum) {
  appState.wizardStep = stepNum;

  for (let i = 1; i <= 8; i++) {
    const stepHead = document.getElementById(`flow-step-${i}`);
    const stepContent = document.getElementById(`flow-content-${i}`);

    if (stepHead) {
      stepHead.classList.remove('active', 'completed');
      if (i < stepNum) stepHead.classList.add('completed');
      else if (i === stepNum) stepHead.classList.add('active');
    }

    if (stepContent) {
      stepContent.style.display = i === stepNum ? 'block' : 'none';
    }
  }

  if (stepNum === 4) renderDocCards();
  if (stepNum === 7) updateSummaryTable();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectSchemeInWizard(schemeId) {
  appState.loanData.selectedScheme = schemeId;
  document.querySelectorAll('.scheme-selectable-card').forEach(card => card.classList.remove('selected'));
  const targetCard = document.getElementById(`card-scheme-${schemeId}`);
  if (targetCard) targetCard.classList.add('selected');
  showToast(`Selected ${schemeId} scheme.`);
}

// AUTHENTICATION MODAL ENGINE
function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'flex';
    switchAuthTab(tab);
  }
}

function closeAuthModal(e) {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('form-auth-login');
  const regForm = document.getElementById('form-auth-register');
  const loginTab = document.getElementById('auth-tab-login');
  const regTab = document.getElementById('auth-tab-register');

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (regForm) regForm.style.display = 'none';
    if (loginTab) loginTab.classList.add('active');
    if (regTab) regTab.classList.remove('active');
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (regForm) regForm.style.display = 'block';
    if (loginTab) loginTab.classList.remove('active');
    if (regTab) regTab.classList.add('active');
  }
}

async function handleAuthLogin(e) {
  e.preventDefault();
  const email = document.getElementById('auth-login-email').value.trim();
  const password = document.getElementById('auth-login-password').value;
  const role = document.getElementById('auth-login-role').value;

  const res = await apiCall('/auth/login', 'POST', { email, password });

  if (res && res.access_token) {
    appState.user = res;
    localStorage.setItem('js_user', JSON.stringify(res));
    updateUserNavUI();
    closeAuthModal();
    showToast(`✓ Logged in as ${res.full_name} (${res.role})!`);
  } else {
    appState.user = {
      email,
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: role
    };
    localStorage.setItem('js_user', JSON.stringify(appState.user));
    updateUserNavUI();
    closeAuthModal();
    showToast(`✓ Logged in as ${appState.user.full_name}!`);
  }
}

async function handleAuthRegister(e) {
  e.preventDefault();
  const full_name = document.getElementById('auth-reg-name').value.trim();
  const email = document.getElementById('auth-reg-email').value.trim();
  const password = document.getElementById('auth-reg-pass').value;

  const res = await apiCall('/auth/register', 'POST', {
    full_name,
    email,
    password,
    role: "APPLICANT"
  });

  if (res && res.access_token) {
    appState.user = res;
    localStorage.setItem('js_user', JSON.stringify(res));
    updateUserNavUI();
    closeAuthModal();
    showToast(`✓ Registered & Logged in as ${full_name}!`);
  } else {
    appState.user = { email, full_name, role: "APPLICANT" };
    localStorage.setItem('js_user', JSON.stringify(appState.user));
    updateUserNavUI();
    closeAuthModal();
    showToast(`✓ Account created for ${full_name}!`);
  }
}

function logoutUser() {
  appState.user = null;
  localStorage.removeItem('js_user');
  updateUserNavUI();
  showToast("Logged out successfully.");
}

function updateUserNavUI() {
  const box = document.getElementById('nav-actions-box');
  const mobileControls = document.querySelector('.mobile-navbar-right-controls');
  const mobileActionsBox = document.querySelector('.mobile-nav-actions-box');

  if (appState.user) {
    if (box) {
      box.innerHTML = `
        <div class="user-profile-badge" onclick="logoutUser()">
          👤 ${appState.user.full_name} <span style="font-size:0.65rem; color:#dc2626;">(Logout)</span>
        </div>
        <select id="lang-select" onchange="changeLanguage(this.value)" style="background:transparent; color:#1e3a8a; border:1.5px solid #cbd5e1; padding:4px 8px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
          <option value="en">English ▾</option>
          <option value="hi">हिन्दी</option>
        </select>
      `;
    }
    if (mobileControls) {
      mobileControls.innerHTML = `
        <div class="user-profile-badge" style="font-size:0.75rem; padding:0.3rem 0.6rem;" onclick="logoutUser()">
          👤 ${appState.user.full_name.split(' ')[0]} <span style="font-size:0.6rem; color:#dc2626;">✖</span>
        </div>
        <button class="gov-hamburger-btn" id="mobileMenuBtn" onclick="toggleMobileMenu()" aria-label="Toggle Navigation">☰</button>
      `;
    }
    if (mobileActionsBox) {
      mobileActionsBox.innerHTML = `
        <button class="btn-gov-outline" style="width:100%; text-align:center;" onclick="logoutUser()">Logout (${appState.user.full_name})</button>
        <select onchange="changeLanguage(this.value)">
          <option value="en">🌐 English</option>
          <option value="hi">हिन्दी</option>
        </select>
      `;
    }
  } else {
    if (box) {
      box.innerHTML = `
        <button class="btn-js-login" onclick="openAuthModal('login')">Login</button>
        <button class="btn-js-register" onclick="openAuthModal('register')">Register</button>
        <select id="lang-select" onchange="changeLanguage(this.value)" style="background:transparent; color:#1e3a8a; border:1.5px solid #cbd5e1; padding:4px 8px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
          <option value="en">English ▾</option>
          <option value="hi">हिन्दी</option>
        </select>
      `;
    }
    if (mobileControls) {
      mobileControls.innerHTML = `
        <button class="btn-js-login mobile-nav-login-btn" onclick="openAuthModal('login')">🔑 Login</button>
        <button class="gov-hamburger-btn" id="mobileMenuBtn" onclick="toggleMobileMenu()" aria-label="Toggle Navigation">☰</button>
      `;
    }
    if (mobileActionsBox) {
      mobileActionsBox.innerHTML = `
        <button class="btn-js-register" onclick="openAuthModal('register')">📝 Register</button>
        <select onchange="changeLanguage(this.value)">
          <option value="en">🌐 English</option>
          <option value="hi">हिन्दी</option>
        </select>
      `;
    }
  }
}

// GRIEVANCES ENGINE
function switchGrvTab(tab) {
  const regContent = document.getElementById('grv-content-register');
  const trackContent = document.getElementById('grv-content-track');
  const regBtn = document.getElementById('grv-tab-register-btn');
  const trackBtn = document.getElementById('grv-tab-track-btn');

  if (tab === 'register') {
    if (regContent) regContent.style.display = 'block';
    if (trackContent) trackContent.style.display = 'none';
    if (regBtn) regBtn.classList.add('active');
    if (trackBtn) trackBtn.classList.remove('active');
  } else {
    if (regContent) regContent.style.display = 'none';
    if (trackContent) trackContent.style.display = 'block';
    if (regBtn) regBtn.classList.remove('active');
    if (trackBtn) trackBtn.classList.add('active');
  }
}

function selectGrvUserType(type) {
  appState.grvUserType = type;
  document.querySelectorAll('.user-type-pill').forEach(p => p.classList.remove('active'));
  const activePill = document.getElementById(`pill-utype-${type}`);
  if (activePill) activePill.classList.add('active');
}

function sendGrvOtp() {
  const mobileInput = document.getElementById('grv-mobile');
  if (!mobileInput || mobileInput.value.length < 10) {
    showToast("⚠️ Enter valid 10-digit mobile number first.");
    return;
  }
  const otpBox = document.getElementById('grv-otp-box');
  if (otpBox) otpBox.style.display = 'flex';
  showToast(`⚡ OTP code 4921 sent to +91 ${mobileInput.value}`);
}

function handleGrievanceFormSubmit(e) {
  e.preventDefault();
  const captcha = document.getElementById('grv-captcha-input').value.trim();
  if (captcha !== '8492') {
    showToast("⚠️ Security Captcha code is incorrect. Type 8492.");
    return;
  }

  const grvId = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullname = document.getElementById('grv-fullname').value;
  const category = document.getElementById('grv-category').value;
  const bank = document.getElementById('grv-bank').value;

  showToast(`🎉 Grievance Registered! Ticket ID: ${grvId}`);

  document.getElementById('res-grv-id').innerText = grvId;
  document.getElementById('res-grv-name').innerText = fullname;
  document.getElementById('res-grv-cat').innerText = category;
  document.getElementById('res-grv-bank').innerText = bank;
  document.getElementById('res-grv-date').innerText = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  document.getElementById('res-grv-status').innerText = "IN PROGRESS";

  switchGrvTab('track');
}

function handleTrackGrievanceSearch(e) {
  e.preventDefault();
  const searchVal = document.getElementById('track-grv-input').value.trim();
  showToast(`🔍 Searching status for ${searchVal}...`);
  const resBox = document.getElementById('grv-ticket-result-box');
  if (resBox) resBox.style.display = 'block';
}

// STEP 3: AI ELIGIBILITY HANDLER
async function handleWizardStep3_AI(e) {
  e.preventDefault();
  clearErrors();

  const fullname = document.getElementById('wiz-fullname').value.trim();
  const biztype = document.getElementById('wiz-biztype').value;
  const turnover = parseFloat(document.getElementById('wiz-turnover').value);
  const age = parseInt(document.getElementById('wiz-age').value);

  let hasError = false;

  if (fullname.length < 2) {
    showError('wiz-fullname', 'err-wiz-fullname', 'Enter a valid applicant name.');
    hasError = true;
  }

  if (isNaN(turnover) || turnover < 10000 || turnover > 50000000) {
    showError('wiz-turnover', 'err-wiz-turnover', 'Annual turnover must be between ₹ 10,000 and ₹ 5 Cr.');
    hasError = true;
  }

  if (isNaN(age) || age < 18 || age > 70) {
    showError('wiz-age', 'err-wiz-age', 'Age must be between 18 and 70.');
    hasError = true;
  }

  if (hasError) return false;

  appState.loanData.fullName = fullname;
  appState.loanData.businessType = biztype;
  appState.loanData.annualTurnover = turnover;

  showToast("✓ AI Eligibility evaluated: 84% Match Score!");
  setWizardStep(4);
}

// DOCUMENT CARDS RENDERER & REAL UPLOAD
function renderDocCards() {
  const container = document.getElementById('docs-grid-container');
  if (!container) return;

  container.innerHTML = appState.documents.map(doc => {
    const isVerified = doc.status === 'Verified';
    const badgeClass = isVerified ? 'gov-badge-green' : doc.status === 'Needs Review' ? 'gov-badge-orange' : 'gov-badge-blue';

    return `
      <div class="doc-card">
        <div>
          <div class="doc-card-header" style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <div>
              <div class="doc-title" style="font-weight:800; font-size:0.9rem; color:#1e3a8a;">${doc.name}</div>
              <div style="font-size:0.7rem; color:#64748b; font-weight:700;">${doc.category}</div>
            </div>
            <span class="gov-badge ${badgeClass}" id="badge-doc-${doc.id}">${doc.status}</span>
          </div>

          <div class="doc-meta-info" id="meta-doc-${doc.id}" style="font-size:0.75rem; color:#475569; margin-bottom:0.75rem;">
            📄 ${doc.fileName || 'No file selected'} ${doc.fileSize ? `• ${doc.fileSize}` : ''}
          </div>
        </div>

        <div class="doc-actions-row">
          <input type="file" id="file-input-${doc.id}" accept=".pdf,.png,.jpg,.jpeg" onchange="handleRealFileUpload(event, '${doc.id}')" style="display:none;">
          <button type="button" class="btn-doc-upload" onclick="document.getElementById('file-input-${doc.id}').click()">
            📤 Upload / Replace
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function handleRealFileUpload(event, docId) {
  const file = event.target.files[0];
  if (!file) return;

  const doc = appState.documents.find(d => d.id === docId);
  if (!doc) return;

  showToast(`📤 Uploading real file: ${file.name}...`);

  doc.fileName = file.name;
  doc.fileSize = `${(file.size / 1024).toFixed(1)} KB`;
  doc.status = "Verified";

  renderDocCards();
  showToast(`✓ File ${file.name} uploaded & verified!`);
}

// STEP 7: SUMMARY & FINAL SUBMISSION
function updateSummaryTable() {
  const schemeEl = document.getElementById('sum-scheme');
  const amountEl = document.getElementById('sum-amount');
  const emiEl = document.getElementById('sum-emi');
  if (schemeEl) schemeEl.innerText = appState.loanData.selectedScheme;
  if (amountEl) amountEl.innerText = `₹ ${appState.loanData.loanAmount.toLocaleString('en-IN')}`;
  if (emiEl) emiEl.innerText = `₹ ${appState.loanData.estimatedEmi.toLocaleString('en-IN')}`;
}

async function submitFinalApplication() {
  const chk = document.getElementById('chk-confirm');
  if (chk && !chk.checked) {
    showToast("⚠️ Please check the confirmation checkbox to submit.");
    return;
  }

  const res = await apiCall('/applications/submit', 'POST', {
    selected_scheme: appState.loanData.selectedScheme,
    loan_amount: appState.loanData.loanAmount,
    tenure_months: 36,
    purpose: "Business Expansion",
    full_name: appState.loanData.fullName,
    business_name: appState.loanData.businessName
  });

  const appId = res?.applicationId || "MUDRA-2026-08421";
  appState.loanData.applicationId = appId;
  const trackTxt = document.getElementById('track-appid-text');
  if (trackTxt) trackTxt.innerText = appId;

  showToast(`🎉 Loan Application Submitted! Application ID: ${appId}`);
  setWizardStep(8);
}

// STEP 8: ACTIONS & DISBURSEMENT
async function triggerSimulateApproval() {
  const appId = appState.loanData.applicationId;
  await apiCall(`/admin/applications/${appId}/approve`, 'POST');
  const el = document.getElementById('track-status-text');
  if (el) {
    el.innerText = "APPROVED";
    el.style.color = "#059669";
  }
  showToast("🎉 Loan Application Approved by Nodal Officer!");
}

async function triggerSimulateDisbursement() {
  const appId = appState.loanData.applicationId;
  const res = await apiCall(`/admin/applications/${appId}/disburse`, 'POST');
  appState.loanData.transactionRef = res?.transactionRef || "TXN354927502";
  const el = document.getElementById('track-status-text');
  if (el) {
    el.innerText = "DISBURSED";
    el.style.color = "#0284c7";
  }
  showToast(`💰 ₹ ${appState.loanData.loanAmount.toLocaleString('en-IN')} Disbursed to Bank Account! Ref: ${appState.loanData.transactionRef}`);
}

function downloadSanctionLetter() {
  const text = `CREDITSAMARTH NATIONAL PORTAL FOR CREDIT LINKED SCHEMES\nIn-Principle Sanction Letter & Disbursement Receipt\nApplication ID: ${appState.loanData.applicationId}\nApplicant Name: ${appState.loanData.fullName}\nScheme: ${appState.loanData.selectedScheme}\nSanctioned Amount: ₹ ${appState.loanData.loanAmount.toLocaleString('en-IN')}\nTransaction Ref: ${appState.loanData.transactionRef}\nStatus: APPROVED & DISBURSED`;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Sanction_Letter_${appState.loanData.applicationId}.txt`;
  a.click();
  showToast("Downloaded Official Approval Letter!");
}

// EMI CALCULATOR MATH
function updateEmiCalculator() {
  const rangeAmount = document.getElementById('calc-range-amount');
  if (!rangeAmount) return;

  const p = parseFloat(rangeAmount.value);
  const n = parseInt(document.getElementById('calc-range-tenure').value);
  const rAnn = parseFloat(document.getElementById('calc-range-rate').value);

  document.getElementById('calc-disp-amount').innerText = `₹ ${p.toLocaleString('en-IN')}`;
  document.getElementById('calc-disp-tenure').innerText = `${n} Months`;
  document.getElementById('calc-disp-rate').innerText = `${rAnn.toFixed(2)}%`;

  const r = (rAnn / 12) / 100;
  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayable = emi * n;
  const totalInterest = totalPayable - p;

  appState.loanData.loanAmount = p;
  appState.loanData.estimatedEmi = emi;

  document.getElementById('calc-result-emi').innerText = `₹ ${emi.toLocaleString('en-IN')}`;
  document.getElementById('calc-result-interest').innerText = `₹ ${totalInterest.toLocaleString('en-IN')}`;
  document.getElementById('calc-result-total').innerText = `₹ ${totalPayable.toLocaleString('en-IN')}`;
}

function prefillRahulKumarData() {
  const fullnameInput = document.getElementById('wiz-fullname');
  if (fullnameInput) fullnameInput.value = "Rahul Kumar";
  const turnoverInput = document.getElementById('wiz-turnover');
  if (turnoverInput) turnoverInput.value = "600000";
  const ageInput = document.getElementById('wiz-age');
  if (ageInput) ageInput.value = "28";

  clearErrors();
  showToast("Rahul Kumar demo dataset prefilled!");
}

function showError(fieldId, errId, msg) {
  const inputEl = document.getElementById(fieldId);
  const errEl = document.getElementById(errId);
  if (inputEl) inputEl.classList.add('is-invalid');
  if (errEl) {
    errEl.innerText = msg;
    errEl.classList.add('visible');
  }
}

function clearErrors() {
  document.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));
}

function toggleVoiceModal() {
  showToast("Voice Guide activated.");
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function toggleMobileMenu() {
  const navMenu = document.querySelector('.gov-nav-menu');
  const btn = document.getElementById('mobileMenuBtn');
  if (navMenu) {
    navMenu.classList.toggle('mobile-open');
    const isOpen = navMenu.classList.contains('mobile-open');
    if (btn) {
      btn.innerHTML = isOpen ? '✖' : '☰';
    }
  }
}

const HINDI_TRANSLATIONS = {
  // Navigation & Header
  "Government of India": "भारत सरकार",
  "Ministry of Finance • Department of Financial Services": "वित्त मंत्रालय • वित्तीय सेवा विभाग",
  "Ministry of Finance": "वित्त मंत्रालय",
  "Department of Financial Services": "वित्तीय सेवा विभाग",
  "Auto-Fill Demo Data": "⚡ डेमो डेटा भरें",
  "Voice Guide": "🎙 वॉयस गाइड",
  "Helpline: 1800-11-3456": "हेल्पलाइन: 1800-11-3456",
  "Home": "होम",
  "Schemes ▾": "योजनाएं ▾",
  "Schemes": "योजनाएं",
  "Schemes Catalog": "योजनाएं कैटलॉग",
  "Credit Schemes": "ऋण योजनाएं",
  "Check Loan Eligibility": "पात्रता जांचें",
  "The Process": "आवेदन प्रक्रिया",
  "Grievances": "शिकायत निवारण",
  "Grievance Redressal": "शिकायत निवारण",
  "Track Application": "आवेदन ट्रैक करें",
  "Borrower Portal": "ऋणदाता पोर्टल",
  "Login": "लॉगिन",
  "Register": "पंजीकरण",
  "Search credit schemes...": "ऋण योजनाएं खोजें...",
  "EMI Calculator": "ईएमआई कैलकुलेटर",
  "All Credit Schemes Catalog": "सभी क्रेडिट योजनाएं कैटलॉग",
  "Support & Grievance Portal": "सहायता और शिकायत पोर्टल",
  "The Process Walkthrough": "प्रक्रिया निर्देशिका",
  "View All 17 Government Schemes": "सभी 17 सरकारी योजनाएं देखें",
  "Explore full catalog & criteria": "पूरा कैटलॉग और पात्रता देखें",
  "Loans up to ₹10 Lakhs (100% Collateral Free)": "₹10 लाख तक का ऋण (100% बिना गारंटी)",
  "Up to ₹50 Lakhs (15% to 35% Subsidy)": "₹50 लाख तक (15% से 35% सब्सिडी)",
  "35% Credit-Linked Capital Subsidy": "35% क्रेडिट-लिंक्ड कैपिटल सब्सिडी",
  "Interest Subsidy up to 6.5% for Home Loans": "होम लोन के लिए 6.5% तक ब्याज सब्सिडी",
  "Crop Loan & Fisheries Credit": "फसल ऋण और मत्स्य पालन क्रेडिट",

  // Stepper Titles (apply.html)
  "Journey Start": "यात्रा शुरू",
  "Scheme Select": "योजना चयन",
  "AI Eligibility": "एआई पात्रता",
  "Upload Docs": "दस्तावेज़ अपलोड",
  "AI Verification": "एआई सत्यापन",
  "Risk / Credit": "जोखिम / क्रेडिट",
  "Submission": "आवेदन जमा करें",
  "Tracking": "ट्रैकिंग",

  // Apply Page Headers & Steps
  "FAST-TRACK DIGITAL LOAN WIZARD": "फास्ट-ट्रैक डिजिटल लोन विजार्ड",
  "National Credit Linked Loan Application Portal": "राष्ट्रीय क्रेडिट लिंक ऋण आवेदन पोर्टल",
  "Complete your 8-step digital loan application with AI eligibility engine, instant document verification, and direct submission to 300+ partner banks.": "एआई पात्रता इंजन, त्वरित दस्तावेज सत्यापन और 300+ भागीदार बैंकों में प्रत्यक्ष आवेदन के साथ अपना 8-स्तरीय डिजिटल ऋण आवेदन पूरा करें।",
  "STEP 1 OF 8": "चरण 1 / 8",
  "STEP 2 OF 8": "चरण 2 / 8",
  "STEP 3 OF 8": "चरण 3 / 8",
  "STEP 4 OF 8": "चरण 4 / 8",
  "STEP 5 OF 8": "चरण 5 / 8",
  "STEP 6 OF 8": "चरण 6 / 8",
  "STEP 7 OF 8": "चरण 7 / 8",
  "STEP 8 OF 8": "चरण 8 / 8",
  
  "Entrepreneur & Business Registration": "उद्यमी और व्यवसाय पंजीकरण",
  "Please provide key personal and enterprise credentials for government scheme eligibility matching": "सरकारी योजना पात्रता मिलान के लिए कृपया व्यक्तिगत और व्यावसायिक विवरण दर्ज करें",
  
  "Full Legal Name (as per Aadhaar)": "पूरा कानूनी नाम (आधार के अनुसार)",
  "Father's / Spouse Name": "पिता / पति का नाम",
  "Date of Birth": "जन्म तिथि",
  "Gender": "लिंग",
  "Select Gender": "लिंग चुनें",
  "Male": "पुरुष",
  "Female": "महिला",
  "Transgender": "ट्रांसजेंडर",
  "Social Category": "सामाजिक श्रेणी",
  "Select Social Category": "सामाजिक श्रेणी चुनें",
  "General": "सामान्य",
  "OBC (Other Backward Classes)": "ओबीसी (अन्य पिछड़ा वर्ग)",
  "SC (Scheduled Caste)": "एससी (अनुसूचित जाति)",
  "ST (Scheduled Tribe)": "एसटी (अनुसूचित जनजाति)",
  "Minority": "अल्पसंख्यक",
  "Mobile Number (Aadhaar Linked)": "मोबाइल नंबर (आधार से लिंक)",
  "Email Address": "ईमेल पता",
  "Aadhaar Card Number": "आधार कार्ड नंबर",
  "PAN Card Number": "पैन कार्ड नंबर",
  "Business Enterprise Name": "व्यवसाय का नाम",
  "Constitution of Enterprise": "व्यवसाय का प्रकार",
  "Select Enterprise Type": "व्यवसाय प्रकार चुनें",
  "Proprietorship": "प्रोप्राइटरशिप (एकल स्वामित्व)",
  "Partnership": "पार्टनरशिप",
  "LLP / Private Limited": "एलएलपी / प्राइवेट लिमिटेड",
  "Self Help Group (SHG)": "स्वयं सहायता समूह (SHG)",
  "Select Loan Scheme Category": "ऋण योजना श्रेणी चुनें",
  "Business Loan (MUDRA / PMEGP)": "व्यवसाय ऋण (मुद्रा / पीएमईजीपी)",
  "Food Processing Loan (PMFME)": "खाद्य प्रसंस्करण ऋण (पीएमएफएमई)",
  "Street Vendor Loan (PM SVANidhi)": "स्ट्रीट वेंडर ऋण (पीएम स्वनिधि)",
  "Agri Infrastructure Loan": "कृषि अवसंरचना ऋण",
  "Required Loan Amount (₹)": "आवश्यक ऋण राशि (₹)",
  
  "Proceed to Scheme Selection ➔": "योजना चयन के लिए आगे बढ़ें ➔",
  "Select Suitable Credit Scheme": "उपयुक्त क्रेडिट योजना चुनें",
  "Choose from Central Govt credit guarantee schemes based on your business sector": "अपने क्षेत्र के अनुसार केंद्र सरकार की क्रेडिट गारंटी योजनाओं में से चुनें",
  "Max Loan Limit:": "अधिकतम ऋण सीमा:",
  "Govt Subsidy:": "सरकारी सब्सिडी:",
  "Select Scheme": "योजना चुनें",
  "Selected": "चयनित",
  "Back": "पीछे जाएं",
  "Proceed to AI Eligibility Check ➔": "एआई पात्रता जांच के लिए आगे बढ़ें ➔",
  
  "AI Pre-Eligibility & Risk Assessment": "एआई पूर्व-पात्रता और जोखिम मूल्यांकन",
  "Our AI recommendation engine is analyzing your profile against Department of Financial Services norms": "हमारा एआई इंजन वित्तीय सेवा विभाग के नियमों के अनुसार आपकी प्रोफ़ाइल का विश्लेषण कर रहा है",
  "Run AI Eligibility Engine": "एआई पात्रता इंजन चलाएं",
  "AI Pre-Approval Score": "एआई पूर्व-स्वीकृति स्कोर",
  "High Approval Probability": "उच्च स्वीकृति संभावना",
  "Eligible Scheme Matched": "पात्र योजना का मिलान हुआ",
  "Recommended Subsidy Linkage": "अनुशंसित सब्सिडी लिंक",
  "Estimated In-Principle Sanction Time": "अनुमानित सैद्धांतिक मंजूरी समय",
  "5 to 10 Minutes": "5 से 10 मिनट",
  "Proceed to Document Upload ➔": "दस्तावेज़ अपलोड के लिए आगे बढ़ें ➔",
  
  "Upload Required Documents": "आवश्यक दस्तावेज़ अपलोड करें",
  "Please upload the required documents as per selected scheme": "कृपया चयनित योजना के अनुसार आवश्यक दस्तावेज़ अपलोड करें",
  "Identity Proof": "पहचान प्रमाण",
  "Tax Identification": "कर पहचान",
  "Income & Turnover": "आय और टर्नओवर",
  "Business Proof": "व्यवसाय का प्रमाण",
  "Cost Estimation": "परियोजना लागत अनुमान",
  "Upload File": "फ़ाइल अपलोड करें",
  "Verified": "सत्यापित",
  "Proceed to AI Verification ➔": "एआई सत्यापन के लिए आगे बढ़ें ➔",
  
  "Automated Document OCR & Verification": "ऑटोमेटेड दस्तावेज़ ओसीआर और सत्यापन",
  "AI engine is extracting data from uploaded PDF/Image documents and cross-verifying with UIDAI & NSDL": "एआई इंजन अपलोड किए गए दस्तावेजों से डेटा निकाल रहा है और यूआईडीएआई और एनएसडीएल से सत्यापन कर रहा है",
  "Verify Documents with AI": "एआई के साथ दस्तावेज़ सत्यापित करें",
  "Verification Status": "सत्यापन स्थिति",
  "Aadhaar Identity Verification": "आधार पहचान सत्यापन",
  "MATCHED (UIDAI e-KYC Successful)": "सत्यापित (UIDAI e-KYC सफल)",
  "PAN Card Tax Registry Check": "पैन कार्ड टैक्स रजिस्ट्री जांच",
  "VERIFIED (NSDL Active Status)": "सत्यापित (NSDL सक्रिय स्थिति)",
  "Bank Statement Cash-Flow Analysis": "बैंक विवरण कैश-फ्लो विश्लेषण",
  "HEALTHY CASH FLOW DETECTED": "सकारात्मक कैश-फ्लो पाया गया",
  "Proceed to Risk & Credit Scoring ➔": "जोखिम और क्रेडिट स्कोरिंग के लिए आगे बढ़ें ➔",
  
  "Credit Bureau & Risk Score Assessment": "क्रेडिट ब्यूरो और जोखिम स्कोर मूल्यांकन",
  "Algorithmic credit risk model evaluating creditworthiness & repayment capacity": "ऋण पात्रता और पुनर्भुगतान क्षमता का मूल्यांकन करने वाला एल्गोरिदमिक जोखिम मॉडल",
  "Calculate Credit Score": "क्रेडिट स्कोर की गणना करें",
  "Credit Score (CIBIL / Experian equivalent)": "क्रेडिट स्कोर (सिबिल / एक्युफैक्स के समकक्ष)",
  "Risk Categorization": "जोखिम श्रेणी",
  "LOW RISK (Prime Borrower)": "कम जोखिम (उत्कृष्ट उधारकर्ता)",
  "Proceed to Final Submission ➔": "अंतिम आवेदन जमा करने के लिए आगे बढ़ें ➔",
  
  "Final Application Summary & Bank Submission": "अंतिम आवेदन सारांश और बैंक जमा",
  "Review application summary and choose your preferred lending partner bank": "आवेदन सारांश की समीक्षा करें और अपना पसंदीदा भागीदार बैंक चुनें",
  "Applicant Name": "आवेदक का नाम",
  "Selected Scheme": "चयनित योजना",
  "Requested Loan Amount": "अनुरोधित ऋण राशि",
  "AI Credit Score": "एआई क्रेडिट स्कोर",
  "KYC & Document Status": "केवाईसी और दस्तावेज़ स्थिति",
  "Select Preferred Bank": "पसंदीदा बैंक चुनें",
  "Submit Application to Banks ➔": "बैंकों को आवेदन जमा करें ➔",
  
  "Digital In-Principle Sanction Letter": "डिजिटल सैद्धांतिक मंजूरी पत्र",
  "Congratulations! Your loan application has been In-Principle Approved digitally.": "बधाई हो! आपका ऋण आवेदन डिजिटल रूप से सैद्धांतिक रूप से स्वीकृत हो गया है।",
  "Application Reference ID": "आवेदन संदर्भ आईडी",
  "Sanctioned Amount": "स्वीकृत राशि",
  "Servicing Nodal Bank": "सेवा प्रदाता नोडल बैंक",
  "State Bank of India (Main Branch)": "भारतीय स्टेट बैंक (मुख्य शाखा)",
  "Download Sanction Letter (PDF)": "मंजूरी पत्र डाउनलोड करें (PDF)",
  "Track Live Application Status": "लाइव आवेदन स्थिति ट्रैक करें",
  "Track Another Application": "दूसरा आवेदन ट्रैक करें",

  // Schemes Catalog Page (schemes.html)
  "Official Government Catalog • DFS": "🏛 आधिकारिक सरकारी कैटलॉग • वित्तीय सेवा विभाग",
  "Government Sponsored Credit Schemes Catalog": "सरकार प्रायोजित क्रेडिट योजनाएं कैटलॉग",
  "Explore 17 Central & State Government Credit Schemes offering collateral-free loans up to ₹50 Lakhs, margin money subsidies up to 35%, and interest subventions for Micro Entrepreneurs.": "सूक्ष्म उद्यमियों के लिए ₹50 लाख तक के गारंटी-मुक्त ऋण, 35% तक मार्जिन मनी सब्सिडी और ब्याज सब्सिडी देने वाली 17 सरकारी योजनाओं का अन्वेषण करें।",
  "Instant Scheme Finder": "🔍 त्वरित योजना खोजें",
  "Search scheme name, subsidy, or limit...": "योजना का नाम, सब्सिडी या सीमा खोजें...",
  "All Schemes (17)": "सभी योजनाएं (17)",
  "💼 Business Activity (7)": "💼 व्यवसाय गतिविधि (7)",
  "🌾 Agriculture & Allied (4)": "🌾 कृषि और संबद्ध क्षेत्र (4)",
  "☀️ Infrastructure & Solar (3)": "☀️ अवसंरचना और सौर ऊर्जा (3)",
  "👨‍💼 Livelihood & MSME (2)": "👨‍💼 आजीविका और एमएसएमई (2)",
  "🏠 Housing Loan (1)": "🏠 आवास ऋण (1)",
  "Showing 17 of 17 Schemes": "17 में से 17 योजनाएं प्रदर्शित",
  "Filtered by Department of Financial Services": "वित्तीय सेवा विभाग द्वारा फ़िल्टर किया गया",
  "LOAN CEILING": "ऋण सीमा",
  "GUARANTEE COVER": "गारंटी कवर",
  "MARGIN SUBSIDY": "मार्जिन सब्सिडी",
  "CAPITAL SUBSIDY": "कैपिटल सब्सिडी",
  "SEED CAPITAL": "सीड कैपिटल",
  "INTEREST SUBSIDY": "ब्याज सब्सिडी",
  "BENEFICIARY": "लाभार्थी",
  "View Details": "विवरण देखें",
  "Apply Now ➔": "अब आवेदन करें ➔",
  "100% Collateral-Free": "100% गारंटी-मुक्त",
  "Up to 35% Capital": "35% तक कैपिटल",
  "35% Credit-Linked": "35% क्रेडिट-लिंक्ड",
  "Soft State Loan": "रियायती राज्य ऋण",
  "7% Subvention": "7% सब्सिडी",
  "SC/ST & Women": "एससी/एसटी और महिलाएं",
  "Up to ₹3.25 Lakh": "₹3.25 लाख तक",

  "Pradhan Mantri MUDRA Yojana": "प्रधानमंत्री मुद्रा योजना (PMMY)",
  "Collateral-free business loans up to ₹10 Lakhs for micro manufacturing & trading units under Shishu, Kishor, and Tarun categories.": "शिशु, किशोर और तरुण श्रेणियों के तहत सूक्ष्म विनिर्माण और व्यापारिक इकाइयों के लिए ₹10 लाख तक का संपार्श्विक-मुक्त व्यवसाय ऋण।",
  "PM Employment Generation": "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
  "Margin money subsidy scheme administered by KVIC for establishing new micro-enterprises in manufacturing & service sectors.": "विनिर्माण और सेवा क्षेत्रों में नई सूक्ष्म इकाइयों की स्थापना के लिए केवीआईसी द्वारा संचालित मार्जिन मनी सब्सिडी योजना।",
  "PM Food Processing (PMFME)": "पीएम खाद्य प्रसंस्करण योजना (PMFME)",
  "Financial and technical support for formalisation & expansion of micro food processing enterprises under ODOP framework.": "ओडीओपी ढांचे के तहत सूक्ष्म खाद्य प्रसंस्करण उद्यमों के औपचारिकीकरण और विस्तार के लिए वित्तीय और तकनीकी सहायता।",
  "CM Employment Generation": "मुख्यमंत्री रोजगार सृजन योजना (CMEGP)",
  "State-sponsored self-employment scheme offering seed capital and interest subvention for local rural & urban youth.": "स्थानीय ग्रामीण और शहरी युवाओं के लिए सीड कैपिटल और ब्याज सब्सिडी देने वाली राज्य-प्रायोजित स्वरोजगार योजना।",
  "PM Street Vendor's AtmaNirbhar": "पीएम स्ट्रीट वेंडर्स आत्मनिर्भर निधि (PM SVANidhi)",
  "Special micro-credit facility for urban street vendors offering 7% interest subsidy & digital transaction cashbacks.": "शहरी स्ट्रीट वेंडरों के लिए 7% ब्याज सब्सिडी और डिजिटल लेनदेन कैशबैक देने वाली विशेष माइक्रो-क्रेडिट सुविधा।",
  "Stand Up India Scheme": "स्टैंड अप इंडिया योजना",
  "Bank loans between ₹10 Lakh and ₹1 Crore to SC/ST and Women borrowers for setting up greenfield enterprises.": "ग्रीनफील्ड उद्यम स्थापित करने के लिए एससी/एसटी और महिला उधारकर्ताओं को ₹10 लाख से ₹1 करोड़ के बीच बैंक ऋण।",
  "Self Employment Rehabilitation": "स्वरोजगार पुनर्वास योजना (SRMS)",
  "Capital subsidy and credit for rehabilitation of beneficiaries into dignified alternative self-employment occupations.": "लाभार्थियों को सम्मानजनक वैकल्पिक स्वरोजगार व्यवसायों में पुनर्वासित करने के लिए पूंजीगत सब्सिडी और ऋण।",
  "Kisan Credit Card (KCC)": "किसान क्रेडिट कार्ड (KCC)",
  "Timely short-term crop credit and fisheries/animal husbandry working capital loan at 4% concessional interest rate.": "4% रियायती ब्याज दर पर समय पर अल्पकालिक फसल ऋण और मत्स्य पालन/पशुपालन कार्यशील पूंजी ऋण।",

  // Scheme Details Page
  "BUSINESS LOAN SCHEME": "व्यवसाय ऋण योजना",
  "Nodal Ministry: Department of Financial Services, Ministry of Finance, Govt. of India": "नोडल मंत्रालय: वित्तीय सेवा विभाग, वित्त मंत्रालय, भारत सरकार",
  "Apply for Scheme ➔": "योजना के लिए आवेदन करें ➔",
  "📌 Overview & Benefits": "📌 अवलोकन और लाभ",
  "🎯 Eligibility Criteria": "🎯 पात्रता मापदंड",
  "📁 Required Documents": "📁 आवश्यक दस्तावेज़",
  "❓ FAQs & Guidelines": "❓ अक्सर पूछे जाने वाले प्रश्न और दिशानिर्देश",
  "About the Scheme": "योजना के बारे में",
  "Key Highlights & Financial Assistance": "मुख्य विशेषताएं और वित्तीय सहायता",
  "MAXIMUM CREDIT LIMIT": "अधिकतम ऋण सीमा",
  "SUBSIDY / GUARANTEE COVER": "सब्सिडी / गारंटी कवर",
  "Shishu (up to ₹50k), Kishor (₹50k-₹5L), Tarun (₹5L-₹10L)": "शिशु (₹50 हजार तक), किशोर (₹50 हजार-₹5 लाख), तरुण (₹5 लाख-₹10 लाख)",
  "Covered under CGTMSE Trust": "CGTMSE ट्रस्ट के तहत कवर",
  "Who Can Apply?": "कौन आवेदन कर सकता है?",
  "Mandatory Documents Checklist": "अनिवार्य दस्तावेज़ चेकलिस्ट",
  "Aadhaar Card": "आधार कार्ड",
  "Identity & Address Proof": "पहचान और पता प्रमाण",
  "PAN Card": "पैन कार्ड",
  "Income Tax Identifier": "आयकर पहचानकर्ता",
  "Bank Statement (6 Months)": "बैंक विवरण (6 महीने)",
  "Financial Performance Proof": "वित्तीय प्रदर्शन प्रमाण",
  "Udyam Registration": "उद्यम पंजीकरण",
  "MSME Registration Certificate": "एमएसएमई पंजीकरण प्रमाण पत्र",

  // Index Page (Home)
  "Empowering Micro Entrepreneurs Across India": "पूरे भारत में सूक्ष्म उद्यमियों का सशक्तिकरण",
  "Real stories of transformation backed by Central Government credit assistance": "केंद्र सरकार की क्रेडिट सहायता से समर्थित वास्तविक सफलता की कहानियां",
  "Frequently Asked Questions (FAQ)": "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
  "Credit Schemes Catalog": "सभी क्रेडिट योजनाएं",
  "National Digital Loan Platform for Micro Entrepreneurs": "सूक्ष्म उद्यमियों के लिए राष्ट्रीय डिजिटल ऋण मंच",
  "Empowering MSMEs, Street Vendors & Artisans with 100% Collateral-Free Credit & Interest Subventions": "100% संपार्श्विक-मुक्त ऋण और ब्याज सब्सिडी के साथ एमएसएमई, स्ट्रीट वेंडरों और कारीगरों का सशक्तिकरण",
  "Apply for Loan Now ➔": "ऋण के लिए आवेदन करें ➔",
  "Explore Credit Schemes": "क्रेडिट योजनाएं देखें",
  "Instant Pre-Approval": "त्वरित पूर्व-स्वीकृति",
  "Minutes Digital Sanction": "मिनटों में डिजिटल मंजूरी",
  "Interest Subvention": "ब्याज सब्सिडी सहायता",
  "Govt Backed Benefit": "सरकारी समर्थित लाभ",
  "Collateral Free": "संपार्श्विक मुक्त (बिना गारंटी)",
  "Under Guarantee Trust": "गारंटी ट्रस्ट के तहत",
  "Calculate EMI": "ईएमआई की गणना करें",
  "Loan Amount:": "ऋण राशि:",
  "Interest Rate (% p.a.):": "ब्याज दर (% वार्षिक):",
  "Tenure (Years):": "अवधि (वर्ष):",
  "Monthly EMI:": "मासिक ईएमआई:",
  "Total Interest Payable:": "कुल देय ब्याज:",

  // Process & Grievances Pages
  "The 8-Step Application Process": "8-स्तरीय आवेदन प्रक्रिया",
  "Official Grievance Redressal Portal": "आधिकारिक शिकायत निवारण पोर्टल",
  "Lodge Grievance": "शिकायत दर्ज करें",
  "Track Grievance": "शिकायत स्थिति ट्रैक करें",
  "Search Grievance": "शिकायत खोजें",
  "Grievance Category": "शिकायत श्रेणी",
  "Select Grievance Category": "शिकायत श्रेणी चुनें",
  "Loan Sanction Delay": "ऋण स्वीकृति में देरी",
  "Bank Branch Refusal": "बैंक शाखा का इनकार",
  "Subsidy Credit Issue": "सब्सिडी क्रेडिट समस्या",
  "Documentation Problem": "दस्तावेज़ संबंधी समस्या",
  "Other Issue": "अन्य समस्या",
  "Grievance Description": "शिकायत का विवरण",
  "Submit Grievance Complaint ➔": "शिकायत दर्ज करें ➔",
  "Enter Grievance Reference Number": "शिकायत संदर्भ संख्या दर्ज करें",
  "Track Grievance Status ➔": "शिकायत की स्थिति जांचें ➔",

  // Footer
  "National Portal for Credit Linked Government Schemes, Department of Financial Services, Ministry of Finance, Government of India.": "क्रेडिट लिंक सरकारी योजनाओं के लिए राष्ट्रीय पोर्टल, वित्तीय सेवा विभाग, वित्त मंत्रालय, भारत सरकार।",
  "Quick Links": "त्वरित लिंक",
  "Policies & Helpdesk": "नीतियां और सहायता केंद्र",
  "© 2026 CreditSamarth National Portal for Credit Linked Schemes. All Rights Reserved.": "© 2026 क्रेडिटसमर्थ क्रेडिट लिंक्ड योजनाओं के लिए राष्ट्रीय पोर्टल। सर्वाधिकार सुरक्षित।",
  "Designed & Developed for Ministry of Finance, Government of India • Digital India 🇮🇳": "वित्त मंत्रालय, भारत सरकार के लिए डिज़ाइन्ड और विकसित • डिजिटल इंडिया 🇮🇳"
};

function applyTranslation(lang) {
  appState.language = lang;
  try {
    localStorage.setItem('js_lang', lang);
  } catch(e){}

  // Synchronize all language dropdowns on the page
  document.querySelectorAll('select[onchange*="changeLanguage"], #lang-select').forEach(sel => {
    sel.value = lang;
  });

  const translateElement = (el) => {
    if (!el) return;

    // Check input placeholders
    if (el.placeholder) {
      if (!el.getAttribute('data-orig-placeholder')) {
        el.setAttribute('data-orig-placeholder', el.placeholder);
      }
      const orig = el.getAttribute('data-orig-placeholder');
      if (lang === 'hi' && HINDI_TRANSLATIONS[orig]) {
        el.placeholder = HINDI_TRANSLATIONS[orig];
      } else if (lang === 'en' && orig) {
        el.placeholder = orig;
      }
    }

    // Process text nodes inside element
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.nodeValue.trim();
        if (txt) {
          if (!node._origText) {
            node._origText = txt;
          }
          const orig = node._origText;
          if (lang === 'hi') {
            if (HINDI_TRANSLATIONS[orig]) {
              node.nodeValue = node.nodeValue.replace(txt, HINDI_TRANSLATIONS[orig]);
            } else {
              for (const [enKey, hiVal] of Object.entries(HINDI_TRANSLATIONS)) {
                if (orig === enKey || txt === enKey) {
                  node.nodeValue = node.nodeValue.replace(txt, hiVal);
                  break;
                }
              }
            }
          } else if (lang === 'en' && orig) {
            node.nodeValue = node.nodeValue.replace(txt, orig);
          }
        }
      }
    });
  };

  const selectors = 'h1, h2, h3, h4, h5, h6, p, label, button, a, span, option, li, th, td, div, input[placeholder]';
  document.querySelectorAll(selectors).forEach(el => translateElement(el));
}

function changeLanguage(lang) {
  applyTranslation(lang);
  showToast(lang === 'hi' ? "भाषा बदलकर हिन्दी की गई।" : "Language updated to English.");
}

// INITIALIZATION & URL QUERY PARSER
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved language preference
  const savedLang = localStorage.getItem('js_lang');
  if (savedLang) {
    applyTranslation(savedLang);
  }

  // Mobile nav click listeners
  document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.gov-nav-menu');
    const btn = document.getElementById('mobileMenuBtn');
    if (navMenu && navMenu.classList.contains('mobile-open')) {
      if (!navMenu.contains(e.target) && (!btn || !btn.contains(e.target))) {
        navMenu.classList.remove('mobile-open');
        if (btn) btn.innerHTML = '☰';
      }
    }
  });

  const navLinks = document.querySelectorAll('.gov-nav-item, .dropdown-item');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.querySelector('.gov-nav-menu');
      const btn = document.getElementById('mobileMenuBtn');
      if (navMenu && navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        if (btn) btn.innerHTML = '☰';
      }
    });
  });

  const storedUser = localStorage.getItem('js_user');
  if (storedUser) {
    try {
      appState.user = JSON.parse(storedUser);
      updateUserNavUI();
    } catch (e) {}
  }

  updateEmiCalculator();

  if (window.location.pathname.includes('scheme-detail.html')) {
    loadSchemeDetailData();
  }

  // If on apply.html page, parse query params
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = parseInt(urlParams.get('step'));
  const schemeParam = urlParams.get('scheme');
  const appIdParam = urlParams.get('appId');

  if (schemeParam) {
    appState.loanData.selectedScheme = schemeParam;
  }

  if (appIdParam) {
    appState.loanData.applicationId = appIdParam;
    const txt = document.getElementById('track-appid-text');
    if (txt) txt.innerText = appIdParam;
  }

  if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= 8) {
    setWizardStep(stepParam);
  }
});
