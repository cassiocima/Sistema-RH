/**
 * RH MASTER ERP - Arquivo Principal
 * Aqui é onde o sistema "acorda" e liga os módulos.
 */

const travas = require('./src/shared/validacoes/travas_seguranca');
const motor = require('./src/modules/folha/motor_calculo');
const esocial = require('./src/modules/esocial/gerador_xml');

console.log("SISTEMA RH MASTER ERP INICIADO");
console.log("Versão 3.0 - Pronto para cálculos de 2026");

// Exemplo de funcionamento:
const salarioTeste = 2500.00;
if (travas.validarSalarioMinimo(salarioTeste)) {
    console.log("Salário validado com sucesso!");
    const resultado = motor.calcularImpostos(salarioTeste);
    console.log("Cálculo realizado:", resultado);
} else {
    console.log("ERRO: Salário abaixo do mínimo permitido!");
}
