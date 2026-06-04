import {
  MapControls,
  MapMarker,
  Map as MapView,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";

const MARKERS = [
  {
    id: "manantiales-de-datos",
    title: "Manantiales de Datos",
    focus: "Eco-monitoreo e Infraestructura Hidrica",
    description: "Zona de sensores IoT y estaciones de monitoreo del ciclo hidrico del bosque.",
    longitude: -99.1913,
    latitude: 19.4157,
    color: "#23ace2",
  },
  {
    id: "el-gran-acueducto",
    title: "El Gran Acueducto",
    focus: "Movilidad e Interconectividad Sustentable",
    description: "Hub de conectividad y punto de partida para las rutas de transporte limpio.",
    longitude: -99.1916,
    latitude: 19.4167,
    color: "#d4a93f",
  },
  {
    id: "memorias-del-ahuehuete",
    title: "Memorias del Ahuehuete",
    focus: "Cultura y Patrimonio Digitalizado",
    description: "Estacion de realidad aumentada junto a los ahuehuetes centenarios del complejo.",
    longitude: -99.192,
    latitude: 19.4158,
    color: "#2b9486",
  },
] as const;

export default function SedeMap() {
  return (
    <section id="sede" className="relative px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-manantial text-xs tracking-[0.35em] uppercase font-product mb-4">
            Coordenadas del Protocolo
          </p>
          <h2 className="font-makes font-bold text-3xl sm:text-4xl md:text-7xl text-niebla">
            Complejo Cultural de Los Pinos
          </h2>
          <p className="text-musgo font-product text-sm mt-3 max-w-lg">
            Tres puntos de activacion distribuidos en la Primera Seccion del Bosque de Chapultepec.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-raiz h-[420px] md:h-[520px]">
          <MapView theme="dark" center={[-99.1938, 19.4162]} zoom={15.2} pitch={30}>
            <MapControls showZoom showCompass />

            {MARKERS.map((marker) => (
              <MapMarker key={marker.id} longitude={marker.longitude} latitude={marker.latitude}>
                <MarkerContent>
                  <div className="relative flex items-center justify-center">
                    <span
                      className="absolute inline-flex h-6 w-6 rounded-full opacity-40 animate-ping"
                      style={{ backgroundColor: marker.color }}
                    />
                    <span
                      className="relative inline-flex h-4 w-4 rounded-full border-2 border-abismo shadow-lg"
                      style={{ backgroundColor: marker.color }}
                    />
                  </div>
                </MarkerContent>
                <MarkerPopup
                  className="w-72 bg-obsidiana/95 backdrop-blur-md border-raiz !border-raiz !shadow-none p-0 overflow-hidden"
                  closeButton
                >
                  <div className="p-4">
                    <div
                      className="h-1 w-12 rounded-full mb-3"
                      style={{ backgroundColor: marker.color }}
                    />
                    <h3
                      className="font-makes font-bold text-niebla mb-1"
                      style={{ fontSize: "1.78rem" }}
                    >
                      {marker.title}
                    </h3>
                    <p
                      className="text-xs font-product font-medium mb-2"
                      style={{ color: marker.color }}
                    >
                      {marker.focus}
                    </p>
                    <p className="text-musgo font-product text-xs leading-relaxed">
                      {marker.description}
                    </p>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ))}
          </MapView>
        </div>
      </div>
    </section>
  );
}
