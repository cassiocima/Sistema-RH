/**
 * RH MASTER ERP - Motor de Cálculo de Folha
 * Baseado no Documento 04 — Motor de Cálculo
 */

const CONSTANTES = {
  IR_DEPENDENT_DEDUCTION: 189.59, // Dedução por dependente (2025)
  FGTS_RATE: 0.08,               // Alíquota FGTS 8%
  HOURS_PER_MONTH: 220,          // Base horas CLT
  TETO_INSS: 8157.41             // Teto máximo INSS 2025
};

/**
 * Função Pura: Recebe dados e retorna o cálculo sem alterar o banco diretamente.
 */
function calculatePayroll(input) {
  const { baseSalary, dependents, events } = input;

  // Passo 1 — Inicializar com Salário Base
  let details = [
    { id: 'et-001', description: 'Salário Base', amount: baseSalary, nature: 'earning' }
  ];

  let grossSalary = baseSalary;
  let inssBase = baseSalary;
  let irrfBase = baseSalary;
  let fgtsBase = baseSalary;

  // Passo 2 — Processar Eventos de Provento (nature = 'earning')
  events.filter(e => e.nature === 'earning').forEach(event => {
    let amount = 0;
    
    // Lógica para Hora Extra ou Percentual
    if (event.formulaType === 'percentage' && event.reference) {
      const taxaHoraria = baseSalary / CONSTANTES.HOURS_PER_MONTH;
      amount = taxaHoraria * event.reference * (parseFloat(event.formulaValue) / 100);
    } else {
      amount = event.amount || 0;
    }

    details.push({
      earningsTypeId: event.earningsTypeId,
      description: event.earningsTypeName,
      amount: amount,
      nature: 'earning'
    });

    grossSalary += amount;
    if (event.incidenceInss) inssBase += amount;
    if (event.incidenceIrrf) irrfBase += amount;
    if (event.incidenceFgts) fgtsBase += amount;
  });

  // Passo 3 — Calcular INSS (Progressivo Cumulativo 2025)
  const inssAmount = calcInss(inssBase);
  details.push({ 
    earningsTypeId: 'inss-001', 
    description: 'Desconto INSS', 
    amount: inssAmount, 
    nature: 'discount' 
  });

  // Passo 4 — Calcular IRRF
  const baseAposINSS = Math.max(0, irrfBase - inssAmount);
  const deducaoDependentes = dependents * CONSTANTES.IR_DEPENDENT_DEDUCTION;
  const baseIRRF = Math.max(0, baseAposINSS - deducaoDependentes);
  const irrfAmount = calcIrrf(baseIRRF);

  if (irrfAmount > 0) {
    details.push({ 
      earningsTypeId: 'irrf-001', 
      description: 'Desconto IRRF', 
      amount: irrfAmount, 
      nature: 'discount' 
    });
  }

  // Passo 5 — Calcular FGTS (Informativo)
  const fgtsAmount = fgtsBase * CONSTANTES.FGTS_RATE;
  details.push({ 
    earningsTypeId: 'fgts-001', 
    description: 'FGTS (Info)', 
    amount: fgtsAmount, 
    nature: 'info' 
  });

  // Passo 6 — Processar Eventos de Desconto (Ex: Vale Transporte)
  events.filter(e => e.nature === 'discount').forEach(event => {
    let amount = 0;
    if (event.formulaType === 'percentage') {
      amount = grossSalary * (parseFloat(event.formulaValue) / 100);
    } else {
      amount = event.amount || 0;
    }

    details.push({
      earningsTypeId: event.earningsTypeId,
      description: event.earningsTypeName,
      amount: amount,
      nature: 'discount'
    });
  });

  // Passo 7 — Totais
  const totalEarnings = details
    .filter(d => d.nature === 'earning')
    .reduce((acc, cur) => acc + cur.amount, 0);
    
  const totalDiscounts = details
    .filter(d => d.nature === 'discount')
    .reduce((acc, cur) => acc + cur.amount, 0);

  return {
    grossSalary,
    inssBase,
    inssAmount,
    irrfBase,
    irrfAmount,
    fgtsBase,
    fgtsAmount,
    totalEarnings,
    totalDiscounts,
    netSalary: totalEarnings - totalDiscounts,
    details
  };
}

/**
 * Algoritmo INSS 2025 Progressivo
 */
function calcInss(base) {
  const b = Math.min(base, CONSTANTES.TETO_INSS);
  let total = 0;
  
  if (b <= 1518.00) return b * 0.075;
  
  // Faixa 1
  total += 1518.00 * 0.075;
  // Faixa 2
  if (b > 1518.00) total += (Math.min(b, 2793.88) - 1518.01) * 0.09;
  // Faixa 3
  if (b > 2793.88) total += (Math.min(b, 4190.83) - 2793.89) * 0.12;
  // Faixa 4
  if (b > 4190.83) total += (Math.min(b, 8157.41) - 4190.84) * 0.14;
  
  return total;
}

/**
 * Algoritmo IRRF 2025
 */
function calcIrrf(base) {
  if (base <= 2428.80) return 0;
  if (base <= 2826.65) return (base * 0.075) - 182.16;
  if (base <= 3751.05) return (base * 0.15) - 394.16;
  if (base <= 4664.68) return (base * 0.225) - 675.49;
  return (base * 0.275) - 908.74;
}

module.exports = { calculatePayroll };
