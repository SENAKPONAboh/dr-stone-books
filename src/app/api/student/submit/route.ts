import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('studentId') as string;
    const bookTitle = formData.get('bookTitle') as string;
    const caseNumber = formData.get('caseNumber') as string;

    if (!file || !userId || !bookTitle || !caseNumber) {
      return NextResponse.json(
        { success: false, error: "Tous les champs (fichier, étudiant, livre, cas) sont requis." },
        { status: 400 }
      );
    }

    // 1. S'assurer que le dossier public/uploads existe physiquement
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Le dossier existe déjà ou erreur gérée
    }

    // 2. Sauvegarder l'image localement dans public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // 3. Créer la soumission en base de données avec le statut PENDING aligné sur Prisma
    const newSubmission = await prisma.caseSubmission.create({
      data: {
        userId: userId,
        bookTitle: bookTitle,
        caseNumber: caseNumber,
        imageUrl: imageUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Votre réponse a été envoyée avec succès au correcteur !",
      submission: newSubmission,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Erreur lors de la soumission de la copie :", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}