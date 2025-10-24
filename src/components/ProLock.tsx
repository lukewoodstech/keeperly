'use client'

import { Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProLockProps {
  feature: string
  onUpgradeClick?: () => void
}

export function ProLock({ feature, onUpgradeClick }: ProLockProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-muted-foreground">
          <Lock className="h-5 w-5" />
          {feature}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to Breeding Pro to unlock this feature
        </p>
        <Button onClick={onUpgradeClick} size="sm">
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  )
}
