"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api-client";

interface SupportTeamMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function SupportTeamManagementPage() {
  const [members, setMembers] = useState<SupportTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SupportTeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "live_support",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/support-team/members");
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      toast.error("Failed to load support team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "live_support",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (member: SupportTeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      phone: member.phone || "",
      role: member.role,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!editingMember && !formData.password) {
      toast.error("Password is required for new members");
      return;
    }

    try {
      if (editingMember) {
        await api.put(`/api/support-team/members/${editingMember._id}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        });
        toast.success("Member updated successfully");
      } else {
        await api.post("/api/support-team/register", formData);
        toast.success("Member created successfully");
      }
      setIsDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save member"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      await api.delete(`/api/support-team/members/${id}`);
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete member");
    }
  };

  const handleToggleActive = async (member: SupportTeamMember) => {
    try {
      await api.put(`/api/support-team/members/${member._id}`, {
        isActive: !member.isActive,
      });
      toast.success(
        `Member ${!member.isActive ? "activated" : "deactivated"} successfully`
      );
      fetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update member");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8" />
              Support Team Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage support team members - Create, edit, and delete support staff
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {member.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {member.role === "company_information_support" && "Company Info"}
                    {member.role === "taxation_support" && "Taxation"}
                    {member.role === "roc_returns_support" && "ROC Returns"}
                    {member.role === "other_registration_support" && "Registration"}
                    {member.role === "advisory_support" && "Advisory"}
                    {member.role === "reports_support" && "Reports"}
                    {member.role === "live_support" && "Live Support"}
                    {!["company_information_support", "taxation_support", "roc_returns_support", "other_registration_support", "advisory_support", "reports_support", "live_support"].includes(member.role) && member.role}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      member.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleToggleActive(member)}
              >
                {member.isActive ? "Deactivate" : "Activate"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "Add New Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Update support team member information"
                : "Create a new support team member"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            {!editingMember && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company_information_support">
                    Company Information Support
                  </SelectItem>
                  <SelectItem value="taxation_support">
                    Taxation Support
                  </SelectItem>
                  <SelectItem value="roc_returns_support">
                    ROC Returns Support
                  </SelectItem>
                  <SelectItem value="other_registration_support">
                    Other Registration Support
                  </SelectItem>
                  <SelectItem value="advisory_support">
                    Advisory Support
                  </SelectItem>
                  <SelectItem value="reports_support">
                    Reports Support
                  </SelectItem>
                  <SelectItem value="live_support">
                    Live Support
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select the service area this support member will handle
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingMember ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

