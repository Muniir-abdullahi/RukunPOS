import { CrudConfig } from '@/Components/crud/GenericCrud';

export const CustomersConfig: CrudConfig = {
  moduleName: 'Customers',
  entityName: 'Customer',
  basePath: '/people/customers',
  columns: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'group', label: 'Customer Group', type: 'badge' },
    { key: 'openingBalance', label: 'Balance', type: 'currency' }
  ],
  formFields: [
    { key: 'dbLabel', label: 'db.The field labels marked with * are required input fields.', type: 'section', hint: '' },
    { key: 'isBoth', label: 'Both Customer and Supplier', type: 'checkbox', colSpan: 3 },
    { key: 'group', label: 'Customer Group', type: 'select', required: true, options: [{value: 'Regular', label: 'Regular'}, {value: 'VIP', label: 'VIP'}] },
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'company', label: 'Company Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text', placeholder: 'example@example.com' },
    { key: 'phone', label: 'Phone Number', type: 'text', required: true },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+1 ...' },
    { key: 'taxNumber', label: 'Tax Number', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'postalCode', label: 'Postal Code', type: 'text' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'openingBalance', label: 'Opening balance (Due)', type: 'number', hint: 'The opening balance for this customer' },
    { key: 'initialDeposit', label: 'Initial Deposit', type: 'number', hint: 'Initial deposit amount' },
    { key: 'creditLimit', label: 'Credit Limit', type: 'number', hint: 'Maximum allowed credit limit' },
    { key: 'paymentTerm', label: 'Payment Term', type: 'number', placeholder: 'e.g. 30' },
  ],
  mockData: [
    { id: 1, name: 'John Doe', company: 'ABC Corp', email: 'john@example.com', phone: '+1 234 567 890', group: 'Regular', openingBalance: 154.50 },
    { id: 2, name: 'Jane Smith', company: 'XYZ Ltd', email: 'jane@example.com', phone: '+1 987 654 321', group: 'VIP', openingBalance: 0 }
  ]
};

export const SuppliersConfig: CrudConfig = {
  moduleName: 'Suppliers',
  entityName: 'Supplier',
  basePath: '/people/suppliers',
  columns: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
  ],
  formFields: [
    { key: 'dbLabel', label: 'db.The field labels marked with * are required input fields.', type: 'section', hint: '' },
    { key: 'isBoth', label: 'Both Customer and Supplier', type: 'checkbox', colSpan: 3 },
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'image', label: 'Image', type: 'file' },
    { key: 'company', label: 'Company Name', type: 'text', required: true },
    { key: 'vatNumber', label: 'VAT Number / Tax Number', type: 'text' },
    { key: 'openingBalance', label: 'Opening balance (Due)', type: 'number' },
    { key: 'email', label: 'Email', type: 'text', required: true },
    { key: 'phone', label: 'Phone Number', type: 'text', required: true },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'city', label: 'City', type: 'text', required: true },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'postalCode', label: 'Postal Code', type: 'text' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'paymentTerm', label: 'Payment Term', type: 'number', placeholder: '30' },
    { key: 'bankDetails', label: 'Supplier Bank Account Details', type: 'textarea', placeholder: 'Bank Name, Account Name, Account Number, IBAN, SWIFT etc.', colSpan: 3 },
  ],
  mockData: [
    { id: 1, name: 'Alice Wong', company: 'Tech Gadgets Inc.', email: 'alice@tginc.com', phone: '+1 222 333 4444' },
    { id: 2, name: 'Tom Wilson', company: 'Global Supplies', email: 'tom@globalsupplies.com', phone: '+1 555 666 7777' },
  ]
};

export const UsersConfig: CrudConfig = {
  moduleName: 'Users',
  entityName: 'User',
  basePath: '/people/users',
  columns: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  formFields: [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'select', options: [{value: 'Admin', label: 'Admin'}, {value: 'Cashier', label: 'Cashier'}] },
    { key: 'status', label: 'Status', type: 'select', options: [{value: 'Active', label: 'Active'}, {value: 'Inactive', label: 'Inactive'}] },
  ],
  mockData: [
    { id: 1, name: 'Admin User', email: 'admin@salelite.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Cashier One', email: 'cashier@salelite.com', role: 'Cashier', status: 'Active' },
  ]
};

