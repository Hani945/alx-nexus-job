import { supabase } from '@/lib/supabaseClient'
import { JobsGrid } from '@/components/common/JobsGrid'
import { EmptyState } from '@/components/common/EmptyState'
import { Job } from '../../types/job'

interface JobsPageProps {
  jobs: Job[]
}

export default function JobsPage({ jobs }: JobsPageProps) {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Find Your Dream Job
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Discover opportunities that match your skills and ambitions
          </p>
        </div>

        {/* Jobs Grid or Empty State */}
        {jobs.length > 0 ? <JobsGrid jobs={jobs} /> : <EmptyState />}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: {
      jobs: jobs ?? [],
    },
  }
}
