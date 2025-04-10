import React from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function coursePage() {
  return (
    <div className="p-10">
      <PageHeader title="Courses">
        <Button className="hover:cursor-pointer" asChild>
          <Link href="/admin/courses/new">Add Course</Link>
        </Button>
      </PageHeader>
      <div>Hello</div>
    </div>
  );
}

export default coursePage;
