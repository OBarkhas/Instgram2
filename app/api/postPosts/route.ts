import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { content, images } = await req.json();
}
