import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

type RevalidateTagPayload = {
  tag?: string;
  tags?: string[];
};

function getTags(payload: RevalidateTagPayload): string[] {
  const singleTag = typeof payload.tag === 'string' ? [payload.tag] : [];
  const multipleTags = Array.isArray(payload.tags)
    ? payload.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return [...singleTag, ...multipleTags]
    .map((tag) => tag.trim())
    .filter((tag, index, all) => tag.length > 0 && all.indexOf(tag) === index);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as RevalidateTagPayload;
    const tags = getTags(payload);

    if (tags.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a non-empty "tag" or "tags" field.',
        },
        { status: 400 }
      );
    }

    for (const tag of tags) {
      revalidateTag(tag, "page");
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tags,
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
