import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');

export async function middleware(req: NextRequest) {
  console.log("Middleware ejecutado en la ruta:", req.nextUrl.pathname); // <-- Añadir esto para depuración

  const token = req.cookies.get('userToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/personal') && payload.role !== 'personal') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/personal/:path*'], // Rutas protegidas
};
