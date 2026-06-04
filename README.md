# AMANAL // 2026

**Hackathon de Tecnologia Liquida para la Resiliencia de Chapultepec**

Landing page interactiva y de alto rendimiento para un hackathon de 48 horas enfocado en resiliencia urbana, ecologia y digitalizacion cultural del Bosque de Chapultepec (primera seccion, CDMX).

> *AMANAL* — del nahuatl *Amanalli* (manantial/estanque de agua), vinculando los flujos historicos de agua de Chapultepec con los flujos modernos de datos y codigo.

---

## Stack Tecnico

### Frontend — Tecnologia Liquida

| Tecnologia | Uso |
|---|---|
| **Astro** | Framework principal (HTML estatico ultra veloz) |
| **React** | Islas interactivas (formulario, mapa, pase) |
| **Tailwind CSS** | Sistema de diseno con tokens semanticos |
| **GSAP** | Animaciones de intro y scroll |
| **OGL** | WebGL — esfera interactiva en Hero |
| **MapLibre GL** | Mapa interactivo de la sede |
| **Framer Motion** | Transiciones de estado en formularios |
| **qrcode.react** | Generacion de QR en pase de acceso |

### Backend — Infraestructura de Datos

| Tecnologia | Uso |
|---|---|
| **Node.js + Express** | API REST |
| **Prisma** | ORM para MySQL |
| **Zod** | Validacion de entrada |
| **MySQL** | Base de datos (Railway) |

---

## Estructura del Monorepo

```
amanal/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/          # env.ts, db.ts
│       ├── controllers/     # register.controller.ts
│       ├── middlewares/      # validate, error
│       ├── routes/           # register.routes.ts, health
│       └── app.ts
├── frontend/
│   ├── public/              # fonts, gallery, favicon
│   └── src/
│       ├── components/      # Astro + React islands
│       │   ├── ui/          # shadcn/mapcn components
│       │   ├── Hero.astro
│       │   ├── Tracks.astro
│       │   ├── Gallery.astro
│       │   ├── SedeMap.tsx
│       │   ├── RegistrationZone.tsx
│       │   ├── PassCard.tsx
│       │   ├── PassLookup.tsx
│       │   ├── AccessPass.tsx
│       │   ├── Partners.tsx
│       │   ├── Navbar.tsx
│       │   └── HeroIntro.tsx
│       ├── data/            # tracks.ts
│       ├── layouts/         # Layout.astro
│       ├── pages/
│       │   ├── index.astro
│       │   ├── pase/index.astro
│       │   └── tracks/[id].astro
│       └── styles/          # global.css
├── biome.json
└── package.json             # workspaces root
```

---

## Direccion de Arte — Manantial Nocturno

Estetica cyberpunk-organica inspirada en el ecosistema nocturno de Chapultepec. La paleta evita los neones saturados genericos y se ancla en los tonos reales del bosque.

| Token | Hex | Referencia |
|---|---|---|
| `--bg-abismo` | `#0a0d0f` | Cielo nocturno sin luna |
| `--bg-obsidiana` | `#131a1e` | Piedra volcanica humeda |
| `--bg-corteza` | `#1c2428` | Corteza de ahuehuete en sombra |
| `--border-raiz` | `#2a3338` | Raices expuestas sobre tierra |
| `--text-niebla` | `#e2ded6` | Niebla matutina entre arboles |
| `--text-musgo` | `#8a9a8e` | Musgo seco sobre roca |
| `--accent-manantial` | `#5ec4b6` | Agua mineral del manantial |
| `--accent-reflejo` | `#7dd8cc` | Reflejo de luz sobre agua |
| `--accent-resina` | `#c4a24e` | Resina de ahuehuete |
| `--accent-fuego` | `#d45a3a` | Tierra volcanica |

**Tipografias:** Makes (titulos) + Product Sans (cuerpo) + JetBrains Mono (codigo)

---

## Secciones

1. **Hero** — Orb WebGL interactivo + intro animada con GSAP
2. **Partners** — Logos en scroll infinito horizontal
3. **Tracks** — Bento grid asimetrico con 3 tracks + paginas de detalle con View Transitions
4. **Galeria** — Grid de imagenes con filtro grayscale-to-color al hover
5. **Sede** — Mapa interactivo de Los Pinos con markers y popups
6. **Pase** — Busqueda de pase de acceso por email
7. **Registro** — Formulario con temporizador de 5 min + validaciones en tiempo real
8. **Footer** — Redes sociales, terminos, privacidad, copyright

---

## Los Tres Tracks

| Track | Enfoque |
|---|---|
| Manantiales de Datos | Eco-monitoreo e Infraestructura Hidrica |
| El Gran Acueducto | Movilidad e Interconectividad Sustentable |
| Memorias del Ahuehuete | Cultura y Patrimonio Digitalizado |

---

## API Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/v1/health` | Health check + conexion a DB |
| `POST` | `/api/v1/register` | Crear registro de participante |
| `GET` | `/api/v1/register/:uuid` | Consultar participante por UUID |
| `GET` | `/api/v1/register/search?email=` | Buscar participante por email |

---

## Modelo de Datos

```prisma
model Registration {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(120)
  email     String   @unique @db.VarChar(255)
  phone     String   @db.VarChar(20)
  section   String   @db.VarChar(50)
  message   String   @db.VarChar(500)
  createdAt DateTime @default(now())
}
```

---

## Instalacion

```bash
# Clonar e instalar dependencias (monorepo)
git clone https://github.com/ImnotaChickenNuggie/amanal.git
cd amanal
npm install

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tu DATABASE_URL

# Sincronizar base de datos
cd backend && npx prisma db push

# Desarrollo
npm run dev --workspace=backend   # API en localhost:3000
npm run dev --workspace=frontend  # UI en localhost:4321
```

---

## Scripts

```bash
# Root (monorepo)
npm run check        # Biome lint + format check
npm run check:fix    # Autofix

# Frontend
npm run dev --workspace=frontend
npm run build --workspace=frontend
npm run preview --workspace=frontend

# Backend
npm run dev --workspace=backend
npm run build --workspace=backend
npm run db:push --workspace=backend
```

---

## Autor

**BR1 || avantgardev**

---

## Licencia

Todos los derechos reservados. AMANAL // 2026.
