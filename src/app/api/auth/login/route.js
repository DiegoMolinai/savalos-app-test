import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { email, password } = body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.fullName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        name: user.fullName,
        role: user.role
      }
    });

    response.cookies.set({
      name: 'token',
      value: token,
    //   httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 día
      path: '/'
    });

    return response;
  } catch (err) {
    console.error('Error en login:', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
