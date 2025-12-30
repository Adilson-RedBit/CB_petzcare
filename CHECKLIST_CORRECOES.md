# ✅ Checklist de Correções - PetCare Agenda

## 🔴 CRÍTICO - Segurança (Prioridade Máxima)

### Autenticação
- [ ] **AUTH-001**: Implementar JWT com refresh tokens
  - [ ] Instalar `jsonwebtoken` ou usar Web Crypto API
  - [ ] Criar função `generateJWT(user)`
  - [ ] Criar função `verifyJWT(token)`
  - [ ] Substituir `generateSessionToken()` por JWT
  - [ ] Arquivo: `src/lib/auth.ts`

- [ ] **AUTH-002**: Armazenar tokens no banco de dados
  - [ ] Criar tabela `user_sessions`
  - [ ] Salvar token ao fazer login
  - [ ] Validar token no banco em `getSession()`
  - [ ] Implementar revogação de sessões
  - [ ] Arquivo: `src/lib/auth.ts`, `migrations/`

- [ ] **AUTH-003**: Remover fallbacks inseguros
  - [ ] Remover fallback SHA-256 em `src/worker/index.ts:11-18`
  - [ ] Remover fallback de senha em `src/worker/index.ts:33-36, 44-47`
  - [ ] Usar apenas bcryptjs para hash de senhas
  - [ ] Arquivo: `src/worker/index.ts`

- [ ] **AUTH-004**: Remover credenciais hardcoded
  - [ ] Exigir variáveis de ambiente para credenciais padrão
  - [ ] Remover valores padrão de `admin@petcare.com` e `admin123`
  - [ ] Adicionar validação que falha se variáveis não existirem
  - [ ] Arquivo: `src/app/api/auth/login/route.ts`

- [ ] **AUTH-005**: Implementar rate limiting
  - [ ] Adicionar rate limiting no endpoint de login (5 tentativas/minuto)
  - [ ] Adicionar rate limiting em criação de agendamentos
  - [ ] Usar Cloudflare Workers rate limiting ou biblioteca
  - [ ] Arquivo: `src/worker/index.ts`, `src/app/api/auth/login/route.ts`

### Validação e Sanitização
- [ ] **VAL-001**: Validar todos os inputs com Zod
  - [ ] Revisar todas as rotas de API
  - [ ] Garantir que todos os endpoints usam `zValidator`
  - [ ] Adicionar validações faltantes
  - [ ] Arquivo: `src/worker/index.ts`, `src/app/api/**/route.ts`

- [ ] **VAL-002**: Sanitizar inputs antes de queries SQL
  - [ ] Criar função `sanitizeString()`
  - [ ] Aplicar em todos os inputs de texto
  - [ ] Usar prepared statements (já está sendo usado, verificar todos)
  - [ ] Arquivo: `src/worker/index.ts`

- [ ] **VAL-003**: Validar uploads de arquivos
  - [ ] Validar tipo MIME
  - [ ] Validar tamanho máximo (ex: 5MB)
  - [ ] Validar extensão
  - [ ] Arquivo: `src/app/api/upload-*/route.ts`

---

## 🟡 IMPORTANTE - Arquitetura

### Roteamento
- [ ] **ARCH-001**: Remover React Router
  - [ ] Deletar `src/react-app/App.tsx`
  - [ ] Remover dependência `react-router` do package.json
  - [ ] Migrar rotas para Next.js App Router
  - [ ] Arquivo: `src/react-app/App.tsx`, `package.json`

- [ ] **ARCH-002**: Consolidar Layouts
  - [ ] Escolher um layout principal (Next.js)
  - [ ] Remover `src/react-app/components/Layout.tsx`
  - [ ] Atualizar todas as páginas para usar layout Next.js
  - [ ] Arquivo: `src/react-app/components/Layout.tsx`, `src/app/**/layout.tsx`

