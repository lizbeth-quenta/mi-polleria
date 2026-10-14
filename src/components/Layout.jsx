import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTienda } from "../context/TiendaContext";

export default function Layout({ marca, links }) {
  const { usuario, logout } = useAuth();
  const { carrito } = useTienda();
  const navigate = useNavigate();
  const unidades = carrito.reduce((s, i) => s + i.cantidad, 0);

  const salir = () => { logout(); navigate("/login"); };

  return (
    <>
      <header className="barra">
        <strong className="marca">{marca}</strong>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.texto}
              {l.carrito && unidades > 0 && <span className="insignia">{unidades}</span>}
            </NavLink>
          ))}
        </nav>
        <span className="usuario">Hola, {usuario.nombre}</span>
        <button className="btn-linea" onClick={salir}>Salir</button>
      </header>
      <div className="aguayo" aria-hidden="true" />
      <main className="contenedor"><Outlet /></main>
    </>
  );
}
