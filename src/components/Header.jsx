import './Header.css';
import { NavLink } from "react-router";
function Header() {
  return (
    <header className="header">
      <div>
        <p className="header__logo">React Quest</p>
        <span className="header__subtitle">
          Central de Evolução Dev
        </span>
      </div>

      <NavLink to="/profile" className="header__button">Meu perfil</NavLink>
    </header>
  );
}

export default Header;
