// ============================================================
// CONTATO — Validação do formulário (front-end)
// ============================================================

// Regex simples para validar formato de e-mail
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Comprimento mínimo aceito para a mensagem
const MIN_MSG = 10;

// ------------------------------------------------------------
// Exibe ou limpa a mensagem de erro de um campo
// @param {string} idErro  - ID do <span> de erro
// @param {string} texto   - Texto do erro (vazio = sem erro)
// @param {string} idCampo - ID do <input>/<textarea> relacionado
// ------------------------------------------------------------
function definirErro(idErro, texto, idCampo) {
    const spanErro = document.getElementById(idErro);
    const campo    = document.getElementById(idCampo);

    spanErro.textContent = texto;

    if (texto) {
        // Marca o campo visualmente como inválido
        campo.classList.add('campo-invalido');
        campo.classList.remove('campo-valido');
    } else {
        // Marca o campo como válido
        campo.classList.remove('campo-invalido');
        campo.classList.add('campo-valido');
    }
}

// ------------------------------------------------------------
// Valida todos os campos e retorna true se o formulário for válido
// ------------------------------------------------------------
function validarFormulario() {
    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    let valido = true;

    // Validação do Nome
    if (!nome) {
        definirErro('erro-nome', 'O nome é obrigatório.', 'nome');
        valido = false;
    } else {
        definirErro('erro-nome', '', 'nome');
    }

    // Validação do E-mail
    if (!email) {
        definirErro('erro-email', 'O e-mail é obrigatório.', 'email');
        valido = false;
    } else if (!REGEX_EMAIL.test(email)) {
        definirErro('erro-email', 'Informe um e-mail válido (ex: nome@dominio.com).', 'email');
        valido = false;
    } else {
        definirErro('erro-email', '', 'email');
    }

    // Validação da Mensagem
    if (!mensagem) {
        definirErro('erro-mensagem', 'A mensagem é obrigatória.', 'mensagem');
        valido = false;
    } else if (mensagem.length < MIN_MSG) {
        definirErro('erro-mensagem', `A mensagem deve ter pelo menos ${MIN_MSG} caracteres.`, 'mensagem');
        valido = false;
    } else {
        definirErro('erro-mensagem', '', 'mensagem');
    }

    return valido;
}

// ------------------------------------------------------------
// Inicialização após o DOM estar carregado
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const form       = document.getElementById('form-contato');
    const textarea   = document.getElementById('mensagem');
    const contador   = document.getElementById('contador-mensagem');
    const msgSucesso = document.getElementById('msg-sucesso');

    // Contador de caracteres da mensagem atualizado em tempo real
    textarea.addEventListener('input', () => {
        const qtd = textarea.value.trim().length;
        contador.textContent = `${qtd} / ${MIN_MSG} caracteres mínimos`;

        // Deixa o contador verde quando o mínimo é atingido
        contador.classList.toggle('contador-ok', qtd >= MIN_MSG);
    });

    // Validação campo a campo ao sair do foco (UX: feedback imediato)
    document.getElementById('nome').addEventListener('blur', () => {
        const valor = document.getElementById('nome').value.trim();
        definirErro('erro-nome', valor ? '' : 'O nome é obrigatório.', 'nome');
    });

    document.getElementById('email').addEventListener('blur', () => {
        const valor = document.getElementById('email').value.trim();
        if (!valor) {
            definirErro('erro-email', 'O e-mail é obrigatório.', 'email');
        } else if (!REGEX_EMAIL.test(valor)) {
            definirErro('erro-email', 'Informe um e-mail válido (ex: nome@dominio.com).', 'email');
        } else {
            definirErro('erro-email', '', 'email');
        }
    });

    document.getElementById('mensagem').addEventListener('blur', () => {
        const valor = document.getElementById('mensagem').value.trim();
        if (!valor) {
            definirErro('erro-mensagem', 'A mensagem é obrigatória.', 'mensagem');
        } else if (valor.length < MIN_MSG) {
            definirErro('erro-mensagem', `A mensagem deve ter pelo menos ${MIN_MSG} caracteres.`, 'mensagem');
        } else {
            definirErro('erro-mensagem', '', 'mensagem');
        }
    });

    // Envio do formulário — bloqueia se inválido
    form.addEventListener('submit', e => {
        e.preventDefault(); // impede recarregamento da página

        if (!validarFormulario()) {
            // Foca no primeiro campo com erro para acessibilidade
            const primeiroErro = form.querySelector('.campo-invalido');
            if (primeiroErro) primeiroErro.focus();
            return;
        }

        // Formulário válido: exibe mensagem de sucesso e reseta o formulário
        msgSucesso.hidden = false;
        form.reset();

        // Limpa todas as marcações de validação
        form.querySelectorAll('.campo-valido, .campo-invalido').forEach(el => {
            el.classList.remove('campo-valido', 'campo-invalido');
        });

        // Reseta o contador de caracteres
        contador.textContent = `0 / ${MIN_MSG} caracteres mínimos`;
        contador.classList.remove('contador-ok');

        // Esconde a mensagem de sucesso automaticamente após 5 segundos
        setTimeout(() => { msgSucesso.hidden = true; }, 5000);
    });
});
