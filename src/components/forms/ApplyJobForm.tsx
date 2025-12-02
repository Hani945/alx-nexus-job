"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ApplyJobForm({
  jobId,
  userId,
}: {
  jobId: string;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: jobId,
        user_id: userId,
        cover_letter: coverLetter,
        cv_url: cvUrl,
      }),
    });

    setLoading(false);

    const data = await res.json();

    if (res.ok) {
      alert("Application submitted!");
    } else {
      alert(data.error || "Something went wrong!");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl">
      <Textarea
        placeholder="Write a short cover letter..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />

      <Input
        placeholder="Paste your CV URL"
        value={cvUrl}
        onChange={(e) => setCvUrl(e.target.value)}
      />

      <Button disabled={loading} type="submit">
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
