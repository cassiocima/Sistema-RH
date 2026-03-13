/**
 * RH MASTER ERP - Gerador de Holerite
 * Objetivo: Exibir o demonstrativo de pagamento (Regra RF030)
 */

function gerarHoleriteTexto(funcionario, calculos) {
    const data = new Date();
    const mesReferencia = `${data.getMonth() + 1}/${data.getFullYear()}`;

    return `
    ====================================================
    REPORTE DE PAGAMENTO - RH MASTER ERP
    ====================================================
    EMPRESA: MINHA EMPRESA LTDA
    MES REFERENCIA: ${mesReferencia}
    ----------------------------------------------------
    NOME: ${funcionario.nome}
    CPF: ${funcionario.cpf}
    CARGO: COLABORADOR
    ----------------------------------------------------
    DESCRIÇÃO          |  PROVENTOS  |  DESCONTOS
    ----------------------------------------------------
    Salário Base       |  R$ ${calculos.bruto} |
    INSS (Progressivo) |             |  R$ ${calculos.descontoINSS}
    ----------------------------------------------------
    TOTAL DE PROVENTOS |  R$ ${calculos.bruto}
    TOTAL DE DESCONTOS |  R$ ${calculos.descontoINSS}
    ----------------------------------------------------
    VALOR LÍQUIDO      |  R$ ${calculos.salarioLiquido}
    ----------------------------------------------------
    DEPÓSITO FGTS (Mês)|  R$ ${calculos.depositoFGTS}
    ====================================================
    `;
}

module.exports = { gerarHoleriteTexto };
