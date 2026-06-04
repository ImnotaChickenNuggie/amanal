import { useEffect, useState } from "react";
import PassCard from "./PassCard";

const API_URL = "http://localhost:3000/api/v1";
const HACKATHON_START = new Date("2026-08-14T09:00:00-06:00");

type PageState = "search" | "loading" | "reveal" | "pass" | "not-found" | "error";

interface ParticipantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  section: string;
  message: string;
}

export default function AccessPass() {
  const [state, setState] = useState<PageState>("search");
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [email, setEmail] = useState("");

  /* Auto-fetch if ?id= present in URL */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) fetchByUuid(id);
  }, []);

  async function fetchByUuid(uuid: string) {
    setState("loading");
    try {
      const res = await fetch(`${API_URL}/register/${uuid}`);
      if (!res.ok) {
        setState("not-found");
        return;
      }
      const json = await res.json();
      setParticipant(json.data);
      setState("pass");
    } catch {
      setState("error");
    }
  }

  async function fetchByEmail(e: React.FormEvent) {
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
      setParticipant(json.data);
      setState("reveal");
    } catch {
      setState("error");
    }
  }

  const isOpen = new Date() < HACKATHON_START;

  /* ── Loading ────────────────────────────── */
  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-manantial/30 border-t-manantial rounded-full animate-spin" />
        <p className="text-musgo font-mono text-sm">Consultando registros...</p>
      </div>
    );
  }

  /* ── Pass Card ──────────────────────────── */
  if (state === "pass" && participant) {
    return (
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-3">
            Credencial Verificada
          </p>
          <h1 className="font-makes font-bold text-3xl sm:text-4xl text-niebla">
            Tu Pase de Acceso
          </h1>
        </div>
        <PassCard {...participant} />
        <a
          href="/"
          className="text-musgo hover:text-manantial text-sm font-product transition-colors"
        >
          &larr; Volver al inicio
        </a>
      </div>
    );
  }

  /* ── Reveal (email search found match) ──── */
  if (state === "reveal" && participant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="text-center">
          <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-3">
            Registro Encontrado
          </p>
          <h1 className="font-makes font-bold text-3xl sm:text-4xl text-niebla mb-2">
            {participant.name}
          </h1>
          <p className="text-musgo font-product text-sm">Tu pase está listo</p>
        </div>
        <button
          type="button"
          onClick={() => setState("pass")}
          className="px-8 py-3.5 bg-manantial text-abismo font-product font-medium rounded-xl hover:bg-reflejo transition-colors text-sm"
        >
          Abrir Pase AMANAL
        </button>
        <button
          type="button"
          onClick={() => {
            setState("search");
            setEmail("");
          }}
          className="text-musgo hover:text-manantial text-sm font-product transition-colors"
        >
          &larr; Buscar otro correo
        </button>
      </div>
    );
  }

  /* ── Not Found ──────────────────────────── */
  if (state === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full border-2 border-raiz flex items-center justify-center">
          <span className="font-mono text-musgo text-2xl">?</span>
        </div>
        <h2 className="font-makes font-bold text-2xl text-niebla">Registro no encontrado</h2>
        {isOpen ? (
          <>
            <p className="text-musgo font-product text-sm leading-relaxed">
              No encontramos un registro con esa información. Aún estás a tiempo de registrarte para
              AMANAL 2026.
            </p>
            <a
              href="/#registro"
              className="px-6 py-3 bg-manantial text-abismo font-product font-medium rounded-xl hover:bg-reflejo transition-colors text-sm"
            >
              Registrarse ahora
            </a>
          </>
        ) : (
          <p className="text-musgo font-product text-sm leading-relaxed">
            Las inscripciones para AMANAL 2026 han cerrado. Inténtalo el próximo año o asiste como
            espectador&nbsp;&mdash; <span className="text-manantial">la entrada es gratuita</span>.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setState("search");
            setEmail("");
          }}
          className="text-musgo hover:text-manantial text-sm font-product transition-colors"
        >
          &larr; Intentar con otro correo
        </button>
      </div>
    );
  }

  /* ── Error ───────────────────────────────── */
  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-fuego/30 flex items-center justify-center">
          <span className="font-mono text-fuego text-2xl">!</span>
        </div>
        <h2 className="font-makes font-bold text-2xl text-niebla">Error de conexión</h2>
        <p className="text-musgo font-product text-sm">
          No pudimos conectar con el servidor. Intenta de nuevo más tarde.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("search");
            setEmail("");
          }}
          className="text-musgo hover:text-manantial text-sm font-product transition-colors"
        >
          &larr; Volver a buscar
        </button>
      </div>
    );
  }

  /* ── Search (default) ───────────────────── */
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-3">
          Consulta tu Pase
        </p>
        <h1 className="font-makes font-bold text-3xl sm:text-4xl text-niebla mb-3">Pase AMANAL</h1>
        <p className="text-musgo font-product text-sm leading-relaxed">
          Ingresa tu correo electrónico para consultar tu pase de acceso al hackathon.
        </p>
      </div>

      <form onSubmit={fetchByEmail} className="w-full space-y-4">
        <div>
          <label
            htmlFor="pass-email"
            className="block text-xs font-mono text-musgo/70 uppercase tracking-wider mb-2"
          >
            Correo electrónico
          </label>
          <input
            id="pass-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            className="w-full bg-corteza/50 border border-raiz rounded-xl px-4 py-3 text-niebla font-product placeholder:text-musgo/30 focus:outline-none focus:border-manantial/50 focus:ring-1 focus:ring-manantial/20 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 bg-manantial text-abismo font-product font-medium rounded-xl hover:bg-reflejo transition-colors text-sm"
        >
          Buscar mi pase
        </button>
      </form>

      <a
        href="/"
        className="text-musgo hover:text-manantial text-sm font-product transition-colors"
      >
        &larr; Volver al inicio
      </a>
    </div>
  );
}
