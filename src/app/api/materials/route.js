import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Material from '@/models/Material';

export async function GET() {
  await dbConnect();
  try {
    const materials = await Material.find().sort({ name: 1 });
    return NextResponse.json(materials);
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching materials' }, { status: 500 });
  }
}
