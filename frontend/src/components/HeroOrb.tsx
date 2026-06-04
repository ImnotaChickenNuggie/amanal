import Orb from "@/components/ui/Orb";

export default function HeroOrb() {
  return (
    <div className="absolute inset-0 pointer-events-auto" aria-hidden="true">
      <Orb
        hue={165}
        hoverIntensity={2.8}
        rotateOnHover={true}
        forceHoverState={false}
        backgroundColor="#0a0d0f"
      />
    </div>
  );
}
