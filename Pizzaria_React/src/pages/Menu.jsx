import { useState, useEffect } from 'react'
import { PIZZAS } from '../data/pizzas'
import { useCarrinho } from '../hooks/useCarrinho'
import CardPizza from '../components/CardPizza'
import Carrinho from '../components/Carrinho'
import ModalResumo from '../components/ModalResumo'

// Página principal: menu de pizzas + carrinho lateral + modal de resumo
export default function Menu() {
  const { itens, total, adicionarItem, removerItem, limparCarrinho } = useCarrinho()
  const [modalAberto, setModalAberto] = useState(false)

  // Fecha o modal ao pressionar a tecla Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setModalAberto(false)
    }
    document.addEventListener('keydown', onKeyDown)
    // Limpa o listener ao desmontar o componente
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Confirma o pedido, limpa o carrinho (e o localStorage) e fecha o modal
  function confirmarPedido() {
    alert('Pedido confirmado! Obrigado pela sua compra 🍕')
    limparCarrinho()
    setModalAberto(false)
  }

  return (
    <main>
      <h1>Menu</h1>

      {/* Wrapper flex: cartões de pizza à esquerda, carrinho à direita */}
      <div className="menu-carrinho-wrapper">

        <section aria-labelledby="menu-title">
          <h2 id="menu-title" hidden>Nossas Pizzas</h2>
          {/* Renderiza um CartãoPizza para cada item do array de dados */}
          {PIZZAS.map(pizza => (
            <CardPizza key={pizza.id} pizza={pizza} onAdicionar={adicionarItem} />
          ))}
        </section>

        {/* Sidebar do carrinho com o estado gerenciado pelo hook */}
        <Carrinho
          itens={itens}
          total={total}
          onRemover={removerItem}
          onFinalizar={() => setModalAberto(true)}
        />
      </div>

      {/* Modal renderizado condicionalmente — só existe no DOM quando aberto */}
      {modalAberto && (
        <ModalResumo
          itens={itens}
          total={total}
          onConfirmar={confirmarPedido}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </main>
  )
}
