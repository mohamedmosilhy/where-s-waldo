# Where's Waldo?

A full-stack, interactive hidden-character search game built with Next.js App Router. Players scan detailed illustrated scenes, click where they think a character is hiding, and race against a live timer to find all characters. Scores are saved to a global leaderboard per scene.

<!-- Add screenshots to docs/screenshots/ then uncomment:
![Home page](docs/screenshots/home.png)
![Game page](docs/screenshots/game.png)
![Leaderboard](docs/screenshots/leaderboard.png)
-->

---

## Features

- **Live timer** — millisecond-precision stopwatch that starts on page load
- **Circular hit detection** — clicks are validated against a configurable center + radius per character, not a rough bounding box
- **Per-scene leaderboards** — fastest completion times ranked in real time
- **Mobile-first responsive layout** — full-width image on small screens with a scrollable character strip; bottom-sheet character menu on tap; side-by-side layout on desktop
- **Completion modal** — prompts for a display name before submitting the score
- **Calibration tool** (`/calibration`) — dev-only page for generating `centerX / centerY / radius` seed values by clicking on a local image upload

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router, Server Components, Server Actions |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) — zero-config, `@theme` directive |
| State management | [Zustand 5](https://zustand-demo.pmnd.rs) |
| ORM | [Prisma 7](https://www.prisma.io) |
| Database | PostgreSQL |
| Fonts | Google Fonts — Bangers + Inter via `next/font/google` |
| Package manager | [pnpm](https://pnpm.io) |
| Deployment | [Vercel](https://vercel.com) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Home — hero, characters, how-to-play
│   ├── scenes/
│   │   ├── page.tsx               # Scene selection grid
│   │   └── [id]/page.tsx          # Active game page
│   └── calibration/page.tsx       # Dev tool for coordinate generation
├── features/
│   ├── game/
│   │   ├── actions.ts             # Server Actions (validate click, save score)
│   │   ├── character-config.ts    # Single source of truth for character metadata
│   │   ├── game-store.ts          # Zustand store (timer, player name)
│   │   └── components/
│   │       ├── SceneImage.tsx     # Main interactive game component
│   │       ├── CharacterMenu.tsx  # Click popup / mobile bottom sheet
│   │       └── CompletionModal.tsx
│   ├── leaderboard/
│   │   └── components/LeaderBoard.tsx
│   ├── scenes/
│   │   └── actions.ts             # getSceneById, getAllScenes
│   └── calibration/
│       └── components/            # CalibrationImage, CharacterForm, ExportPanel
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
public/
└── images/
    ├── characters/                # waldo.webp  wizard.webp  odlaw.webp  wenda.webp
    ├── scene-1.webp
    └── scene-2.webp
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm — `npm install -g pnpm`
- A running PostgreSQL instance

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/where-s-waldo.git
cd where-s-waldo
pnpm install
```

### 2. Set environment variables

```bash
cp .env.example .env   # then fill in your DATABASE_URL
```

See [Environment Variables](#environment-variables) for the full list.

### 3. Run database migrations

```bash
pnpm exec prisma migrate dev
```

### 4. Seed the database

```bash
pnpm seed
```

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file at the project root:

```env
# PostgreSQL connection string
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/whereswaldo"
```

> **Prisma reads `DATABASE_URL` directly.** No additional runtime config is required.

For production, add the same variable in **Vercel → Project Settings → Environment Variables**.

---

## Database Commands

| Command | Description |
|---|---|
| `pnpm exec prisma migrate dev` | Apply pending migrations (development) |
| `pnpm exec prisma migrate deploy` | Apply migrations in production (no prompts) |
| `pnpm exec prisma migrate reset` | Drop DB → reapply all migrations → re-seed |
| `pnpm exec prisma db push` | Push schema changes without generating a migration file |
| `pnpm exec prisma generate` | Regenerate the Prisma Client after schema changes |
| `pnpm studio` | Open Prisma Studio in the browser |

---

## Seed Command

```bash
pnpm seed
```

The seed script (`prisma/seed.ts`) inserts:

- Scene images with their public URLs
- Characters (Waldo, Wizard, Odlaw, Wenda)
- Per-scene hit-box coordinates (`centerX`, `centerY`, `radius`) for each character
- A handful of sample leaderboard scores

> `prisma migrate reset` automatically runs the seed after wiping the database.

To add new scenes or adjust character positions, edit `prisma/seed.ts`. Use the **Calibration Tool** at `/calibration` to visually generate accurate coordinate values from your images first.

---

## Calibration Tool

The `/calibration` route is a developer utility for generating character hit-box seed values.

1. Go to `/calibration`
2. Upload any scene image
3. Click on a character's face — a crosshair + adjustable radius circle appear
4. Set the character name and fine-tune the radius with the slider
5. Click **Save** — the entry appears in the export panel with a one-click copy button
6. Paste the generated TypeScript into `prisma/seed.ts`

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Next.js development server with HMR |
| `pnpm build` | Create an optimised production build |
| `pnpm start` | Serve the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm seed` | Seed the database |
| `pnpm studio` | Launch Prisma Studio |

---

## Deployment

**Live URL:** *(add your Vercel URL here)*

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/<your-username>/where-s-waldo)

1. Connect your GitHub repo in the Vercel dashboard
2. Add `DATABASE_URL` in **Project Settings → Environment Variables**
3. Add a build command that runs migrations:
   ```
   pnpm exec prisma migrate deploy && pnpm build
   ```
4. Every push to `main` triggers an automatic redeploy

---

## Database Schema

```prisma
model Image {
  id         String           @id @default(uuid())
  name       String           @unique
  url        String           @unique
  characters ImageCharacter[]
  scores     Score[]
}

model Character {
  id              String           @id @default(uuid())
  name            String           @unique
  imageCharacters ImageCharacter[]
}

// Hit-box per character per scene
model ImageCharacter {
  imageId     String
  characterId String
  centerX     Float     // normalised 0–1 (fraction of image width)
  centerY     Float     // normalised 0–1 (fraction of image height)
  radius      Float     // normalised — used in circular hit detection
  image       Image     @relation(fields: [imageId], references: [id])
  character   Character @relation(fields: [characterId], references: [id])

  @@id([imageId, characterId])
}

model Score {
  id             String   @id @default(uuid())
  playerName     String
  completionTime Int      // milliseconds
  imageId        String
  createdAt      DateTime @default(now())
  image          Image    @relation(fields: [imageId], references: [id])
}
```

**Hit detection formula:**

```
√( (clickX − centerX)² + (clickY − centerY)² ) ≤ radius
```

All coordinates are normalised fractions (0–1) of the image dimensions, so hit-boxes remain accurate regardless of display size.

---

## Screenshots

> To add screenshots: take them, save to `docs/screenshots/`, then uncomment the images at the top of this file.

| Home | Game | Leaderboard |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

---

## License

MIT
