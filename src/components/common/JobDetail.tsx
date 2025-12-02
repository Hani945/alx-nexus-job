import Image from "next/image";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Globe,
  Briefcase,
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { JobDetailProps } from "@/types/job";

export function JobDetail({ job }: JobDetailProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const handleBackClick = () => {
    router.push("/jobs");
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    console.log(`${isSaved ? "Unsaving" : "Saving"} job:`, job.id);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job opportunity: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSaveClick}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Job Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
              <div className="flex flex-1 items-start gap-4">
                <Image
                  src={job.image_url}
                  alt={job.company}
                  width={80}
                  height={80}
                  className="bg-background rounded-xl border object-contain p-2"
                />

                <div className="flex-1">
                  <h1 className="text-2xl font-bold lg:text-3xl">
                    {job.title}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="mr-2 h-4 w-4" />
                      {job.company}
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {job.location}
                    </div>

                    {job.remote_policy && (
                      <div className="flex items-center text-muted-foreground">
                        <Globe className="mr-2 h-4 w-4" />
                        {job.remote_policy}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Posted on {formatDate(job.created_at)}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="flex min-w-[200px] flex-col gap-3">
                <Link href={`/apply/${job.id}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full">
                    Apply Now
                  </Button>
                </Link>

                {job.application_url && (
                  <Button variant="outline" size="lg" asChild>
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Company Website
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-3 border-t pt-6">
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <Clock className="h-4 w-4" />
                {job.type}
              </Badge>

              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </Badge>

              {job.experience_level && (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  <Briefcase className="h-4 w-4" />
                  {job.experience_level}
                </Badge>
              )}

              {job.category && (
                <Badge variant="outline" className="px-3 py-1">
                  {job.category}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Page Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Description */}
          <div className="space-y-6 lg:col-span-2">
            {job.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-primary mt-2 h-2 w-2 rounded-full" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Image
                    src={job.image_url}
                    alt={job.company}
                    width={50}
                    height={50}
                    className="rounded-lg border object-contain p-1"
                  />
                  <div>
                    <h3 className="font-semibold">{job.company}</h3>
                    <p className="text-muted-foreground text-sm">{job.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <OverviewRow label="Job Type" value={job.type} />
                <OverviewRow label="Location" value={job.location} />
                <OverviewRow label="Salary" value={job.salary} />
                <OverviewRow label="Experience" value={job.experience_level} />
                <OverviewRow label="Remote Policy" value={job.remote_policy} />
                <OverviewRow
                  label="Date Posted"
                  value={formatDate(job.created_at)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden fixed left-0 right-0 bottom-0 bg-background/90 border-t p-4">
        <Link href={`/apply/${job.id}`}>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
            Apply Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

function OverviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
