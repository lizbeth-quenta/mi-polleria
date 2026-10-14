import { useState } from "react";
import { useTienda } from "../../context/TiendaContext";
import { CATEGORIAS, ESTADOS } from "../../data/polleras";

const VACIO = { nombre: "", bastas: 5, tela: "", categoria: CATEGORIAS[0], precio: 0, stock: 0, color: "#D81B73", imagen: "" };

function Resumen() {
  const { polleras, pedidos } = useTienda();
  const ventas = pedidos.filter((p) => p.estado !== "Cancelado").reduce((s, p) => s + p.total, 0);
  const nuevos = pedidos.filter((p) => p.estado === "Nuevo").length;
  const bajo = polleras.filter((p) => p.stock < 5);
  return (
    <>
      <div className="indicadores">
        <div className="indicador"><span>Ventas registradas</span><strong>Bs. {ventas}</strong></div>
        <div className="indicador"><span>Pedidos nuevos</span><strong>{nuevos}</strong></div>
        <div className="indicador"><span>Modelos con poco stock</span><strong>{bajo.length}</strong></div>
      </div>
      <h3>Reponer pronto</h3>
      {bajo.length === 0 ? <p className="vacio">Todo el stock está bien.</p> :
        <ul>{bajo.map((p) => <li key={p.id}>{p.nombre}: quedan {p.stock}</li>)}</ul>}
    </>
  );
}

function Productos() {
  const { polleras, guardarPollera, borrarPollera } = useTienda();
  const [form, setForm] = useState(null);

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const guardar = (e) => {
    e.preventDefault();
    guardarPollera({ ...form, bastas: Number(form.bastas), precio: Number(form.precio), stock: Number(form.stock) });
    setForm(null);
  };
  const borrar = (p) => { if (window.confirm(`¿Borrar "${p.nombre}"? Esta acción no se puede deshacer.`)) borrarPollera(p.id); };

  return (
    <>
      <button className="btn" onClick={() => setForm({ ...VACIO })}>Agregar pollera nueva</button>

      {form && (
        <form className="panel" onSubmit={guardar}>
          <h3>{form.id ? "Editar pollera" : "Pollera nueva"}</h3>
          <div className="fila">
            <label>Nombre<input required value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} /></label>
            <label>Tela<input required value={form.tela} onChange={(e) => cambiar("tela", e.target.value)} /></label>
          </div>
          <div className="fila">
            <label>Bastas<input type="number" min="1" max="20" value={form.bastas} onChange={(e) => cambiar("bastas", e.target.value)} /></label>
            <label>Precio (Bs.)<input type="number" min="0" value={form.precio} onChange={(e) => cambiar("precio", e.target.value)} /></label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={(e) => cambiar("stock", e.target.value)} /></label>
          </div>
          <div className="fila">
            <label>Categoría
              <select value={form.categoria} onChange={(e) => cambiar("categoria", e.target.value)}>
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Color<input type="color" value={form.color} onChange={(e) => cambiar("color", e.target.value)} /></label>
          </div>
          <label>Enlace de la foto (opcional)
            <input placeholder="https://…" value={form.imagen} onChange={(e) => cambiar("imagen", e.target.value)} />
          </label>
          <div className="fila">
            <button className="btn" type="submit">Guardar cambios</button>
            <button className="btn-linea" type="button" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="scroll-x">
        <table className="tabla">
          <thead><tr><th>Modelo</th><th>Bastas</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {polleras.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td><td>{p.bastas}</td><td>{p.categoria}</td>
                <td>Bs. {p.precio}</td><td className={p.stock < 5 ? "alerta" : ""}>{p.stock}</td>
                <td>
                  <button className="btn-linea" onClick={() => setForm(p)}>Editar</button>{" "}
                  <button className="btn-linea peligro" onClick={() => borrar(p)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Pedidos() {
  const { pedidos, cambiarEstado } = useTienda();
  if (pedidos.length === 0) return <p className="vacio">Todavía no hay pedidos.</p>;
  return pedidos.map((p) => (
    <div className="panel" key={p.id}>
      <div className="fila entre">
        <strong>Pedido {p.id} · {p.cliente}</strong>
        <select value={p.estado} onChange={(e) => cambiarEstado(p.id, e.target.value)} aria-label="Estado del pedido">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <p className="suave">{p.fecha} · Cintura {p.medidas.cintura} cm · Largo {p.medidas.largo} cm</p>
      <ul>{p.items.map((i) => <li key={i.id}>{i.cantidad} × {i.nombre} ({i.bastas} bastas)</li>)}</ul>
      {p.nota && <p><em>Nota: {p.nota}</em></p>}
      <strong>Total: Bs. {p.total}</strong>
    </div>
  ));
}

export default function PanelDueno() {
  const [tab, setTab] = useState("resumen");
  const tabs = { resumen: <Resumen />, productos: <Productos />, pedidos: <Pedidos /> };
  return (
    <>
      <h2>Panel del dueño</h2>
      <div className="pestanas">
        {Object.keys(tabs).map((t) => (
          <button key={t} className={tab === t ? "activa" : ""} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tabs[tab]}
    </>
  );
}
