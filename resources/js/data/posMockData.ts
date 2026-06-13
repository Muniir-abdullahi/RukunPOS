export const posCategories = [
  { id: 'all', name: 'All Items' },
  { id: 'c1', name: 'Drinks' },
  { id: 'c2', name: 'Snacks' },
  { id: 'c3', name: 'Electronics' },
  { id: 'c4', name: 'Grocery' },
  { id: 'c5', name: 'Pharmacy' },
];

export const posProducts = [
  { id: 'p1', name: 'Coca Cola 2L', sku: 'DRN-001', price: 2.50, stock: 45, categoryId: 'c1', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Cola' },
  { id: 'p2', name: 'Orange Juice', sku: 'DRN-002', price: 3.00, stock: 20, categoryId: 'c1', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Juice' },
  { id: 'p3', name: 'Potato Chips', sku: 'SNK-001', price: 1.50, stock: 100, categoryId: 'c2', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Chips' },
  { id: 'p4', name: 'Chocolate Bar', sku: 'SNK-002', price: 1.00, stock: 50, categoryId: 'c2', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Choco' },
  { id: 'p5', name: 'Wireless Mouse', sku: 'ELE-001', price: 15.00, stock: 12, categoryId: 'c3', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Mouse' },
  { id: 'p6', name: 'USB Cable', sku: 'ELE-002', price: 5.00, stock: 200, categoryId: 'c3', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Cable' },
  { id: 'p7', name: 'Apples 1kg', sku: 'GRO-001', price: 4.00, stock: 3, categoryId: 'c4', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Apples' },
  { id: 'p8', name: 'Aspirin', sku: 'PHA-001', price: 6.00, stock: 80, categoryId: 'c5', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Aspirin' },
  { id: 'p9', name: 'Energy Drink', sku: 'DRN-003', price: 2.75, stock: 0, categoryId: 'c1', image: 'https://placehold.co/150x150/eff6ff/1e40af?text=Energy' },
];

export const posCustomers = [
  { id: 'walk-in', name: 'Walk-in Customer' },
  { id: 'cu1', name: 'John Doe' },
  { id: 'cu2', name: 'Jane Smith' },
  { id: 'cu3', name: 'Acme Corp' },
];

export const posRecentSales = [
  { id: 'INV-1001', customer: 'Walk-in Customer', total: 4.00, status: 'Completed', time: '10 mins ago' },
  { id: 'INV-1002', customer: 'John Doe', total: 15.00, status: 'Completed', time: '35 mins ago' },
  { id: 'INV-1003', customer: 'Jane Smith', total: 7.50, status: 'Suspended', time: '1 hour ago' },
];
