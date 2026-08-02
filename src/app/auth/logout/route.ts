import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie.",
    });

    // Supprimer le cookie de rôle en le périmant immédiatement
    response.cookies.set({
      name: 'userRole',
      value: '',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error("Erreur lors de la déconnexion :", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la déconnexion." },
      { status: 500 }
    );
  }
}