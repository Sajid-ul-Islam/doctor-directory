<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Doctor Directory - Agent Guidelines

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion & CSS Animations
- **Icons**: Lucide React
- **Theming**: next-themes
- **Data**: CSV-based data parsing (papaparse) & Search (fuse.js)

## 🎨 Design System
- **Aesthetics**: Modern, premium, glassmorphism, smooth gradients.
- **Dark Mode**: Fully supported using `dark:` variants and `next-themes`.
- **Interactions**: Hover effects, micro-animations, and smooth transitions.
- **Typography**: Tracking-tight, heavy weights for headings (Geist font).

## 📝 Coding Standards
- **Components**: Functional components with TypeScript.
- **i18n**: Use the local dictionary system (`src/app/dictionaries.ts`). Always use the `t` object for text.
- **Images**: Use standard `<img>` tags for AI-generated images to bypass hostname restrictions.
- **Data Fetching**: Use Server Components and async data fetching from `src/app/data.ts`.
- **State**: Use `useTransition` or `framer-motion` for UI state changes.

## 📂 Directory Structure
- `src/app`: Routes and Page components.
- `src/app/doctor/[slug]`: Dynamic doctor profile pages.
- `src/app/data.ts`: Data fetching and parsing logic.
- `src/app/actions.ts`: Server actions for interaction.
