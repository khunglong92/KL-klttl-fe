// Centralized query keys to avoid typos and enable refactors.
// Usage: queryKey: [QUERY_KEYS.products.root]

export const QUERY_KEYS = {
  products: {
    root: "products" as const,
    byId: (id: number | string) => ["product", id] as const,
    byCategory: (category: string) =>
      ["products", "category", category] as const,
  },
  categories: {
    root: "categories" as const,
    byId: (id: number | string) => ["category", id] as const,
  },
  services: {
    root: "services" as const,
    byId: (id: number | string) => ["service", id] as const,
    byParent: (parentId: string | null) =>
      ["services", "parent", parentId ?? "null"] as const,
  },
  auth: {
    profile: ["auth", "profile"] as const,
  },
  contacts: {
    root: "contacts" as const,
    byId: (id: string) => ["contact", id] as const,
    paginated: (page: number, limit: number) =>
      ["contacts", "paginated", page, limit] as const,
  },
  quotes: {
    root: "quotes" as const,
    byId: (id: string) => ["quote", id] as const,
    paginated: (page: number, limit: number) =>
      ["quotes", "paginated", page, limit] as const,
  },
  companyIntros: {
    root: "companyIntros" as const,
    active: ["companyIntros", "active"] as const,
    admin: ["companyIntros", "admin"] as const,
    byId: (id: string) => ["companyIntro", id] as const,
  },
  projects: {
    root: "projects" as const,
    byId: (id: string) => ["project", id] as const,
    featured: ["projects", "featured"] as const,
  },
} as const;

export type QueryKey = ReadonlyArray<unknown>;
