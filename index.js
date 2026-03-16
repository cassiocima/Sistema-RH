const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

// Cria o arquivo de banco de dados na pasta 'data' (conforme sua arquitetura macro)
const dbDir = path.join(__dirname, 'data');
if (!require('fs').existsSync(dbDir)) require('fs').mkdirSync(dbDir);
const db = new Database(path.join(dbDir, 'folha.db'));

app.use(express.json());

// --- CRIAÇÃO DAS TABELAS (CONFORME SEU MODELO DE DADOS) ---
db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('private','public')),
    regime TEXT CHECK(regime IN ('clt','rju','mixed')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    name TEXT NOT NULL,
    base_salary REAL DEFAULT 0,
    FOREIGN KEY(entity_id) REFERENCES entities(id)
  );

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    hire_date TEXT NOT NULL,
    base_salary REAL NOT NULL DEFAULT 0,
    FOREIGN KEY(entity_id) REFERENCES entities(id)
  );

  CREATE TABLE IF NOT EXISTS payroll_periods (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    status TEXT DEFAULT 'open',
    FOREIGN KEY(entity_id) REFERENCES entities(id)
  );
`);

console.log("✅ Banco de Dados SQLite configurado com as tabelas do Modelo!");

// --- ROTAS DA API ---

// Listar Funcionários (Vindo do Banco Real)
app.get('/api/employees', (req, res) => {
    const rows = db.prepare('SELECT * FROM employees').all();
    res.json(rows);
});

// Cadastrar Funcionário (Gravando no Banco Real)
app.post('/api/employees', (req, res) => {
    const { id, name, cpf, hire_date, base_salary } = req.body;
    const stmt = db.prepare('INSERT INTO employees (id, entity_id, name, cpf, hire_date, base_salary) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, 'entity-demo', name, cpf, hire_date, base_salary);
    res.json({ mensagem: "Funcionário gravado no SQLite!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
