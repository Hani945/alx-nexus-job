import { supabase } from '@/lib/supabaseClient'
import { JobDetail } from '@/components/common/JobDetail'
import { EmptyState } from '@/components/common/EmptyState'
import { Job } from '@/types/job'


import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

interface JobDetailPageProps {
  job: Job | null
}

export default function JobDetailPage({ job }: JobDetailPageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Job Not Found"
            message="The job you're looking for doesn't exist or has been removed."
          />
        </div>
      </div>
    )
  }

  return <JobDetail job={job} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !job) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      job,
    },
  }
}
