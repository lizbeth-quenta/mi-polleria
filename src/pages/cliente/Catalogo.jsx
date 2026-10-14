import { useState } from "react";
import { useTienda } from "../../context/TiendaContext";
import { CATEGORIAS } from "../../data/polleras";
import TarjetaPollera from "../../components/TarjetaPollera";

export default function Catalogo() {
  const { polleras, agregar } = useTienda();
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [aviso, setAviso] = useState("");

  const lista = polleras.filter(
    (p) =>
      (categoria === "Todas" || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const alAgregar = (p) => {
    agregar(p);
    setAviso(`"${p.nombre}" se agregó a tu pedido`);
    setTimeout(() => setAviso(""), 2000);
  };

  return (
    <>
      <h2>Catálogo de polleras</h2>
      <div className="filtros">
        <input placeholder="Buscar pollera…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {["Todas", ...CATEGORIAS].map((c) => (
          <button key={c} className={"chip" + (categoria === c ? " activa" : "")} onClick={() => setCategoria(c)}>{c}</button>
        ))}
      </div>
      {aviso && <p className="aviso" role="status">{aviso}</p>}
      {lista.length === 0 ? (
        <p className="vacio">No hay polleras con ese filtro. Prueba con otra categoría.</p>
      ) : (
        <div className="grilla">
          {lista.map((p) => <TarjetaPollera key={p.id} p={p} onAgregar={alAgregar} />)}
        </div>
      )}
    </>
  );
}
