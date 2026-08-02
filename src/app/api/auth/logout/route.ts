import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Déconnexion réussie" });
  
  // On supprime le cookie en mettant un âge max de 0
  response.cookies.set({
    name: 'userRole',
    value: '',
    maxAge: 0,
    path: '/',
  });

  return response;
}