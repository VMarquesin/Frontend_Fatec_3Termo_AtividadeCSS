// Formata valor numérico para Real brasileiro
const formatarBRL = valor =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Sidebar do carrinho de compras
// Props: itens | total | onRemover (callback com id) | onFinalizar (abre modal)
export default function Carrinho({ itens, total, onRemover, onFinalizar }) {
  return (
    <aside id="carrinho" aria-label="Carrinho de compras">
      <h2>Carrinho</h2>

      {/* Mensagem exibida quando o carrinho está vazio */}
      {itens.length === 0 && (
        <p id="mensagem-vazio">Seu carrinho está vazio.</p>
      )}

      {/* Lista de itens — cada um com botão "Remover" vinculado ao seu ID único */}
      <ul id="lista-carrinho">
        {itens.map(item => (
          <li key={item.id} className="item-carrinho">
            <span className="item-nome">{item.nome}</span>
            <span className="item-preco">{formatarBRL(item.preco)}</span>
            <button
              type="button"
              className="btn-remover"
              aria-label={`Remover ${item.nome} do carrinho`}
              onClick={() => onRemover(item.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      {/* Total recalculado automaticamente pelo hook */}
      <div id="total-carrinho">
        Total: <span id="valor-total">{formatarBRL(total)}</span>
      </div>

      {/* Botão desabilitado enquanto o carrinho estiver vazio */}
      <button
        type="button"
        id="btn-finalizar"
        disabled={itens.length === 0}
        onClick={onFinalizar}
      >
        Finalizar Pedido
      </button>
    </aside>
  )
}
