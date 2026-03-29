import type { Metadata } from "next";
import { buildPageMetadata, SITE_NAME, SITE_ALTERNATE_NAMES, absoluteUrl } from "./seo";

/** All indexable public URLs (must match `sitemap.ts` coverage). */
export const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/about",
  "/contact",
  "/support",
  "/terms-and-conditions",
  "/privacy-policy",
  "/company-information",
  "/company-information/private-limited",
  "/company-information/public-limited",
  "/company-information/one-person-company",
  "/company-information/section-8",
  "/company-information/nidhi-company",
  "/company-information/producer-company",
  "/registration",
  "/registration/gst-registration",
  "/registration/llp-registration",
  "/registration/partnership-firm",
  "/registration/sole-proprietorship",
  "/registration/msme-udyam-registration",
  "/registration/startup-india-registration",
  "/registration/ngo-registration",
  "/registration/epfo",
  "/registration/iec-registration",
  "/registration/digital-signature",
  "/registration/pan-apply",
  "/registration/tan-apply",
  "/registration/pt-tax",
  "/registration/esic",
  "/registration/industry-license",
  "/registration/gumusta-shop-registration",
  "/registration/fassai-food-license",
  "/taxation",
  "/taxation/income-tax",
  "/taxation/gst-filing",
  "/taxation/tds-returns",
  "/taxation/tax-planning",
  "/taxation/pt-tax-filing",
  "/taxation/corporate-tax-filing",
  "/taxation/payroll-tax",
  "/taxation/epfo-filing",
  "/taxation/esic-filing",
  "/trademark-iso",
  "/trademark-iso/trademark",
  "/trademark-iso/iso-9001",
  "/trademark-iso/iso-14001-certification",
  "/trademark-iso/copyright-registration",
  "/roc-returns",
  "/roc-returns/annual-filing",
  "/roc-returns/board-resolutions",
  "/roc-returns/director-changes",
  "/roc-returns/share-transfer",
  "/advisory",
  "/advisory/business-strategy-consulting",
  "/advisory/legal-compliance-advisory",
  "/advisory/financial-planning-analysis",
  "/advisory/digital-transformation",
  "/advisory/assistance-for-fund-raising",
  "/advisory/startup-mentoring",
  "/advisory/tax-plan-analysis",
  "/advisory/other-finance-related-services",
  "/advisory/hr-organizational-development",
  "/reports",
  "/reports/project-reports",
  "/reports/cma-reports",
  "/reports/dscr-reports",
  "/reports/bank-reconciliation",
  "/tools",
  "/tools/income-tax-calculator",
  "/tools/gst-calculator",
  "/tools/emi-calculator",
  "/tools/salary-calculator",
  "/tools/sip-calculator",
  "/tools/ppf-calculator",
  "/tools/rd-calculator",
  "/tools/nps-calculator",
  "/tools/epf-calculator",
  "/tools/hra-calculator",
  "/tools/home-loan-emi",
  "/tools/mutual-fund-calculator",
  "/tools/compound-interest",
  "/tools/currency-converter",
  "/tools/gst-number-search",
  "/tools/ifsc-code-search",
  "/tools/hsn-code-finder",
  "/tools/gst-search-by-name",
  "/tools/tax-saving",
  "/tools/it-refund-status",
  "/tools/rent-receipts",
  "/tools/gold-rates",
] as const;

export type PublicSitemapPath = (typeof PUBLIC_SITEMAP_PATHS)[number];

type SeoPageEntry = {
  title: string;
  description: string;
  keywords?: string[];
  /** Short name for Organization `hasOfferCatalog` (optional). */
  offerName?: string;
};

const brandKw = [SITE_NAME, ...SITE_ALTERNATE_NAMES];

const kw = (...terms: string[]) => [...brandKw, ...terms];

