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
      { name: 'Private Limited', href: '/admin/services/private-limited' },
      { name: 'Public Limited', href: '/admin/services/public-limited' },
      { name: 'One Person Company', href: '/admin/services/opc' },
      { name: 'Section 8 Company', href: '/admin/services/section-8' },
    ]
  },

  // Other Registration
  {
    name: 'Other Registration', icon: FileText,
    submenu: [
      { name: 'LLP Registration', href: '/admin/services/llp' },
      { name: 'Partnership Firm', href: '/admin/services/partnership' },
      { name: 'Sole Proprietorship', href: '/admin/services/sole-proprietorship' },
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

  // Trademark & ISO
  {
    name: 'Trademark & ISO', icon: FileText,
    submenu: [
      { name: 'Trademark Registration', href: '/admin/services/trademark' },
      { name: 'ISO Certification', href: '/admin/services/iso' },
      { name: 'Copyright', href: '/admin/services/copyright' },
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
