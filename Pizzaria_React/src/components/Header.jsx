import { Link, useLocation } from 'react-router-dom'

// Cabeçalho compartilhado por todas as páginas
export default function Header() {
  const { pathname } = useLocation()

  return (
    <header>
      <div>
        <img
          src="https://www.creativefabrica.com/wp-content/uploads/2022/04/17/Pizza-Logo-Design-Graphics-29132095-1.jpg"
          alt="Logo da Pizzaria"
          className="logo"
        />
      </div>
      <nav aria-label="Navegação principal">
        <ul>
          {/* Link ativo recebe a classe .nav-ativo para destaque visual */}
          <li>
            <Link to="/" className={pathname === '/' ? 'nav-ativo' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/" className={pathname === '/' ? 'nav-ativo' : ''}>Menu</Link>
          </li>
          <li>
            <Link to="/contato" className={pathname === '/contato' ? 'nav-ativo' : ''}>Contact</Link>
          </li>
        </ul>
        <button aria-label="Abrir menu">=</button>
      </nav>
    </header>
  )
}
