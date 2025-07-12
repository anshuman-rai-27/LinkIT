import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Ensure Node.js runtime for file upload

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Read Cloudinary credentials from env
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ message: 'Cloudinary not configured' }, { status: 500 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Prepare form data for Cloudinary
  const form = new FormData();
  form.append('file', new Blob([buffer]), file.name);
  form.append('upload_preset', 'odooskill'); // Use your unsigned preset or remove if using API key/secret

  // Use basic auth for Cloudinary API
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  // Upload to Cloudinary
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`
    },
    body: form,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return NextResponse.json({ message: 'Cloudinary upload failed', error }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ url: data.secure_url });
} 