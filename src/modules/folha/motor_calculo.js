/**
 * RH MASTER ERP - Motor de Cálculo
 * Regras: RB001 (FGTS) e RB002 (INSS 2026)
 */

function calcularImpostos(salarioBruto) {
    // --- CÁLCULO DO FGTS (Regra RB001) ---
    // O FGTS é sempre 8% para CLT
    const fgts = salarioBruto * 0.08;

    // --- CÁLCULO DO INSS PROGRESSIVO (Regra RB002) ---
    // Valores baseados na tabela de 2026 do seu documento
    let inss = 0;
    const tetoInss = 908.86;

    if (salarioBruto <= 1518.00) {
        inss = salarioBruto * 0.075;
    } else if (salarioBruto <= 2793.88) {
        inss = (1518.00 * 0.075) + ((salarioBruto - 1518.00) * 0.09);
    } else if (salarioBruto <= 4190.83) {
        inss = (1518.00 * 0.075) + (1275.88 * 0.09) + ((salarioBruto - 2793.88) * 0.12);
    } else if (salarioBruto <= 8157.41) {
        inss = (1518.00 * 0.075) + (1275.88 * 0.09) + (1396.95 * 0.12) + ((salarioBruto - 4190.83) * 0.14);
    } else {
        inss = tetoInss; // Se o salário for acima do teto, desconta o valor máximo
    }

    // --- RESULTADO FINAL ---
    const liquido = salarioBruto - inss;

    return {
        bruto: salarioBruto.toFixed(2),
        descontoINSS: inss.toFixed(2),
        depositoFGTS: fgts.toFixed(2),
        salarioLiquido: liquido.toFixed(2)
    };
}

// Exemplo de uso: Se o salário for 3000.00
// console.log(calcularImpostos(3000.00));
