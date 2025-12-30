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
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    
    const path = date ? `/api/appointments?date=${date}` : "/api/appointments";
    
    const workerResponse = await proxyToWorker(path, {
      method: "GET",
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    // Se o worker não estiver disponível, retornar array vazio
    return NextResponse.json([]);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Dados do agendamento recebidos:", body);

    const workerResponse = await proxyToWorker("/api/appointments", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (workerResponse) {
      if (workerResponse.ok) {
        const data = await workerResponse.json();
        return NextResponse.json(data, { status: 201 });
      } else {
        // Tentar ler a mensagem de erro do worker
        const errorData = await workerResponse.json().catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro do worker:", errorData);
        return NextResponse.json(
          { error: errorData.error || "Erro ao criar agendamento no worker" },
          { status: workerResponse.status }
        );
      }
    }

    // Se o worker não estiver disponível, retornar erro
    return NextResponse.json(
      { 
        error: "Worker não está rodando. Por favor, execute 'npm run dev:worker' em outro terminal." 
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro ao criar agendamento: ${errorMessage}` },
      { status: 500 }
    );
  }
}

