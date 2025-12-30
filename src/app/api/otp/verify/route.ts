import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { identifier, code } = await request.json();

    if (!identifier || !code) {
      return NextResponse.json(
        { error: "Identificador e código são obrigatórios" },
        { status: 400 }
      );
    }

    const isValid = verifyCode(identifier, code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Código inválido ou expirado" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao verificar OTP:", error);
    return NextResponse.json(
      { error: "Erro ao verificar código" },
      { status: 500 }
    );
  }
}

