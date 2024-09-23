export interface Promotion {
    id: number;
    title: string;
    description: string;
    discount_price: number;
    branchId: number; // Relacionado con la sucursal
  }
  