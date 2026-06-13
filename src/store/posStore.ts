import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  sku: string;
  category: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  points?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'mobile_money' | 'bank' | 'split';
}

export interface SaleTransaction {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customer?: Customer | null;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  status: 'completed' | 'held' | 'cancelled';
  cashier: string;
}

interface PosState {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  discountRate: number;
  taxRate: number;
  heldSales: SaleTransaction[];
  recentSales: SaleTransaction[];
  searchQuery: string;
  activeCategory: string;

  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  setCustomer: (customer: Customer | null) => void;
  setDiscount: (rate: number) => void;
  setTax: (rate: number) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  clearCart: () => void;
  
  holdSale: () => void;
  resumeSale: (saleId: string) => void;
  completeSale: (paymentMethod: PaymentMethod, amountReceived: number) => SaleTransaction;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  selectedCustomer: null,
  discountRate: 0,
  taxRate: 0.10, // 10%
  heldSales: [],
  recentSales: [],
  searchQuery: '',
  activeCategory: 'All',

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) return state; // Can't add more than stock
      return { cart: state.cart.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item) };
    }
    return { cart: [...state.cart, { product, qty: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),

  updateQuantity: (productId, delta) => set((state) => {
    return {
      cart: state.cart.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, Math.min(item.qty + delta, item.product.stock));
          return { ...item, qty: newQty };
        }
        return item;
      })
    };
  }),

  setCustomer: (selectedCustomer) => set({ selectedCustomer }),
  setDiscount: (discountRate) => set({ discountRate }),
  setTax: (taxRate) => set({ taxRate }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  clearCart: () => set({ cart: [], selectedCustomer: null, discountRate: 0 }),

  holdSale: () => set((state) => {
    if (state.cart.length === 0) return state;
    
    const subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const tax = subtotal * state.taxRate;
    const discount = subtotal * state.discountRate;
    const total = subtotal + tax - discount;

    const newHeldSale: SaleTransaction = {
      id: `HLD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...state.cart],
      subtotal,
      tax,
      discount,
      total,
      customer: state.selectedCustomer,
      paymentMethod: { id: 'none', name: 'None', type: 'cash' },
      amountReceived: 0,
      change: 0,
      status: 'held',
      cashier: 'Admin',
    };

    return {
      heldSales: [newHeldSale, ...state.heldSales],
      cart: [],
      selectedCustomer: null,
      discountRate: 0,
    };
  }),

  resumeSale: (saleId) => set((state) => {
    const saleToResume = state.heldSales.find(s => s.id === saleId);
    if (!saleToResume) return state;

    return {
      cart: saleToResume.items,
      selectedCustomer: saleToResume.customer || null,
      heldSales: state.heldSales.filter(s => s.id !== saleId),
    };
  }),

  completeSale: (paymentMethod, amountReceived) => {
    const state = get();
    if (state.cart.length === 0) throw new Error("Cart is empty");

    const subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const tax = subtotal * state.taxRate;
    const discount = subtotal * state.discountRate;
    const total = subtotal + tax - discount;
    const change = Math.max(0, amountReceived - total);

    const completedSale: SaleTransaction = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...state.cart],
      subtotal,
      tax,
      discount,
      total,
      customer: state.selectedCustomer,
      paymentMethod,
      amountReceived,
      change,
      status: 'completed',
      cashier: 'Admin',
    };

    set((state) => ({
      recentSales: [completedSale, ...state.recentSales],
      cart: [],
      selectedCustomer: null,
      discountRate: 0,
    }));

    return completedSale;
  }
}));
