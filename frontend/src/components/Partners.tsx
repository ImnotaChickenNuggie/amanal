import LogoLoop from "@/components/ui/LogoLoop";

const partnerLogos = [
  { src: "/partners/aws.webp", alt: "AWS" },
  { src: "/partners/bosque de chapultepec.webp", alt: "Bosque de Chapultepec" },
  { src: "/partners/casa-bengala.webp", alt: "Casa Bengala" },
  { src: "/partners/claude.webp", alt: "Claude" },
  { src: "/partners/github.webp", alt: "GitHub" },
  { src: "/partners/gobierno_de_la_ciudad_de_mexico.webp", alt: "Gobierno de la Ciudad de México" },
  { src: "/partners/google-cloud.webp", alt: "Google Cloud" },
  { src: "/partners/mercado-pago.webp", alt: "Mercado Pago" },
  { src: "/partners/platzi.webp", alt: "Platzi" },
  { src: "/partners/rotoplas.webp", alt: "Rotoplas" },
  { src: "/partners/telcel.webp", alt: "Telcel" },
  { src: "/partners/vemo.webp", alt: "Vemo" },
];

export default function Partners() {
  return (
    <section className="relative py-20 md:py-28">
      {/* Header */}
      <div className="text-center mb-14 px-6">
        <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-4">
          Red de Aliados
        </p>
        <h2 className="font-makes font-bold text-3xl sm:text-4xl md:text-5xl text-niebla mb-4">
          Nodos del Acueducto
        </h2>
        <p className="text-musgo font-product text-sm max-w-md mx-auto leading-relaxed">
          Instituciones y organizaciones que canalizan recursos hacia la innovación abierta de
          Chapultepec.
        </p>
      </div>

      {/* Logo Loop */}
      <div className="relative h-[100px]">
        <LogoLoop
          logos={partnerLogos}
          speed={50}
          direction="left"
          logoHeight={50}
          gap={64}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#0a0d0f"
          ariaLabel="Partners y aliados de AMANAL 2026"
          className="partner-logos"
        />
      </div>
    </section>
  );
}
