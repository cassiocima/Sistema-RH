/**
 * SISTEMA: RH MASTER ERP
 * OBJETIVO: Impedir dados errados conforme as Regras VAL001 e VAL003 do FRD.
 */

// 1. Validador de CPF (Regra VAL001)
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove pontos e traços
    if (cpf.length !== 11) return false;
    
    // Impede CPFs conhecidos como inválidos (111.111.111-11, etc)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    return true; // Se chegou aqui, o CPF é aceitável para o cadastro inicial
}

// 2. Validador de Salário Mínimo (Regra VAL003)
function validarSalarioMinimo(valorSalario) {
    const SALARIO_MINIMO_VIGENTE = 1518.00; // Valor base para 2026 conforme o FRD
    
    if (valorSalario < SALARIO_MINIMO_VIGENTE) {
        return false; // Salário abaixo do mínimo não é permitido
    }
    return true;
}

// Exportando as regras para o resto do sistema usar
module.exports = { validarCPF, validarSalarioMinimo };