export const CategoriesConfig: CrudConfig = {
  moduleName: 'Categories',
  entityName: 'Category',
  basePath: '/products/categories',
  columns: [
    { key: 'name', label: 'Category Name', type: 'text' },
    { key: 'code', label: 'Category Code', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' }
  ],
  formFields: [
    { key: 'name', label: 'Category Name', type: 'text', required: true },
    { key: 'code', label: 'Category Code', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: [{value: 'Active', label: 'Active'}, {value: 'Inactive', label: 'Inactive'}] },
  ],
  mockData: [
    { id: 1, name: 'Electronics', code: 'ELEC', status: 'Active' },
    { id: 2, name: 'Clothing', code: 'CLO', status: 'Active' },
    { id: 3, name: 'Food', code: 'FD', status: 'Active' }
  ]
};

export const BrandsConfig: CrudConfig = {
  moduleName: 'Brands',
  entityName: 'Brand',
  basePath: '/products/brands',
  columns: [
    { key: 'name', label: 'Brand Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' }
  ],
  formFields: [
    { key: 'name', label: 'Brand Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' }
  ],
  mockData: [
    { id: 1, name: 'Apple', description: 'Tech company' },
    { id: 2, name: 'Samsung', description: 'Electronics' },
    { id: 3, name: 'Nike', description: 'Sports apparel' }
  ]
};

export const UnitsConfig: CrudConfig = {
  moduleName: 'Units',
  entityName: 'Unit',
  basePath: '/products/units',
  columns: [
    { key: 'code', label: 'Code', type: 'text' },
    { key: 'name', label: 'Unit Name', type: 'text' },
    { key: 'baseUnit', label: 'Base Unit', type: 'text' },
  ],
  formFields: [
    { key: 'dbLabel', label: 'db.The field labels marked with * are required input fields.', type: 'section', hint: '' },
    { key: 'code', label: 'Code', type: 'text', required: true },
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'baseUnit', label: 'Base Unit', type: 'select', options: [{value: 'Piece', label: 'Piece'}, {value: 'KG', label: 'KG'}] },
    { key: 'example', label: 'Example conversions:', type: 'section', hint: '1 Dozen = 1*12 Piece \n 1 Gram = 1/1000 KG' },
  ],
  mockData: [
    { id: 1, name: 'Pieces', code: 'pc', baseUnit: 'No Base Unit' },
    { id: 2, name: 'Kilograms', code: 'kg', baseUnit: 'No Base Unit' },
    { id: 3, name: 'Dozen', code: 'dz', baseUnit: 'Pieces' }
  ]
};

