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
    const workerResponse = await proxyToWorker("/api/admin/business-config", {
      method: "GET",
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      console.log('📦 Configuração do negócio recebida do worker:', {
        logo_url: data.logo_url,
        professional_name: data.professional_name,
        professional_name_type: typeof data.professional_name,
        professional_name_length: data.professional_name?.length,
        banner_title: data.banner_title,
        banner_description: data.banner_description
      });
      console.log('📋 Dados completos:', JSON.stringify(data, null, 2));
      return NextResponse.json(data);
    }

    // Se o worker não estiver disponível, retornar configuração padrão
    console.warn('Worker não disponível, retornando configuração padrão');
    return NextResponse.json({
      business_name: 'PetCare Agenda',
      phone: '(11) 9999-9999',
      whatsapp: '11999999999',
      email: 'contato@petcare.com',
      address: 'Rua dos Pets, 123 - São Paulo/SP',
      instagram: '@petcare.agenda',
      description: 'Cuidamos do seu pet com carinho e profissionalismo. Banho, tosa e muito amor!',
      logo_url: '',
      primary_color: '#3B82F6',
      secondary_color: '#8B5CF6',
      business_hours_display: 'Seg-Sáb: 8h às 18h',
      professional_name: '',
      banner_title: '',
      banner_description: ''
    });
  } catch (error) {
    console.error("Erro ao buscar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configuração do negócio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const workerResponse = await proxyToWorker("/api/admin/business-config", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (workerResponse && workerResponse.ok) {
      const data = await workerResponse.json();
      return NextResponse.json(data);
    }

    // Se o worker não estiver disponível, retornar erro
    return NextResponse.json(
      { 
        error: "Worker não está rodando. Por favor, execute 'npm run dev:worker' em outro terminal." 
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao salvar configuração do negócio" },
      { status: 500 }
    );
  }
}

