import { toolbarFlags } from '@/lib/flags';
import { getProviderData } from 'flags/next';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(getProviderData(toolbarFlags));
}
