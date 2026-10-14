import { useAuth } from "../../context/AuthContext";
import { useTienda } from "../../context/TiendaContext";

export default function MisPedidos() {
  const { usuario } = useAuth();
  const { pedidos } = useTienda();
  const mios = pedidos.filter((p) => p.email === usuario.email);

  return (
    <>
      <h2>Mis pedidos</h2>
      {mios.length === 0 && <p className="vacio">Aún no has hecho pedidos.</p>}
      {mios.map((p) => (
        <div className="panel" key={p.id}>
          <div className="fila entre">
            <strong>Pedido {p.id}</strong>
            <span className="estado">{p.estado}</span>
          </div>
          <p className="suave">{p.fecha} · Cintura {p.medidas.cintura} cm · Largo {p.medidas.largo} cm</p>
          <ul>{p.items.map((i) => <li key={i.id}>{i.cantidad} × {i.nombre}</li>)}</ul>
          <strong>Total: Bs. {p.total}</strong>
        </div>
      ))}
    </>
  );
}
