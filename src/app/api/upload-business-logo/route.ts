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
    const file = formData.get("logo") as File;

    console.log('Upload de logo iniciado');
    console.log('Arquivo recebido:', file ? { name: file.name, size: file.size, type: file.type } : 'null');

    if (!file) {
      console.error('Nenhuma logo fornecida');
      return NextResponse.json(
        { error: "Nenhuma logo fornecida" },
        { status: 400 }
      );
    }

    // Validação robusta do arquivo
    const validation = validateUpload(file, UPLOAD_CONFIGS.image);
    if (!validation.valid) {
      console.error('Validação de arquivo falhou:', validation.error);
      return NextResponse.json(
        { error: validation.error || "Arquivo inválido" },
        { status: 400 }
      );
    }

    // Tentar fazer proxy para o worker primeiro
    console.log('Tentando fazer proxy para worker...');
    const workerResponse = await proxyToWorker("/api/upload-business-logo", formData);

    if (workerResponse) {
      console.log('Resposta do worker:', workerResponse.status, workerResponse.statusText);
      
      if (workerResponse.ok) {
        const data = await workerResponse.json();
        console.log('Upload bem-sucedido:', data);
        return NextResponse.json(data);
      } else {
        const errorData = await workerResponse.json().catch(() => ({ error: 'Erro desconhecido do worker' }));
        console.error('Erro do worker:', errorData);
        return NextResponse.json(
          { error: errorData.error || 'Erro ao fazer upload no worker' },
          { status: workerResponse.status }
        );
      }
    } else {
      console.warn('Worker não respondeu, usando fallback base64');
    }

    // Em desenvolvimento local, se o worker não estiver disponível ou R2 não funcionar,
    // criar uma URL base64 temporária
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({ 
        logoUrl: dataUrl,
        warning: "Logo salva temporariamente (base64). Em produção, será salva no R2."
      });
    } catch (error) {
      console.error("Erro ao processar logo:", error);
      return NextResponse.json(
        { 
          error: "Erro ao processar logo. Worker não está rodando ou R2 não está configurado." 
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Erro ao fazer upload da logo:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da logo" },
      { status: 500 }
    );
  }
}

