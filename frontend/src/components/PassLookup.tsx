import { useState } from "react";

const API_URL = "http://localhost:3000/api/v1";

type State = "idle" | "loading" | "not-found" | "error";

export default function PassLookup() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch(`${API_URL}/register/search?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        setState("not-found");
        return;
      }
      const json = await res.json();
      window.location.href = `/pase?id=${json.data.id}`;
    } catch {
      setState("error");
    }
  }

  return (
    <section id="pase" className="relative px-6 py-24 md:py-32">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-4">
          Consulta tu Credencial
        </p>
        <h2 className="font-makes font-bold text-3xl sm:text-4xl md:text-5xl text-niebla mb-4">
          ¿Ya te registraste?
        </h2>
        <p className="text-musgo font-product text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          Ingresa tu correo electrónico para acceder a tu pase holográfico de entrada al hackathon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state !== "idle" && state !== "loading") setState("idle");
            }}
            placeholder="tu@correo.com"
            required
            className="w-full bg-obsidiana/60 border border-raiz rounded-xl px-5 py-3.5 text-niebla font-product text-sm placeholder:text-musgo/30 focus:outline-none focus:border-manantial/50 focus:ring-1 focus:ring-manantial/20 transition-colors text-center"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full py-3.5 bg-manantial text-abismo font-product font-medium rounded-xl hover:bg-reflejo transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === "loading" ? "Buscando..." : "Buscar mi pase"}
          </button>
        </form>

        {state === "not-found" && (
          <p className="text-fuego/80 font-product text-xs mt-4">
            No encontramos un registro con ese correo. Verifica e intenta de nuevo.
          </p>
        )}

        {state === "error" && (
          <p className="text-fuego/80 font-product text-xs mt-4">
            Error de conexión. Intenta de nuevo más tarde.
          </p>
        )}
      </div>
    </section>
  );
}
