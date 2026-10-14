export default function TarjetaPollera({ p, onAgregar }) {
  const agotada = p.stock <= 0;
  return (
    <article className="tarjeta">
      <div className="foto" style={p.imagen ? { backgroundImage: `url(${p.imagen})` } : { background: p.color }}>
        {!p.imagen && <span className="bastas-visual">{Array.from({ length: p.bastas }).map((_, i) => <i key={i} />)}</span>}
      </div>
      <div className="tarjeta-cuerpo">
        <h3>{p.nombre}</h3>
        <p className="suave">{p.bastas} bastas · {p.tela}</p>
        <p className="precio">Bs. {p.precio}</p>
        <p className={p.stock < 5 ? "alerta" : "suave"}>
          {agotada ? "Agotada" : `Quedan ${p.stock}`}
        </p>
        <button className="btn" disabled={agotada} onClick={() => onAgregar(p)}>
          Agregar al pedido
        </button>
      </div>
    </article>
  );
}
