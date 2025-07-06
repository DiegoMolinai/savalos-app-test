import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import User from '@/models/User';

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({ isActive: true }).sort({ fullName: 1 });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
