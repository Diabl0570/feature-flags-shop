import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

type RevalidatePathPayload = {
  path?: string;
  paths?: string[];
  type?: 'page' | 'layout';
};

function getPaths(payload: RevalidatePathPayload): string[] {
  const singlePath = typeof payload.path === 'string' ? [payload.path] : [];
  const multiplePaths = Array.isArray(payload.paths)
    ? payload.paths.filter((path): path is string => typeof path === 'string')
    : [];

  return [...singlePath, ...multiplePaths]
    .map((path) => path.trim())
    .filter((path, index, all) => path.length > 0 && all.indexOf(path) === index);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as RevalidatePathPayload;
    const paths = getPaths(payload);

    if (paths.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a non-empty "path" or "paths" field.',
        },
        { status: 400 }
      );
    }

    for (const path of paths) {
      revalidatePath(path, payload.type);
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      paths,
      type: payload.type ?? null,
      now: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid JSON payload.',
      },
      { status: 400 }
    );
  }
}
