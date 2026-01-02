import { apiClient } from "./base";

export interface DashboardStats {
  products: number;
  services: number;
  projects: number;
  news: number;
  recruitments: number;
  priceQuotes: number;
  quotes: number;
  contacts: number;
  users: number;
}

export interface GrowthStat {
  month: string;
  quotes: number;
  contacts: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

const statisticsService = {
  getDashboardStats: () => {
    return apiClient.get<DashboardStats>("/statistics/dashboard");
  },
  getGrowthStats: () => {
    return apiClient.get<GrowthStat[]>("/statistics/growth");
  },
  getCategoryStats: () => {
    return apiClient.get<CategoryStat[]>("/statistics/categories");
  },
};

export default statisticsService;
