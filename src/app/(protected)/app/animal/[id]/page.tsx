import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Droplet } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuickLogDialogWrapper } from '@/components/QuickLogDialogWrapper'
import { EventTimeline } from '@/components/EventTimeline'
import { AnimalActions } from '@/components/AnimalActions'
import { createClient } from '@/lib/supabaseServer'
import { fmtDate } from '@/lib/format'
import type { Animal, Event } from '@/lib/types'

interface AnimalDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user - use getUser() for security
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout will redirect
  }

  // Fetch animal from database
  const { data: animal } = await supabase
    .from('animals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/app"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 w-fit transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Animals
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{animal.name}</h1>
              {animal.sex && (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 border-gray-200"
                >
                  {animal.sex}
                </Badge>
              )}
            </div>
            <p className="text-lg text-gray-600">{animal.species}</p>
          </div>

          <div className="flex gap-2">
            <QuickLogDialogWrapper animalId={animal.id} userId={user.id} />
            <AnimalActions animal={animal as Animal} userId={user.id} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {animal.dob && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{fmtDate(animal.dob)}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {animal.acquisition_date && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Acquired</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{fmtDate(animal.acquisition_date)}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {animal.morph && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Morph</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{animal.morph}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Droplet className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{eventList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <EventTimeline events={eventList} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-900">Animal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 text-sm">
                <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="text-gray-600 font-medium">Species:</div>
                  <div className="col-span-2 font-semibold text-gray-900">{animal.species}</div>
                </div>
                {animal.breed && (
                  <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="text-gray-600 font-medium">Breed:</div>
                    <div className="col-span-2 font-semibold text-gray-900">{animal.breed}</div>
                  </div>
                )}
                {animal.sex && (
                  <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="text-gray-600 font-medium">Sex:</div>
                    <div className="col-span-2 font-semibold text-gray-900">{animal.sex}</div>
                  </div>
                )}
                {animal.notes && (
                  <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="text-gray-600 font-medium">Notes:</div>
                    <div className="col-span-2 font-semibold text-gray-900">{animal.notes}</div>
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
