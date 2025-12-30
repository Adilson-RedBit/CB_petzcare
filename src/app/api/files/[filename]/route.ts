import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.WORKER_URL || "http://localhost:5173";

async function proxyToWorker(path: string) {
  try {
    const response = await fetch(`${WORKER_URL}${path}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Erro ao fazer proxy para worker:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // Decodificar o filename e garantir que está correto
    const decodedFilename = decodeURIComponent(filename);
    console.log('📁 Buscando arquivo via proxy [filename]:', decodedFilename);

    // Se o filename contém barras, redirecionar para a rota catch-all
    if (decodedFilename.includes('/')) {
      // Redirecionar para a rota catch-all que lida com caminhos
      const url = new URL(request.url);
      url.pathname = `/api/files/${decodedFilename}`;
      return NextResponse.redirect(url);
    }

    // Tentar fazer proxy para o worker primeiro
    const workerPath = `/api/files/${decodedFilename}`;
    console.log('🔗 Caminho do worker:', workerPath);
    
    const workerResponse = await proxyToWorker(workerPath);

    if (workerResponse) {
      console.log('📡 Resposta do worker:', workerResponse.status, workerResponse.statusText);
      
      if (workerResponse.ok) {
      // Retornar a resposta do worker com os headers corretos
      const blob = await workerResponse.blob();
      const headers = new Headers();
      
      // Copiar headers importantes do worker
      workerResponse.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === "content-type" || lowerKey === "cache-control" || lowerKey === "etag") {
          headers.set(key, value);
        }
      });
      
      // Se não tiver content-type, tentar inferir do filename
      if (!headers.has("content-type")) {
        const extension = decodedFilename.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
        };
        if (extension && mimeTypes[extension]) {
          headers.set("content-type", mimeTypes[extension]);
        } else {
          headers.set("content-type", "application/octet-stream");
        }
      }
      
      return new NextResponse(blob, { headers });
    }

    // Se o worker não estiver disponível ou retornar erro, verificar se é uma URL base64
    if (decodedFilename.startsWith('data:')) {
      // É uma URL base64, retornar diretamente (não deve acontecer, mas por segurança)
      return NextResponse.json(
        { error: "URL base64 não pode ser servida via proxy" },
        { status: 400 }
      );
    }

    // Se o worker não estiver disponível, retornar 404
    console.warn('Worker não respondeu ou arquivo não encontrado:', decodedFilename);
    return NextResponse.json(
      { error: "Arquivo não encontrado ou worker não está rodando" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Erro ao buscar arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar arquivo" },
      { status: 500 }
    );
  }
}

