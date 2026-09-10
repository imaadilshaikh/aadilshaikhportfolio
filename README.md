# Spider Portfolio Clone

A Vite + React + TypeScript portfolio web project for a personal portfolio experience with a dark UI aesthetic, animated layout sections, and custom UI building blocks.

## Overview

This project is a portfolio landing page and personal website clone built around a single-page experience that highlights profile information, skills, project work, experience, and contact/navigation opportunities. The front end uses Vite, React 19, Wouter routing, and a large custom UI component library generated from Radix-style patterns.

## Tech Stack

- JavaScript runtime: Node.js
- Front end: React 19, Vite 7
- Styling: Tailwind CSS v4, `@tailwindcss/vite`, custom CSS in the client UI
- UI primitives: Radix UI component wrappers in `client/src/components/ui/`
- Routing: Wouter
- Animation: Framer Motion and GSAP
- Forms and validation: `react-hook-form`, `zod`, `@hookform/resolvers`
- Data/visualization: Recharts
- Server: Express for asset serving and catch-all HTML delivery
- Build tooling: TypeScript, esbuild, vite, tsx

## Project Structure

```text
.
├── client/
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── const.ts
│       ├── index.css
│       ├── main.tsx
│       ├── assets/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       └── pages/
├── server/
│   └── index.ts
├── shared/
│   └── const.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Scripts

The project scripts in `package.json` are:

```json
"scripts": {
  "dev": "vite --host",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "node dist/index.js",
  "preview": "vite preview --host",
  "check": "tsc --noEmit",
  "format": "prettier --write ."
}
```

## Local Development

Install dependencies:

```sh
npm install
```

Run development server:

```sh
npm run dev
```

Create production build:

```sh
npm run build
```

Run production server:

```sh
npm run start
```

## Vite Configuration

The Vite config sets up:

- alias paths for `@`, `@shared`, and `@assets`
- project root at `client/`
- production output directory at `dist/public`
- allowed hosts for local and Manus environment hosts
- custom plugins for Tailwind CSS, React, Manus runtime, Manus debug log collection, and a storage proxy

## Notes

This repository also contains a custom Manus logging and storage proxy implementation, plus a generated UI component layer located under `client/src/components/ui/`. The design is structured as a web experience rather than a generic app shell.
