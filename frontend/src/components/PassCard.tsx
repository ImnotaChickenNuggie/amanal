import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useRef } from "react";

/* ── Helpers ────────────────────────────── */
const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, p = 3) => Number.parseFloat(v.toFixed(p));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

/* ── Track metadata ─────────────────────── */
const TRACK_MAP: Record<string, { label: string; focus: string; color: string }> = {
  "manantiales-de-datos": {
    label: "Manantiales de Datos",
    focus: "Eco-monitoreo e Infraestructura Hídrica",
    color: "#23ace2",
  },
  "el-gran-acueducto": {
    label: "El Gran Acueducto",
    focus: "Movilidad e Interconectividad Sustentable",
    color: "#d4a93f",
  },
  "memorias-del-ahuehuete": {
    label: "Memorias del Ahuehuete",
    focus: "Cultura y Patrimonio Digitalizado",
    color: "#2b9486",
  },
};

/* ── Props ──────────────────────────────── */
interface PassCardProps {
  name: string;
  email: string;
  section: string;
  id: string;
}

export default function PassCard({ name, email, section, id }: PassCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  const track = TRACK_MAP[section] || { label: section, focus: "", color: "#5ec4b6" };

  /* ── Tilt engine (spring-smoothed pointer tracking) ── */
  const tiltEngine = useMemo(() => {
    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const setVars = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;
      const w = shell.clientWidth || 1;
      const h = shell.clientHeight || 1;
      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);
      const centerX = px - 50;
      const centerY = py - 50;
      const props: Record<string, string> = {
        "--pointer-x": `${px}%`,
        "--pointer-y": `${py}%`,
        "--background-x": `${adjust(px, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(py, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${py / 100}`,
        "--pointer-from-left": `${px / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };
      for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const k = 1 - Math.exp(-dt / 0.14);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      setVars(cx, cy);
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
      }
    };

    return {
      setTarget(x: number, y: number) {
        tx = x;
        ty = y;
        if (!running) {
          running = true;
          lastTs = 0;
          rafId = requestAnimationFrame(step);
        }
      },
      toCenter() {
        const s = shellRef.current;
        if (s) this.setTarget(s.clientWidth / 2, s.clientHeight / 2);
      },
      setImmediate(x: number, y: number) {
        cx = x;
        cy = y;
        setVars(x, y);
      },
      getCurrent() {
        return { x: cx, y: cy, tx, ty };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        running = false;
        lastTs = 0;
      },
    };
  }, []);

  /* ── Pointer handlers ───────────────────── */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const s = shellRef.current;
      if (!s) return;
      const r = s.getBoundingClientRect();
      tiltEngine.setTarget(e.clientX - r.left, e.clientY - r.top);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (e: PointerEvent) => {
      const s = shellRef.current;
      if (!s) return;
      s.classList.add("active", "entering");
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      enterTimerRef.current = setTimeout(() => s.classList.remove("entering"), 180);
      const r = s.getBoundingClientRect();
      tiltEngine.setTarget(e.clientX - r.left, e.clientY - r.top);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback(() => {
    const s = shellRef.current;
    if (!s) return;
    tiltEngine.toCenter();
    const check = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        s.classList.remove("active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(check);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(check);
  }, [tiltEngine]);

  /* ── Lifecycle ──────────────────────────── */
  useEffect(() => {
    const s = shellRef.current;
    if (!s) return;
    s.addEventListener("pointerenter", handlePointerEnter);
    s.addEventListener("pointermove", handlePointerMove);
    s.addEventListener("pointerleave", handlePointerLeave);
    tiltEngine.setImmediate(s.clientWidth - 70, 60);
    tiltEngine.toCenter();
    return () => {
      s.removeEventListener("pointerenter", handlePointerEnter);
      s.removeEventListener("pointermove", handlePointerMove);
      s.removeEventListener("pointerleave", handlePointerLeave);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
    };
  }, [tiltEngine, handlePointerEnter, handlePointerMove, handlePointerLeave]);

  /* ── Render ─────────────────────────────── */
  return (
    <div
      ref={wrapRef}
      className="pass-wrapper mx-auto"
      style={{ maxWidth: 380, "--glow-color": track.color } as React.CSSProperties}
    >
      <div className="pass-glow" />
      <div ref={shellRef} className="pass-shell">
        <div className="pass-card">
          <div className="pass-inside" />
          <div className="pass-shine" />
          <div className="pass-glare" />
          <div className="pass-content">
            {/* Track color stripe */}
            <div
              className="h-1 rounded-t-[23px]"
              style={{ background: `linear-gradient(90deg, ${track.color}, transparent 80%)` }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-manantial">
                {"AMANAL // 2026"}
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-musgo">
                Pase de Acceso
              </span>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-raiz to-transparent" />

            {/* Name, QR & Email */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-5 gap-4">
              <h2 className="font-makes font-bold text-3xl sm:text-4xl text-niebla text-center leading-tight">
                {name}
              </h2>
              <div className="rounded-lg bg-niebla/95 p-2">
                <QRCodeSVG value={id} size={80} bgColor="transparent" fgColor="#0a0d0f" level="M" />
              </div>
              <p className="font-mono text-sm text-musgo">{email}</p>
            </div>

            {/* Track badge */}
            <div className="mx-6 rounded-xl bg-corteza/40 border border-raiz/40 p-4 mb-4">
              <div className="flex items-center gap-2.5 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: track.color }}
                />
                <span className="font-product text-sm font-medium text-niebla">{track.label}</span>
              </div>
              <p className="text-musgo text-xs font-product pl-5">{track.focus}</p>
            </div>

            {/* Credentials */}
            <div className="px-6 space-y-2.5 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-wider text-musgo/50 uppercase w-14 shrink-0">
                  ID
                </span>
                <span className="h-px flex-1 bg-raiz/40" />
                <span className="font-mono text-xs text-musgo">
                  {id.slice(0, 8)}&hellip;{id.slice(-4)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-wider text-musgo/50 uppercase w-14 shrink-0">
                  Estado
                </span>
                <span className="h-px flex-1 bg-raiz/40" />
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-manantial animate-pulse" />
                  <span className="font-mono text-xs text-manantial uppercase tracking-wider">
                    Confirmado
                  </span>
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-raiz to-transparent" />
            <div className="px-6 py-4 text-center">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-musgo/50">
                14&ndash;16 Ago 2026 &middot; Los Pinos, CDMX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
