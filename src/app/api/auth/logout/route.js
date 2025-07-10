// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server'

export async function POST() {
  // Eliminar cookie 'token' (establecerla vencida)
  const response = NextResponse.json({ message: 'Logout exitoso' })

  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    maxAge: 0, // ⚠️ Esto elimina la cookie
    httpOnly: true,
    secure: true, // poner en false si estás en localhost sin HTTPS
    sameSite: 'lax',
  })

  return response
}
