'use client'

import { useState } from 'react'
import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpgradeDialog } from './UpgradeDialog'

interface UpgradeButtonProps {
  userId: string
  email: string
}

export function UpgradeButton({ userId, email }: UpgradeButtonProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setUpgradeOpen(true)}>
        <Crown className="h-4 w-4 mr-2" />
        Upgrade to Pro
      </Button>
      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        userId={userId}
        email={email}
      />
    </>
  )
}
