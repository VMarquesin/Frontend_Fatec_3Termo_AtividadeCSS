// Cartão individual de pizza no menu
// Props: pizza (objeto com dados) | onAdicionar (callback ao clicar em "Pedir agora")
export default function CardPizza({ pizza, onAdicionar }) {
  return (
    <article>
      <img src={pizza.imagem} alt={pizza.alt} />
      <h3>{pizza.nome}</h3>
      <p>{pizza.descricao}</p>
      {/* Chama o callback passando nome e preço para o hook useCarrinho */}
      <button type="button" onClick={() => onAdicionar(pizza.nome, pizza.preco)}>
        Pedir agora
      </button>
    </article>
  )
}
