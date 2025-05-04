// app/api/tasks/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { title } = await req.json()

  const { data, error } = await supabase.from('tasks').insert([{ title, completed: false }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data![0])
  
}

export async function PUT(req: NextRequest) {
  const { id, completed } = await req.json()

  const { error } = await supabase.from('tasks').update({ completed }).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'updated' })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'deleted' })
}
