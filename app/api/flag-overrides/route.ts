import { decryptOverrides, encryptOverrides } from 'flags';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const OVERRIDES_COOKIE_NAME = 'vercel-flag-overrides';

type FlagOverrides = Record<string, unknown>;

async function getCurrentOverrides(): Promise<FlagOverrides> {
  const cookieStore = await cookies();
  const encryptedOverride = cookieStore.get(OVERRIDES_COOKIE_NAME)?.value;

  if (!encryptedOverride) {
    return {};
  }

  try {
    const decrypted = await decryptOverrides(encryptedOverride);
    return decrypted ?? {};
  } catch {
    return {};
  }
}

export async function GET() {
  const overrides = await getCurrentOverrides();
  return NextResponse.json({ overrides });
}

export async function POST(req: Request) {
  const payload = (await req.json()) as FlagOverrides;
  const currentOverrides = await getCurrentOverrides();
  const nextOverrides = { ...currentOverrides, ...payload };

  const encrypted = await encryptOverrides(nextOverrides, process.env.FLAGS_SECRET);

  const res = NextResponse.json({ success: true });

  res.cookies.set(OVERRIDES_COOKIE_NAME, encrypted, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });

  res.cookies.delete(OVERRIDES_COOKIE_NAME);

  return res;
}
