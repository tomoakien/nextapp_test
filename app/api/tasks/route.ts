// app/api/tasks/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true })

  if (error) {
    console.error('[GET ERROR]', error.message); // 追加
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    try {
      const { title } = await req.json();
  
      if (!title || typeof title !== 'string' || title.trim() === '') {
        console.error('[POST] Invalid title:', title);
        return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title: title.trim(), completed: false }])
        .select(); // ← 重要！
  
      if (error) {
        console.error('[POST] Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      return NextResponse.json(data?.[0]); // 1件返す
    } catch (err: any) {
      console.error('[POST] Unexpected error:', err.message);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
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
