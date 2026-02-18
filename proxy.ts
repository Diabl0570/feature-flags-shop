import { precomputeFlags } from '@/lib/flags';
import { decryptOverrides } from 'flags';
import { serialize } from 'flags/next';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const encryptedOverrides = request.cookies.get('vercel-flag-overrides')?.value;
  const overrides = encryptedOverrides
    ? ((await decryptOverrides(encryptedOverrides)) ?? {})
    : {};

  const values = await Promise.all(
    precomputeFlags.map(async (featureFlag) => {
      const override = overrides[featureFlag.key];
      return override === undefined ? featureFlag() : override;
    }),
  );
  const code = await serialize(precomputeFlags, values);

  const nextUrl = request.nextUrl.clone();
  const pathname = nextUrl.pathname;

  nextUrl.pathname = pathname === '/' ? `/${code}` : `/${code}${pathname}`;

  return NextResponse.rewrite(nextUrl);
}

export const config = {
  matcher: ['/', '/products/:path*'],
};