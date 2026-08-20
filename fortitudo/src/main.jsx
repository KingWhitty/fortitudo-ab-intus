import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/* Storage shim — the app was written against window.storage.
   In a browser we back it with localStorage, same async shape. */
if (!window.storage) {
  const P = "renati:";
  window.storage = {
    async get(key) {
      const v = localStorage.getItem(P + key);
      if (v === null) throw new Error("not found");
      return { key, value: v };
    },
    async set(key, value) {
      localStorage.setItem(P + key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(P + key);
      return { key, deleted: true };
    },
    async list(prefix = "") {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(P + prefix)) keys.push(k.slice(P.length));
      }
      return { keys, prefix };
    },
  };
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
