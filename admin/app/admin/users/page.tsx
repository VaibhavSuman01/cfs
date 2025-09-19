"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DownloadIcon, UserIcon, CalendarIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, TrashIcon, BanIcon, CheckCircleIcon, EyeIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '@/lib/api-client';
import { API_PATHS } from '@/lib/api-client';

// Define interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  fatherName?: string;
  pan?: string;
  aadhaar?: string;
  address?: string;
  dob?: string;
  isBlocked?: boolean;
  blockedAt?: string;
  blockReason?: string;
  blockedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  unblockedAt?: string;
  unblockedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRange, setSelectedRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      if (dateRange?.from) {
        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);
        params.append('startDate', startDate.toISOString());
      }
      if (dateRange?.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        params.append('endDate', endDate.toISOString());
      }

      const response = await api.get(`${API_PATHS.ADMIN.USERS}?${params.toString()}`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, debouncedSearchTerm, dateRange, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page when search or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, dateRange]);

  const handleDateRangeSelect = (range: string) => {
    setSelectedRange(range);
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (range === 'day') {
      setDateRange({ from: today, to: now });
    } else if (range === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      setDateRange({ from: weekAgo, to: now });
    } else if (range === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      monthAgo.setHours(0, 0, 0, 0);
      setDateRange({ from: monthAgo, to: now });
    } else if (range === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      yearAgo.setHours(0, 0, 0, 0);
      setDateRange({ from: yearAgo, to: now });
    } else if (range === 'all') {
      setDateRange(undefined);
    }
  };

  const handleDownload = async () => {
    const loadingToast = toast({
      title: 'Preparing Download',
      description: 'Your file is being prepared...',
    });
    try {
      const date = new Date().toISOString().split('T')[0];
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (dateRange?.from) {
        params.append('startDate', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append('endDate', dateRange.to.toISOString());
      }
      await api.downloadFile(`${API_PATHS.ADMIN.USERS_DOWNLOAD}?${params.toString()}`, `users-${date}.xlsx`);
      loadingToast.dismiss();
      toast({
        title: 'Download Started',
        description: 'Your file should be downloading now.',
      });
    } catch (error) {
      console.error('Download failed:', error);
      loadingToast.dismiss();
      toast({
        title: 'Download Failed',
        description: 'Could not download the user data.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handler functions
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      pan: user.pan,
      aadhaar: user.aadhaar,
      fatherName: user.fatherName,
      address: user.address,
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    });
    setShowEditDialog(true);
  };

  const handleBlockUser = (user: User) => {
    if (user.isBlocked) {
      toast({
        title: 'Warning',
        description: 'This user is already blocked.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedUser(user);
    setBlockReason('');
    setShowBlockDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await api.put(`${API_PATHS.ADMIN.USER_UPDATE(selectedUser._id)}`, editFormData);
      toast({
        title: 'Success',
        description: 'User updated successfully.',
      });
      setShowEditDialog(false);
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive',
      });
    }
  };

  const handleBlockUserConfirm = async () => {
    if (!selectedUser) return;

    try {
      await api.post(API_PATHS.ADMIN.USER_BLOCK(selectedUser._id), {
        reason: blockReason,
      });
      toast({
        title: 'Success',
        description: 'User blocked successfully.',
      });
      setShowBlockDialog(false);
      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to block user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to block user.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleUnblockUser = async (user: User) => {
    if (!user.isBlocked) {
      toast({
        title: 'Warning',
        description: 'This user is not blocked.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post(`${API_PATHS.ADMIN.USER_UNBLOCK(user._id)}`);
      toast({
        title: 'Success',
        description: 'User unblocked successfully.',
      });
      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to unblock user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to unblock user.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`${API_PATHS.ADMIN.USER_DELETE(selectedUser._id)}`);
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
      });
      setShowDeleteDialog(false);
      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-muted-foreground text-white">Manage all registered users.</p>
          </div>
          <Button onClick={handleDownload}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download as Excel
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6"> 
          <div className="relative flex-grow"> 
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, mobile, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2"> 
            <Select onValueChange={handleDateRangeSelect} value={selectedRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className="w-[300px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => { setDateRange(range); setSelectedRange('custom'); }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              {pagination ? (
                pagination.pages > 1 ? 
                  `${pagination.total} users found (Page ${pagination.page} of ${pagination.pages})` : 
                  `${pagination.total} users found`
              ) : 'Loading...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead>Aadhar</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobile || '-'}</TableCell>
                      <TableCell>{user.fatherName || '-'}</TableCell>
                      <TableCell>{user.pan || '-'}</TableCell>
                      <TableCell>{user.aadhaar || '-'}</TableCell>
                      <TableCell>{user.dob ? formatDate(user.dob) : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.isBlocked ? "destructive" : "default"}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          {user.isBlocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnblockUser(user)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBlockUser(user)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <BanIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination Controls */}
            {pagination && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} users
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select value={pageSize.toString()} onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {pagination.pages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          let pageNum;
                          if (pagination.pages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.pages - 2) {
                            pageNum = pagination.pages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= pagination.pages}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update user information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={editFormData.mobile || ''}
                onChange={(e) => setEditFormData({...editFormData, mobile: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                value={editFormData.pan || ''}
                onChange={(e) => setEditFormData({...editFormData, pan: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="aadhaar">Aadhaar</Label>
              <Input
                id="aadhaar"
                value={editFormData.aadhaar || ''}
                onChange={(e) => setEditFormData({...editFormData, aadhaar: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={editFormData.dob || ''}
                onChange={(e) => setEditFormData({...editFormData, dob: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                value={editFormData.fatherName || ''}
                onChange={(e) => setEditFormData({...editFormData, fatherName: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={editFormData.address || ''}
                onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this user? They will not be able to access their dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="blockReason">Reason for blocking (optional)</Label>
            <Textarea
              id="blockReason"
              placeholder="Enter reason for blocking this user..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlockUserConfirm}>
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              User: <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUserConfirm}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



