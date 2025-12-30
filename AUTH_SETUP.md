# Sistema de Autenticação - Área Profissional

O sistema de autenticação com email e senha foi implementado para proteger a área profissional do PetCare Agenda.

## 🔐 Funcionalidades

- ✅ Login com email e senha
- ✅ Registro de novos profissionais
- ✅ Proteção de rotas com middleware
- ✅ Gerenciamento de sessão com cookies
- ✅ Hash de senhas com bcrypt
- ✅ Logout seguro

## 📁 Estrutura

```
src/
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts      # Endpoint de login
│   │   ├── logout/route.ts      # Endpoint de logout
│   │   ├── register/route.ts   # Endpoint de registro
│   │   └── me/route.ts          # Endpoint para obter usuário atual
│   └── login/
│       └── page.tsx             # Página de login/registro
├── lib/
│   └── auth.ts                  # Funções de autenticação
├── hooks/
│   └── useAuth.ts               # Hook React para autenticação
└── middleware.ts                # Middleware de proteção de rotas
```

## 🚀 Como Usar

### 1. Acessar a Área Profissional

Ao tentar acessar `/professional` sem estar autenticado, você será redirecionado para `/login`.

### 2. Login

**Desenvolvimento:**
- Email: `admin@petcare.com` (ou configurado em `DEFAULT_PROFESSIONAL_EMAIL`)
- Senha: `admin123` (ou configurado em `DEFAULT_PROFESSIONAL_PASSWORD`)

**Produção:**
- Use o banco de dados para autenticação (veja seção abaixo)

### 3. Registro

Na página de login, clique em "Criar conta" para registrar um novo profissional.

## 🗄️ Banco de Dados

### Migração

Execute a migração para criar a tabela de profissionais:

```sql
-- migrations/8.sql
CREATE TABLE IF NOT EXISTS professionals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'professional',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Integração com Cloudflare D1

Para usar o banco de dados em produção, atualize os endpoints em `src/app/api/auth/`:

**Exemplo de login com banco:**

```typescript
// src/app/api/auth/login/route.ts
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function POST(request: NextRequest) {
  const { env } = await getRequestContext();
  const db = env.DB;
  
  const user = await db.prepare(
    "SELECT * FROM professionals WHERE email = ?"
  ).bind(email).first();
  
  if (!user) {
    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
  }
  
  const isValid = await verifyPassword(password, user.password_hash);
  // ... resto do código
}
```

## 🔒 Segurança

### Desenvolvimento vs Produção

**Desenvolvimento:**
- Usa usuário padrão hardcoded
- Senha em texto plano (apenas para desenvolvimento!)

**Produção:**
- ✅ Senhas são hasheadas com bcrypt
- ✅ Cookies httpOnly e secure
- ✅ Validação de entrada com Zod
- ✅ Proteção CSRF com sameSite

### Melhorias Recomendadas

1. **JWT Tokens**: Substitua tokens simples por JWT
2. **Rate Limiting**: Adicione limite de tentativas de login
3. **2FA**: Adicione autenticação de dois fatores
4. **Refresh Tokens**: Implemente renovação de tokens
5. **Audit Log**: Registre tentativas de login

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Desenvolvimento (opcional)
DEFAULT_PROFESSIONAL_EMAIL=admin@petcare.com
DEFAULT_PROFESSIONAL_PASSWORD=admin123

# Produção
NODE_ENV=production
```

## 🧪 Testando

1. Acesse `http://localhost:3000/professional`
2. Você será redirecionado para `/login`
3. Faça login com as credenciais padrão
4. Após login, será redirecionado para `/professional`
5. Use o botão "Sair" no header para fazer logout

## 🔧 Customização

### Alterar Tempo de Sessão

Edite `src/lib/auth.ts`:

```typescript
maxAge: 60 * 60 * 24 * 7, // 7 dias (em segundos)
```

### Adicionar Validações

Edite os schemas Zod em `src/app/api/auth/login/route.ts` e `register/route.ts`.

## ⚠️ Importante

1. **Nunca commite senhas** no código
2. **Use variáveis de ambiente** para credenciais
3. **Em produção**, sempre use o banco de dados
4. **Remova** o código de desenvolvimento antes de deploy
5. **Use HTTPS** em produção para cookies seguros

