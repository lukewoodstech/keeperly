import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Droplet, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuickLogDialogWrapper } from '@/components/QuickLogDialogWrapper'
import { EventTimeline } from '@/components/EventTimeline'
import { createClient } from '@/lib/supabaseServer'
import { fmtDate } from '@/lib/format'
import type { Animal, Event } from '@/lib/types'

interface AnimalDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null // Layout will redirect
  }

  // Fetch animal from database
  const { data: animal } = await supabase
    .from('animals')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (!animal) {
    notFound()
  }

  // Fetch events for this animal
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('animal_id', id)
    .order('happened_on', { ascending: false })

  const eventList = (events || []) as Event[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/app"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Animals
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{animal.name}</h1>
              {animal.sex && (
                <Badge variant="secondary">{animal.sex}</Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{animal.species}</p>
          </div>

          <div className="flex gap-2">
            <QuickLogDialogWrapper animalId={animal.id} userId={session.user.id} />
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {animal.dob && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date of Birth</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtDate(animal.dob)}</div>
            </CardContent>
          </Card>
        )}

        {animal.acquisition_date && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acquired</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtDate(animal.acquisition_date)}</div>
            </CardContent>
          </Card>
        )}

        {animal.morph && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Morph</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animal.morph}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventList.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <EventTimeline events={eventList} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Animal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-muted-foreground">Species:</div>
                  <div className="col-span-2 font-medium">{animal.species}</div>
                </div>
                {animal.breed && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-muted-foreground">Breed:</div>
                    <div className="col-span-2 font-medium">{animal.breed}</div>
                  </div>
                )}
                {animal.sex && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-muted-foreground">Sex:</div>
                    <div className="col-span-2 font-medium">{animal.sex}</div>
                  </div>
                )}
                {animal.notes && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-muted-foreground">Notes:</div>
                    <div className="col-span-2 font-medium">{animal.notes}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
