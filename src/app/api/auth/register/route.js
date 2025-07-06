import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  const { fullName, email, password, role } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Usuario ya registrado' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ fullName, email, passwordHash, role });

  return NextResponse.json({ message: 'Usuario creado correctamente' });
}
