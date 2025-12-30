import { NextRequest, NextResponse } from "next/server";
import { validateUpload, UPLOAD_CONFIGS } from "@/lib/validateUpload";

// Configurar limite de body size para 10MB
export const runtime = 'nodejs';
export const maxDuration = 30;

const WORKER_URL = process.env.WORKER_URL || "http://localhost:5173";

async function proxyToWorker(path: string, formData: FormData) {
  try {
    const response = await fetch(`${WORKER_URL}${path}`, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Erro ao fazer proxy para worker:", error);
    return null;
  }
}

// Desabilitar body parser padrão para permitir uploads grandes
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhuma foto fornecida" },
        { status: 400 }
      );
    }

    // Validação robusta do arquivo
    const validation = validateUpload(file, UPLOAD_CONFIGS.image);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Arquivo inválido" },
        { status: 400 }
      );
    }

    // Tentar fazer proxy para o worker primeiro
    const workerResponse = await proxyToWorker("/api/upload-pet-photo", formData);

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    // Em desenvolvimento local, se o worker não estiver disponível ou R2 não funcionar,
    // criar uma URL base64 temporária
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({ 
        photoUrl: dataUrl,
        warning: "Imagem salva temporariamente (base64). Em produção, será salva no R2."
      });
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      return NextResponse.json(
        { 
          error: "Erro ao processar imagem. Worker não está rodando ou R2 não está configurado." 
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da foto" },
      { status: 500 }
    );
  }
}

