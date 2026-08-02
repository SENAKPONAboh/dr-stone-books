import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, firstName, email, phone, country, university, faculty, level, currentPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur manquant." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur existant
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Objet des données à mettre à jour
    let updateData: any = {
      name: name || user.name,
      firstName: firstName !== undefined ? firstName : user.firstName,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      country: country !== undefined ? country : user.country,
      university: university !== undefined ? university : user.university,
      faculty: faculty !== undefined ? faculty : user.faculty,
      level: level !== undefined ? level : user.level,
    };

    // Si l'utilisateur souhaite changer son mot de passe
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Le mot de passe actuel est requis pour définir un nouveau mot de passe." },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: "Le mot de passe actuel est incorrect." },
          { status: 401 }
        );
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Mettre à jour l'utilisateur en base de données
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès !",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        university: updatedUser.university,
        faculty: updatedUser.faculty,
        level: updatedUser.level,
        role: updatedUser.role,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}