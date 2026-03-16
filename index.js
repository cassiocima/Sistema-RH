/**
 * RH MASTER ERP - Servidor com Banco em Arquivo
 * Conforme Visão Geral: Cadastro e Fluxo de Processamento
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// Caminho para o nosso "banco de dados" (um arquivo simples)
const DB_FILE = path.join(__dirname, 'database', 'folha_dados.json');

// Garante que a pasta database existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database');

app.use(express.json());

// Função para ler o arquivo (O nosso "SQL" manual)
const lerBanco = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
};

// Rota para CADASTRAR (Passo 1 do Fluxo Principal)
app.post('/api/employees', (req, res) => {
    const lista = lerBanco();
    const novoFuncionario = req.body;
    
    lista.push(novoFuncionario);
    
    // Salva no arquivo - os dados não somem se desligar o PC!
    fs.writeFileSync(DB_FILE, JSON.stringify(lista, null, 2));
    
    console.log("✅ Funcionário salvo no banco:", novoFuncionario.nome);
    res.status(201).json({ mensagem: "Salvo com sucesso!" });
});

// Rota para LISTAR
app.get('/api/employees', (req, res) => {
    res.json(lerBanco());
});

app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR RODANDO EM http://localhost:${PORT}`);
    console.log(`📁 BANCO DE DADOS ATIVO EM: ${DB_FILE}`);
});