/** One row per public path except `/` (homepage uses root layout). */
export const SEO_REGISTRY: Record<string, SeoPageEntry> = {
  "/about": {
    title: "About Us – Trusted Business Registration & Compliance Partner",
    description:
      "Learn about Com Financial Services (CFS): company registration, GST, tax filing, trademark, and ROC compliance for startups and SMEs across India. Experienced team, transparent process.",
    offerName: "About Com Financial Services",
  },
  "/contact": {
    title: "Contact Us – Company Registration & Tax Support in India",
    description:
      "Get expert help for GST registration, private limited company setup, ITR filing, TDS, trademark, and MCA compliance. Request a callback from Com Financial Services (CFS) today.",
    keywords: kw("contact CA online India", "business registration help", "GST consultant India"),
    offerName: "Contact",
  },
  "/support": {
    title: "Support – Help with Registrations, Filings & Account",
    description:
      "How-to guides and support for Com Financial Services customers: track applications, documents, GST, tax, and company compliance queries. Fast responses from our team.",
    offerName: "Customer support",
  },
  "/terms-and-conditions": {
    title: "Terms and Conditions",
    description:
      "Terms and conditions for using Com Financial Services (CFS) website and professional services for business registration, taxation, and compliance in India.",
    offerName: "Terms and conditions",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Com Financial Services (CFS) collects, uses, and protects your personal data when you use our registration, tax, and compliance services in India.",
    offerName: "Privacy policy",
  },
  "/company-information": {
    title: "Company Registration Types in India – Private, OPC, LLP & More",
    description:
      "Compare Private Limited, Public Limited, OPC, Section 8, Nidhi, and Producer Company. Choose the right structure and register online with Com Financial Services (CFS).",
    keywords: kw("company registration India", "Pvt Ltd registration", "OPC vs LLP"),
    offerName: "Company registration guides",
  },
  "/company-information/private-limited": {
    title: "Private Limited Company Registration Online in India",
    description:
      "Incorporate a Private Limited Company with DIN, DSC, name approval, MOA/AOA, and SPICe+. End-to-end MCA compliance support from Com Financial Services (CFS).",
    keywords: kw("private limited company registration", "Pvt Ltd incorporation India", "SPICe+ filing"),
    offerName: "Private Limited registration",
  },
  "/company-information/public-limited": {
    title: "Public Limited Company Registration in India",
    description:
      "Set up a Public Limited Company for listing and large fundraising. Guidance on capital, directors, compliance, and MCA filings with Com Financial Services (CFS).",
    keywords: kw("public limited company India", "PLC registration", "listed company incorporation"),
    offerName: "Public Limited registration",
  },
  "/company-information/one-person-company": {
    title: "One Person Company (OPC) Registration Online India",
    description:
      "Register an OPC with a single director and limited liability. Fast name approval, incorporation, and post-compliance support from Com Financial Services (CFS).",
    keywords: kw("OPC registration India", "one person company", "solo founder company"),
    offerName: "OPC registration",
  },
  "/company-information/section-8": {
    title: "Section 8 Company (NGO) Registration in India",
    description:
      "Incorporate a non-profit Section 8 company for charitable objects. Licenses, MOA, and 80G/12A pathway guidance with Com Financial Services (CFS).",
    keywords: kw("Section 8 company registration", "NGO registration India", "non profit company"),
    offerName: "Section 8 company",
  },
  "/company-information/nidhi-company": {
    title: "Nidhi Company Registration & Compliance in India",
    description:
      "Start a Nidhi company for member borrowing and lending. MCA rules, minimum members, and ongoing ROC compliance with Com Financial Services (CFS).",
    keywords: kw("Nidhi company registration", "Nidhi compliance India"),
    offerName: "Nidhi company",
  },
  "/company-information/producer-company": {
    title: "Producer Company Registration in India",
    description:
      "Form a Producer Company for farmers and primary producers. Incorporation, shareholding, and cooperative-style governance with Com Financial Services (CFS).",
    keywords: kw("producer company registration India", "farmer producer company"),
    offerName: "Producer company",
  },
  "/registration": {
    title: "Business & Statutory Registrations – GST, LLP, MSME, PAN, TAN",
    description:
      "GST registration, LLP, partnership, sole proprietorship, MSME Udyam, Startup India, NGO, IEC, DSC, PAN, TAN, FSSAI, and more. Apply online across India with CFS.",
    keywords: kw("GST registration online", "LLP registration India", "MSME Udyam", "PAN apply online"),
    offerName: "Business registrations hub",
  },
  "/registration/gst-registration": {
    title: "GST Registration Online – Apply for GSTIN in India",
    description:
      "New business GST registration, voluntary GST, and turnover-based GSTIN. Document checklist, ARN tracking, and expert filing support from Com Financial Services (CFS).",
    keywords: kw("GST registration online", "GSTIN apply India", "new GST registration"),
    offerName: "GST registration",
  },
  "/registration/llp-registration": {
    title: "LLP Registration Online in India",
    description:
      "Limited Liability Partnership incorporation: partners, LLP agreement, FiLLiP filing, and DPIN. Affordable LLP setup with Com Financial Services (CFS).",
    keywords: kw("LLP registration India", "LLP incorporation online", "FiLLiP"),
    offerName: "LLP registration",
  },
  "/registration/partnership-firm": {
    title: "Partnership Firm Registration in India",
    description:
      "Register a partnership deed, obtain PAN, and comply with state requirements. Simple partnership setup for growing businesses with Com Financial Services (CFS).",
    keywords: kw("partnership firm registration India", "partnership deed registration"),
    offerName: "Partnership firm registration",
  },
  "/registration/sole-proprietorship": {
    title: "Sole Proprietorship Registration India",
    description:
      "Start as a sole proprietor: Udyam, GST, current account, and local licenses. Lightweight structure for freelancers and small traders via Com Financial Services (CFS).",
    keywords: kw("sole proprietorship India", "proprietorship registration", "small business setup"),
    offerName: "Sole proprietorship",
  },
  "/registration/msme-udyam-registration": {
    title: "MSME Udyam Registration Online – Udyam Certificate",
    description:
      "Free Udyam registration for micro, small, and medium enterprises. Instant certificate, government benefits, and tender eligibility with Com Financial Services (CFS).",
    keywords: kw("Udyam registration", "MSME registration online India", "udyam certificate"),
    offerName: "MSME Udyam registration",
  },
  "/registration/startup-india-registration": {
    title: "Startup India Registration & DPIIT Recognition",
    description:
      "Get DPIIT Startup India recognition: tax benefits, self-certification, IPR fast track, and funding readiness. Application support from Com Financial Services (CFS).",
    keywords: kw("Startup India registration", "DPIIT recognition", "startup certificate India"),
    offerName: "Startup India",
  },
  "/registration/ngo-registration": {
    title: "NGO Registration – Trust, Society & Section 8 in India",
    description:
      "Choose Trust, Society, or Section 8 for your NGO. Registration, bylaws, and compliance roadmap with Com Financial Services (CFS) advisory.",
    keywords: kw("NGO registration India", "trust registration", "society registration"),
    offerName: "NGO registration",
  },
  "/registration/epfo": {
    title: "EPFO Registration for Employers in India",
    description:
      "PF code and EPF employer registration, employee KYC, and monthly ECR readiness. Stay compliant with Com Financial Services (CFS).",
    keywords: kw("EPFO registration employer", "PF code registration India", "EPF establishment"),
    offerName: "EPFO registration",
  },
  "/registration/iec-registration": {
    title: "IEC Code Registration – Import Export Code Online India",
    description:
      "Apply for IEC with DGFT for import-export business. Digital IEC, AD code linking, and customs readiness with Com Financial Services (CFS).",
    keywords: kw("IEC registration", "import export code India", "DGFT IEC"),
    offerName: "IEC registration",
  },
  "/registration/digital-signature": {
    title: "Digital Signature Certificate (DSC) for MCA & GST",
    description:
      "Class 2/3 DSC for directors, GST, tenders, and ROC e-filing. Token delivery and video KYC guidance from Com Financial Services (CFS).",
    keywords: kw("DSC apply online India", "digital signature certificate MCA", "USB token DSC"),
    offerName: "Digital signature DSC",
  },
  "/registration/pan-apply": {
    title: "PAN Card Apply Online – New & Correction for Individuals & Business",
    description:
      "New PAN application, corrections, and duplicate PAN for individuals, firms, and companies. Form 49A/49AA support with Com Financial Services (CFS).",
    keywords: kw("PAN card apply online", "new PAN India", "company PAN application"),
    offerName: "PAN apply",
  },
  "/registration/tan-apply": {
    title: "TAN Registration Online for TDS Deductors",
    description:
      "Apply for TAN to deduct and deposit TDS. Form 49B, NSDL tracking, and employer compliance setup with Com Financial Services (CFS).",
    keywords: kw("TAN registration online", "TAN apply India", "TDS deductor TAN"),
    offerName: "TAN apply",
  },
  "/registration/pt-tax": {
    title: "Professional Tax (PT) Registration for Employers & Professionals",
    description:
      "State-wise professional tax registration for salaries and professions. Enrollment, returns, and payment calendar with Com Financial Services (CFS).",
    keywords: kw("professional tax registration India", "PT enrollment employer"),
    offerName: "Professional tax registration",
  },
  "/registration/esic": {
    title: "ESIC Registration for Employers in India",
    description:
      "ESI employer code, employee IP generation, and contribution rules for eligible establishments. Setup help from Com Financial Services (CFS).",
    keywords: kw("ESIC registration employer", "ESI code India", "employee state insurance registration"),
    offerName: "ESIC registration",
  },
  "/registration/industry-license": {
    title: "Industry & Trade Licenses in India",
    description:
      "Shop Act, factory, pollution, FSSAI, and sector-specific licenses. Identify what your business needs with Com Financial Services (CFS).",
    keywords: kw("trade license India", "industry license registration", "business license"),
    offerName: "Industry licenses",
  },
  "/registration/gumusta-shop-registration": {
    title: "Gumasta / Shop & Establishment Registration",
    description:
      "Maharashtra Gumasta and other state shop licences. Timelines, fees, and renewal reminders with Com Financial Services (CFS).",
    keywords: kw("Gumasta license", "shop establishment registration Maharashtra"),
    offerName: "Shop & establishment",
  },
  "/registration/fassai-food-license": {
    title: "FSSAI Food License Registration Online India",
    description:
      "Basic, state, and central FSSAI licences for food business operators. FoSCoS application and compliance support from Com Financial Services (CFS).",
    keywords: kw("FSSAI registration online", "food license India", "FoSCoS FSSAI"),
    offerName: "FSSAI food license",
  },
  "/taxation": {
    title: "Taxation Services – GST, Income Tax, TDS & Corporate Tax India",
    description:
      "GST return filing, income tax returns, TDS, tax planning, payroll tax, EPFO/ESIC filings. Dedicated experts at Com Financial Services (CFS).",
    keywords: kw("GST return filing India", "income tax filing", "TDS return filing", "tax consultant online"),
    offerName: "Taxation services hub",
  },
  "/taxation/income-tax": {
    title: "Income Tax Return (ITR) Filing Online in India",
    description:
      "Salaried, business, and capital gains ITR filing with HRA, deductions, and AIS/26AS reconciliation. Maximize refunds with Com Financial Services (CFS).",
    keywords: kw("ITR filing India", "income tax return online", "CA for ITR"),
    offerName: "Income tax filing",
  },
  "/taxation/gst-filing": {
    title: "GST Return Filing – GSTR-1, GSTR-3B & Annual Return",
    description:
      "Monthly and quarterly GST filing, ITC reconciliation, e-invoicing readiness, and notices support. Com Financial Services (CFS) for timely GSTR-1 and 3B.",
    keywords: kw("GSTR-1 GSTR-3B filing", "GST return filing online", "GST compliance India"),
    offerName: "GST filing",
  },
  "/taxation/tds-returns": {
    title: "TDS Return Filing & 26Q 24Q 27Q Compliance",
    description:
      "TDS deduction, Form 24Q/26Q/27Q, Form 16/16A, and lower deduction certificates. End-to-end TDS compliance with Com Financial Services (CFS).",
    keywords: kw("TDS return filing India", "Form 24Q", "TDS quarterly return"),
    offerName: "TDS returns",
  },
  "/taxation/tax-planning": {
    title: "Tax Planning for Businesses & Individuals in India",
    description:
      "Legitimate tax saving via deductions, structure, timing, and regime choice (old vs new). Year-round planning with Com Financial Services (CFS).",
    keywords: kw("tax planning India", "tax saving investment", "business tax strategy"),
    offerName: "Tax planning",
  },
  "/taxation/pt-tax-filing": {
    title: "Professional Tax Return Filing for Employers",
    description:
      "Monthly PT deductions, state returns, and payment due dates. Reduce penalties with Com Financial Services (CFS) payroll tax desk.",
    keywords: kw("professional tax return filing", "PT return employer India"),
    offerName: "PT tax filing",
  },
  "/taxation/corporate-tax-filing": {
    title: "Corporate Tax Filing & Advance Tax for Companies",
    description:
      "Company ITR-6, MAT/AMT, transfer pricing basics, and advance tax instalments. Corporate tax desk at Com Financial Services (CFS).",
    keywords: kw("corporate tax filing India", "company income tax return", "ITR-6"),
    offerName: "Corporate tax filing",
  },
  "/taxation/payroll-tax": {
    title: "Payroll Tax Compliance – PF, ESI & PT",
    description:
      "Salary structuring, PF, ESI, PT, and TDS on salary in one payroll compliance stack. Com Financial Services (CFS) for growing teams.",
    keywords: kw("payroll compliance India", "salary TDS PF ESI", "payroll tax services"),
    offerName: "Payroll tax",
  },
  "/taxation/epfo-filing": {
    title: "EPFO ECR & PF Monthly Filing for Employers",
    description:
      "Generate ECR, pay challan, and reconcile member passbooks. Avoid late fees with Com Financial Services (CFS) EPFO filing support.",
    keywords: kw("EPF monthly filing", "ECR filing India", "EPFO employer return"),
    offerName: "EPFO filing",
  },
  "/taxation/esic-filing": {
    title: "ESIC Monthly Contribution & Return Filing",
    description:
      "ESI wage upload, challan, and six-monthly returns. Compliant employer filings with Com Financial Services (CFS).",
    keywords: kw("ESIC return filing", "ESI monthly payment India"),
    offerName: "ESIC filing",
  },
  "/trademark-iso": {
    title: "Trademark, Copyright & ISO Certification Services India",
    description:
      "Trademark search, application, objection reply, copyright, and ISO 9001/14001 certification support. Protect and certify your brand with CFS.",
    keywords: kw("trademark registration India", "ISO 9001 certification", "copyright registration"),
    offerName: "Trademark & ISO hub",
  },
  "/trademark-iso/trademark": {
    title: "Trademark Registration Online in India",
    description:
      "Word, logo, and composite trademark filing, examination reply, opposition, and renewal. Com Financial Services (CFS) IP desk.",
    keywords: kw("trademark registration online", "brand registration India", "TM application"),
    offerName: "Trademark registration",
  },
  "/trademark-iso/iso-9001": {
    title: "ISO 9001 Quality Management Certification in India",
    description:
      "QMS documentation, audit readiness, and certification body coordination for ISO 9001. Com Financial Services (CFS) implementation support.",
    keywords: kw("ISO 9001 certification India", "QMS certification small business"),
    offerName: "ISO 9001",
  },
  "/trademark-iso/iso-14001-certification": {
    title: "ISO 14001 Environmental Management Certification",
    description:
      "EMS framework, legal register, and certification audit path for ISO 14001. Sustainability-focused SMEs choose Com Financial Services (CFS).",
    keywords: kw("ISO 14001 certification India", "environmental management ISO"),
    offerName: "ISO 14001",
  },
  "/trademark-iso/copyright-registration": {
    title: "Copyright Registration for Software, Content & Creative Work",
    description:
      "Literary, artistic, software, and media copyright filing in India. Ownership clarity and enforcement readiness with Com Financial Services (CFS).",
    keywords: kw("copyright registration India", "software copyright India"),
    offerName: "Copyright registration",
  },
  "/roc-returns": {
    title: "ROC MCA Filings – Annual Returns, Board Resolutions & Changes",
    description:
      "AOC-4, MGT-7/MGT-7A, DIR-12, SH-7, PAS-3, and board resolutions. Keep your company MCA-clean with Com Financial Services (CFS).",
    keywords: kw("ROC filing India", "MCA annual filing", "company annual return"),
    offerName: "ROC returns hub",
  },
  "/roc-returns/annual-filing": {
    title: "ROC Annual Filing – AOC-4 & MGT-7 for Companies",
    description:
      "Financial statements and annual return filing with MCA. Due dates, auditor coordination, and late fee mitigation via Com Financial Services (CFS).",
    keywords: kw("AOC-4 filing", "MGT-7 annual return", "ROC annual compliance"),
    offerName: "ROC annual filing",
  },
  "/roc-returns/board-resolutions": {
    title: "Board Resolutions & Minutes for Private Limited Companies",
    description:
      "Drafting board resolutions for loans, appointments, dividends, and related-party transactions. Governance support from Com Financial Services (CFS).",
    keywords: kw("board resolution company", "board minutes private limited"),
    offerName: "Board resolutions",
  },
  "/roc-returns/director-changes": {
    title: "Director Appointment, Resignation & DIN Updates (DIR-12)",
    description:
      "Add or remove directors, KMP changes, and DIR-3 KYC. MCA forms filed accurately by Com Financial Services (CFS).",
    keywords: kw("DIR-12 filing", "add director private limited", "DIN appointment India"),
    offerName: "Director changes",
  },
  "/roc-returns/share-transfer": {
    title: "Share Transfer, Allotment & Cap Table (SH-7, PAS-3)",
    description:
      "Share certificates, stamp duty, SH-7 for capital change, PAS-3 for allotment. Equity moves done right with Com Financial Services (CFS).",
    keywords: kw("share transfer private limited", "PAS-3 allotment", "SH-7 authorised capital"),
    offerName: "Share transfer",
  },
  "/advisory": {
    title: "Business, Legal, Tax & Startup Advisory Services India",
    description:
      "Strategy, compliance, fundraising, mentoring, HR, and finance advisory for founders and SMEs. Book a consultation with Com Financial Services (CFS).",
    keywords: kw("business advisory India", "startup mentor India", "legal compliance advisory"),
    offerName: "Advisory hub",
  },
  "/advisory/business-strategy-consulting": {
    title: "Business Strategy Consulting for Growing Companies",
    description:
      "Market positioning, pricing, GTM, and operational scale-up plans. Practical strategy sprints with Com Financial Services (CFS) advisors.",
    offerName: "Business strategy consulting",
  },
  "/advisory/legal-compliance-advisory": {
    title: "Legal & Regulatory Compliance Advisory",
    description:
      "Contracts, labour laws, industry regulations, and MCA compliance calendars. Reduce legal risk with Com Financial Services (CFS).",
    offerName: "Legal compliance advisory",
  },
  "/advisory/financial-planning-analysis": {
    title: "Financial Planning & Analysis (FP&A) for SMEs",
    description:
      "Budgets, cash flow, MIS dashboards, and unit economics. Clear numbers for decisions with Com Financial Services (CFS).",
    offerName: "Financial planning & analysis",
  },
  "/advisory/digital-transformation": {
    title: "Digital Transformation for Finance & Operations",
    description:
      "Accounting stack, GST APIs, payroll tools, and process automation roadmap. Modernize with Com Financial Services (CFS).",
    offerName: "Digital transformation",
  },
  "/advisory/assistance-for-fund-raising": {
    title: "Fundraising Assistance – Pitch, Data Room & Investor Readiness",
    description:
      "Financial models, cap table hygiene, and due diligence prep for angels and VCs. Fundraising support from Com Financial Services (CFS).",
    keywords: kw("startup fundraising India", "pitch deck financial model"),
    offerName: "Fundraising assistance",
  },
  "/advisory/startup-mentoring": {
    title: "Startup Mentoring – Incorporation to Scale",
    description:
      "Mentorship on product-market fit, compliance milestones, and growth metrics. Founder-friendly mentoring at Com Financial Services (CFS).",
    keywords: kw("startup mentoring India", "founder mentor"),
    offerName: "Startup mentoring",
  },
  "/advisory/tax-plan-analysis": {
    title: "Tax Plan Analysis – Old vs New Regime & Entity Choice",
    description:
      "Scenario modelling for salary, business income, and company vs LLP structures. Optimize legally with Com Financial Services (CFS).",
    offerName: "Tax plan analysis",
  },
  "/advisory/other-finance-related-services": {
    title: "Other Finance & Accounting Services",
    description:
      "Custom finance projects: MIS, audits coordination, MIS cleanup, and special assignments. Tell us your need—Com Financial Services (CFS).",
    offerName: "Other finance services",
  },
  "/advisory/hr-organizational-development": {
    title: "HR Policy & Organizational Development Support",
    description:
      "HR policies, offer letters, POSH, and performance frameworks for small teams. People-ops help from Com Financial Services (CFS).",
    offerName: "HR & organizational development",
  },
  "/reports": {
    title: "Project Reports, CMA, DSCR & Bank Reconciliation",
    description:
      "Loan project reports, CMA data, DSCR for lenders, and bank reconciliation. Credit-ready documentation from Com Financial Services (CFS).",
    keywords: kw("project report for bank loan", "CMA report India", "DSCR report"),
    offerName: "Reports hub",
  },
  "/reports/project-reports": {
    title: "Project Report for Bank Loan & MSME Finance",
    description:
      "Detailed project reports for term loans, CGTMSE, and machinery finance. Lender-format deliverables from Com Financial Services (CFS).",
    keywords: kw("project report bank loan India", "term loan project report"),
    offerName: "Project reports",
  },
  "/reports/cma-reports": {
    title: "CMA Data & Credit Monitoring Arrangement Reports",
    description:
      "CMA for working capital and term loans with projections banks expect. Com Financial Services (CFS) credit documentation team.",
    keywords: kw("CMA report for bank", "credit monitoring arrangement"),
    offerName: "CMA reports",
  },
  "/reports/dscr-reports": {
    title: "DSCR Report for Loan Eligibility & Monitoring",
    description:
      "Debt service coverage analysis for term loans and LAP. Clear DSCR narratives with Com Financial Services (CFS).",
    keywords: kw("DSCR report India", "debt service coverage loan"),
    offerName: "DSCR reports",
  },
  "/reports/bank-reconciliation": {
    title: "Bank Reconciliation & Ledger Cleanup Services",
    description:
      "Match bank statements to books, identify gaps, and close months faster. Outsourced BRS from Com Financial Services (CFS).",
    keywords: kw("bank reconciliation services India", "BRS accounting"),
    offerName: "Bank reconciliation",
  },
  "/tools": {
    title: "Free Tax & Business Calculators – GST, Income Tax, EMI & More",
    description:
      "Free calculators for income tax, GST, EMI, salary, SIP, PPF, HRA, IFSC, HSN, and gold rates. Instant results from Com Financial Services (CFS).",
    keywords: kw("free tax calculator India", "GST calculator", "income tax calculator online"),
    offerName: "Free calculators hub",
  },
  "/tools/income-tax-calculator": {
    title: "Free Income Tax Calculator India (Old vs New Regime)",
    description:
      "Estimate income tax liability with deductions and regime comparison. Quick, free calculator from Com Financial Services (CFS).",
    offerName: "Income tax calculator",
  },
  "/tools/gst-calculator": {
    title: "Free GST Calculator – Add or Remove GST",
    description:
      "Calculate CGST/SGST or IGST inclusive and exclusive amounts. Handy GST calculator by Com Financial Services (CFS).",
    offerName: "GST calculator",
  },
  "/tools/emi-calculator": {
    title: "Free EMI Calculator for Home, Car & Personal Loans",
    description:
      "Monthly EMI, total interest, and amortization overview. Plan repayments with Com Financial Services (CFS) EMI calculator.",
    offerName: "EMI calculator",
  },
  "/tools/salary-calculator": {
    title: "Free Salary Calculator – In-Hand & Employer Cost",
    description:
      "Break down CTC to take-home pay with PF, ESI, and tax estimates. Salary calculator India by Com Financial Services (CFS).",
    offerName: "Salary calculator",
  },
  "/tools/sip-calculator": {
    title: "Free SIP Calculator – Mutual Fund SIP Returns",
    description:
      "Project SIP wealth with expected return and tenure. Plan goals with Com Financial Services (CFS) SIP calculator.",
    offerName: "SIP calculator",
  },
  "/tools/ppf-calculator": {
    title: "Free PPF Calculator – Public Provident Fund Maturity",
    description:
      "PPF maturity, interest, and yearly contribution planner. Government-backed savings calculator from Com Financial Services (CFS).",
    offerName: "PPF calculator",
  },
  "/tools/rd-calculator": {
    title: "Free RD Calculator – Recurring Deposit Returns",
    description:
      "Estimate recurring deposit maturity with bank-style compounding. RD calculator India by Com Financial Services (CFS).",
    offerName: "RD calculator",
  },
  "/tools/nps-calculator": {
    title: "Free NPS Calculator – National Pension System Corpus",
    description:
      "Project NPS retirement corpus with tier-1 contributions and returns. NPS calculator from Com Financial Services (CFS).",
    offerName: "NPS calculator",
  },
  "/tools/epf-calculator": {
    title: "Free EPF Calculator – Provident Fund Maturity",
    description:
      "Employee PF balance growth with employer match and interest. EPF calculator India by Com Financial Services (CFS).",
    offerName: "EPF calculator",
  },
  "/tools/hra-calculator": {
    title: "Free HRA Calculator – Exemption & Tax Savings",
    description:
      "Calculate HRA exemption under Section 10(13A) for metro and non-metro. HRA calculator from Com Financial Services (CFS).",
    offerName: "HRA calculator",
  },
  "/tools/home-loan-emi": {
    title: "Free Home Loan EMI Calculator India",
    description:
      "Home loan EMI, total interest, and tenure sensitivity. Plan property finance with Com Financial Services (CFS).",
    offerName: "Home loan EMI calculator",
  },
  "/tools/mutual-fund-calculator": {
    title: "Free Mutual Fund Calculator – Lump Sum & SIP",
    description:
      "Estimate mutual fund future value for lump sum and SIP. Investment calculator by Com Financial Services (CFS).",
    offerName: "Mutual fund calculator",
  },
  "/tools/compound-interest": {
    title: "Free Compound Interest Calculator",
    description:
      "See how compounding grows principal with rate and time. Compound interest calculator from Com Financial Services (CFS).",
    offerName: "Compound interest calculator",
  },
  "/tools/currency-converter": {
    title: "Currency Converter – INR & Major FX Rates",
    description:
      "Convert between INR and major world currencies for travel and trade. Currency tool from Com Financial Services (CFS).",
    offerName: "Currency converter",
  },
  "/tools/gst-number-search": {
    title: "GST Number Search – Verify GSTIN Online",
    description:
      "Look up GSTIN details and filing status pointers. GST search tool by Com Financial Services (CFS).",
    offerName: "GST number search",
  },
  "/tools/ifsc-code-search": {
    title: "IFSC Code Search – Find Bank Branch IFSC & MICR",
    description:
      "Search IFSC codes for NEFT, RTGS, and IMPS. Bank branch finder from Com Financial Services (CFS).",
    offerName: "IFSC code search",
  },
  "/tools/hsn-code-finder": {
    title: "HSN Code Finder for GST Invoicing",
    description:
      "Find HSN codes for goods and services invoicing. GST HSN helper by Com Financial Services (CFS).",
    offerName: "HSN code finder",
  },
  "/tools/gst-search-by-name": {
    title: "GST Search by Business Name",
    description:
      "Discover GSTINs linked to trade names. Business name GST lookup from Com Financial Services (CFS).",
    offerName: "GST search by name",
  },
  "/tools/tax-saving": {
    title: "Tax Saving Calculator – Section 80C, 80D & More",
    description:
      "Estimate tax saved with 80C, NPS, health insurance, and HRA. Tax saving planner from Com Financial Services (CFS).",
    offerName: "Tax saving calculator",
  },
  "/tools/it-refund-status": {
    title: "Income Tax Refund Status Check Guide & Links",
    description:
      "Track ITR refund status on the e-filing portal. Step-by-step help from Com Financial Services (CFS).",
    offerName: "IT refund status",
  },
  "/tools/rent-receipts": {
    title: "Rent Receipt Generator for HRA Proof",
    description:
      "Create rent receipt format for landlord declarations and HRA claims. Free tool from Com Financial Services (CFS).",
    offerName: "Rent receipts",
  },
  "/tools/gold-rates": {
    title: "Gold Rates in India Today – 22K & 24K Trends",
    description:
      "Track gold price trends for jewellery and investment planning. Gold rates tool by Com Financial Services (CFS).",
    keywords: kw("gold rate India today", "22 carat gold price"),
    offerName: "Gold rates",
  },
};

