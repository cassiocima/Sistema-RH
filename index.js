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
