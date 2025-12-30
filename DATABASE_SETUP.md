# 🗄️ Configuração do Banco de Dados Local

Este projeto usa **Cloudflare D1** (SQLite) como banco de dados. Para desenvolvimento local, você pode usar um banco SQLite local.

## ✅ Banco de Dados Local Configurado!

O banco de dados local já foi configurado e todas as migrations foram executadas com sucesso.

### 📍 Localização do Banco Local

O banco local está localizado em:
```
.wrangler/state/v3/d1/
```

### 🚀 Como Usar

1. **Iniciar o Worker com Banco Local:**
   ```bash
   npm run dev:worker
   ```
   
   O worker usará automaticamente o banco local quando executado em modo de desenvolvimento.

2. **Iniciar o Next.js:**
   ```bash
   npm run dev
   ```

3. **Reconfigurar o Banco (se necessário):**
   ```bash
   npm run setup:db
   ```
   
   Isso executará todas as migrations novamente, recriando o banco local.

### 📊 Estrutura do Banco

O banco contém as seguintes tabelas:

- **services** - Serviços oferecidos (banho, tosa, etc.)
- **pets** - Pets cadastrados
- **appointments** - Agendamentos
- **appointment_services** - Relação entre agendamentos e serviços
- **service_pricing** - Preços por porte do pet
- **working_hours** - Horários de funcionamento
- **business_config** - Configurações do negócio
- **professionals** - Usuários profissionais (autenticação)

### 🔍 Verificar Dados no Banco Local

Você pode consultar o banco local usando:

```bash
npx wrangler d1 execute DB --local --command="SELECT * FROM services"
```

### 📝 Migrations

As migrations estão em `migrations/` e foram executadas na seguinte ordem:

1. `1.sql` - Criação das tabelas principais (services, pets, appointments)
2. `2.sql` - Dados iniciais de serviços
3. `3.sql` - Dados atualizados de serviços
4. `4.sql` - Tabela appointment_services (relação muitos-para-muitos)
5. `5.sql` - Tabela service_pricing e campos adicionais em pets
6. `6.sql` - Campos de proprietário em pets
7. `7.sql` - Tabelas working_hours e business_config
8. `8.sql` - Tabela professionals (autenticação)

### ⚠️ Importante

- O banco local é independente do banco de produção na Cloudflare
- Dados criados localmente não são sincronizados automaticamente
- Para produção, você precisará fazer deploy do banco na Cloudflare

### 🆘 Problemas Comuns

**Erro: "Database not found"**
- Execute `npm run setup:db` novamente

**Erro: "Worker não está rodando"**
- Certifique-se de que `npm run dev:worker` está executando em outro terminal

**Dados não aparecem**
- Verifique se o worker está usando o banco local (não remoto)
- Execute `npm run setup:db` para recriar o banco


























