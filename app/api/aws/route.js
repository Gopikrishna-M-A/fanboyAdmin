import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";



const generateUniqueFileName = (originalFileName) => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, ''); // Remove non-numeric characters from timestamp
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
  const fileExtension = originalFileName.split('.').pop(); // Get file extension
  // Concatenate timestamp, random string, and file extension to create a unique filename
  return `${timestamp}_${randomString}.${fileExtension}`;
}


const Bucket = process.env.AWS_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
export async function POST(request) {
  const formData = await request.formData();
  const files = formData.getAll("file");

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const uniqueFileName = generateUniqueFileName(file.name);
      const Body = (await file.arrayBuffer());
      s3.send(new PutObjectCommand({ Bucket, Key: uniqueFileName, Body }));
      return `https://${Bucket}.s3.amazonaws.com/${uniqueFileName}`;
    })
  );

  return NextResponse.json(uploadedFiles);
}

// https://<bucker-name>.s3.<region>.amazonaws.com/<filename>