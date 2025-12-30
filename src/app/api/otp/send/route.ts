import { NextRequest, NextResponse } from "next/server";
import { generateVerificationCode, storeVerificationCode } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { error: "Identificador é obrigatório" },
        { status: 400 }
      );
    }

    // Gerar código de verificação
    const code = generateVerificationCode(6);
    
    // Armazenar código (em produção, use um banco de dados ou cache)
    storeVerificationCode(identifier, code, 300); // 5 minutos

    // Em produção, aqui você enviaria o código por SMS/Email
    // Por enquanto, vamos retornar o código para desenvolvimento
    // REMOVA ISSO EM PRODUÇÃO!
    console.log(`Código OTP para ${identifier}: ${code}`);

    return NextResponse.json({
      success: true,
      message: "Código de verificação enviado",
      // REMOVER EM PRODUÇÃO:
      code: process.env.NODE_ENV === "development" ? code : undefined,
    });
  } catch (error) {
    console.error("Erro ao enviar OTP:", error);
    return NextResponse.json(
      { error: "Erro ao enviar código de verificação" },
      { status: 500 }
    );
  }
}

