'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronUp,
  BarChart2,
  FileSpreadsheet,
  Download,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react'

export type NavItem = {
  name: string;
  href?: string;
  icon?: React.ElementType;
  header?: boolean;
  submenu?: NavItem[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  {
    name: 'Services',
    icon: FileSpreadsheet,
    href: '#',
  },
  
  // Company Formation
  {
    name: 'Company Formation', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/forms/company-formation' },
      { name: 'Pending Review', href: '/admin/forms/company-formation?status=Pending' },
      { name: 'Reviewed', href: '/admin/forms/company-formation?status=Reviewed' },
      { name: 'Filed', href: '/admin/forms/company-formation?status=Filed' },
      {
        name: 'Private Limited Company',
        submenu: [
          { name: 'All', href: '/admin/forms/company-formation?service=Private%20Limited%20Company' },
          { name: 'Pending', href: '/admin/forms/company-formation?service=Private%20Limited%20Company&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/company-formation?service=Private%20Limited%20Company&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/company-formation?service=Private%20Limited%20Company&status=Filed' },
        ]
      },
      {
        name: 'Public Limited Company',
        submenu: [
          { name: 'All', href: '/admin/forms/company-formation?service=Public%20Limited%20Company' },
          { name: 'Pending', href: '/admin/forms/company-formation?service=Public%20Limited%20Company&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/company-formation?service=Public%20Limited%20Company&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/company-formation?service=Public%20Limited%20Company&status=Filed' },
        ]
      },
      {
        name: 'One Person Company',
        submenu: [
          { name: 'All', href: '/admin/forms/company-formation?service=One%20Person%20Company' },
          { name: 'Pending', href: '/admin/forms/company-formation?service=One%20Person%20Company&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/company-formation?service=One%20Person%20Company&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/company-formation?service=One%20Person%20Company&status=Filed' },
        ]
      },
      {
        name: 'Section 8 Company',
        submenu: [
          { name: 'All', href: '/admin/forms/company-formation?service=Section%208%20Company' },
          { name: 'Pending', href: '/admin/forms/company-formation?service=Section%208%20Company&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/company-formation?service=Section%208%20Company&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/company-formation?service=Section%208%20Company&status=Filed' },
        ]
      },
      {
        name: 'Nidhi Company',
        submenu: [
          { name: 'All', href: '/admin/forms/company-formation?service=Nidhi%20Company' },
          { name: 'Pending', href: '/admin/forms/company-formation?service=Nidhi%20Company&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/company-formation?service=Nidhi%20Company&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/company-formation?service=Nidhi%20Company&status=Filed' },
        ]
      },
      {
        name: 'Partnership Firm Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/company-formation?service=Partnership%20Firm%20Registration' },
          { name: 'Pending', href: '/admin/forms/company-formation?service=Partnership%20Firm%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/company-formation?service=Partnership%20Firm%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/company-formation?service=Partnership%20Firm%20Registration&status=Filed' },
        ]
      },
    ]
  },

  // Other Registration
  {
    name: 'Other Registration', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/forms/other-registration' },
      { name: 'Pending Review', href: '/admin/forms/other-registration?status=Pending' },
      { name: 'Reviewed', href: '/admin/forms/other-registration?status=Reviewed' },
      { name: 'Filed', href: '/admin/forms/other-registration?status=Filed' },
      {
        name: 'LLP Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=LLP%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=LLP%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=LLP%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=LLP%20Registration&status=Filed' },
        ]
      },
      {
        name: 'Partnership Firm',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=Partnership%20Firm%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=Partnership%20Firm%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=Partnership%20Firm%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=Partnership%20Firm%20Registration&status=Filed' },
        ]
      },
      {
        name: 'Sole Proprietorship',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=Sole%20Proprietorship' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=Sole%20Proprietorship&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=Sole%20Proprietorship&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=Sole%20Proprietorship&status=Filed' },
        ]
      },
      {
        name: 'GST Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=GST%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=GST%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=GST%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=GST%20Registration&status=Filed' },
        ]
      },
      {
        name: 'Digital Signature',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=Digital%20Signature' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=Digital%20Signature&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=Digital%20Signature&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=Digital%20Signature&status=Filed' },
        ]
      },
      {
        name: 'EPFO Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=EPFO%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=EPFO%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=EPFO%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=EPFO%20Registration&status=Filed' },
        ]
      },
      {
        name: 'ESIC Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=ESIC%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=ESIC%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=ESIC%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=ESIC%20Registration&status=Filed' },
        ]
      },
      {
        name: 'FSSAI Food License',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=FSSAI%20Food%20License' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=FSSAI%20Food%20License&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=FSSAI%20Food%20License&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=FSSAI%20Food%20License&status=Filed' },
        ]
      },
      {
        name: 'IEC Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=IEC%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=IEC%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=IEC%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=IEC%20Registration&status=Filed' },
        ]
      },
      {
        name: 'Industry License',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=Industry%20License' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=Industry%20License&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=Industry%20License&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=Industry%20License&status=Filed' },
        ]
      },
      {
        name: 'MSME Udyam Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=MSME%20Udyam%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=MSME%20Udyam%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=MSME%20Udyam%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=MSME%20Udyam%20Registration&status=Filed' },
        ]
      },
      {
        name: 'NGO Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=NGO%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=NGO%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=NGO%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=NGO%20Registration&status=Filed' },
        ]
      },
      {
        name: 'PAN Apply',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=PAN%20Apply' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=PAN%20Apply&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=PAN%20Apply&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=PAN%20Apply&status=Filed' },
        ]
      },
      {
        name: 'Producer Company',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=Producer%20Company' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=Producer%20Company&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=Producer%20Company&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=Producer%20Company&status=Filed' },
        ]
      },
      {
        name: 'PT Tax Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=PT%20Tax%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=PT%20Tax%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=PT%20Tax%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=PT%20Tax%20Registration&status=Filed' },
        ]
      },
      {
        name: 'Startup India Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=Startup%20India%20Registration' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=Startup%20India%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=Startup%20India%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=Startup%20India%20Registration&status=Filed' },
        ]
      },
      {
        name: 'TAN Apply',
        submenu: [
          { name: 'All', href: '/admin/forms/other-registration?service=TAN%20Apply' },
          { name: 'Pending', href: '/admin/forms/other-registration?service=TAN%20Apply&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/other-registration?service=TAN%20Apply&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/other-registration?service=TAN%20Apply&status=Filed' },
        ]
      },
    ]
  },

  // ROC Returns
  {
    name: 'ROC Returns', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/forms/roc-returns' },
      { name: 'Pending Review', href: '/admin/forms/roc-returns?status=Pending' },
      { name: 'Reviewed', href: '/admin/forms/roc-returns?status=Reviewed' },
      { name: 'Filed', href: '/admin/forms/roc-returns?status=Filed' },
      {
        name: 'Annual Filing',
        submenu: [
          { name: 'All', href: '/admin/forms/roc-returns?service=Annual%20Filing' },
          { name: 'Pending', href: '/admin/forms/roc-returns?service=Annual%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/roc-returns?service=Annual%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/roc-returns?service=Annual%20Filing&status=Filed' },
        ]
      },
      {
        name: 'Board Resolutions',
        submenu: [
          { name: 'All', href: '/admin/forms/roc-returns?service=Board%20Resolutions' },
          { name: 'Pending', href: '/admin/forms/roc-returns?service=Board%20Resolutions&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/roc-returns?service=Board%20Resolutions&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/roc-returns?service=Board%20Resolutions&status=Filed' },
        ]
      },
      {
        name: 'Director Changes',
        submenu: [
          { name: 'All', href: '/admin/forms/roc-returns?service=Director%20Changes' },
          { name: 'Pending', href: '/admin/forms/roc-returns?service=Director%20Changes&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/roc-returns?service=Director%20Changes&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/roc-returns?service=Director%20Changes&status=Filed' },
        ]
      },
      {
        name: 'Share Transfer',
        submenu: [
          { name: 'All', href: '/admin/forms/roc-returns?service=Share%20Transfer' },
          { name: 'Pending', href: '/admin/forms/roc-returns?service=Share%20Transfer&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/roc-returns?service=Share%20Transfer&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/roc-returns?service=Share%20Transfer&status=Filed' },
        ]
      },
    ]
  },

  // Reports
  {
    name: 'Reports', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/forms/reports' },
      { name: 'Pending Review', href: '/admin/forms/reports?status=Pending' },
      { name: 'Reviewed', href: '/admin/forms/reports?status=Reviewed' },
      { name: 'Filed', href: '/admin/forms/reports?status=Filed' },
      {
        name: 'Bank Reconciliation',
        submenu: [
          { name: 'All', href: '/admin/forms/reports?service=Bank%20Reconciliation' },
          { name: 'Pending', href: '/admin/forms/reports?service=Bank%20Reconciliation&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/reports?service=Bank%20Reconciliation&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/reports?service=Bank%20Reconciliation&status=Filed' },
        ]
      },
      {
        name: 'CMA Reports',
        submenu: [
          { name: 'All', href: '/admin/forms/reports?service=CMA%20Reports' },
          { name: 'Pending', href: '/admin/forms/reports?service=CMA%20Reports&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/reports?service=CMA%20Reports&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/reports?service=CMA%20Reports&status=Filed' },
        ]
      },
      {
        name: 'DSCR Reports',
        submenu: [
          { name: 'All', href: '/admin/forms/reports?service=DSCR%20Reports' },
          { name: 'Pending', href: '/admin/forms/reports?service=DSCR%20Reports&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/reports?service=DSCR%20Reports&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/reports?service=DSCR%20Reports&status=Filed' },
        ]
      },
      {
        name: 'Project Reports',
        submenu: [
          { name: 'All', href: '/admin/forms/reports?service=Project%20Reports' },
          { name: 'Pending', href: '/admin/forms/reports?service=Project%20Reports&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/reports?service=Project%20Reports&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/reports?service=Project%20Reports&status=Filed' },
        ]
      },
    ]
  },

  // Trademark & ISO
  {
    name: 'Trademark & ISO', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/forms/trademark-iso' },
      { name: 'Pending Review', href: '/admin/forms/trademark-iso?status=Pending' },
      { name: 'Reviewed', href: '/admin/forms/trademark-iso?status=Reviewed' },
      { name: 'Filed', href: '/admin/forms/trademark-iso?status=Filed' },
      {
        name: 'Trademark Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/trademark-iso?service=Trademark%20Registration' },
          { name: 'Pending', href: '/admin/forms/trademark-iso?service=Trademark%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/trademark-iso?service=Trademark%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/trademark-iso?service=Trademark%20Registration&status=Filed' },
        ]
      },
      {
        name: 'ISO 9001',
        submenu: [
          { name: 'All', href: '/admin/forms/trademark-iso?service=ISO%209001' },
          { name: 'Pending', href: '/admin/forms/trademark-iso?service=ISO%209001&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/trademark-iso?service=ISO%209001&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/trademark-iso?service=ISO%209001&status=Filed' },
        ]
      },
      {
        name: 'ISO 14001',
        submenu: [
          { name: 'All', href: '/admin/forms/trademark-iso?service=ISO%2014001' },
          { name: 'Pending', href: '/admin/forms/trademark-iso?service=ISO%2014001&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/trademark-iso?service=ISO%2014001&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/trademark-iso?service=ISO%2014001&status=Filed' },
        ]
      },
      {
        name: 'Copyright Registration',
        submenu: [
          { name: 'All', href: '/admin/forms/trademark-iso?service=Copyright%20Registration' },
          { name: 'Pending', href: '/admin/forms/trademark-iso?service=Copyright%20Registration&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/trademark-iso?service=Copyright%20Registration&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/trademark-iso?service=Copyright%20Registration&status=Filed' },
        ]
      },
    ]
  },

  // Advisory
  {
    name: 'Advisory', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/forms/advisory' },
      { name: 'Pending Review', href: '/admin/forms/advisory?status=Pending' },
      { name: 'Reviewed', href: '/admin/forms/advisory?status=Reviewed' },
      { name: 'Filed', href: '/admin/forms/advisory?status=Filed' },
      {
        name: 'Business Strategy Consulting',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Business%20Strategy%20Consulting' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Business%20Strategy%20Consulting&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Business%20Strategy%20Consulting&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Business%20Strategy%20Consulting&status=Filed' },
        ]
      },
      {
        name: 'Financial Planning & Analysis',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Financial%20Planning%20%26%20Analysis' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Financial%20Planning%20%26%20Analysis&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Financial%20Planning%20%26%20Analysis&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Financial%20Planning%20%26%20Analysis&status=Filed' },
        ]
      },
      {
        name: 'Digital Transformation',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Digital%20Transformation' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Digital%20Transformation&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Digital%20Transformation&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Digital%20Transformation&status=Filed' },
        ]
      },
      {
        name: 'HR & Organizational Development',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=HR%20%26%20Organizational%20Development' },
          { name: 'Pending', href: '/admin/forms/advisory?service=HR%20%26%20Organizational%20Development&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=HR%20%26%20Organizational%20Development&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=HR%20%26%20Organizational%20Development&status=Filed' },
        ]
      },
      {
        name: 'Legal Compliance Advisory',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Legal%20Compliance%20Advisory' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Legal%20Compliance%20Advisory&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Legal%20Compliance%20Advisory&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Legal%20Compliance%20Advisory&status=Filed' },
        ]
      },
      {
        name: 'Startup Mentoring',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Startup%20Mentoring' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Startup%20Mentoring&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Startup%20Mentoring&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Startup%20Mentoring&status=Filed' },
        ]
      },
      {
        name: 'Tax Planning & Analysis',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Tax%20Planning%20%26%20Analysis' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Tax%20Planning%20%26%20Analysis&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Tax%20Planning%20%26%20Analysis&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Tax%20Planning%20%26%20Analysis&status=Filed' },
        ]
      },
      {
        name: 'Assistance for Fund Raising',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Assistance%20for%20Fund%20Raising' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Assistance%20for%20Fund%20Raising&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Assistance%20for%20Fund%20Raising&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Assistance%20for%20Fund%20Raising&status=Filed' },
        ]
      },
      {
        name: 'Other Finance Related Services',
        submenu: [
          { name: 'All', href: '/admin/forms/advisory?service=Other%20Finance%20Related%20Services' },
          { name: 'Pending', href: '/admin/forms/advisory?service=Other%20Finance%20Related%20Services&status=Pending' },
          { name: 'Reviewed', href: '/admin/forms/advisory?service=Other%20Finance%20Related%20Services&status=Reviewed' },
          { name: 'Filed', href: '/admin/forms/advisory?service=Other%20Finance%20Related%20Services&status=Filed' },
        ]
      },
    ]
  },

  // Taxation
  {
    name: 'Taxation', icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/tax-forms' },
      { name: 'Pending Review', href: '/admin/tax-forms?status=Pending' },
      { name: 'Reviewed', href: '/admin/tax-forms?status=Reviewed' },
      { name: 'Filed', href: '/admin/tax-forms?status=Filed' },
      {
        name: 'GST Filing',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=GST%20Filing' },
          { name: 'Pending', href: '/admin/tax-forms?service=GST%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=GST%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=GST%20Filing&status=Filed' },
        ]
      },
      {
        name: 'Income Tax Filing',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=Income%20Tax%20Filing' },
          { name: 'Pending', href: '/admin/tax-forms?service=Income%20Tax%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=Income%20Tax%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=Income%20Tax%20Filing&status=Filed' },
        ]
      },
      {
        name: 'TDS Returns',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=TDS%20Returns' },
          { name: 'Pending', href: '/admin/tax-forms?service=TDS%20Returns&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=TDS%20Returns&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=TDS%20Returns&status=Filed' },
        ]
      },
      {
        name: 'Tax Planning',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=Tax%20Planning' },
          { name: 'Pending', href: '/admin/tax-forms?service=Tax%20Planning&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=Tax%20Planning&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=Tax%20Planning&status=Filed' },
        ]
      },
      {
        name: 'EPFO Filing',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=EPFO%20Filing' },
          { name: 'Pending', href: '/admin/tax-forms?service=EPFO%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=EPFO%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=EPFO%20Filing&status=Filed' },
        ]
      },
      {
        name: 'ESIC Filing',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=ESIC%20Filing' },
          { name: 'Pending', href: '/admin/tax-forms?service=ESIC%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=ESIC%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=ESIC%20Filing&status=Filed' },
        ]
      },
      {
        name: 'PT-Tax Filing',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=PT-Tax%20Filing' },
          { name: 'Pending', href: '/admin/tax-forms?service=PT-Tax%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=PT-Tax%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=PT-Tax%20Filing&status=Filed' },
        ]
      },
      {
        name: 'Corporate Tax Filing',
        submenu: [
          { name: 'All', href: '/admin/tax-forms?service=Corporate%20Tax%20Filing' },
          { name: 'Pending', href: '/admin/tax-forms?service=Corporate%20Tax%20Filing&status=Pending' },
          { name: 'Reviewed', href: '/admin/tax-forms?service=Corporate%20Tax%20Filing&status=Reviewed' },
          { name: 'Filed', href: '/admin/tax-forms?service=Corporate%20Tax%20Filing&status=Filed' },
        ]
      },
    ]
  },

  { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const hasHref = typeof item.href === 'string' && item.href.length > 0;
      const isOpen = openSubmenus[item.name];

      if (item.header) {
        return (
          <div key={item.name} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {item.name}
          </div>
        );
      }

      if (!hasSubmenu && hasHref) {
        return (
          <Link
            key={item.name}
            href={item.href || '#'}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${pathname === item.href
                ? 'bg-white/10 text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
          >
            {item.icon && (
              <item.icon
                className={`${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0 h-6 w-6 ${pathname === item.href ? 'text-white' : 'text-white/60 group-hover:text-white'
                  }`}
                aria-hidden="true"
              />
            )}
            {!collapsed && item.name}
          </Link>
        );
      }

      if (hasSubmenu) {
        return (
          <div key={item.name}>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors`}
            >
              {item.icon && (
                <item.icon
                  className={`${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0 h-6 w-6 text-white/60 group-hover:text-white`}
                  aria-hidden="true"
                />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </>
              )}
            </button>
            {isOpen && !collapsed && (
              <div className="mt-1 space-y-1" style={{ paddingLeft: `${level * 16}px` }}>
                {renderNavItems(item.submenu!, level + 1)}
              </div>
            )}
          </div>
        );
      }

      // Label-only item (no href, no submenu)
      return (
        <div key={item.name}>
          <div className="px-2 py-2 text-sm font-medium text-white/60">
            {item.icon && (
              <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3 inline-block'} h-5 w-5 align-middle`} />
            )}
            {!collapsed && <span className="align-middle">{item.name}</span>}
          </div>
        </div>
      );
    });
  };

  // Listen for global toggle event from header
  useEffect(() => {
    const handler = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggle-admin-sidebar', handler as EventListener);
    return () => {
      window.removeEventListener('toggle-admin-sidebar', handler as EventListener);
    };
  }, []);

  return (
    <>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-white/5/70" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-72 max-w-[80%] bg-blue-800 border-r border-white/20 text-white">
            <div className="flex items-center justify-between px-4 py-4">
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <button aria-label="Close sidebar" onClick={() => setMobileOpen(false)} className="p-2 rounded-md bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div
              className="px-2 pb-6 overflow-y-auto h-[calc(100%-64px)] [&::-webkit-scrollbar]:hidden"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {renderNavItems(navigation)}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar with collapse */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`${collapsed ? 'w-16' : 'w-64'} h-screen group flex flex-col border-r border-white/20 bg-blue-800 text-white transition-[width] duration-200`}>
          <div className="flex items-center justify-between px-4 pt-5">
            {!collapsed && <h1 className="text-xl font-bold text-white">Admin Panel</h1>}
            <button
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(prev => !prev)}
              className="ml-auto p-2 rounded-md bg-white/10 text-white/80 hover:text-white"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-4 flex-1 flex flex-col overflow-hidden">
            <div
              className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              <nav className={`${collapsed ? 'px-1' : 'px-2'} space-y-1`}>
                {renderNavItems(navigation)}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
