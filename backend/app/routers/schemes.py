from fastapi import APIRouter

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

GOVERNMENT_SCHEMES_LIST = [
  {
    "id": "MUDRA",
    "name": "MUDRA Loan Scheme",
    "fullName": "Pradhan Mantri MUDRA Yojana (PMMY)",
    "tagline": "Funding the Unfunded for Micro Enterprises",
    "maxLoan": "₹10,00,000",
    "maxLoanAmount": 1000000,
    "subsidy": "Collateral-Free Guarantee",
    "category": "Micro & Small Businesses",
    "interestRate": "8.40% - 11.50% p.a.",
    "tenure": "up to 5 Years",
    "badgeColor": "bg-blue-600",
    "badgeText": "Most Popular",
    "suitableFor": [
      "Retail & Kirana Stores",
      "Repair & Service Shops",
      "Handicrafts & Artisans",
      "Food Stalls & Vendors",
      "Small Transport Operators"
    ],
    "eligibilitySummary": [
      "Indian citizen aged 18 to 65 years",
      "Non-farm income generating micro activity",
      "No past bank loan default history",
      "Valid Aadhaar and PAN linkage"
    ],
    "keyBenefits": [
      "Zero Collateral Security needed",
      "Flexible repayment terms up to 60 months",
      "MUDRA Debit Card for easy working capital access",
      "Low processing fees and competitive interest rates"
    ],
    "description": "Designed to provide credit support to non-corporate, non-farm small/micro enterprises. Divided into Shishu (up to ₹50k), Kishore (₹50k to ₹5L), and Tarun (₹5L to ₹10L)."
  },
  {
    "id": "PMFME",
    "name": "PMFME Scheme",
    "fullName": "PM Formalisation of Micro Food Processing Enterprises",
    "tagline": "Empowering Micro Food Processing Sector",
    "maxLoan": "₹10,00,000",
    "maxLoanAmount": 1000000,
    "subsidy": "35% Capital Subsidy (Max ₹10 Lakhs)",
    "category": "Food Processing Enterprises",
    "interestRate": "8.50% - 10.75% p.a.",
    "tenure": "up to 7 Years",
    "badgeColor": "bg-emerald-600",
    "badgeText": "High Subsidy",
    "suitableFor": [
      "Bakery & Spice Grinding Units",
      "Grain & Rice Mills",
      "Fruit & Vegetable Processing",
      "Dairy Product Units",
      "Pickles & Snack Manufacturing"
    ],
    "eligibilitySummary": [
      "Existing or new micro food processing units",
      "Individual entrepreneurs, SHGs, FPOs, Cooperatives",
      "Ownership rights of enterprise site or long lease",
      "Minimum 10% entrepreneur contribution"
    ],
    "keyBenefits": [
      "35% Credit-linked Capital Subsidy",
      "Technical knowledge transfer & skill training",
      "Brand building & marketing support",
      "Handholding support by District Resource Persons"
    ],
    "description": "A flagship central scheme under Aatmanirbhar Bharat Abhiyan providing financial, technical and business support for micro food processing units."
  },
  {
    "id": "PMEGP",
    "name": "PMEGP Scheme",
    "fullName": "Prime Minister's Employment Generation Programme",
    "tagline": "Generate Employment through Self-Employment",
    "maxLoan": "₹50,00,000",
    "maxLoanAmount": 5000000,
    "subsidy": "15% to 35% Margin Money Subsidy",
    "category": "New Micro Enterprises",
    "interestRate": "9.00% - 12.00% p.a.",
    "tenure": "up to 7 Years",
    "badgeColor": "bg-amber-600",
    "badgeText": "High Capacity",
    "suitableFor": [
      "Manufacturing Units",
      "Agro-based Industries",
      "Handloom & Khadi Units",
      "Service & Trading Outlets",
      "Rural Cottage Industries"
    ],
    "eligibilitySummary": [
      "Individuals above 18 years of age",
      "At least VIII standard pass for projects > ₹10L (Mfg)",
      "Only for new micro enterprise projects",
      "No assistance under other govt subsidy schemes"
    ],
    "keyBenefits": [
      "Up to 35% Margin Money Subsidy for Special Categories",
      "Assistance for second loan up to ₹1 Crore for upgrade",
      "Nodal implementation through KVIC / KVIB / DIC",
      "EDP Training mandatory & fully supported"
    ],
    "description": "Credit-linked subsidy programme administered by Ministry of MSME to establish micro-enterprises and generate sustainable rural and urban employment."
  },
  {
    "id": "CMEGP",
    "name": "CMEGP Scheme",
    "fullName": "Chief Minister Employment Generation Programme",
    "tagline": "State-Backed Credit Support for Local Entrepreneurs",
    "maxLoan": "₹25,00,000",
    "maxLoanAmount": 2500000,
    "subsidy": "20% to 35% Capital Subsidy",
    "category": "Self-Employment & MSME",
    "interestRate": "8.75% - 11.25% p.a.",
    "tenure": "up to 5 Years",
    "badgeColor": "bg-purple-600",
    "badgeText": "State Focus",
    "suitableFor": [
      "Garment Tailoring Units",
      "Electronics Repair & Hardware",
      "Local Logistics & Transport",
      "Beauty & Wellness Outlets",
      "IT & Mobile Service Kiosks"
    ],
    "eligibilitySummary": [
      "Domicile resident of the state",
      "Age group 18 to 45 years (relaxation for reserved categories)",
      "Educational qualification minimum 10th pass",
      "Family annual income below prescribed state ceiling"
    ],
    "keyBenefits": [
      "Fast-track processing by State District Industries Center",
      "Special subsidy boosters for women & rural youth",
      "Single-window online approval and tracking",
      "Interest subvention of 2% for prompt repayments"
    ],
    "description": "State-sponsored self-employment initiative tailored to empower local youth with bankable credit lines, seed capital and capital subsidy."
  }
]

@router.get("")
def get_schemes():
    return GOVERNMENT_SCHEMES_LIST

@router.get("/{scheme_id}")
def get_scheme_by_id(scheme_id: str):
    for s in GOVERNMENT_SCHEMES_LIST:
        if s["id"].lower() == scheme_id.lower():
            return s
    return GOVERNMENT_SCHEMES_LIST[0]
