import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { createClient } from '@/lib/supabaseServer'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check authentication - use getUser() for security
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Get subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const hasPro = subscription?.status === 'active'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar hasPro={hasPro} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar email={user.email || ''} hasPro={hasPro} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
