# 🚀 COMECE AQUI - Deploy do PetCare Agenda

## ✅ PASSO 1: Configurar o Token (JÁ FEITO!)

Execute o script para configurar o token:

```powershell
.\configurar-token.ps1
```

Ou configure manualmente:

```powershell
$env:CLOUDFLARE_API_TOKEN="COLE_SEU_TOKEN_AQUI"
wrangler whoami
```

Se mostrar seu email, está pronto!

---

## 📋 PASSO 4: Executar o Deploy

Agora execute os comandos abaixo **na ordem**:

### 4.1 - Criar Banco de Dados

```powershell
wrangler d1 create petcare-db
```

**COPIE O `database_id` que aparecer!**

### 4.2 - Atualizar wrangler.json

Abra o arquivo `wrangler.json` e atualize:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "petcare-db",
      "database_id": "COLE_O_DATABASE_ID_AQUI"
    }
  ],
  "r2_buckets": [
    {
      "binding": "R2_BUCKET",
      "bucket_name": "petcare-files"
    }
  ]
}
```

### 4.3 - Criar Bucket R2

```powershell
wrangler r2 bucket create petcare-files
```

### 4.4 - Executar Migrations

```powershell
wrangler d1 execute petcare-db --file=./migrations/1.sql
wrangler d1 execute petcare-db --file=./migrations/2.sql
wrangler d1 execute petcare-db --file=./migrations/3.sql
wrangler d1 execute petcare-db --file=./migrations/4.sql
wrangler d1 execute petcare-db --file=./migrations/5.sql
wrangler d1 execute petcare-db --file=./migrations/6.sql
wrangler d1 execute petcare-db --file=./migrations/7.sql
wrangler d1 execute petcare-db --file=./migrations/8.sql
wrangler d1 execute petcare-db --file=./migrations/9.sql
wrangler d1 execute petcare-db --file=./migrations/10.sql
```

### 4.5 - Deploy do Worker

```powershell
npm run deploy:worker
```

**ANOTE A URL DO WORKER!** (ex: `https://seu-worker.workers.dev`)

### 4.6 - Deploy do Next.js

```powershell
npm run deploy:pages
```

**ANOTE A URL DO PAGES!** (ex: `https://seu-projeto.pages.dev`)

---

## 📋 PASSO 5: Configurar no Dashboard

1. Acesse: **https://dash.cloudflare.com**
2. Vá em **Workers & Pages** > Seu projeto Pages
3. **Settings** > **Environment Variables**
4. Adicione:
   - **Variable name**: `WORKER_URL`
   - **Value**: A URL do seu worker (do passo 4.5)

---

## 📋 PASSO 6: Configurar Domínio

1. No mesmo projeto Pages
2. **Custom domains** > **Set up a custom domain**
3. Digite: `petzcare.org`
4. Siga as instruções

---

## ✅ Pronto!

Sua aplicação estará em: `https://petzcare.org`

---

## 🐛 Problemas?

- **Erro de autenticação**: Verifique se o API Token está configurado
- **Erro de database**: Verifique se o `database_id` no `wrangler.json` está correto
- **Erro de R2**: Verifique se o bucket foi criado

