import { JobCard } from './JobCard'
import { JobsGridProps } from '@/types/job'

export function JobsGrid({ jobs }: JobsGridProps) {
  if (jobs.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
