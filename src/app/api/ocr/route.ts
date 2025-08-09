import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash";

    const payload = {
      contents: [
        {
          parts: [
            { text: "Extract all visible text from this image." },
            { inlineData: { mimeType: file.type, data: base64 } },
          ],
        },
      ],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No text found.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("OCR API Error:", error);
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}
