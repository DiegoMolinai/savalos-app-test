import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

// Decodificador usando clave secreta
const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('🔒 No token. Redirigiendo a login.');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verificar token con 'jose'
    await jwtVerify(token, getJwtSecret());
    console.log('✅ Token válido');
    return NextResponse.next();
  } catch (err) {
    console.error('❌ Token inválido:', err.message);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}


export const config = {
  matcher: ['/visitas', '/visitas/(.*)', '/admin', '/admin/(.*)', '/items', '/items/(.*)'],
};


