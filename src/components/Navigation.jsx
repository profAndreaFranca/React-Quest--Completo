import { NavLink } from "react-router";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation">
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/missions">Missões</NavLink>
      <NavLink to="/projects">Projetos</NavLink>
      <NavLink to="/evolution">Evolução</NavLink>
      <NavLink to="/profile">Perfil</NavLink>
    </nav>
  );
}

export default Navigation;
