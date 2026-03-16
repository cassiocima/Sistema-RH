/**
 * RH MASTER ERP - Servidor Express conforme Visão Geral v1.0
 */
const express = require('express');
const app = express();
const PORT = 3001; // Porta padrão da sua documentação

app.use(express.json());

// Simulação de Banco de Dados (será substituído pelo SQLite em breve)
let funcionarios = [];

// Rota para CADASTRAR funcionários (Passo 1 do seu Fluxo Principal)
app.post('/api/employees', (req, res) => {
    const novoFuncionario = req.body;
    funcionarios.push(novoFuncionario);
    console.log("Novo funcionário cadastrado:", novoFuncionario.nome);
    res.status(201).json({ mensagem: "Funcionário cadastrado com sucesso!" });
});

// Rota para LISTAR funcionários
app.get('/api/employees', (req, res) => {
    res.json(funcionarios);
});

app.listen(PORT, () => {
    console.log(`
    =============================================
    RH MASTER ERP - BACKEND INICIADO
    Porta: ${PORT}
    Status: Pronto para Processamento de Folha
    =============================================
    `);
});
