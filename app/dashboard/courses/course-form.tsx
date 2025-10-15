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
import { Course } from "./columns";
import { createCourse, updateCourse } from "./actions";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
});

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
}

export function CourseForm({ course, onClose }: CourseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setServerError(null);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || "");

    const result = course
      ? await updateCourse(course.id, formData)
      : await createCourse(formData);

    if (result.success) {
      onClose();
    } else if (result.message) {
      // You can add more specific checks here if you add unique constraints to courses
      setServerError(result.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Introduction to React" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Learn the basics of React..."
                    {...field}
                  />
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
