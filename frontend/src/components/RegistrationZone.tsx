import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Value as PhoneValue } from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

import { PhoneInput } from "@/components/ui/phone-input";
import { Select } from "@/components/ui/select";

const INITIAL_SECONDS = 5 * 60;
const API_URL = "http://localhost:3000/api/v1";

const SECTIONS = [
  { value: "manantiales-de-datos", label: "Manantiales de Datos — Eco-monitoreo" },
  { value: "el-gran-acueducto", label: "El Gran Acueducto — Movilidad" },
  { value: "memorias-del-ahuehuete", label: "Memorias del Ahuehuete — Cultura" },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  section: string;
  message: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  section?: string;
  message?: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error" | "expired";

// Track which fields have been interacted with (blur or change)
type TouchedFields = Record<keyof FormData, boolean>;

function validateField(field: keyof FormData, value: string): string | undefined {
  switch (field) {
    case "name":
      if (!value.trim()) return "El nombre es requerido";
      if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
      return undefined;
    case "email":
      if (!value.trim()) return "El correo es requerido";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingresa un correo electrónico válido";
      return undefined;
    case "phone":
      if (!value) return "El teléfono es requerido";
      if (!isValidPhoneNumber(value)) return "El teléfono debe tener al menos 10 dígitos";
      return undefined;
    case "section":
      if (!value) return "Selecciona un track";
      return undefined;
    case "message":
      if (!value.trim()) return "El manifiesto es requerido";
      return undefined;
    default:
      return undefined;
  }
}

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
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    phone: false,
    section: false,
    message: false,
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

  const validateAndSetError = useCallback(
    (field: keyof FormData, value: string) => {
      if (!touched[field]) return;
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [touched],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateAndSetError(name as keyof FormData, value);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.name as keyof FormData;
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function handlePhoneChange(value: PhoneValue | undefined) {
    const phoneStr = value || "";
    setForm((prev) => ({ ...prev, phone: phoneStr }));
    if (touched.phone) {
      const error = validateField("phone", phoneStr);
      setErrors((prev) => ({ ...prev, phone: error }));
    }
  }

  function handlePhoneBlur() {
    setTouched((prev) => ({ ...prev, phone: true }));
    const error = validateField("phone", form.phone);
    setErrors((prev) => ({ ...prev, phone: error }));
  }

  function handleSectionChange(value: string) {
    setForm((prev) => ({ ...prev, section: value }));
    setTouched((prev) => ({ ...prev, section: true }));
    const error = validateField("section", value);
    setErrors((prev) => ({ ...prev, section: error }));
  }

  function validateAll(): boolean {
    const newErrors: FieldErrors = {};
    let valid = true;
    for (const field of Object.keys(form) as (keyof FormData)[]) {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    }
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, section: true, message: true });
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "expired") return;
    if (!validateAll()) return;

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

  const hasErrors = Object.values(errors).some(Boolean);

  const inputBase =
    "w-full bg-obsidiana/60 border rounded-lg px-4 py-3 text-niebla font-product text-sm placeholder:text-musgo/50 focus:outline-none transition-all duration-200";
  const inputNormal = `${inputBase} border-raiz focus:border-manantial/50 focus:ring-1 focus:ring-manantial/20`;
  const inputError = `${inputBase} border-fuego/70 ring-1 ring-fuego/20 focus:border-fuego/70 focus:ring-fuego/20`;

  function fieldClass(field: keyof FormData) {
    return touched[field] && errors[field] ? inputError : inputNormal;
  }

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
              <a
                href={`/pase?id=${registrationId}`}
                className="inline-block mt-6 px-6 py-3 bg-manantial text-abismo font-product font-medium rounded-lg hover:bg-reflejo transition-colors text-sm"
              >
                Ver tu Pase de Acceso
              </a>
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
              noValidate
              className="glass rounded-2xl p-8 md:p-10 space-y-5"
            >
              {/* Nombre */}
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
                  placeholder="¿Cómo te registrará el acueducto?"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldClass("name")}
                />
                {touched.name && errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-fuego text-xs font-product mt-1.5"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email */}
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
                    placeholder="Tu nodo de contacto"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass("email")}
                  />
                  {touched.email && errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-fuego text-xs font-product mt-1.5"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <div className="block text-musgo text-xs tracking-widest uppercase font-product mb-2">
                    Teléfono
                  </div>
                  <div
                    className={`flex items-stretch rounded-lg border overflow-hidden transition-all duration-200 ${
                      touched.phone && errors.phone
                        ? "border-fuego/70 ring-1 ring-fuego/20"
                        : "border-raiz focus-within:border-manantial/50 focus-within:ring-1 focus-within:ring-manantial/20"
                    } bg-obsidiana/60`}
                  >
                    <PhoneInput
                      defaultCountry="MX"
                      placeholder="55 1234 5678"
                      value={(form.phone as PhoneValue) || undefined}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      international
                      countryCallingCodeEditable={false}
                      className="w-full"
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-fuego text-xs font-product mt-1.5"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Track */}
              <div>
                <label
                  htmlFor="section"
                  className="block text-musgo text-xs tracking-widest uppercase font-product mb-2"
                >
                  Track
                </label>
                <Select
                  id="section"
                  options={SECTIONS}
                  value={form.section}
                  onChange={handleSectionChange}
                  placeholder="Selecciona tu flujo"
                  error={touched.section && !!errors.section}
                  name="section"
                />
                {touched.section && errors.section && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-fuego text-xs font-product mt-1.5"
                  >
                    {errors.section}
                  </motion.p>
                )}
              </div>

              {/* Manifiesto */}
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
                  maxLength={500}
                  rows={4}
                  placeholder="Define tu perfil (Dev, UI/UX, Data) y la idea que quieres implementar..."
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${fieldClass("message")} resize-none`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {touched.message && errors.message ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-fuego text-xs font-product"
                    >
                      {errors.message}
                    </motion.p>
                  ) : (
                    <span />
                  )}
                  <span className="text-musgo/50 text-xs font-product">
                    {form.message.length}/500
                  </span>
                </div>
              </div>

              {status === "error" && (
                <div className="text-fuego text-sm font-product bg-fuego/10 border border-fuego/20 rounded-lg px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting" || hasErrors}
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
