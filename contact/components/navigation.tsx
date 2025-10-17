'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Plus, 
  Home,
  Building2,
  Users
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Contact Form',
    href: '/contact-form',
    icon: Plus,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Contact</span>
              <span className="text-sm text-gray-500 ml-1">Management</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
