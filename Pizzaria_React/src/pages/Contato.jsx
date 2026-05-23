import { useState } from 'react'

// Regex simples para validar formato de e-mail
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Comprimento mínimo aceito para a mensagem
const MIN_MSG = 10

// Estado inicial dos campos e erros
const CAMPOS_VAZIO  = { nome: '', email: '', mensagem: '' }
const ERROS_VAZIO   = { nome: '', email: '', mensagem: '' }
const TOCADOS_VAZIO = { nome: false, email: false, mensagem: false }

// Página de contato com formulário validado no front-end
export default function Contato() {
  const [campos,  setCampos]  = useState(CAMPOS_VAZIO)
  const [erros,   setErros]   = useState(ERROS_VAZIO)
  // "tocados" controla quando mostrar erros (apenas após o usuário interagir)
  const [tocados, setTocados] = useState(TOCADOS_VAZIO)
  const [sucesso, setSucesso] = useState(false)

  // Valida um campo específico e retorna a mensagem de erro ou string vazia
  function validarCampo(campo, valor) {
    if (campo === 'nome') {
      return valor.trim() ? '' : 'O nome é obrigatório.'
    }
    if (campo === 'email') {
      if (!valor.trim()) return 'O e-mail é obrigatório.'
      if (!REGEX_EMAIL.test(valor.trim())) return 'Informe um e-mail válido (ex: nome@dominio.com).'
      return ''
    }
    if (campo === 'mensagem') {
      if (!valor.trim()) return 'A mensagem é obrigatória.'
      if (valor.trim().length < MIN_MSG) return `A mensagem deve ter pelo menos ${MIN_MSG} caracteres.`
      return ''
    }
    return ''
  }

  // Atualiza o campo e revalida em tempo real se já foi tocado
  function handleChange(e) {
    const { name, value } = e.target
    setCampos(prev => ({ ...prev, [name]: value }))
    if (tocados[name]) {
      setErros(prev => ({ ...prev, [name]: validarCampo(name, value) }))
    }
  }

  // Valida ao sair do campo — feedback imediato sem precisar clicar em enviar
  function handleBlur(e) {
    const { name, value } = e.target
    setTocados(prev => ({ ...prev, [name]: true }))
    setErros(prev => ({ ...prev, [name]: validarCampo(name, value) }))
  }

  // Valida tudo ao submeter — bloqueia se houver qualquer erro
  function handleSubmit(e) {
    e.preventDefault()

    const novosErros = {
      nome:     validarCampo('nome',     campos.nome),
      email:    validarCampo('email',    campos.email),
      mensagem: validarCampo('mensagem', campos.mensagem),
    }

    // Marca todos os campos como tocados para exibir os erros
    setErros(novosErros)
    setTocados({ nome: true, email: true, mensagem: true })

    // Se houver qualquer erro, interrompe o envio
    if (Object.values(novosErros).some(msg => msg !== '')) return

    // Formulário válido: exibe mensagem de sucesso e reseta o estado
    setSucesso(true)
    setCampos(CAMPOS_VAZIO)
    setTocados(TOCADOS_VAZIO)
    setErros(ERROS_VAZIO)
    setTimeout(() => setSucesso(false), 5000)
  }

  // Contador de caracteres para o textarea
  const qtdMensagem = campos.mensagem.trim().length

  // Retorna a classe CSS do campo baseado no estado de validação
  function classeCampo(nome) {
    if (!tocados[nome]) return ''
    return erros[nome] ? 'campo-invalido' : 'campo-valido'
  }

  return (
    <main>
      <h1>Fale Conosco</h1>

      <section className="contato-wrapper" aria-labelledby="contato-titulo">
        <h2 id="contato-titulo" hidden>Formulário de Contato</h2>

        {/* Mensagem de sucesso — renderizada condicionalmente */}
        {sucesso && (
          <div className="msg-sucesso" role="alert">
            ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Campo: Nome */}
          <div className="campo">
            <label htmlFor="nome">
              Nome <span className="obrigatorio" aria-label="obrigatório">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={campos.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Seu nome completo"
              autoComplete="name"
              className={classeCampo('nome')}
              aria-describedby="erro-nome"
            />
            <span className="erro" id="erro-nome" role="alert" aria-live="polite">
              {erros.nome}
            </span>
          </div>

          {/* Campo: E-mail */}
          <div className="campo">
            <label htmlFor="email">
              E-mail <span className="obrigatorio" aria-label="obrigatório">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={campos.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="seu@email.com"
              autoComplete="email"
              className={classeCampo('email')}
              aria-describedby="erro-email"
            />
            <span className="erro" id="erro-email" role="alert" aria-live="polite">
              {erros.email}
            </span>
          </div>

          {/* Campo: Mensagem */}
          <div className="campo">
            <label htmlFor="mensagem">
              Mensagem <span className="obrigatorio" aria-label="obrigatório">*</span>
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              value={campos.mensagem}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Escreva sua mensagem (mínimo 10 caracteres)..."
              rows={5}
              className={classeCampo('mensagem')}
              aria-describedby="erro-mensagem contador-mensagem"
            />
            {/* Contador de caracteres em tempo real */}
            <span
              id="contador-mensagem"
              className={`contador${qtdMensagem >= MIN_MSG ? ' contador-ok' : ''}`}
            >
              {qtdMensagem} / {MIN_MSG} caracteres mínimos
            </span>
            <span className="erro" id="erro-mensagem" role="alert" aria-live="polite">
              {erros.mensagem}
            </span>
          </div>

          <button type="submit" id="btn-enviar">Enviar Mensagem</button>
        </form>
      </section>
    </main>
  )
}
