// app/api/set-cookie/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = NextResponse.next();
  
  const { name, value } = await request.json();

  if (!name || !value) {
    return NextResponse.json({ error: 'Name and value are required' }, { status: 400 });
  }

  const url = new URL(request.url);
  const isSecure = url.protocol === 'https:';

  res.cookies.set(name, value, {
    httpOnly: true,
    secure: isSecure, // Set secure based on the request protocol
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'none',
  });

  return NextResponse.json({ message: 'Cookie set successfully' });
}
