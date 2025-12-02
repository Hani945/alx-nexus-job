import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Building2, Clock, DollarSign } from 'lucide-react'
import { JobCardProps } from '@/types/job'
import { useRouter } from 'next/router'

export function JobCard({ job }: JobCardProps) {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/jobs/${job.id}`)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the button
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    router.push(`/jobs/${job.id}`)
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={job.image_url}
                alt={job.company}
                width={64}
                height={64}
                className="bg-background rounded-xl border object-contain p-2 shadow-sm"
              />
              <div className="border-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 bg-green-500" />
            </div>
            <div>
              <h3 className="text-foreground group-hover:text-primary line-clamp-2 font-semibold transition-colors">
                {job.title}
              </h3>
              <div className="text-muted-foreground mt-1 flex items-center">
                <Building2 className="mr-1 h-4 w-4" />
                <span className="text-sm font-medium">{job.company}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location */}
        <div className="text-muted-foreground flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          <span className="text-sm">{job.location}</span>
        </div>

        {/* Job Type */}
        <div className="text-muted-foreground flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          <span className="text-sm capitalize">{job.type}</span>
        </div>

        {/* Salary */}
        <div className="text-muted-foreground flex items-center">
          <DollarSign className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {job.salary}
          </span>
        </div>

        {/* Tags and Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <Badge variant="secondary" className="capitalize">
            {job.type}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
