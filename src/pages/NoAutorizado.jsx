import { Link } from "react-router-dom";
import { useAuth, RUTA_POR_ROL } from "../context/AuthContext";

export default function NoAutorizado() {
  const { usuario } = useAuth();
  return (
    <div className="login-pagina">
      <div className="login-caja">
        <h1>Sin acceso</h1>
        <p>Tu cuenta no tiene permiso para ver esta zona.</p>
        <Link className="btn grande" to={usuario ? RUTA_POR_ROL[usuario.rol] : "/login"}>
          Volver a mi zona
        </Link>
      </div>
    </div>
  );
}
