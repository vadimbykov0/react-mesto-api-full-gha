import logo from '../images/Logo.svg';

export default function Header({ children }) {
  return (
    <header className="header">
      <a href="#"><img src={logo} className="header__logo" alt="Логотип Место" /></a>
      {children}
    </header>
  )
}
