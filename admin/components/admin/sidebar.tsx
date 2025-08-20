'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  LogOut
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
    submenu: [
      // Company Formation
      { name: 'Company Formation', icon: FileText ,
        submenu: [
          { name: 'Private Limited', href: '/admin/services/private-limited' },
          { name: 'Public Limited', href: '/admin/services/public-limited' },
          { name: 'One Person Company', href: '/admin/services/opc' },
          { name: 'Section 8 Company', href: '/admin/services/section-8' },
        ]
      },
      
      // Other Registration
      { name: 'Other Registration', icon: FileText,
        submenu: [
          { name: 'LLP Registration', href: '/admin/services/llp' },
          { name: 'Partnership Firm', href: '/admin/services/partnership' },
          { name: 'Sole Proprietorship', href: '/admin/services/sole-proprietorship' },
        ]
      },
      
      // Taxation
      { name: 'Taxation', icon: FileText,
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
      
      // Trademark & ISO
      { name: 'Trademark & ISO', icon: FileText,
        submenu: [
          { name: 'Trademark Registration', href: '/admin/services/trademark' },
          { name: 'ISO Certification', href: '/admin/services/iso' },
          { name: 'Copyright', href: '/admin/services/copyright' },
        ]
      },
    ]
  },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageSquare },
  { name: 'Logout', href: '/admin/logout', icon: LogOut },
]

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isOpen = openSubmenus[item.name];

      if (item.header) {
        return (
          <div key={item.name} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {item.name}
          </div>
        );
      }

      if (!hasSubmenu && item.href) {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon && (
              <item.icon
                className={`mr-3 flex-shrink-0 h-6 w-6 ${
                  pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
            )}
            {item.name}
          </Link>
        );
      }

      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
          >
            {item.icon && (
              <item.icon
                className={`mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500`}
                aria-hidden="true"
              />
            )}
            <span className="flex-1 text-left">{item.name}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {isOpen && (
            <div className="mt-1 space-y-1" style={{ paddingLeft: `${level * 16}px` }}>
              {renderNavItems(item.submenu!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {renderNavItems(navigation)}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
