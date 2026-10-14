import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, RUTA_POR_ROL } from "./context/AuthContext";
import { TiendaProvider } from "./context/TiendaContext";
import RutaProtegida from "./components/RutaProtegida";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import NoAutorizado from "./pages/NoAutorizado";
import Catalogo from "./pages/cliente/Catalogo";
import Carrito from "./pages/cliente/Carrito";
import MisPedidos from "./pages/cliente/MisPedidos";
import PanelDueno from "./pages/dueno/PanelDueno";
import PanelProgramador from "./pages/programador/PanelProgramador";

const LINKS_CLIENTE = [
  { to: "/cliente", texto: "Catálogo", end: true },
  { to: "/cliente/carrito", texto: "Mi pedido", carrito: true },
  { to: "/cliente/pedidos", texto: "Mis pedidos" },
];

function Inicio() {
  const { usuario } = useAuth();
  return <Navigate to={usuario ? RUTA_POR_ROL[usuario.rol] : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <TiendaProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/no-autorizado" element={<NoAutorizado />} />

            {/* ZONA CLIENTE */}
            <Route path="/cliente" element={
              <RutaProtegida roles={["cliente"]}>
                <Layout marca="Pollería Chola Paceña" links={LINKS_CLIENTE} />
              </RutaProtegida>
            }>
              <Route index element={<Catalogo />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="pedidos" element={<MisPedidos />} />
            </Route>

            {/* ZONA DUEÑO */}
            <Route path="/dueno" element={
              <RutaProtegida roles={["dueno"]}>
                <Layout marca="Panel del dueño" links={[{ to: "/dueno", texto: "Gestión", end: true }]} />
              </RutaProtegida>
            }>
              <Route index element={<PanelDueno />} />
            </Route>

            {/* ZONA PROGRAMADOR */}
            <Route path="/programador" element={
              <RutaProtegida roles={["programador"]}>
                <Layout marca="Panel técnico" links={[{ to: "/programador", texto: "Sistema", end: true }]} />
              </RutaProtegida>
            }>
              <Route index element={<PanelProgramador />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TiendaProvider>
    </AuthProvider>
  );
}
