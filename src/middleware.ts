import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // On vérifie si un cookie contenant le rôle de l'utilisateur existe
  const userRole = request.cookies.get('userRole')?.value;

  // 1. Protection de la zone Admin
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      // Si ce n'est pas un Admin, on le renvoie à la page de connexion
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Protection de la zone Correcteur
  if (pathname.startsWith('/corrector')) {
    // L'Admin ou le Correcteur peuvent accéder à cet espace
    if (userRole !== 'CORRECTEUR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Protection du Dashboard (Étudiants)
  if (pathname.startsWith('/dashboard')) {
    // Il faut au moins être connecté pour voir le dashboard
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// On indique au middleware sur quelles routes il doit s'activer
export const config = {
  matcher: ['/admin/:path*', '/corrector/:path*', '/dashboard/:path*'],
};