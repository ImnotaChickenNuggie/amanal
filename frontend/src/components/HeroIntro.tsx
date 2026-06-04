import Orb from "@/components/ui/Orb";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function HeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => setDone(true),
      });

      // Phase 1 (0–1s): Orb breathes in — slow scale up
      tl.to(".intro-orb", {
        scale: 1.3,
        duration: 1.0,
        ease: "sine.inOut",
      });

      // Phase 2 (0.8–1.4s): Orb bursts outward + fades
      tl.to(
        ".intro-orb",
        {
          scale: 2.5,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.8,
      );

      // Phase 3 (1.2–2.0s): Overlay fades smoothly to transparent
      tl.to(
        ".intro-overlay",
        {
          opacity: 0,
          duration: 0.8,
          ease: "sine.out",
        },
        1.2,
      );

      // Phase 4 (1.4–2.2s): Hero content fades in with stagger
      // These are outside the scope, so we target them directly via document
      const heroElements = document.querySelectorAll("[data-hero-reveal]");
      tl.fromTo(
        heroElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
        },
        1.4,
      );
    },
    { scope: containerRef },
  );

  if (done) return null;

  return (
    <div ref={containerRef}>
      <div className="intro-overlay fixed inset-0 z-50" style={{ backgroundColor: "#0a0d0f" }}>
        {/* Orb — exact same setup as HeroOrb */}
        <div className="intro-orb absolute inset-0 pointer-events-auto">
          <Orb
            hue={165}
            hoverIntensity={2.8}
            rotateOnHover={true}
            forceHoverState={false}
            backgroundColor="#0a0d0f"
          />
        </div>
      </div>
    </div>
  );
}
