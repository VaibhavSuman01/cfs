"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Edit, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonalInformationDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
              <Input
                value={user.name || "Not provided"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <Input
                value={user.email || "Not provided"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">PAN</Label>
              <Input
                value={user.pan || "Not provided"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Mobile No.</Label>
              <Input
                value={user.mobile || "Not provided"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Aadhar No.</Label>
              <Input
                value={user.aadhaar || "Not provided"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

