"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function DashboardIndexRedirect() {
  useEffect(() => {
    redirect("/dashboard/executive-summary");
  }, []);
  return null;
}