- [ ] **ARCH-003**: Remover código duplicado
  - [ ] Identificar funções duplicadas
  - [ ] Extrair para módulos compartilhados em `src/lib/`
  - [ ] Atualizar imports
  - [ ] Arquivo: Múltiplos

### Banco de Dados
- [ ] **DB-001**: Adicionar constraints
  - [ ] Adicionar UNIQUE em `professionals.email`
  - [ ] Adicionar CHECK em `appointments.status`
  - [ ] Adicionar FOREIGN KEY constraints
  - [ ] Criar migration
  - [ ] Arquivo: `migrations/11.sql`

- [ ] **DB-002**: Corrigir queries N+1
  - [ ] Refatorar `GET /api/appointments` para usar JOIN
  - [ ] Buscar todos os serviços de uma vez
  - [ ] Testar performance antes/depois
  - [ ] Arquivo: `src/worker/index.ts:297-372`

- [ ] **DB-003**: Adicionar paginação
  - [ ] Adicionar parâmetros `page` e `limit` em listagens
  - [ ] Implementar em `GET /api/appointments`
  - [ ] Implementar em `GET /api/pets`
  - [ ] Implementar em `GET /api/services`
  - [ ] Arquivo: `src/worker/index.ts`

---

## 🟢 MELHORIAS - Performance

- [ ] **PERF-001**: Implementar cache de API
  - [ ] Adicionar React Query ou SWR
  - [ ] Configurar cache para serviços, pets, agendamentos
  - [ ] Implementar revalidação automática
  - [ ] Arquivo: `src/react-app/hooks/useApi.ts`

- [ ] **PERF-002**: Reduzir polling
  - [ ] Aumentar intervalo de 5s para 30-60s
  - [ ] Ou implementar WebSockets/SSE
  - [ ] Arquivo: `src/react-app/pages/Home.tsx:82-83`

- [ ] **PERF-003**: Remover window.location.reload()
  - [ ] Substituir por refetch de dados
  - [ ] Atualizar estado local
  - [ ] Arquivo: `src/react-app/hooks/useApi.ts:132, 198`

- [ ] **PERF-004**: Otimizar bundle size
  - [ ] Remover dependências não usadas
  - [ ] Code splitting por rota
  - [ ] Tree-shaking de ícones Lucide
  - [ ] Arquivo: `next.config.js`, `package.json`

- [ ] **PERF-005**: Otimizar imagens
  - [ ] Usar Next.js Image component
  - [ ] Adicionar lazy loading
  - [ ] Configurar tamanhos responsivos
  - [ ] Arquivo: Componentes que usam `<img>`

---

## 🔵 QUALIDADE - Código

### Testes
- [ ] **TEST-001**: Setup de testes
  - [ ] Instalar Vitest
  - [ ] Configurar `vitest.config.ts`
  - [ ] Adicionar script `test` no package.json
  - [ ] Arquivo: `package.json`, `vitest.config.ts`

- [ ] **TEST-002**: Testes de autenticação
  - [ ] Teste de login bem-sucedido
  - [ ] Teste de login com credenciais inválidas
  - [ ] Teste de logout
  - [ ] Arquivo: `src/__tests__/auth.test.ts`

- [ ] **TEST-003**: Testes de API
  - [ ] Teste de criação de pet
  - [ ] Teste de criação de agendamento
  - [ ] Teste de validação de inputs
  - [ ] Arquivo: `src/__tests__/api.test.ts`

- [ ] **TEST-004**: Testes de componentes
  - [ ] Teste de AppointmentForm
  - [ ] Teste de PetForm
  - [ ] Teste de validação de formulários
  - [ ] Arquivo: `src/react-app/components/__tests__/`

### Código
- [ ] **CODE-001**: Remover console.logs
  - [ ] Buscar todos os `console.log`
  - [ ] Substituir por logger estruturado (pino ou similar)
  - [ ] Ou remover se não necessário
  - [ ] Arquivo: Múltiplos

