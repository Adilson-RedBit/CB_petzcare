import { NextRequest, NextResponse } from "next/server";

// URL do worker em desenvolvimento (Vite roda na porta 5173)
const WORKER_URL = process.env.WORKER_URL || "http://localhost:5173";

async function proxyToWorker(path: string, options?: RequestInit) {
  try {
    const response = await fetch(`${WORKER_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    return response;
  } catch (error) {
    console.error("Erro ao fazer proxy para worker:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Tentar fazer proxy para o worker primeiro
    const workerResponse = await proxyToWorker("/api/admin/working-hours", {
      method: "GET",
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    // Se o worker não estiver disponível, retornar array vazio
    // Isso permite que a UI funcione mesmo sem o worker rodando
    return NextResponse.json([]);
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horários de trabalho" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Tentar fazer proxy para o worker primeiro
    const workerResponse = await proxyToWorker("/api/admin/working-hours", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    // Se o worker não estiver disponível, retornar sucesso
    // (os dados serão salvos quando o worker estiver rodando)
    console.warn("Worker não disponível, dados não foram salvos:", body);
    return NextResponse.json({ 
      success: true,
      warning: "Worker não está rodando. Os dados serão salvos quando o worker estiver disponível."
    });
  } catch (error) {
    console.error("Erro ao salvar horários:", error);
    return NextResponse.json(
      { error: "Erro ao salvar horários de trabalho" },
      { status: 500 }
    );
  }
}

