# Configuração Next.js, shadcn/ui e OTP

Este projeto foi migrado para usar Next.js, shadcn/ui e sistema de autenticação OTP.

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

## 🚀 Executar em Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   └── otp/            # Endpoints OTP
│   │   ├── auth/               # Páginas de autenticação
│   │   │   └── otp/            # Página de verificação OTP
│   │   ├── home/               # Página inicial (cliente)
│   │   ├── professional/      # Página profissional
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Página inicial (redireciona)
│   │   └── globals.css          # Estilos globais
│   ├── components/
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   └── dialog.tsx
│   │   └── otp/                # Componentes OTP
│   │       ├── OTPInput.tsx
│   │       └── OTPVerification.tsx
│   ├── lib/
│   │   ├── utils.ts            # Utilitários (cn function)
│   │   └── otp.ts              # Serviço OTP
│   ├── react-app/              # Componentes React existentes
│   └── shared/                 # Tipos compartilhados
├── components.json             # Configuração shadcn/ui
├── next.config.js              # Configuração Next.js
└── tailwind.config.js          # Configuração Tailwind
```

## 🎨 shadcn/ui

O projeto está configurado com shadcn/ui. Para adicionar novos componentes:

```bash
npx shadcn@latest add [component-name]
```

Componentes disponíveis:
- Button
- Input
- Label
- Card
- Dialog

## 🔐 Sistema OTP

### Como Funciona

1. **Solicitar Código**: O usuário informa telefone ou email
2. **Receber Código**: Um código de 6 dígitos é gerado e enviado
3. **Verificar Código**: O usuário digita o código para autenticar

### Endpoints

- `POST /api/otp/send` - Envia código OTP
- `POST /api/otp/verify` - Verifica código OTP

### Uso

Acesse `/auth/otp` para a página de autenticação OTP.

**Nota**: Em desenvolvimento, o código é exibido no console. Em produção, remova isso e implemente envio real por SMS/Email.

### Exemplo de Integração

```tsx
import { OTPVerification } from "@/components/otp/OTPVerification";

function MyAuthPage() {
  const handleVerify = async (code: string) => {
    const response = await fetch("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({ identifier: "user@example.com", code }),
    });
    return response.ok;
  };

  return (
    <OTPVerification
      identifier="user@example.com"
      onVerify={handleVerify}
    />
  );
}
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NODE_ENV=development
```

### Tailwind CSS

O Tailwind está configurado com as variáveis CSS do shadcn/ui. As cores podem ser customizadas em `src/app/globals.css`.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run lint` - Executa linter
- `npm run dev:worker` - Inicia worker do Cloudflare (se necessário)

## 🚨 Importante

1. **OTP em Produção**: O código OTP atual é apenas para desenvolvimento. Em produção:
   - Remova o log do código no endpoint `/api/otp/send`
   - Implemente envio real por SMS (Twilio, AWS SNS, etc.) ou Email
   - Use um cache/banco de dados para armazenar códigos (não use Map em memória)

2. **Cloudflare Workers**: Se você estiver usando Cloudflare Workers, pode precisar ajustar a configuração do Next.js para compatibilidade.

3. **API Routes**: As rotas da API do Hono continuam funcionando. As rotas do Next.js (`/api/*`) são separadas.

## 🎯 Próximos Passos

1. Implementar envio real de OTP (SMS/Email)
2. Adicionar mais componentes do shadcn/ui conforme necessário
3. Configurar autenticação de sessão após verificação OTP
4. Adicionar proteção de rotas com middleware do Next.js

