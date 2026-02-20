# Securology.ai — Cybersecurity for the AI Era

A full-screen, no-scroll, dark-themed single-page website for an AI-era cybersecurity consultancy. Built with React, TypeScript, Three.js (React Three Fiber), Framer Motion, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to GitHub Pages

### 1. Create the Repository

Create a new repository on GitHub:
- **For a user/org site**: Name it `securology-ai.github.io`
- **For a project site**: Name it anything (e.g., `securology-site`)

If using a **project site**, update `vite.config.ts`:
```ts
base: '/your-repo-name/',
```

### 2. Push the Code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:securology-ai/securology-ai.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to **Settings → Pages** in your repository
2. Under **Source**, select **GitHub Actions**
3. The included `.github/workflows/deploy.yml` will automatically build and deploy on every push to `main`

### 4. Access Your Site

- **User site**: `https://securology-ai.github.io`
- **Project site**: `https://securology-ai.github.io/your-repo-name`

## Customization

### Changing Text Content
All copy lives in the scene components under `src/components/scenes/`:
- `Hero.tsx` — headline, subheadline, bullet points
- `Services.tsx` — service cards
- `WhyAI.tsx` — threat landscape and principles
- `CaseStudies.tsx` — outcome metrics
- `Contact.tsx` — form and contact info

### Brand Colors
Edit the color palette in `tailwind.config.js` under `theme.extend.colors.brand`.

### Contact Form
The form uses a `mailto:` link by default. To use Formspree:
1. Create a form at [formspree.io](https://formspree.io)
2. Update `Contact.tsx` to POST to your Formspree endpoint

### 3D Scene
The hero 3D scene is in `src/components/three/AICore.tsx`. Adjust:
- `count` prop on `ParticleStream` for particle density (lower = better perf)
- `dpr` on `Canvas` for resolution scaling
- Geometry detail (sphere segments, hex count)

### Fonts
Uses Google Fonts (Inter + JetBrains Mono). To use system fonts only, remove the `<link>` tags from `index.html`.

## Performance Notes

- **3D**: Geometry is kept simple (~500 triangles total). Particles use `Points` (GPU instanced). DPR capped at 1.5.
- **Code splitting**: Three.js and Framer Motion are split into separate chunks.
- **Reduced motion**: Toggle in the nav bar swaps the 3D canvas for a static CSS background.
- **No external assets**: All icons are inline SVGs. No images to load.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| 3D | React Three Fiber + drei |
| Animation | Framer Motion |
| Styling | Tailwind CSS 3 |
| Hosting | GitHub Pages (via Actions) |

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Scene router + transitions
├── index.css                 # Global styles + Tailwind
├── types.ts                  # Shared types
├── context/
│   └── MotionContext.tsx      # Reduced motion state
└── components/
    ├── Navigation.tsx         # Top nav bar
    ├── HUD.tsx               # Bottom status bar
    ├── ui/
    │   ├── Logo.tsx          # SVG logo
    │   ├── Button.tsx        # Reusable button
    │   └── Icons.tsx         # All SVG icons
    ├── three/
    │   └── AICore.tsx        # 3D hero scene
    └── scenes/
        ├── Hero.tsx
        ├── Services.tsx
        ├── WhyAI.tsx
        ├── CaseStudies.tsx
        └── Contact.tsx
```

## License

MIT
