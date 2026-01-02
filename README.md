# Website Bán Đồ Gia Dụng

This is a code bundle for Website Bán Đồ Gia Dụng. The original project is available at https://www.figma.com/design/1comPY3vfOjaacVIJXGvNK/Website-B%C3%A1n-%C4%90%E1%BB%93-Gia-D%E1%BB%A5ng.

## 🚀 Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **TanStack Router** - File-based Routing
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Radix UI** - UI Components
- **Motion** - Animation

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── home/           # Home page components (Hero, ProductGrid, ProductCard)
│   ├── figma/          # Figma-specific components
│   └── ui/             # UI primitives (shadcn/ui)
├── routes/             # TanStack Router routes
│   ├── __root.tsx      # Root route with layout
│   └── index.tsx       # Home page route
├── hooks/              # Custom React hooks
│   └── useTheme.ts     # Theme management hook
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
│   └── product.ts      # Product types
└── main.tsx            # Application entry point
```

## 🎯 Key Features

- ✅ **TanStack Router** - File-based routing with type safety
- ✅ **Theme Management** - Dark/Light mode support
- ✅ **Organized Structure** - Clean folder architecture following Vite best practices
- ✅ **TypeScript** - Full type safety
- ✅ **Path Aliases** - Clean imports with `@/` prefix

## 🛠️ Getting Started

### Install Dependencies

```bash
yarn install
# or
npm install
```

### Run Development Server

```bash
yarn dev
# or
npm run dev
```

The app will be available at `http://localhost:7000`

### Build for Production

```bash
yarn build
# or
npm run build
```

## 📝 Adding New Routes

1. Create a new file in `src/routes/` directory (e.g., `src/routes/products.tsx`)
2. TanStack Router will automatically detect and register the route
3. Type-safe navigation is available throughout the app

## 🎨 Adding New Components

- **Layout components** → `src/components/layout/`
- **Page components** → `src/components/home/`, `src/components/products/`, etc.
- **UI primitives** → `src/components/ui/`
- **Shared utilities** → `src/lib/`

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with TanStack Router plugin
- `tsconfig.json` - TypeScript configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration (if exists)

## 📦 Dependencies

Main dependencies are listed in `package.json`. Key packages:

- `@tanstack/react-router` - File-based routing
- `@tanstack/router-devtools` - Router development tools
- `react` & `react-dom` - UI framework
- `motion` - Animation library
- `lucide-react` - Icon library
