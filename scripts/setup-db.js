import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('📦 Configurando banco de dados local...\n');

// Lista de migrations em ordem
const migrations = [
  'migrations/1.sql',
  'migrations/2.sql',
  'migrations/3.sql',
  'migrations/4.sql',
  'migrations/5.sql',
  'migrations/6.sql',
  'migrations/7.sql',
  'migrations/8.sql',
  'migrations/9.sql'
];

console.log('📝 Executando migrations no banco local...\n');

for (const migration of migrations) {
  const migrationPath = join(rootDir, migration);
  if (existsSync(migrationPath)) {
    console.log(`  ✓ Executando ${migration}...`);
    try {
      // Usar wrangler d1 execute com --local para banco local
      execSync(
        `npx wrangler d1 execute DB --local --file="${migrationPath}"`,
        { 
          cwd: rootDir,
          stdio: 'inherit'
        }
      );
      console.log(`  ✅ ${migration} executado com sucesso\n`);
    } catch (error) {
      console.error(`  ❌ Erro ao executar ${migration}`);
      console.error(`  ${error.message}\n`);
    }
  } else {
    console.log(`  ⚠️  Arquivo ${migration} não encontrado, pulando...\n`);
  }
}

console.log('\n✅ Configuração do banco de dados local concluída!');
console.log('\n💡 Agora você pode executar: npm run dev:worker');

