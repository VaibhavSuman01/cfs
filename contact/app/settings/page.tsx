"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Sun, Save, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import api from "@/lib/api-client";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      toast.success("Settings saved successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Profile Settings</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-gray-300">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
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
                <Label htmlFor="current-password" className="dark:text-gray-300">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="dark:text-gray-300">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="dark:text-gray-300">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={async () => {
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
                  } catch (error) {
                    const errorMessage = error && typeof error === 'object' && 'response' in error
                      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to change password"
                      : "Failed to change password";
                    toast.error(errorMessage);
                  } finally {
                    setIsChangingPassword(false);
                  }
                }}
                disabled={isChangingPassword}
              >
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

          {/* Appearance Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Appearance</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <Label className="dark:text-gray-300">Dark Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

