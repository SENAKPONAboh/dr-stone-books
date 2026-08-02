import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Récupérer tous les utilisateurs (GET)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        university: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur GET /api/admin/users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 2. Créer un nouvel utilisateur (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, university } = body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Cet email est déjà utilisé." }, { status: 400 });
    }

    // Création (Pense à hacher le mot de passe avec bcrypt si nécessaire)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Idéalement haché avec bcrypt.hash(password, 10)
        role: role || 'ETUDIANT',
        university: university || null,
      },
    });

    return NextResponse.json({ success: true, message: "Utilisateur créé avec succès !", user: newUser });
  } catch (error) {
    console.error("Erreur POST /api/admin/users:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création." }, { status: 500 });
  }
}

// 3. Modifier le rôle d'un utilisateur (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Erreur PATCH /api/admin/users:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour du rôle." }, { status: 500 });
  }
}