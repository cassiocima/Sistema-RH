/**
 * RH MASTER ERP - Módulo eSocial
 * Objetivo: Preparar os dados para os eventos S-1200 (Remuneração) 
 * e S-2200 (Admissão) conforme o FRD.
 */

function gerarEventoAdmissao(funcionario) {
    // Este código monta o "esqueleto" que o governo exige
    const xmlS2200 = `
    <eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmissao/v_S_01_01_00">
        <evtAdmissao>
            <ideEmpregador>
                <nrInsc>12345678000199</nrInsc>
            </ideEmpregador>
            <trabalhador>
                <cpfTrab>${funcionario.cpf}</cpfTrab>
                <nmTrab>${funcionario.nome}</nmTrab>
            </trabalhador>
            <vinculo>
                <dataAdmissao>${funcionario.data_admissao}</dataAdmissao>
                <salario>${funcionario.salario_base}</salario>
            </vinculo>
        </evtAdmissao>
    </eSocial>
    `;
    return xmlS2200;
}

// Esta função avisa se o arquivo está pronto para ser enviado
function statusEnvio() {
    return "Aguardando assinatura digital (Certificado A1)...";
}

module.exports = { gerarEventoAdmissao };
