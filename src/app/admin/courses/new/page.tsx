import CourseForm from "@/features/courses/components/CourseForm";
import PageHeader from "@/components/PageHeader";
import React from "react";

function NewPage() {
  return (
    <div className="p-10">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
export default NewPage;
