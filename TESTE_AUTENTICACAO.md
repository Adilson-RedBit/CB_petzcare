# 🧪 Guia de Teste - Autenticação Profissional

## Passo a Passo para Testar

### 1️⃣ Iniciar o Servidor

```bash
npm run dev
```

Aguarde a mensagem:
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### 2️⃣ Acessar a Área Profissional

Abra seu navegador e acesse:
```
http://localhost:3000/professional
```

**O que deve acontecer:**
- ✅ Você será automaticamente redirecionado para `/login`
- ✅ A página de login será exibida

### 3️⃣ Fazer Login

Na página de login, preencha:

**Email:** `admin@petcare.com`  
**Senha:** `admin123`

Clique em **"Entrar"**

**O que deve acontecer:**
- ✅ Loading spinner aparece
- ✅ Redirecionamento automático para `/professional`
- ✅ Você vê a área profissional com todos os recursos

### 4️⃣ Verificar Autenticação

Na área profissional, você deve ver:

**No Header:**
- ✅ Nome do usuário: "Administrador"
- ✅ Botão "Sair" no canto superior direito

**Na Página:**
- ✅ Painel profissional completo
- ✅ Abas: Agenda, Serviços, Horários, Negócio
- ✅ Agendamentos do dia

### 5️⃣ Testar Logout

Clique no botão **"Sair"** no header

**O que deve acontecer:**
- ✅ Redirecionamento para `/login`
- ✅ Cookies de sessão removidos
- ✅ Tentar acessar `/professional` novamente redireciona para login

### 6️⃣ Testar Registro (Opcional)

Na página de login, clique em **"Não tem conta? Criar conta"**

Preencha:
- **Nome:** Seu nome
- **Email:** seu@email.com
- **Senha:** senha123 (mínimo 6 caracteres)

**Nota:** Em desenvolvimento, o registro não salva no banco ainda.

## 🔍 Verificações Técnicas

### Verificar Cookies

Abra o DevTools (F12) → Application → Cookies

Após login, você deve ver:
- `auth_token` (httpOnly: true)
- `user_email` (httpOnly: false)

### Verificar Redirecionamento

1. Acesse `/professional` sem estar logado
2. Verifique na URL: deve estar em `/login?redirect=/professional`

### Verificar Middleware

O middleware protege automaticamente:
- ✅ `/professional` - Requer autenticação
- ✅ `/professional/*` - Requer autenticação
- ✅ `/login` - Redireciona se já autenticado

## 🐛 Troubleshooting

### Problema: Servidor não inicia

```bash
# Verificar se a porta 3000 está livre
netstat -ano | findstr :3000

# Matar processo se necessário
taskkill /PID <PID> /F
```

### Problema: Erro de compilação

```bash
# Limpar cache
rm -rf .next
npm run dev
```

### Problema: Login não funciona

1. Verifique o console do navegador (F12)
2. Verifique a aba Network para ver requisições
3. Verifique se o endpoint `/api/auth/login` está respondendo

### Problema: Redirecionamento infinito

1. Limpe os cookies do navegador
2. Reinicie o servidor
3. Tente novamente

## ✅ Checklist de Funcionalidades

- [ ] Redirecionamento automático para login
- [ ] Página de login exibe corretamente
- [ ] Login com credenciais válidas funciona
- [ ] Redirecionamento após login funciona
- [ ] Nome do usuário aparece no header
- [ ] Botão de logout aparece
- [ ] Logout remove sessão
- [ ] Tentar acessar /professional sem login redireciona
- [ ] Alternar entre Login/Registro funciona
- [ ] Validação de formulário funciona
- [ ] Mensagens de erro aparecem corretamente

## 📸 Screenshots Esperados

### Tela de Login
- Card centralizado
- Ícone de cadeado
- Campos: Email e Senha
- Botão "Entrar"
- Link "Criar conta"

### Área Profissional (Após Login)
- Header com nome do usuário
- Botão "Sair"
- Painel com abas
- Conteúdo da área profissional

## 🎯 Resultado Esperado

Após seguir todos os passos, você deve ter:
- ✅ Sistema de autenticação funcionando
- ✅ Proteção de rotas ativa
- ✅ Sessão persistente
- ✅ Logout funcional
- ✅ Interface responsiva e moderna

