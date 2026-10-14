import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, RUTA_POR_ROL } from "../context/AuthContext";

export default function Login() {
  const { usuario, login, registrar } = useAuth();
  const navigate = useNavigate();
  const [modo, setModo] = useState("ingresar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (usuario) navigate(RUTA_POR_ROL[usuario.rol], { replace: true });
  }, [usuario, navigate]);

  const enviar = (e) => {
    e.preventDefault();
    setError("");
    if (modo === "ingresar") {
      if (!login(email, password)) setError("Correo o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.");
    } else {
      if (!nombre.trim() || password.length < 4) return setError("Escribe tu nombre y una contraseña de al menos 4 caracteres.");
      const r = registrar(nombre, email, password);
      if (r.error) setError(r.error);
    }
  };

  const demo = (correo) => { setModo("ingresar"); setEmail(correo); setPassword("1234"); };

  return (
    <div className="login-pagina">
      <div className="aguayo grueso" aria-hidden="true" />
      <form className="login-caja" onSubmit={enviar}>
        <h1>Pollería Chola Paceña</h1>
        <p className="suave">Polleras de La Paz, hechas con varias bastas.</p>

        <div className="pestanas">
          <button type="button" className={modo === "ingresar" ? "activa" : ""} onClick={() => setModo("ingresar")}>Ingresar</button>
          <button type="button" className={modo === "registro" ? "activa" : ""} onClick={() => setModo("registro")}>Crear cuenta</button>
        </div>

        {modo === "registro" && (
          <label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} /></label>
        )}
        <label>Correo electrónico
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Contraseña
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn grande" type="submit">{modo === "ingresar" ? "Ingresar" : "Crear mi cuenta"}</button>

        <div className="demo">
          <span className="suave">Cuentas de prueba:</span>
          <button type="button" className="btn-linea" onClick={() => demo("cliente@demo.com")}>Cliente</button>
          <button type="button" className="btn-linea" onClick={() => demo("dueno@demo.com")}>Dueño</button>
          <button type="button" className="btn-linea" onClick={() => demo("dev@demo.com")}>Programador</button>
        </div>
      </form>
    </div>
  );
}
