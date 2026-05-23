import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Menu from './pages/Menu'
import Contato from './pages/Contato'

// Componente raiz: define o roteamento entre as páginas
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Página principal com o menu e o carrinho */}
        <Route path="/" element={<Menu />} />
        {/* Página de contato com formulário validado */}
        <Route path="/contato" element={<Contato />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
