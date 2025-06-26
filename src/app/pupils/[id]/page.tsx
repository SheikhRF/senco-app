// app/pupils/[id]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { assignDiagnoses } from './actions'
import { Button } from '@/components/ui/button'

export default async function PupilDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch pupil
  const { data: pupil, error: pupilError } = await supabase
    .from('Pupil')
    .select('*')
    .eq('Pupil_ID', params.id)
    .single()

  if (!pupil || pupilError) return notFound()

  // Fetch all diagnoses
  const { data: allDiagnoses } = await supabase
    .from('Diagnosis')
    .select('Label_ID, Label, Description')

  // Fetch current diagnoses for pupil
  const { data: currentDiagnoses } = await supabase
    .from('Pupil_Diagnosis')
    .select('Label_ID')
    .eq('Pupil_ID', params.id)

  const selectedDiagnosisIds = new Set(currentDiagnoses?.map(d => d.Label_ID))

  // Fetch related barriers and strategies
  const { data: strategies } = await supabase.rpc('get_strategies_for_pupil', {
    pupil_id_input: params.id,
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{pupil.forename} {pupil.surname}</h1>
      <p className="text-muted-foreground">{pupil.email}</p>

      {/* Diagnoses Form */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Assign Diagnoses</h2>
        <form action={assignDiagnoses} className="space-y-4">
          <input type="hidden" name="pupil_id" value={params.id} />
          {allDiagnoses?.map((diag) => (
            <div key={diag.Label_ID} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="diagnoses"
                value={diag.Label_ID}
                defaultChecked={selectedDiagnosisIds.has(diag.Label_ID)}
              />
              <label className="font-medium">{diag.Label}</label>
            </div>
          ))}
          <Button type="submit" className="mt-4">Save Diagnoses</Button>
        </form>
      </div>

      {/* Related Strategies */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Suggested Strategies</h2>
        {strategies?.length ? (
          <ul className="list-disc pl-4 space-y-1">
            {strategies.map((s: any) => (
              <li key={s.Strategy_ID}>
                <strong>{s.Strategy}</strong> – {s.Description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No strategies available.</p>
        )}
      </div>
    </div>
  )
}
