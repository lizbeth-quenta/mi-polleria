const KEY = "polleria_logs";

export function leerLogs() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function log(mensaje) {
  const logs = leerLogs();
  logs.unshift({ fecha: new Date().toLocaleString("es-BO"), mensaje });
  try { localStorage.setItem(KEY, JSON.stringify(logs.slice(0, 60))); } catch {}
}