export const ProductsConfig: CrudConfig = {
  moduleName: 'Products',
  entityName: 'Product',
  basePath: '/products',
  columns: [
    { key: 'image', label: 'Image', type: 'text' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'code', label: 'Code', type: 'text' },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'price', label: 'Price', type: 'currency' },
    { key: 'unit', label: 'Unit', type: 'badge' },
    { key: 'qty', label: 'Quantity', type: 'text' }
  ],
  formFields: [
    { key: 'dbLabel', label: 'db.The field labels marked with * are required input fields.', type: 'section', hint: '' },
    { key: 'productType', label: 'Product Type', type: 'select', required: true, options: [{value: 'Standard', label: 'Standard'}, {value: 'Combo', label: 'Combo'}, {value: 'Digital', label: 'Digital'}, {value: 'Service', label: 'Service'}] },
    { key: 'name', label: 'Product Name', type: 'text', required: true },
    { key: 'code', label: 'Product Code', type: 'text', required: true },
    { key: 'barcodeSymbology', label: 'Barcode Symbology', type: 'select', required: true, options: [{value: 'Code 128', label: 'Code 128'}, {value: 'Code 39', label: 'Code 39'}, {value: 'UPC-A', label: 'UPC-A'}] },
    { key: 'brand', label: 'Brand', type: 'select', options: [{value: 'Apple', label: 'Apple'}, {value: 'Samsung', label: 'Samsung'}] },
    { key: 'category', label: 'Category', type: 'select', required: true, options: [{value: 'Electronics', label: 'Electronics'}, {value: 'Clothing', label: 'Clothing'}] },
    { key: 'productUnit', label: 'Product Unit', type: 'select', required: true, options: [{value: 'Piece', label: 'Piece'}, {value: 'KG', label: 'KG'}] },
    { key: 'saleUnit', label: 'Sale Unit', type: 'select', options: [{value: 'Piece', label: 'Piece'}] },
    { key: 'purchaseUnit', label: 'Purchase Unit', type: 'select', options: [{value: 'Piece', label: 'Piece'}] },
    { key: 'productCost', label: 'Product Cost', type: 'number', required: true },
    { key: 'profitMarginType', label: 'Profit Margin Type', type: 'select', options: [{value: 'Percentage (%)', label: 'Percentage (%)'}, {value: 'Fixed', label: 'Fixed'}] },
    { key: 'profitMargin', label: 'Profit Margin', type: 'number' },
    { key: 'productPrice', label: 'Product Price', type: 'number', required: true },
    { key: 'wholesalePrice', label: 'Wholesale Price', type: 'number' },
    { key: 'dailySaleObj', label: 'Daily Sale Objective', type: 'number', hint: 'Target for daily sales' },
    { key: 'alertQuantity', label: 'Alert Quantity', type: 'number' },
    { key: 'productTax', label: 'Product Tax', type: 'select', options: [{value: 'No Tax', label: 'No Tax'}, {value: 'VAT (10%)', label: 'VAT (10%)'}] },
    { key: 'taxMethod', label: 'Tax Method', type: 'select', hint: 'Exclusive means tax is added to price. Inclusive means price includes tax.', options: [{value: 'Exclusive', label: 'Exclusive'}, {value: 'Inclusive', label: 'Inclusive'}] },
    { key: 'warranty', label: 'Warranty', type: 'text', placeholder: 'eg: 1 Months' },
    { key: 'guarantee', label: 'Guarantee', type: 'text', placeholder: 'eg: 1 Months' },
    { key: 'featured', label: 'Featured', type: 'checkbox', hint: 'Featured product will be displayed in POS' },
    { key: 'embeddedBarcode', label: 'Embedded Barcode', type: 'checkbox', hint: 'Check this if this product will be used in weight scale machine.', colSpan: 3 },
    { key: 'initialStock', label: 'Initial Stock', type: 'checkbox', hint: 'This feature will not work for product with variants and batches', colSpan: 3 },
    { key: 'image', label: 'Product Image', type: 'file', hint: 'Drag and drop or choose file', colSpan: 3 },
    { key: 'details', label: 'Product Details', type: 'wysiwyg', colSpan: 3 },
    { key: 'hasVariant', label: 'This product has variant', type: 'checkbox', colSpan: 3 },
    { key: 'hasDifferentPrice', label: 'This product has different price for different warehouse', type: 'checkbox', colSpan: 3 },
    { key: 'hasBatch', label: 'This product has batch and expired date', type: 'checkbox', colSpan: 3 },
    { key: 'hasIMEI', label: 'This product has IMEI or Serial numbers', type: 'checkbox', colSpan: 3 },
    { key: 'hasPromo', label: 'Add Promotional Price', type: 'checkbox', colSpan: 3 },
  ],
  mockData: [
    { id: 1, image: '📱', name: 'iPhone 15', code: 'IP15', brand: 'Apple', category: 'Electronics', price: 999.00, unit: 'Piece', qty: 50 },
    { id: 2, image: '📺', name: 'Samsung TV', code: 'SS-TV', brand: 'Samsung', category: 'Electronics', price: 1200.00, unit: 'Piece', qty: 15 }
  ]
};

export const PurchasesConfig: CrudConfig = {
  moduleName: 'Purchases',
  entityName: 'Purchase',
  basePath: '/purchases',
  columns: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'supplier', label: 'Supplier', type: 'text' },
    { key: 'status', label: 'Purchase Status', type: 'badge' },
    { key: 'payment', label: 'Payment Status', type: 'badge' },
    { key: 'total', label: 'Total', type: 'currency' }
  ],
  formFields: [
    { key: 'date', label: 'Purchase Date', type: 'date', required: true },
    { key: 'supplier', label: 'Supplier', type: 'select', options: [{value: 'Tech Gadgets Inc.', label: 'Tech Gadgets Inc.'}] },
    { key: 'status', label: 'Status', type: 'select', options: [{value: 'Pending', label: 'Pending'}, {value: 'Completed', label: 'Completed'}] },
    { key: 'total', label: 'Total Amount', type: 'number' },
  ],
  mockData: [
    { id: 1, date: '2023-10-01', reference: 'PR-2023-001', supplier: 'Tech Gadgets Inc.', status: 'Completed', payment: 'Paid', total: 1540.00 },
    { id: 2, date: '2023-10-05', reference: 'PR-2023-002', supplier: 'Global Supplies', status: 'Pending', payment: 'Unpaid', total: 420.50 }
  ]
};

export const PurchaseReturnsConfig: CrudConfig = {
  moduleName: 'Purchase Returns',
  entityName: 'Return',
  basePath: '/purchases/return',
  columns: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'supplier', label: 'Supplier', type: 'text' },
    { key: 'total', label: 'Total Returned', type: 'currency' }
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'supplier', label: 'Supplier', type: 'text' },
    { key: 'total', label: 'Total Amount', type: 'number' },
  ],
  mockData: [
    { id: 1, date: '2023-10-10', reference: 'PRT-001', supplier: 'Tech Gadgets Inc.', total: 150.00 }
  ]
};

