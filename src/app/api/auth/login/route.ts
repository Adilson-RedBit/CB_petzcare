import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";
import { z } from "zod";

const WORKER_URL = process.env.WORKER_URL || "http://localhost:5173";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
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
    const { email, password } = LoginSchema.parse(body);

    // Fazer proxy para o worker
    const workerResponse = await proxyToWorker("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      
      // Criar sessão no Next.js usando JWT
      // O worker já salvou o hash da sessão no banco
      const tokenHash = data.sessionToken;
      await setSession({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role || "professional",
        created_at: new Date().toISOString(),
      }, tokenHash);

      return NextResponse.json(data);
    }

    // Worker não disponível - fallback para desenvolvimento local
    if (process.env.NODE_ENV === "development") {
      // Fallback simples para desenvolvimento - NÃO USAR EM PRODUÇÃO
      if (email === "admin@petcare.com" && password === "admin123") {
        await setSession({
          id: 1,
          email: "admin@petcare.com",
          name: "Administrador",
          role: "admin",
          created_at: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          user: {
            id: 1,
            email: "admin@petcare.com",
            name: "Administrador",
            role: "admin",
          },
          message: "Login realizado com sucesso (modo desenvolvimento)"
        });
      }
    }

    // Se o worker respondeu com erro, retornar o erro
    if (workerResponse) {
      const errorData = await workerResponse.json().catch(() => ({ error: "Erro ao fazer login" }));
      return NextResponse.json(
        { error: errorData.error || "Email ou senha incorretos" },
        { status: workerResponse.status }
      );
    }

    return NextResponse.json(
      {
        error: "Worker não está rodando. Para desenvolvimento, use: admin@petcare.com / admin123"
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

    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}

