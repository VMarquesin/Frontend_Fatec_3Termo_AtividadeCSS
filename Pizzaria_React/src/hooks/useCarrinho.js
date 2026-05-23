import { useState, useEffect } from 'react'

// Chave usada para persistir o carrinho no localStorage
const STORAGE_KEY = 'itensCarrinho'

// Carrega o estado inicial a partir do localStorage (executado apenas uma vez)
function carregarEstadoInicial() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    return salvo ? JSON.parse(salvo) : []
  } catch {
    return []
  }
}

// Hook personalizado que encapsula toda a lógica do carrinho
export function useCarrinho() {
  // useState com função inicializadora — lê o localStorage apenas no primeiro render
  const [itens, setItens] = useState(carregarEstadoInicial)

  // Contador de IDs únicos — parte do maior ID salvo para não reutilizar IDs
  const [proximoId, setProximoId] = useState(() => {
    const salvo = carregarEstadoInicial()
    return salvo.length > 0 ? Math.max(...salvo.map(i => i.id)) + 1 : 0
  })

  // Persiste no localStorage sempre que o array de itens mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens))
  }, [itens])

  // Adiciona uma pizza ao carrinho com ID único
  function adicionarItem(nome, preco) {
    setItens(prev => [...prev, { id: proximoId, nome, preco }])
    setProximoId(prev => prev + 1)
  }

  // Remove um item pelo seu ID único — nunca remove o item errado
  function removerItem(id) {
    setItens(prev => prev.filter(item => item.id !== id))
  }

  // Limpa o carrinho e reseta o contador (chamado ao confirmar pedido)
  function limparCarrinho() {
    setItens([])
    setProximoId(0)
  }

  // Total calculado derivado do array de itens
  const total = itens.reduce((soma, item) => soma + item.preco, 0)

  return { itens, total, adicionarItem, removerItem, limparCarrinho }
}
