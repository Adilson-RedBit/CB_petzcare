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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const workerResponse = await proxyToWorker(`/api/appointments/${id}/confirm`, {
      method: "PATCH",
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { 
        error: "Worker não está rodando. Por favor, execute 'npm run dev:worker' em outro terminal." 
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Erro ao confirmar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao confirmar agendamento" },
      { status: 500 }
    );
  }
}

