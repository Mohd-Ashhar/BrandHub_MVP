"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { createStudent } from "@/app/dashboard/admin/students/actions";

interface Brand {
  id: string;
  name: string;
}

export function StudentForm({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  ); // ✅ Changed to undefined

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // ✅ Only append brand if selected
    if (selectedBrand) {
      formData.append("brandId", selectedBrand);
    }

    const result = await createStudent(formData);

    if (result.success) {
      router.push("/dashboard/admin/students");
      router.refresh();
    } else {
      setError(result.message || "Failed to create student");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          Temporary Password <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimum 6 characters"
          minLength={6}
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          This will be the student&apos;s initial password. They should change
          it after first login.
        </p>
      </div>

      {/* Phone and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="+91 98765 43210"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="Mumbai"
            disabled={loading}
          />
        </div>
      </div>

      {/* State and Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            placeholder="Maharashtra"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandId">Brand (Optional)</Label>
          <Select
            value={selectedBrand}
            onValueChange={(value) =>
              setSelectedBrand(value === "none" ? undefined : value)
            } // ✅ Handle "none"
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand (optional)" />
            </SelectTrigger>
            <SelectContent>
              {/* ✅ FIX: Use valid value instead of empty string */}
              <SelectItem value="none">No brand assigned</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Leave unassigned if student isn&apos;t associated with a specific
            brand
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error creating student</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Creating..." : "Create Student"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
