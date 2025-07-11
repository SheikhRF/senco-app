'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

type Pupil = {
  Pupil_ID: string
  forename: string
  surname: string
  email: string
}

export default function PupilsPage() {
  const [pupils, setPupils] = useState<Pupil[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPupils = async () => {
      const { data, error } = await supabase.from('Pupil').select('*')

      if (error) {
        console.error('Supabase error:', error)
      } else {
        setPupils(data || [])
      }

      setLoading(false)
    }

    fetchPupils()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pupils</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : pupils.map((pupil) => (
              <Link key={pupil.Pupil_ID} href={`/pupils/${pupil.Pupil_ID}`}>
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-bold">{pupil.forename} {pupil.surname}</p>
                    <p className="text-sm text-muted-foreground">{pupil.email}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  )
}
