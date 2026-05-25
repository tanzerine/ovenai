import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  await supabase.from('user_points').select('user_id').limit(1)
  return NextResponse.json({ ok: true })
}
