import { create } from 'zustand';

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Unit {
  id: string;
  name: string;
  shortName: string;
  status: 'Active' | 'Inactive';
}

export interface Product {
  id: string;
  image: string;
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface StockAdjustment {
  id: string;
  productId: string;
  type: 'Increase' | 'Decrease';
  quantity: number;
  reason: string;
  date: string;
  notes: string;
}

interface InventoryState {
  categories: Category[];
  brands: Brand[];
  units: Unit[];
  products: Product[];
  adjustments: StockAdjustment[];
  
  // Actions
  addCategory: (c: Category) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBrand: (b: Brand) => void;
  updateBrand: (id: string, b: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addUnit: (u: Unit) => void;
  updateUnit: (id: string, u: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addAdjustment: (a: StockAdjustment) => void;
}

const mockCategories: Category[] = [
  { id: 'c1', name: 'Electronics', description: 'Gadgets and devices', status: 'Active' },
  { id: 'c2', name: 'Drinks', description: 'Beverages', status: 'Active' },
  { id: 'c3', name: 'Snacks', description: 'Snack foods', status: 'Active' },
];

const mockBrands: Brand[] = [
  { id: 'b1', name: 'Sony', description: 'Electronics brand', status: 'Active' },
  { id: 'b2', name: 'Coca Cola', description: 'Soft drinks', status: 'Active' },
];

const mockUnits: Unit[] = [
  { id: 'u1', name: 'Piece', shortName: 'pcs', status: 'Active' },
  { id: 'u2', name: 'Kilogram', shortName: 'kg', status: 'Active' },
  { id: 'u3', name: 'Liter', shortName: 'L', status: 'Active' },
];

const mockProducts: Product[] = [
  {
    id: 'p1',
    image: 'https://placehold.co/150x150/eff6ff/1e40af?text=TV',
    name: 'Sony Bravia 55" 4K',
    sku: 'SNY-TV-55',
    barcode: '8493021948',
    categoryId: 'c1',
    brandId: 'b1',
    unitId: 'u1',
    costPrice: 400,
    sellingPrice: 599.99,
    stock: 12,
    minStock: 5,
    description: '4K Ultra HD Smart TV',
    status: 'Active',
  },
  {
    id: 'p2',
    image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Cola',
    name: 'Coca Cola 2L',
    sku: 'CC-2L-01',
    barcode: '4930219432',
    categoryId: 'c2',
    brandId: 'b2',
    unitId: 'u3',
    costPrice: 1.20,
    sellingPrice: 2.50,
    stock: 45,
    minStock: 10,
    description: '2 Liter Bottle of Coca Cola',
    status: 'Active',
  },
  {
    id: 'p3',
    image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Energy',
    name: 'Energy Drink',
    sku: 'ED-001',
    barcode: '129481023',
    categoryId: 'c2',
    brandId: 'b2',
    unitId: 'u1',
    costPrice: 1.00,
    sellingPrice: 2.75,
    stock: 2,
    minStock: 20,
    description: 'Energy Drink Can',
    status: 'Active',
  }
];

const mockAdjustments: StockAdjustment[] = [
  {
    id: 'a1',
    productId: 'p2',
    type: 'Increase',
    quantity: 10,
    reason: 'Restocking',
    date: new Date().toISOString(),
    notes: 'Arrived with today delivery',
  }
];

export const useInventoryStore = create<InventoryState>((set) => ({
  categories: mockCategories,
  brands: mockBrands,
  units: mockUnits,
  products: mockProducts,
  adjustments: mockAdjustments,

  addCategory: (c) => set((state) => ({ categories: [...state.categories, c] })),
  updateCategory: (id, c) => set((state) => ({ categories: state.categories.map(cat => cat.id === id ? { ...cat, ...c } : cat) })),
  deleteCategory: (id) => set((state) => ({ categories: state.categories.filter(cat => cat.id !== id) })),

  addBrand: (b) => set((state) => ({ brands: [...state.brands, b] })),
  updateBrand: (id, b) => set((state) => ({ brands: state.brands.map(brand => brand.id === id ? { ...brand, ...b } : brand) })),
  deleteBrand: (id) => set((state) => ({ brands: state.brands.filter(brand => brand.id !== id) })),

  addUnit: (u) => set((state) => ({ units: [...state.units, u] })),
  updateUnit: (id, u) => set((state) => ({ units: state.units.map(unit => unit.id === id ? { ...unit, ...u } : unit) })),
  deleteUnit: (id) => set((state) => ({ units: state.units.filter(unit => unit.id !== id) })),

  addProduct: (p) => set((state) => ({ products: [...state.products, p] })),
  updateProduct: (id, p) => set((state) => ({ products: state.products.map(prod => prod.id === id ? { ...prod, ...p } : prod) })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter(prod => prod.id !== id) })),

  addAdjustment: (a) => set((state) => {
    // Process the stock change on the product as well
    const product = state.products.find(p => p.id === a.productId);
    if (product) {
      const quantityDiff = a.type === 'Increase' ? a.quantity : -a.quantity;
      const updatedProducts = state.products.map(p => 
        p.id === a.productId ? { ...p, stock: p.stock + quantityDiff } : p
      );
      return { 
        adjustments: [a, ...state.adjustments],
        products: updatedProducts 
      };
    }
    return { adjustments: [a, ...state.adjustments] };
  }),
}));
