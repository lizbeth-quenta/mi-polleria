import { useState, useEffect } from "react";

export default function useLocalStorage(key, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(key);
      return guardado ? JSON.parse(guardado) : inicial;
    } catch {
      return inicial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(valor)); } catch {}
  }, [key, valor]);
  return [valor, setValor];
}
