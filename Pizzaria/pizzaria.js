let itensCarrinho = [];
let proximoId = 0;

// ============================================================
// localStorage — salvar e carregar o estado do carrinho
// ============================================================

// Serializa o array e o contador no localStorage
function salvarCarrinho() {
    localStorage.setItem('itensCarrinho', JSON.stringify(itensCarrinho));
    localStorage.setItem('proximoId', JSON.stringify(proximoId));
}

// Recupera e desserializa o carrinho salvo
// Se não houver dados salvos, mantém o array vazio inicial
function carregarCarrinho() {
    const dadosSalvos = localStorage.getItem('itensCarrinho');
    const idSalvo     = localStorage.getItem('proximoId');

    if (dadosSalvos) {
        itensCarrinho = JSON.parse(dadosSalvos);
        proximoId     = idSalvo ? JSON.parse(idSalvo) : itensCarrinho.length;
    }
}

function adicionarAoCarrinho(nome, preco) {
    itensCarrinho.push({ id: proximoId++
                        ,nome
                        ,preco: parseFloat(preco) });

    salvarCarrinho(); // persiste o novo item no localStorage
    renderizarCarrinho();
}

function removerDoCarrinho(id) {
    itensCarrinho = itensCarrinho.filter(item => item.id !== id);

    salvarCarrinho(); // persiste o carrinho atualizado no localStorage
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista         = document.getElementById('lista-carrinho');
    const mensagemVazio = document.getElementById('mensagem-vazio');
    const valorTotal    = document.getElementById('valor-total');
    const btnFinalizar  = document.getElementById('btn-finalizar');

    lista.innerHTML = '';
    mensagemVazio.style.display = itensCarrinho.length === 0 ? 'block' : 'none';

    // Habilita o botão "Finalizar Pedido" somente quando há itens no carrinho
    btnFinalizar.disabled = itensCarrinho.length === 0;

    itensCarrinho.forEach(item => {

        const li = document.createElement('li');

        li.classList.add('item-carrinho');
        li.innerHTML =
            `<span class="item-nome">${item.nome}</span>` 
          + `<span class="item-preco">${item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>` 
          + `<button class="btn-remover" type="button" aria-label="Remover ${item.nome} do carrinho">Remover</button>`;

        li.querySelector('.btn-remover').addEventListener('click', () => removerDoCarrinho(item.id));
        lista.appendChild(li);

    });

    const total = itensCarrinho.reduce((soma, i) => soma + i.preco, 0);

    valorTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.addEventListener('DOMContentLoaded', () => {

    // Restaura o carrinho salvo antes de qualquer renderização
    carregarCarrinho();
    renderizarCarrinho();

    // Botões "Pedir agora" — adicionam pizza ao carrinho
    document.querySelectorAll('button[data-nome]').forEach(botao => {
        botao.addEventListener('click', () => adicionarAoCarrinho(botao.dataset.nome, botao.dataset.preco));
    });

    // Botão "Finalizar Pedido" — abre o modal com o resumo
    document.getElementById('btn-finalizar').addEventListener('click', abrirModal);

    // Botão "Fechar Modal" — fecha sem confirmar
    document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);

    // Botão "Confirmar" — finaliza o pedido
    document.getElementById('btn-confirmar').addEventListener('click', confirmarPedido);

    // Clique no overlay escurecido também fecha o modal
    document.getElementById('modal-overlay').addEventListener('click', fecharModal);

    // Tecla Escape fecha o modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') fecharModal();
    });
});

// ============================================================
// MODAL — funções de abrir, fechar e confirmar
// ============================================================

// Preenche o modal com os itens do carrinho e o exibe
function abrirModal() {
    const modalLista = document.getElementById('modal-lista');
    const modalQtd   = document.getElementById('modal-quantidade');
    const modalTotal = document.getElementById('modal-total');

    // Limpa lista anterior antes de preencher
    modalLista.innerHTML = '';

    // Agrupa os itens por nome para exibir quantidade por sabor
    const agrupado = {};
    itensCarrinho.forEach(item => {
        if (agrupado[item.nome]) {
            agrupado[item.nome].quantidade++;
            agrupado[item.nome].subtotal += item.preco;
        } else {
            agrupado[item.nome] = { quantidade: 1, subtotal: item.preco };
        }
    });

    // Cria um <li> por sabor com nome, quantidade e subtotal
    Object.entries(agrupado).forEach(([nome, dados]) => {
        const li = document.createElement('li');
        li.classList.add('modal-item');
        li.innerHTML =
            `<span class="modal-item-nome">${nome}</span>`
          + `<span class="modal-item-qtd">x${dados.quantidade}</span>`
          + `<span class="modal-item-subtotal">${dados.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
        modalLista.appendChild(li);
    });

    // Preenche quantidade total e soma final
    modalQtd.textContent = itensCarrinho.length;
    const total = itensCarrinho.reduce((soma, i) => soma + i.preco, 0);
    modalTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Exibe o modal adicionando a classe .ativo
    document.getElementById('modal-resumo').classList.add('ativo');
}

// Remove a classe .ativo, ocultando o modal
function fecharModal() {
    document.getElementById('modal-resumo').classList.remove('ativo');
}

// Confirma o pedido: exibe alerta, limpa carrinho e fecha o modal
function confirmarPedido() {
    alert('Pedido confirmado! Obrigado pela sua compra 🍕');
    itensCarrinho = [];
    proximoId = 0;
    salvarCarrinho(); // limpa o localStorage após a confirmação do pedido
    renderizarCarrinho();
    fecharModal();
}