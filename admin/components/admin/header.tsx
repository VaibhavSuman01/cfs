'use client'

import { useState } from 'react'
import { Search, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api, { API_PATHS } from '@/lib/api-client'
import { useAuth } from '@/providers/auth-provider'
export function AdminHeader() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [openChangePwd, setOpenChangePwd] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)

  // Get the current page title from the pathname
  const getPageTitle = () => {
    if (pathname === '/admin/dashboard') return 'Dashboard'
    const path = pathname.split('/').pop() || 'Admin'
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
  }

  const openSidebarOnMobile = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('toggle-admin-sidebar'))
    }
  }

  return (
    <header className="rounded-none bg-blue-600/15 backdrop-blur border-b border-white/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden bg-white/10 p-2 rounded-md text-white/80 hover:text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50"
              onClick={openSidebarOnMobile}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-white">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center">
            <div className="relative mx-4 hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/70" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-md leading-5 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:placeholder-white focus:ring-1 focus:ring-white/40 focus:border-white/40 sm:text-sm"
                placeholder="Search"
              />
            </div>
            
           
            
            <div className="ml-4 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button aria-label="Open user menu" className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50">
                    <span className="text-white font-medium">AD</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setOpenChangePwd(true)}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openChangePwd} onOpenChange={setOpenChangePwd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenChangePwd(false)} disabled={isChanging}>Cancel</Button>
            <Button onClick={async () => {
              if (!currentPassword || !newPassword || !confirmPassword) {
                toast.error('Please fill in all fields');
                return;
              }
              if (newPassword !== confirmPassword) {
                toast.error('New password and confirmation do not match');
                return;
              }
              if (newPassword.length < 6) {
                toast.error('New password must be at least 6 characters');
                return;
              }
              try {
                setIsChanging(true);
                await api.put(API_PATHS.AUTH.PASSWORD, { currentPassword, newPassword });
                toast.success('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setOpenChangePwd(false);
              } catch (err: any) {
                const message = err?.response?.data?.message || 'Failed to change password';
                toast.error(message);
              } finally {
                setIsChanging(false);
              }
            }} disabled={isChanging}>
              {isChanging ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
