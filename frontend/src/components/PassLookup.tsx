import { useState } from "react";

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1";

type State = "idle" | "loading" | "not-found" | "error";

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "El correo es requerido";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingresa un correo electrónico válido";
  return undefined;
}

export default function PassLookup() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [fieldError, setFieldError] = useState<string | undefined>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    if (touched) setFieldError(validateEmail(value));
    if (state !== "idle" && state !== "loading") setState("idle");
  }

  function handleBlur() {
    setTouched(true);
    setFieldError(validateEmail(email));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const error = validateEmail(email);
    setFieldError(error);
    if (error) return;

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

  const inputBase =
    "w-full bg-obsidiana/60 border rounded-xl px-5 py-3.5 text-niebla font-product text-sm placeholder:text-musgo/30 focus:outline-none transition-all duration-200 text-center";
  const inputNormal = `${inputBase} border-raiz focus:border-manantial/50 focus:ring-1 focus:ring-manantial/20`;
  const inputError = `${inputBase} border-fuego/70 ring-1 ring-fuego/20 focus:border-fuego/70 focus:ring-fuego/20`;

  const hasError = touched && !!fieldError;

  return (
    <section id="pase" className="relative px-6 py-24 md:py-32">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-4">
          Consulta tu Pase
        </p>
        <h2 className="font-makes font-bold text-3xl sm:text-4xl md:text-7xl text-niebla mb-4">
          ¿Ya te registraste?
        </h2>
        <p className="text-musgo font-product text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          Ingresa tu correo electrónico para acceder a tu pase de acceso al hackathon.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu@correo.com"
              className={hasError ? inputError : inputNormal}
            />
            {hasError && <p className="text-fuego text-xs font-product mt-1.5">{fieldError}</p>}
          </div>
          <button
            type="submit"
            disabled={state === "loading" || hasError}
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
