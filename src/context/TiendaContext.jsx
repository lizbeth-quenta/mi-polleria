import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { POLLERAS_INICIALES } from "../data/polleras";
import { log } from "../utils/log";

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [polleras, setPolleras] = useLocalStorage("polleria_polleras", POLLERAS_INICIALES);
  const [pedidos, setPedidos] = useLocalStorage("polleria_pedidos", []);
  const [carrito, setCarrito] = useState([]);

  // ---- Carrito (cliente) ----
  const agregar = (p) =>
    setCarrito((c) => {
      const existe = c.find((i) => i.id === p.id);
      if (existe)
        return c.map((i) => (i.id === p.id ? { ...i, cantidad: Math.min(i.cantidad + 1, p.stock) } : i));
      return [...c, { id: p.id, nombre: p.nombre, precio: p.precio, bastas: p.bastas, stock: p.stock, cantidad: 1 }];
    });

  const cambiarCantidad = (id, delta) =>
    setCarrito((c) =>
      c.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, Math.min(i.stock, i.cantidad + delta)) } : i))
    );

  const quitar = (id) => setCarrito((c) => c.filter((i) => i.id !== id));
  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  const confirmarPedido = (usuario, medidas, nota) => {
    const pedido = {
      id: Date.now(),
      email: usuario.email,
      cliente: usuario.nombre,
      items: carrito.map(({ id, nombre, precio, cantidad, bastas }) => ({ id, nombre, precio, cantidad, bastas })),
      total, medidas, nota,
      estado: "Nuevo",
      fecha: new Date().toLocaleDateString("es-BO"),
    };
    setPedidos((p) => [pedido, ...p]);
    setPolleras((ps) =>
      ps.map((x) => {
        const it = carrito.find((i) => i.id === x.id);
        return it ? { ...x, stock: x.stock - it.cantidad } : x;
      })
    );
    setCarrito([]);
    log(`Pedido ${pedido.id} creado por ${usuario.email} (Bs. ${total})`);
  };

  // ---- Gestión (dueño) ----
  const cambiarEstado = (id, estado) => {
    setPedidos((ps) => ps.map((p) => (p.id === id ? { ...p, estado } : p)));
    log(`Pedido ${id} pasó a "${estado}"`);
  };

  const guardarPollera = (p) => {
    if (p.id) {
      setPolleras((ps) => ps.map((x) => (x.id === p.id ? p : x)));
      log(`Pollera editada: ${p.nombre}`);
    } else {
      setPolleras((ps) => [...ps, { ...p, id: Date.now() }]);
      log(`Pollera creada: ${p.nombre}`);
    }
  };

  const borrarPollera = (id) => {
    setPolleras((ps) => ps.filter((x) => x.id !== id));
    log(`Pollera borrada (id ${id})`);
  };

  return (
    <TiendaContext.Provider
      value={{ polleras, pedidos, carrito, total, agregar, cambiarCantidad, quitar,
               confirmarPedido, cambiarEstado, guardarPollera, borrarPollera }}
    >
      {children}
    </TiendaContext.Provider>
  );
}

export const useTienda = () => useContext(TiendaContext);