export const SalesConfig: CrudConfig = {
  moduleName: 'Sales List',
  entityName: 'Sale',
  basePath: '/sales',
  columns: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'payment', label: 'Payment Status', type: 'badge' },
    { key: 'total', label: 'Total', type: 'currency' }
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'customer', label: 'Customer', type: 'select', options: [{value: 'John Doe', label: 'John Doe'}, {value: 'Walk-in Customer', label: 'Walk-in Customer'}] },
    { key: 'status', label: 'Sale Status', type: 'select', options: [{value: 'Completed', label: 'Completed'}, {value: 'Pending', label: 'Pending'}] },
    { key: 'payment', label: 'Payment Status', type: 'select', options: [{value: 'Paid', label: 'Paid'}, {value: 'Unpaid', label: 'Unpaid'}, {value: 'Partial', label: 'Partial'}] },
    { key: 'total', label: 'Total', type: 'number' }
  ],
  mockData: [
    { id: 1, date: '2026-05-13', reference: 'SL-001', customer: 'Walk-in Customer', status: 'Completed', payment: 'Paid', total: 120.50 },
    { id: 2, date: '2026-05-12', reference: 'SL-002', customer: 'Jane Smith', status: 'Completed', payment: 'Partial', total: 650.00 }
  ]
};

export const SaleReturnsConfig: CrudConfig = {
  moduleName: 'Sale Returns',
  entityName: 'Return',
  basePath: '/sales/return',
  columns: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'total', label: 'Total Returned', type: 'currency' }
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'total', label: 'Amount', type: 'number' }
  ],
  mockData: [
    { id: 1, date: '2026-05-12', reference: 'SRT-001', customer: 'Walk-in Customer', total: 45.00 }
  ]
};

export const QuotationsConfig: CrudConfig = {
  moduleName: 'Quotations',
  entityName: 'Quotation',
  basePath: '/quotations',
  columns: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'total', label: 'Total', type: 'currency' }
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{value: 'Pending', label: 'Pending'}, {value: 'Sent', label: 'Sent'}] },
    { key: 'total', label: 'Total', type: 'number' }
  ],
  mockData: [
    { id: 1, date: '2026-05-10', reference: 'QT-001', customer: 'Tech Gadgets Inc', status: 'Pending', total: 1200.00 }
  ]
};

export const ExpensesConfig: CrudConfig = {
  moduleName: 'Expenses',
  entityName: 'Expense',
  basePath: '/expenses',
  columns: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'currency' }
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'category', label: 'Category', type: 'select', options: [{value: 'Rent', label: 'Rent'}, {value: 'Utilities', label: 'Utilities'}] },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'note', label: 'Note', type: 'textarea' }
  ],
  mockData: [
    { id: 1, date: '2026-05-01', reference: 'EXP-001', category: 'Rent', amount: 1500.00 },
    { id: 2, date: '2026-05-10', reference: 'EXP-002', category: 'Utilities', amount: 250.00 }
  ]
};

