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

// --- ATUALIZAÇÃO DO ESQUEMA CONFORME DOCUMENTO 03 ---
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    hire_date TEXT NOT NULL,
    employment_type TEXT NOT NULL CHECK(employment_type IN ('clt','clt_public','rju','commissioned','temporary')),
    pension_regime TEXT NOT NULL CHECK(pension_regime IN ('rgps','rpps')),
    base_salary REAL NOT NULL DEFAULT 0,
    active INTEGER DEFAULT 1,
    UNIQUE(entity_id, cpf)
  );

  CREATE TABLE IF NOT EXISTS dependents (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT CHECK(relationship IN ('spouse','child','parent','other')),
    birth_date TEXT NOT NULL,
    cpf TEXT,
    ir_deduction INTEGER DEFAULT 0,
    health_plan INTEGER DEFAULT 0,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS leaves (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('vacation','sick','maternity','paternity','suspension','other')),
    start_date TEXT NOT NULL,
    end_date TEXT,
    paid INTEGER DEFAULT 1,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );
`);

console.log("✅ Banco de Dados SQLite configurado com as tabelas do Modelo!");

// --- ROTAS DA API ---

// ROTA: Listagem com Filtros (Busca por Nome/CPF e Status)
app.get('/api/employees', (req, res) => {
    const { search, active } = req.query;
    let sql = `
        SELECT e.*, p.name as position_name 
        FROM employees e
        LEFT JOIN positions p ON e.position_id = p.id
        WHERE 1=1
    `;
    const params = [];

    // Filtro de Busca (Nome ou CPF) - Regra do Doc 03
    if (search) {
        sql += ` AND (e.name LIKE ? OR e.cpf LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // Filtro de Status (Ativo/Inativo) - Regra do Doc 03
    if (active === '1' || active === '0') {
        sql += ` AND e.active = ?`;
        params.push(active);
    } else if (active !== 'all') {
        // Por padrão, sua documentação pede apenas os ativos (active = 1)
        sql += ` AND e.active = 1`;
    }

    try {
        const rows = db.prepare(sql).all(...params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar funcionários" });
    }
});

// ROTA: Cadastrar Funcionário (Com Validações do Doc 03)
app.post('/api/employees', (req, res) => {
    const { id, name, cpf, birth_date, hire_date, employment_type, pension_regime, base_salary } = req.body;

    // Validação de campos obrigatórios
    if (!name || !cpf || !birth_date || !hire_date || !employment_type || !pension_regime) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes conforme Documento 03." });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO employees (id, entity_id, name, cpf, birth_date, hire_date, employment_type, pension_regime, base_salary)
            VALUES (?, 'entity-demo', ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id || require('crypto').randomUUID(), name, cpf, birth_date, hire_date, employment_type, pension_regime, base_salary || 0);
        res.status(201).json({ mensagem: "Funcionário criado com active = 1" });
    } catch (e) {
        res.status(400).json({ erro: "CPF já cadastrado nesta entidade." });
    }
});

// ROTA: Editar Funcionário (Apenas campos permitidos)
app.patch('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, base_salary, active, department } = req.body; // Apenas campos editáveis

    const stmt = db.prepare(`
        UPDATE employees 
        SET name = COALESCE(?, name), 
            base_salary = COALESCE(?, base_salary),
            active = COALESCE(?, active)
        WHERE id = ?
    `);
    stmt.run(name, base_salary, active, id);
    res.json({ mensagem: "Dados atualizados (campos protegidos mantidos)." });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
