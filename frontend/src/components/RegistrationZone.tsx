import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const INITIAL_SECONDS = 5 * 60;
const API_URL = "http://localhost:3000/api/v1";

const SECTIONS = [
  { value: "manantiales-de-datos", label: "Manantiales de Datos — Eco-monitoreo" },
  { value: "el-gran-acueducto", label: "El Gran Acueducto — Movilidad" },
  { value: "memorias-del-ahuehuete", label: "Memorias del Ahuehuete — Cultura" },
] as const;

type FormData = {
  name: string;
  email: string;
  phone: string;
  section: string;
  message: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error" | "expired";

export default function RegistrationZone() {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    section: "",
    message: "",
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const isUrgent = seconds <= 60;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "expired") return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      setRegistrationId(data.data.id);
      setStatus("success");
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error de conexión");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-obsidiana/60 border border-raiz rounded-lg px-4 py-3 text-niebla font-product text-sm placeholder:text-musgo/50 focus:outline-none focus:border-manantial/50 focus:ring-1 focus:ring-manantial/20 transition-colors";

  return (
    <section id="registro" className="relative px-6 py-24 md:py-32">
      <div className="max-w-2xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-4">
            Ventana de Acceso
          </p>
          <h2 className="font-makes font-bold text-3xl sm:text-4xl md:text-5xl text-niebla mb-6">
            Sincroniza tus Credenciales
          </h2>
          <p className="text-musgo font-product text-sm max-w-lg mx-auto leading-relaxed">
            El Acueducto de Datos se está cerrando. Para asegurar la asignación de servidores y
            espacio físico en Los Pinos, debes sincronizar tus credenciales de acceso antes de que
            el flujo se interrumpa.
          </p>
        </div>

        {/* Temporizador */}
        <div className="flex justify-center mb-12">
          <div
            className={`font-mono text-5xl sm:text-6xl md:text-7xl tracking-wider transition-colors duration-300 ${
              isUrgent ? "text-fuego animate-pulse" : "text-manantial"
            }`}
          >
            {minutes}:{secs}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Expirado */}
          {status === "expired" && (
            <motion.div
              key="expired"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-10 text-center"
            >
              <div className="font-mono text-fuego text-sm tracking-wider mb-4">
                [ERROR::TIMEOUT]
              </div>
              <p className="font-makes text-2xl text-niebla mb-2">Enlace roto.</p>
              <p className="text-musgo font-product text-sm">
                Ventana de sincronización expirada. Recarga la página para reiniciar el protocolo.
              </p>
            </motion.div>
          )}

          {/* Éxito */}
          {status === "success" && registrationId && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-10 text-center"
            >
              <div className="font-mono text-manantial text-sm tracking-wider mb-4">
                [SYNC::COMPLETE]
              </div>
              <p className="font-makes text-2xl text-niebla mb-4">Credenciales sincronizadas.</p>
              <p className="text-musgo font-product text-sm mb-6">
                Tu código de acceso al Acueducto:
              </p>
              <code className="block bg-abismo border border-raiz rounded-lg px-6 py-4 font-mono text-resina text-sm break-all">
                {registrationId}
              </code>
              <p className="text-musgo font-product text-xs mt-4">
                Guarda este código. Lo necesitarás para acceder al evento.
              </p>
            </motion.div>
          )}

          {/* Formulario */}
          {status !== "expired" && status !== "success" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 md:p-10 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-musgo text-xs tracking-widest uppercase font-product mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="¿Cómo te registrará el acueducto?"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-musgo text-xs tracking-widest uppercase font-product mb-2"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Tu nodo de contacto"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-musgo text-xs tracking-widest uppercase font-product mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+52 55 1234 5678"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="section"
                  className="block text-musgo text-xs tracking-widest uppercase font-product mb-2"
                >
                  Track
                </label>
                <select
                  id="section"
                  name="section"
                  required
                  value={form.section}
                  onChange={handleChange}
                  className={`${inputClass} ${!form.section ? "text-musgo/50" : ""}`}
                >
                  <option value="" disabled>
                    Selecciona tu flujo
                  </option>
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-musgo text-xs tracking-widest uppercase font-product mb-2"
                >
                  Manifiesto de Desarrollo
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={500}
                  rows={4}
                  placeholder="Define tu perfil (Dev, UI/UX, Data) y la idea que quieres implementar..."
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
                <span className="block text-right text-musgo/50 text-xs font-product mt-1">
                  {form.message.length}/500
                </span>
              </div>

              {status === "error" && (
                <div className="text-fuego text-sm font-product bg-fuego/10 border border-fuego/20 rounded-lg px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-manantial hover:bg-reflejo text-abismo font-product font-medium py-3.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sincronizando..." : "Iniciar Sincronización"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
