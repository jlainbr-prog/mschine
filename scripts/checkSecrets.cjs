const fs = require('fs');
const path = require('path');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const required = ['PRIVATE_KEY', 'RPC_URL', 'CONTRACTS'];

const envFile = path.resolve(process.cwd(), '.env');
const exampleFile = path.resolve(process.cwd(), '.env.example');

const fromProcess = Object.assign({}, process.env);
const fromEnvFile = parseEnvFile(envFile);
const fromExample = parseEnvFile(exampleFile);

function getVal(key) {
  if (fromProcess[key]) return fromProcess[key];
  if (fromEnvFile[key]) return fromEnvFile[key];
  if (fromExample[key]) return fromExample[key];
  return undefined;
}

const missing = [];
for (const k of required) {
  const v = getVal(k);
  if (!v || String(v).trim() === '') missing.push(k);
}

if (missing.length === 0) {
  console.log('OK: todas as secrets requeridas estão definidas.');
  process.exit(0);
} else {
  console.log('Faltando as seguintes variáveis de ambiente / secrets:');
  for (const k of missing) console.log('- ' + k);
  console.log('\nSugestão: crie um arquivo .env na raiz com as chaves ou defina os Secrets no GitHub.');
  process.exit(2);
}
