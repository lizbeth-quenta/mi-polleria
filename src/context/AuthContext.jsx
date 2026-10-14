import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { log } from "../utils/log";

const AuthContext = createContext(null);

const USUARIOS_INICIALES = [
  { email: "cliente@demo.com", password: "1234", rol: "cliente", nombre: "María" },
  { email: "dueno@demo.com", password: "1234", rol: "dueno", nombre: "Doña Rosa" },
  { email: "dev@demo.com", password: "1234", rol: "programador", nombre: "Programador" },
];

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useLocalStorage("polleria_usuarios", USUARIOS_INICIALES);
  const [sesion, setSesion] = useLocalStorage("polleria_sesion", null); // guarda el email

  const usuario = usuarios.find((u) => u.email === sesion) || null;

  const login = (email, password) => {
    const u = usuarios.find((x) => x.email === email.trim().toLowerCase() && x.password === password);
    if (!u) { log(`Intento de login fallido: ${email}`); return null; }
    setSesion(u.email);
    log(`Login correcto: ${u.email} (${u.rol})`);
    return u;
  };

  const registrar = (nombre, email, password) => {
    const correo = email.trim().toLowerCase();
    if (usuarios.some((u) => u.email === correo)) return { error: "Ese correo ya está registrado" };
    const nuevo = { email: correo, password, rol: "cliente", nombre: nombre.trim() };
    setUsuarios((us) => [...us, nuevo]);
    setSesion(correo);
    log(`Cuenta nueva: ${correo}`);
    return { usuario: nuevo };
  };

  const cambiarRol = (email, rol) => {
    setUsuarios((us) => us.map((u) => (u.email === email ? { ...u, rol } : u)));
    log(`Rol de ${email} cambiado a ${rol}`);
  };

  const logout = () => {
    if (usuario) log(`Logout: ${usuario.email}`);
    setSesion(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, usuarios, login, registrar, cambiarRol, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const RUTA_POR_ROL = { cliente: "/cliente", dueno: "/dueno", programador: "/programador" };
