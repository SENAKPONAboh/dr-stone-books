import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Vérifier si le compte existe déjà pour éviter les doublons
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "arthur@drstonebooks.com" }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Le compte administrateur existe déjà." });
    }

    // Crypter le mot de passe avant de l'enregistrer (Règle absolue de sécurité)
    const hashedPassword = await bcrypt.hash("AdminSecurise2026!", 10);

    // Créer ton profil dans la base de données
    const newAdmin = await prisma.user.create({
      data: {
        firstName: "Arthur",
        name: "ABOH",
        email: "arthur@drstonebooks.com",
        password: hashedPassword,
        role: "ADMIN",
      }
    });

    return NextResponse.json({ 
      message: "Clé du royaume forgée avec succès.", 
      admin: newAdmin.email 
    });

  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du compte." }, { status: 500 });
  }
}