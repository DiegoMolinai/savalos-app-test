// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Cambia esto por tu clave real del entorno
const TOKEN_SECRET = "supersecreto123"

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const token = cookieHeader
      .split('; ')
      .find((c) => c.startsWith('token='))
      ?.split('=')[1]

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const decoded = jwt.verify(token, TOKEN_SECRET)
    const user = {
      id: decoded.id,
      name: decoded.name, // solo si lo incluiste en el token
      role: decoded.role, // idem
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
