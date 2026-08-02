import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "L'e-mail et le mot de passe sont requis." },
        { status: 400 }
      );
    }

    // 1. Rechercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // 2. Vérifier le mot de passe (comparaison avec le hash bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // 3. Déterminer la redirection selon le rôle
    let redirectUrl = '/dashboard'; 
    if (user.role === 'ADMIN') {
      redirectUrl = '/admin';
    } else if (user.role === 'CORRECTEUR') {
      redirectUrl = '/corrector';
    }

    // 4. Préparer la réponse avec les données
    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie !",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl,
    }, { status: 200 });

    // NOUVEAU : On crée un cookie sécurisé avec le rôle pour le Middleware
    response.cookies.set({
      name: 'userRole',
      value: user.role,
      httpOnly: true, // Sécurité : empêche le vol du cookie par des scripts malveillants
      path: '/',      // Accessible sur tout le site
      maxAge: 60 * 60 * 24 * 7, // Valide pendant 7 jours
    });

    return response;

  } catch (error: any) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}