'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Home,
  Building2,
  Settings,
  LogOut,
  User,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Chat Support',
    href: '/chat',
    icon: MessageCircle,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  if (pathname === '/auth') {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Support</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">Team</span>
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
                    className={`flex items-center space-x-2 dark:text-gray-300 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
            
            <Link href="/profile">
              <Button variant="ghost" className="dark:text-gray-300">
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </Button>
            </Link>
            
            <Link href="/settings">
              <Button variant="ghost" className="dark:text-gray-300">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="ghost" onClick={handleLogout} className="dark:text-gray-300">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
