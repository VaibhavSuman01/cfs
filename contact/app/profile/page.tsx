"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Save, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import api from "@/lib/api-client";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await api.put("/api/support-team/change-password", {
        currentPassword,
        newPassword,
      });
      
      if (response.data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-8 w-8" />
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your profile information and password
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Profile Information</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-gray-300">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="dark:text-gray-300">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="dark:text-gray-300">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

