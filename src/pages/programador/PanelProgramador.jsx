import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTienda } from "../../context/TiendaContext";
import { leerLogs } from "../../utils/log";

export default function PanelProgramador() {
  const { usuario, usuarios, cambiarRol } = useAuth();
  const { polleras, pedidos } = useTienda();
  const [logs, setLogs] = useState(leerLogs());

  const reiniciar = () => {
    if (!window.confirm("Se borrarán usuarios, polleras, pedidos y registros. ¿Continuar?")) return;
    Object.keys(localStorage).filter((k) => k.startsWith("polleria_")).forEach((k) => localStorage.removeItem(k));
    window.location.href = "/login";
  };

  return (
    <>
      <h2>Panel del programador</h2>
      <div className="indicadores">
        <div className="indicador"><span>Usuarios</span><strong>{usuarios.length}</strong></div>
        <div className="indicador"><span>Polleras</span><strong>{polleras.length}</strong></div>
        <div className="indicador"><span>Pedidos</span><strong>{pedidos.length}</strong></div>
      </div>

      <h3>Usuarios y roles</h3>
      <div className="scroll-x">
        <table className="tabla">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.email}>
                <td>{u.nombre}</td><td>{u.email}</td>
                <td>
                  <select value={u.rol} disabled={u.email === usuario.email}
                          onChange={(e) => cambiarRol(u.email, e.target.value)} aria-label={`Rol de ${u.email}`}>
                    <option value="cliente">cliente</option>
                    <option value="dueno">dueno</option>
                    <option value="programador">programador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fila entre">
        <h3>Registro de actividad</h3>
        <button className="btn-linea" onClick={() => setLogs(leerLogs())}>Actualizar</button>
      </div>
      <pre className="consola">
        {logs.length === 0 ? "Sin actividad registrada." : logs.map((l) => `${l.fecha}  ${l.mensaje}`).join("\n")}
      </pre>

      <h3>Mantenimiento</h3>
      <button className="btn-linea peligro" onClick={reiniciar}>Reiniciar datos de demostración</button>
    </>
  );
}
