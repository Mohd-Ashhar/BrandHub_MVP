"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Student } from "./columns";
import { createStudent, updateStudent } from "./actions";
import { useState } from "react";

// Define the form schema for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

interface StudentFormProps {
  student?: Student; // Student data for editing, optional
  onClose: () => void; // Function to close the dialog
}

export function StudentForm({ student, onClose }: StudentFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setServerError(null); // Clear previous errors
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);

    const result = student
      ? await updateStudent(student.id, formData)
      : await createStudent(formData);

    if (result.success) {
      onClose(); // Close the dialog on success
    } else if (result.message) {
      // Create a more user-friendly error message
      if (result.message.includes("students_email_key")) {
        setServerError("A student with this email already exists.");
      } else {
        setServerError(result.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {serverError && (
          <div className="rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-700">
            <p>{serverError}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
