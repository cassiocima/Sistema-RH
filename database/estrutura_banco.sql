-- RH MASTER ERP - Estrutura do Banco de Dados (Regra 12.1)
-- Este arquivo define como as informações serão salvas

CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,      -- Regra VAL001 (Apenas números)
    pis TEXT UNIQUE NOT NULL,      -- Regra VAL002
    data_admissao DATE NOT NULL,   -- Regra VAL004
    salario_base DECIMAL(12,2),    -- Regra VAL003 (Mínimo R$ 1.518,00)
    tipo_contrato TEXT,            -- CLT, Aprendiz ou Estagiário
    status TEXT DEFAULT 'Ativo'    -- Ativo, Férias, Afastado
);

CREATE TABLE folha_pagamento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    funcionario_id INTEGER,
    mes_referencia TEXT,           -- Ex: 03/2026
    salario_bruto DECIMAL(12,2),
    desconto_inss DECIMAL(12,2),   -- Regra RB002
    valor_fgts DECIMAL(12,2),      -- Regra RB001
    salario_liquido DECIMAL(12,2),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);
