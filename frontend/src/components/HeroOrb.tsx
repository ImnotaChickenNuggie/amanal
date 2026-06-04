import Orb from "@/components/ui/Orb";

export default function HeroOrb() {
  return (
    <div className="sticky top-0 h-screen w-full pointer-events-auto" aria-hidden="true">
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
