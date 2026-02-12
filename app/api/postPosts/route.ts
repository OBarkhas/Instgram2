import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface PostRequestBody {
  content: string;
  images: string[];
  ownerId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PostRequestBody = await req.json();

    const { content, images, ownerId } = body;

    if (!ownerId) {
      return NextResponse.json({ error: "ownerId needed" }, { status: 400 });
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "images is empty" }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        images,
        ownerId,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
