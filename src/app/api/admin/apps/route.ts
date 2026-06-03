import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase.from('apps').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ app: data });
  }

  const { data, error } = await supabase.from('apps').select('*').order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ apps: data });
}

export async function POST(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('apps').insert([body as any]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ app: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { data, error } = await supabase.from('apps').update(updates as any).eq('id', id).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ app: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const { error } = await supabase.from('apps').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
