import { Product, Customer } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    categoryId: 'c1',
    brandId: 'b1',
    unitId: 'u1',
    price: 29.99,
    cost: 15.00,
    stock: 120,
    barcode: '123456789012'
  },
  {
    id: '2',
    name: 'Mechanical Keyboard',
    sku: 'MK-002',
    categoryId: 'c1',
    brandId: 'b1',
    unitId: 'u1',
    price: 89.99,
    cost: 45.00,
    stock: 45,
    barcode: '123456789013'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    address: '123 Main St'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0102',
    address: '456 Oak Ave'
  }
];