export function pageMetadata(path: string): Metadata {
  const entry = SEO_REGISTRY[path];
  if (!entry) {
    throw new Error(`Missing SEO_REGISTRY entry for path: ${path}`);
  }
  return buildPageMetadata({
    path,
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
  });
}

export function getServiceOffersForSchema(): { name: string; url: string }[] {
  return PUBLIC_SITEMAP_PATHS.filter((p) => p !== "/").map((path) => {
    const entry = SEO_REGISTRY[path];
    const name =
      entry?.offerName ??
      entry?.title.split("–")[0]?.trim() ??
      path.replace(/\//g, " ").trim();
    return { name, url: absoluteUrl(path) };
  });
}

/** Sitemap priority: deeper service URLs stay high but below the homepage. */
export function sitemapPriorityForPath(path: string): number {
  if (path === "/") return 1;
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 1) {
    if (path === "/contact" || path === "/registration" || path === "/taxation" || path === "/tools") {
      return 0.95;
    }
    return 0.92;
  }
  if (
    path.includes("gst-registration") ||
    path.includes("income-tax") ||
    path.includes("private-limited") ||
    path.includes("gst-filing") ||
    path.includes("trademark") ||
    path === "/tools/income-tax-calculator" ||
    path === "/tools/gst-calculator"
  ) {
    return 0.88;
  }
  return 0.8;
}

export function sitemapChangeFrequency(path: string): "weekly" | "daily" | "monthly" {
  if (path === "/") return "weekly";
  if (path === "/tools/gold-rates") return "daily";
  if (path.startsWith("/tools/")) return "weekly";
  return "monthly";
}
