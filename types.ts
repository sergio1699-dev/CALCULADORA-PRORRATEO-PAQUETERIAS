
export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ProductResult extends Product {
  totalValue: number;
  shippingAllocation: number;
  shippingPerUnit: number;
  newUnitPrice: number;
}
