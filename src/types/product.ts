export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  description?: string;
  inStock?: boolean;
}

export type ProductCategory = 
  | 'Tất cả' 
  | 'Bàn' 
  | 'Ghế' 
  | 'Tủ' 
  | 'Kệ' 
  | 'Đồ gia dụng' 
  | 'Trang trí' 
  | 'Nhựa';
