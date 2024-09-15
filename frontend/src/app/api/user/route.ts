import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function handler(request: NextRequest, response: NextResponse) {
  const session = await auth();
  return await fetch(`${process.env.API_BASE_URL}/auth/user`, {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
}
