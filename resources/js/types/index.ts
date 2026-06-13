// People
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager' | 'accountant';
  status: 'active' | 'inactive';
}

// Products
export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Unit {
  id: string;
  name: string;
  shortName: string; // e.g., kg, pcs
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  price: number;
  cost: number;
  stock: number;
  barcode: string;
}

// Transactions
export interface Purchase {
  id: string;
  supplierId: string;
  date: string;
  status: 'received' | 'pending' | 'ordered';
  total: number;
  items: Array<{ productId: string; quantity: number; cost: number }>;
}

export interface Sale {
  id: string;
  customerId: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'transfer';
  total: number;
  items: Array<{ productId: string; quantity: number; price: number }>;
}

export interface SaleReturn {
  id: string;
  saleId: string;
  date: string;
  amount: number;
  items: Array<{ productId: string; quantity: number }>;
}

export interface SaleExchange {
  id: string;
  originalSaleId: string;
  date: string;
  differenceAmount: number;
}

export interface Quotation {
  id: string;
  customerId: string;
  date: string;
  status: 'sent' | 'accepted' | 'declined' | 'converted';
  total: number;
}

// Finance
export interface Expense {
  id: string;
  categoryId: string;
  date: string;
  amount: number;
  referenceNo: string;
}

export interface Account {
  id: string;
  name: string;
  accountNo: string;
  balance: number;
}

export interface MoneyTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  date: string;
  amount: number;
}

export interface ReportSummary {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  netProfit: number;
}
