const formatarBRL = valor =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Agrupa itens do carrinho por nome para exibir quantidade por sabor
function agruparItens(itens) {
  const agrupado = {}
  itens.forEach(item => {
    if (agrupado[item.nome]) {
      agrupado[item.nome].quantidade++
      agrupado[item.nome].subtotal += item.preco
    } else {
      agrupado[item.nome] = { quantidade: 1, subtotal: item.preco }
    }
  })
  return Object.entries(agrupado)
}

// Modal de resumo do pedido
// Props: itens | total | onConfirmar | onFechar
export default function ModalResumo({ itens, total, onConfirmar, onFechar }) {
  return (
    // Overlay escurecido — clique fora do modal fecha
    <div className="modal-overlay" onClick={onFechar} role="presentation">

      {/* Caixa central — stopPropagation impede que o clique interno feche o modal */}
      <div
        className="modal-caixa"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="modal-titulo">Resumo do Pedido</h2>

        {/* Lista de pizzas agrupadas por sabor com quantidade e subtotal */}
        <ul id="modal-lista">
          {agruparItens(itens).map(([nome, dados]) => (
            <li key={nome} className="modal-item">
              <span className="modal-item-nome">{nome}</span>
              <span className="modal-item-qtd">x{dados.quantidade}</span>
              <span className="modal-item-subtotal">{formatarBRL(dados.subtotal)}</span>
            </li>
          ))}
        </ul>

        {/* Quantidade total de pizzas e soma final */}
        <div className="modal-totais">
          <p>Quantidade total: <strong>{itens.length}</strong> pizza(s)</p>
          <p>Soma final: <strong>{formatarBRL(total)}</strong></p>
        </div>

        {/* Botões de ação */}
        <div className="modal-botoes">
          <button type="button" id="btn-confirmar" onClick={onConfirmar}>
            Confirmar
          </button>
          <button type="button" id="btn-fechar-modal" onClick={onFechar}>
            Fechar Modal
          </button>
        </div>
      </div>
    </div>
  )
}