- [ ] **CODE-002**: Extrair magic numbers
  - [ ] Criar arquivo `src/lib/constants.ts`
  - [ ] Extrair valores hardcoded
  - [ ] Exemplos: tempo de sessão, multiplicadores de preço
  - [ ] Arquivo: `src/lib/constants.ts`, múltiplos

- [ ] **CODE-003**: Adicionar JSDoc
  - [ ] Documentar funções complexas
  - [ ] Adicionar tipos de parâmetros e retorno
  - [ ] Adicionar exemplos onde apropriado
  - [ ] Arquivo: Múltiplos

- [ ] **CODE-004**: Padronizar tratamento de erros
  - [ ] Criar classe `AppError` customizada
  - [ ] Padronizar formato de erros
  - [ ] Implementar Error Boundary no React
  - [ ] Arquivo: `src/lib/errors.ts`, componentes

### UX
- [ ] **UX-001**: Melhorar feedback de loading
  - [ ] Adicionar skeletons ao invés de spinners
  - [ ] Melhorar estados de loading em formulários
  - [ ] Arquivo: Componentes

- [ ] **UX-002**: Melhorar tratamento de erros na UI
  - [ ] Substituir `alert()` por toast notifications
  - [ ] Adicionar mensagens de erro amigáveis
  - [ ] Arquivo: Componentes

- [ ] **UX-003**: Adicionar confirmações
  - [ ] Confirmar antes de cancelar agendamento
  - [ ] Confirmar antes de deletar pet
  - [ ] Arquivo: Componentes

---

## 📚 DOCUMENTAÇÃO

- [ ] **DOC-001**: Criar .env.example
  - [ ] Listar todas as variáveis de ambiente necessárias
  - [ ] Adicionar descrições
  - [ ] Arquivo: `.env.example`

- [ ] **DOC-002**: Melhorar README
  - [ ] Adicionar seção de instalação detalhada
  - [ ] Adicionar seção de desenvolvimento
  - [ ] Adicionar troubleshooting
  - [ ] Arquivo: `README.md`

- [ ] **DOC-003**: Documentar APIs
  - [ ] Criar documentação OpenAPI/Swagger
  - [ ] Ou adicionar comentários JSDoc nas rotas
  - [ ] Arquivo: `docs/api.md` ou inline

- [ ] **DOC-004**: Documentar arquitetura
  - [ ] Diagrama de arquitetura
  - [ ] Fluxo de autenticação
  - [ ] Fluxo de agendamento
  - [ ] Arquivo: `docs/architecture.md`

---

## 🚀 DEVOPS

- [ ] **DEVOPS-001**: Configurar CI/CD
  - [ ] Criar `.github/workflows/ci.yml`
  - [ ] Adicionar testes no pipeline
  - [ ] Adicionar lint no pipeline
  - [ ] Adicionar type check
  - [ ] Arquivo: `.github/workflows/`

- [ ] **DEVOPS-002**: Configurar deploy automático
  - [ ] Deploy automático em staging
  - [ ] Deploy manual em production
  - [ ] Notificações de deploy
  - [ ] Arquivo: `.github/workflows/deploy.yml`

- [ ] **DEVOPS-003**: Adicionar monitoramento
  - [ ] Integrar Sentry para erros
  - [ ] Configurar Cloudflare Analytics
  - [ ] Adicionar health check endpoint
  - [ ] Arquivo: `src/worker/index.ts`, `src/app/api/health/route.ts`

---

## 📊 Métricas de Progresso

Use este checklist para acompanhar o progresso:

- **Total de Itens**: ~60
- **Críticos**: 10
- **Importantes**: 15
- **Melhorias**: 20
- **Documentação**: 4
- **DevOps**: 3

### Como Usar

1. Marque cada item conforme for completando
2. Adicione link para PR/commit quando relevante
3. Adicione notas sobre problemas encontrados
4. Revise periodicamente o progresso

---

**Última Atualização**: 2024
**Status Geral**: 🔴 **Requer Atenção Imediata em Segurança**




















