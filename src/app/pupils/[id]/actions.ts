'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function assignDiagnoses(formData: FormData) {
  const supabase = await createClient()

  const pupilId = formData.get('pupil_id') as string
  const selected = formData.getAll('diagnoses') as string[]

  // Remove old diagnoses
  await supabase.from('Pupil_Diagnosis').delete().eq('Pupil_ID', pupilId)

  // Insert new ones
  if (selected.length) {
    const newLinks = selected.map((labelId) => ({
      Pupil_ID: pupilId,
      Label_ID: labelId,
    }))
    await supabase.from('Pupil_Diagnosis').insert(newLinks)
  }

  redirect(`/pupils/${pupilId}`)
}
