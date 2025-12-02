import { Building2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title?: string
  message?: string
  showAction?: boolean
}

export function EmptyState({
  title = 'No jobs available',
  message = 'There are currently no job openings. Please check back later.',
  showAction = false,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto max-w-md">
        <Building2 className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
        <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        {showAction && (
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Browse All Jobs
          </Button>
        )}
      </div>
    </div>
  )
}
