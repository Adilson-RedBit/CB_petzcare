import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";
import { z } from "zod";

const WORKER_URL = process.env.WORKER_URL || "http://localhost:5173";

const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = RegisterSchema.parse(body);

    // Fazer proxy para o worker
    const workerResponse = await proxyToWorker("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      
      // Criar sessão no Next.js
      await setSession({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role || "professional",
        created_at: new Date().toISOString(),
      });

      return NextResponse.json(data, { status: 201 });
    }

    // Se o worker respondeu com erro, retornar o erro
    if (workerResponse) {
      const errorData = await workerResponse.json().catch(() => ({ error: "Erro ao criar conta" }));
      return NextResponse.json(
        { error: errorData.error || "Erro ao criar conta" },
        { status: workerResponse.status }
      );
    }

    return NextResponse.json(
      { 
        error: "Worker não está rodando. Por favor, execute 'npm run dev:worker' em outro terminal." 
      },
      { status: 503 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}

