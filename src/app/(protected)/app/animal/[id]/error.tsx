'use client'

import { useEffect } from 'react'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="space-y-4">
      <Link
        href="/app"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Animals
      </Link>

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              We encountered an error while loading this animal's details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={reset} className="w-full">
              Try Again
            </Button>
            <Link href="/app" className="block">
              <Button variant="outline" className="w-full">
                Back to Animals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
