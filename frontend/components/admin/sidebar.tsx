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

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { 
    name: 'Tax Forms', 
    icon: FileText,
    submenu: [
      { name: 'All Forms', href: '/admin/tax-forms' },
      { name: 'Pending Review', href: '/admin/tax-forms?status=pending' },
      { name: 'Reviewed', href: '/admin/tax-forms?status=reviewed' },
      { name: 'Filed', href: '/admin/tax-forms?status=filed' },
    ]
  },
  { 
    name: 'Services', 
    icon: FileSpreadsheet,
    submenu: [
      // Company Formation
      { name: 'Company Formation', header: true },
      { name: 'Private Limited', href: '/admin/services/private-limited' },
      { name: 'Public Limited', href: '/admin/services/public-limited' },
      { name: 'One Person Company', href: '/admin/services/opc' },
      { name: 'Section 8 Company', href: '/admin/services/section-8' },
      
      // Other Registration
      { name: 'Other Registration', header: true },
      { name: 'LLP Registration', href: '/admin/services/llp' },
      { name: 'Partnership Firm', href: '/admin/services/partnership' },
      { name: 'Sole Proprietorship', href: '/admin/services/sole-proprietorship' },
      
      // Taxation
      { name: 'Taxation', header: true },
      { name: 'GST Filing', href: '/admin/services/gst' },
      { name: 'Income Tax Filing', href: '/admin/services/income-tax' },
      { name: 'TDS Returns', href: '/admin/services/tds' },
      
      // Trademark & ISO
      { name: 'Trademark & ISO', header: true },
      { name: 'Trademark Registration', href: '/admin/services/trademark' },
      { name: 'ISO Certification', href: '/admin/services/iso' },
      { name: 'Copyright', href: '/admin/services/copyright' },
    ]
  },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageSquare },
  { name: 'Logout', href: '/admin/logout', icon: LogOut },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {navigation.map((item) => (
                <div key={item.name}>
                  {!item.submenu ? (
                    <Link
                      href={item.href!}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        pathname === item.href
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          pathname.startsWith(item.href || '')
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-6 w-6 ${
                            pathname.startsWith(item.href || '') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="flex-1 text-left">{item.name}</span>
                        {openSubmenus[item.name] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      
                      {openSubmenus[item.name] && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            subItem.header ? (
                              <div key={subItem.name} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {subItem.name}
                              </div>
                            ) : (
                              <Link
                                key={subItem.name}
                                href={subItem.href||""}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                  pathname === subItem.href
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-700 font-medium">AD</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    View profile
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
