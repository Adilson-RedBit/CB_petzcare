import { NextRequest, NextResponse } from "next/server";

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
    const workerResponse = await proxyToWorker("/api/admin/service-pricing", {
      method: "GET",
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    // Se o worker não estiver disponível, retornar array vazio
    return NextResponse.json([]);
  } catch (error) {
    console.error("Erro ao buscar preços:", error);
    return NextResponse.json(
      { error: "Erro ao buscar preços" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const workerResponse = await proxyToWorker("/api/admin/service-pricing", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json(
      { 
        error: "Worker não está rodando. Por favor, execute 'npm run dev:worker' em outro terminal." 
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Erro ao salvar preço:", error);
    return NextResponse.json(
      { error: "Erro ao salvar preço" },
      { status: 500 }
    );
  }
}

