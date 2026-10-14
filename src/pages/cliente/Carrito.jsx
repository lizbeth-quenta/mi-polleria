import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTienda } from "../../context/TiendaContext";

export default function Carrito() {
  const { usuario } = useAuth();
  const { carrito, total, cambiarCantidad, quitar, confirmarPedido } = useTienda();
  const navigate = useNavigate();
  const [cintura, setCintura] = useState("");
  const [largo, setLargo] = useState("");
  const [nota, setNota] = useState("");

  if (carrito.length === 0)
    return (
      <p className="vacio">
        Tu pedido está vacío. <Link to="/cliente">Mira el catálogo</Link>
      </p>
    );

  const confirmar = (e) => {
    e.preventDefault();
    confirmarPedido(usuario, { cintura: Number(cintura), largo: Number(largo) }, nota);
    navigate("/cliente/pedidos");
  };

  return (
    <>
      <h2>Tu pedido</h2>
      <div className="scroll-x">
        <table className="tabla">
          <thead><tr><th>Pollera</th><th>Bastas</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
          <tbody>
            {carrito.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td><td>{i.bastas}</td><td>Bs. {i.precio}</td>
                <td>
                  <button className="mini" onClick={() => cambiarCantidad(i.id, -1)} aria-label="Menos">−</button>
                  {" "}{i.cantidad}{" "}
                  <button className="mini" onClick={() => cambiarCantidad(i.id, 1)} aria-label="Más">+</button>
                </td>
                <td>Bs. {i.precio * i.cantidad}</td>
                <td><button className="btn-linea" onClick={() => quitar(i.id)}>Quitar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="total">Total: Bs. {total}</p>

      <form className="panel" onSubmit={confirmar}>
        <h3>Tus medidas</h3>
        <p className="suave">La pollera se confecciona a tu medida.</p>
        <div className="fila">
          <label>Cintura (cm)<input type="number" min="40" max="200" required value={cintura} onChange={(e) => setCintura(e.target.value)} /></label>
          <label>Largo (cm)<input type="number" min="30" max="150" required value={largo} onChange={(e) => setLargo(e.target.value)} /></label>
        </div>
        <label>Nota para la pollera (opcional)
          <textarea rows="2" value={nota} onChange={(e) => setNota(e.target.value)} />
        </label>
        <button className="btn grande" type="submit">Confirmar pedido</button>
      </form>
    </>
  );
}
