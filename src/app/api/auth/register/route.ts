import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, university } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs obligatoires ne sont pas remplis.' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Cet email est déjà utilisé par un autre compte.' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        university: university || null,
        role: Role.ETUDIANT,
        points: 0,
      },
    });

    // Retirer le mot de passe de l'objet retourné
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès !',
      user: userWithoutPassword,
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}