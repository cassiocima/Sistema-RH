# RH Master ERP v3.0 🚀

Sistema de Gestão de Folha de Pagamento com foco em eSocial Compliance.

## 🛠️ Estrutura do Projeto
- **database/**: Esquema do banco de dados SQLite.
- **src/modules/cadastro**: Gestão de funcionários (RF001).
- **src/modules/folha**: Motor de cálculo progressivo (RB002).
- **src/modules/esocial**: Integração via XML (RF040).
- **src/shared/validacoes**: Travas de segurança e compliance (VAL001).

## ⚖️ Regras de Negócio Implementadas
- [x] Salário Mínimo 2026 (R$ 1.518,00)
- [x] INSS Progressivo conforme EC 103/2019
- [x] Validação de CPF (Módulo 11)
- [x] Geração de XML para eSocial