export const ExpenseCategoriesConfig: CrudConfig = {
  moduleName: 'Expense Categories',
  entityName: 'Category',
  basePath: '/expenses/categories',
  columns: [
    { key: 'name', label: 'Category Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' }
  ],
  formFields: [
    { key: 'name', label: 'Category Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }
  ],
  mockData: [
    { id: 1, name: 'Rent', description: 'Office rent' },
    { id: 2, name: 'Utilities', description: 'Power, Water, Internet' }
  ]
};

export const AccountsConfig: CrudConfig = {
  moduleName: 'Accounts',
  entityName: 'Account',
  basePath: '/accounting',
  columns: [
    { key: 'accountNo', label: 'Account No', type: 'text' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'balance', label: 'Balance', type: 'currency' }
  ],
  formFields: [
    { key: 'accountNo', label: 'Account Number', type: 'text' },
    { key: 'name', label: 'Account Name', type: 'text' },
    { key: 'balance', label: 'Initial Balance', type: 'number' }
  ],
  mockData: [
    { id: 1, accountNo: 'AC-001', name: 'Cash', balance: 5000.00 },
    { id: 2, accountNo: 'AC-002', name: 'Bank Account', balance: 15400.50 }
  ]
};

export const RolesConfig: CrudConfig = {
  moduleName: 'Roles & Permissions',
  entityName: 'Role',
  basePath: '/settings/roles',
  columns: [
    { key: 'name', label: 'Role Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' }
  ],
  formFields: [
    { key: 'name', label: 'Role Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }
  ],
  mockData: [
    { id: 1, name: 'Admin', description: 'Full system access' },
    { id: 2, name: 'Cashier', description: 'POS and Sales access only' },
    { id: 3, name: 'Manager', description: 'Report and inventory access' }
  ]
};

export const StockTransfersConfig: CrudConfig = {
  moduleName: 'Stock Transfers',
  entityName: 'Transfer',
  basePath: '/inventory/transfers',
  columns: [
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'from', label: 'From Source', type: 'text' },
    { key: 'to', label: 'To Destination', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge', badgeColors: { pending: 'warning', completed: 'success' } },
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'from', label: 'From Source', type: 'select', required: true, options: [{value: 'Main Warehouse', label: 'Main Warehouse'}, {value: 'Store Front', label: 'Store Front'}] },
    { key: 'to', label: 'To Destination', type: 'select', required: true, options: [{value: 'Main Warehouse', label: 'Main Warehouse'}, {value: 'Store Front', label: 'Store Front'}] },
    { key: 'status', label: 'Status', type: 'select', options: [{value: 'pending', label: 'Pending'}, {value: 'completed', label: 'Completed'}] },
    { key: 'note', label: 'Notes', type: 'textarea' },
  ],
  mockData: [
    { id: 1, date: '2026-05-14', reference: 'TRN-1011', from: 'Main Warehouse', to: 'Store Front', status: 'completed' },
    { id: 2, date: '2026-05-15', reference: 'TRN-1012', from: 'Store Front', to: 'Main Warehouse', status: 'pending' },
  ]
};

export const InventoryAdjustmentsConfig: CrudConfig = {
  moduleName: 'Inventory Adjustments',
  entityName: 'Adjustment',
  basePath: '/inventory/adjustments',
  columns: [
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'warehouse', label: 'Warehouse', type: 'text' },
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'reference', label: 'Reference No', type: 'text' },
    { key: 'warehouse', label: 'Warehouse', type: 'select', required: true, options: [{value: 'Main Warehouse', label: 'Main Warehouse'}, {value: 'Secondary Warehouse', label: 'Secondary Warehouse'}] },
    { key: 'note', label: 'Notes', type: 'textarea' },
  ],
  mockData: [
    { id: 1, date: '2026-05-14', reference: 'ADJ-2001', warehouse: 'Main Warehouse' },
  ]
};

export const WarehousesConfig: CrudConfig = {
  moduleName: 'Warehouses',
  entityName: 'Warehouse',
  basePath: '/settings/warehouses',
  columns: [
    { key: 'name', label: 'Warehouse Name', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
  ],
  formFields: [
    { key: 'name', label: 'Warehouse Name', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'zipCode', label: 'Zip Code', type: 'text' },
  ],
  mockData: [
    { id: 1, name: 'Main Warehouse', phone: '+1 234 567 890', email: 'main@warehouse.com', city: 'New York' },
    { id: 2, name: 'Secondary Warehouse', phone: '+1 987 654 321', email: 'second@warehouse.com', city: 'Los Angeles' }
  ]
};

export const AuditLogsConfig: CrudConfig = {
  moduleName: 'Audit Logs',
  entityName: 'Log Entry',
  basePath: '/settings/audit-logs',
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  columns: [
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'user', label: 'User', type: 'text' },
    { key: 'action', label: 'Action', type: 'badge', badgeColors: { Create: 'bg-green-100 text-green-800', Update: 'bg-yellow-100 text-yellow-800', Delete: 'bg-red-100 text-red-800', Login: 'bg-blue-100 text-blue-800' } },
    { key: 'module', label: 'Module', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
  ],
  formFields: [
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'user', label: 'User', type: 'text' },
    { key: 'action', label: 'Action', type: 'text' },
    { key: 'module', label: 'Module', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
  mockData: [
    { id: 1, date: '2026-05-16 10:23', user: 'Admin User', action: 'Create', module: 'Products', description: 'Created new product "iPhone 15"' },
    { id: 2, date: '2026-05-16 10:15', user: 'Admin User', action: 'Login', module: 'System', description: 'User successfully logged in' },
    { id: 3, date: '2026-05-15 15:42', user: 'Jane Smith', action: 'Update', module: 'Sales', description: 'Updated order status to Paid (POS-1004)' },
    { id: 4, date: '2026-05-15 14:20', user: 'Sales Rep', action: 'Delete', module: 'Customers', description: 'Deleted customer "Temp Customer"' },
    { id: 5, date: '2026-05-14 09:00', user: 'Manager', action: 'Create', module: 'Stock Transfers', description: 'Transferred 50 items to Store Front' },
  ]
};

