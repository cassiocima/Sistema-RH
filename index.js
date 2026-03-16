const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
// Importamos o motor que você acabou de criar
const { calculatePayroll } = require('./src/modules/calculator');

const app = express();
const PORT = 3001;

const db = new Database(path.join(__dirname, 'data', 'folha.db'));
app.use(express.json());

// ROTA DE PRÉVIA: Calcula a folha de um funcionário específico
app.get('/api/payroll/preview/:id', (req, res) => {
    const { id } = req.params;

    // 1. Busca os dados do funcionário no banco
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

    if (!employee) {
        return res.status(404).json({ erro: "Funcionário não encontrado" });
    }

    // 2. Busca dependentes (para dedução de IRRF)
    const dependents = db.prepare('SELECT COUNT(*) as qtd FROM dependents WHERE employee_id = ? AND ir_deduction = 1').get(id);

    // 3. Busca eventos/horas extras lançadas (se houver)
    const events = db.prepare('SELECT * FROM payroll_events WHERE employee_id = ?').all(id);

    // 4. Executa o cálculo usando o motor (calculator.js)
    const resultado = calculatePayroll({
        baseSalary: employee.base_salary,
        dependents: dependents.qtd,
        events: events || []
    });

    // 5. Retorna a prévia do Holerite
    res.json({
        funcionario: employee.name,
        periodo: "Março/2026",
        ...resultado
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Prévia disponível em http://localhost:${PORT}/api/payroll/preview/ID_DO_FUNCIONARIO`);
});
