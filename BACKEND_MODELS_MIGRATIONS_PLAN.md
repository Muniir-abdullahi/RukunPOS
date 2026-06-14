# SaleLite POS Backend Models and Migrations Plan

## Purpose

This project is currently a Laravel + Inertia React POS UI with mock data stores. The backend should first establish a clean database model layer and migrations that support the existing screens before replacing the mock stores with real controllers, requests, services, and Inertia props.

The UI currently covers:

- Dashboard metrics and recent activity
- POS checkout with cart, customers, payment methods, held sales, receipts, tax, discount, and change due
- Products, categories, brands, units, barcode printing, stock overview, and stock adjustments
- Customers, suppliers, users, roles, warehouses, audit logs
- Purchases and purchase returns
- Sales list, sale returns, exchange placeholder, quotations
- Expenses and expense categories
- Accounting accounts, money transfers, and account statements
- Reports for sales, purchases, products, stock, and profit/loss

## Current Backend State

Existing custom migrations are only a starter schema:

- `categories`: only `name`
- `products`: `category_id`, `name`, `sku`, `cost_price`, `selling_price`, `stock`
- `customers`: `name`, `phone`, `email`
- `suppliers`: `name`, `phone`, `email`
- `sales`: `customer_id`, `total`, `status`
- `sale_items`: `sale_id`, `product_id`, `quantity`, `unit_price`, `total`
- `purchases`: `supplier_id`, `total`, `status`
- `expenses`: plain string `category`, `description`, `amount`, `expense_date`

These migrations do not yet cover enough UI fields or business relationships. Because this app is still early and appears not to have real production data, the preferred approach is to replace/expand the initial custom migrations into a coherent schema before building controllers.

## Backend Principles

- Use Laravel Eloquent models with explicit relationships.
- Keep financial totals as `decimal(15, 2)` unless quantity precision requires more.
- Use database foreign keys for core relationships.
- Store inventory as a ledger of movements, with cached current stock per product/warehouse for speed.
- Do not rely only on `products.stock` long term; derive stock changes from purchases, sales, returns, transfers, and adjustments.
- Keep status fields as strings initially for simple migrations. PHP enums can be added later if useful.
- Add `created_by`, `updated_by`, or `user_id` on business documents where auditability matters.
- Keep MVP single company/store, but include warehouses because the UI already has warehouse screens and transfer flows.

## Recommended Migration Order

1. Foundation: roles/permissions if using a package, users extension, warehouses, tax rates/settings
2. People: customer groups, customers, suppliers
3. Product taxonomy: categories, brands, units
4. Products: products, product warehouse stock
5. Inventory ledger: stock movements, stock adjustments, stock transfers
6. Purchases: purchases, purchase_items, purchase_payments, purchase_returns, purchase_return_items
7. Sales/POS: sales, sale_items, sale_payments, held_sales, sale_returns, sale_return_items
8. Quotations: quotations, quotation_items
9. Expenses: expense_categories, expenses
10. Accounting: accounts, account_transactions, money_transfers
11. System: audit_logs, notifications/settings

## Models and Tables

### Users and Roles

Use the existing `users` table as the authentication base.

Add fields to `users`:

- `role_id` nullable foreign key
- `phone` nullable string
- `status` string default `active`
- `last_login_at` nullable timestamp

Create `roles`:

- `id`
- `name` unique
- `description` nullable
- `permissions` json nullable
- timestamps

Relationships:

- `Role hasMany User`
- `User belongsTo Role`
- `User hasMany Sale` as cashier
- `User hasMany AuditLog`

UI support:

- People > Users
- Settings > Roles
- Audit log user display

### Warehouses

Create `warehouses`:

- `id`
- `name`
- `phone` nullable
- `email` nullable
- `address` nullable
- `city` nullable
- `zip_code` nullable
- `status` string default `active`
- timestamps

Relationships:

- `Warehouse hasMany ProductStock`
- `Warehouse hasMany StockMovement`
- `Warehouse hasMany StockTransfer` as source/destination

UI support:

- Settings > Warehouses
- Stock overview
- Stock adjustments
- Stock transfers
- Future multi-location inventory

### Customer Groups

Create `customer_groups`:

- `id`
- `name` unique
- `description` nullable
- `status` string default `active`
- timestamps

UI support:

- Customer form `Customer Group`
- Default groups: `Regular`, `VIP`

### Customers

Replace/extend `customers`:

- `id`
- `customer_group_id` nullable foreign key
- `name`
- `company` nullable
- `email` nullable
- `phone`
- `whatsapp` nullable
- `tax_number` nullable
- `address` nullable
- `city` nullable
- `state` nullable
- `postal_code` nullable
- `country` nullable
- `opening_balance` decimal default 0
- `initial_deposit` decimal default 0
- `credit_limit` decimal nullable
- `payment_term_days` unsigned integer nullable
- `is_supplier` boolean default false
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Customer belongsTo CustomerGroup`
- `Customer hasMany Sale`
- `Customer hasMany Quotation`
- `Customer hasMany SaleReturn`

UI support:

- People > Customers
- POS customer selector
- Sales, quotations, returns

### Suppliers

Replace/extend `suppliers`:

- `id`
- `name`
- `image` nullable
- `company`
- `vat_number` nullable
- `opening_balance` decimal default 0
- `email`
- `phone`
- `whatsapp` nullable
- `address`
- `city`
- `state` nullable
- `postal_code` nullable
- `country` nullable
- `payment_term_days` unsigned integer nullable
- `bank_details` text nullable
- `is_customer` boolean default false
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Supplier hasMany Purchase`
- `Supplier hasMany PurchaseReturn`

UI support:

- People > Suppliers
- Purchases
- Purchase returns

### Categories

Replace/extend `categories`:

- `id`
- `parent_id` nullable self foreign key
- `name`
- `code` nullable unique
- `description` text nullable
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Category hasMany Product`
- `Category belongsTo parent Category`
- `Category hasMany child Categories`

UI support:

- Products > Categories
- Product form
- POS category filter

### Brands

Create `brands`:

- `id`
- `name` unique
- `description` text nullable
- `logo_path` nullable
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Brand hasMany Product`

UI support:

- Products > Brands
- Product form/list

### Units

Create `units`:

- `id`
- `name`
- `code` unique
- `short_name` nullable
- `base_unit_id` nullable self foreign key
- `operator` nullable string, for conversion multiply/divide
- `operation_value` decimal nullable
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Unit hasMany Product` as product unit
- `Unit hasMany Product` as sale unit
- `Unit hasMany Product` as purchase unit

UI support:

- Products > Units
- Product unit, sale unit, purchase unit

### Products

Replace/extend `products`:

- `id`
- `category_id` nullable foreign key
- `brand_id` nullable foreign key
- `unit_id` nullable foreign key
- `sale_unit_id` nullable foreign key
- `purchase_unit_id` nullable foreign key
- `type` string default `standard`
- `name`
- `sku` unique
- `barcode` nullable unique
- `barcode_symbology` nullable string
- `image_path` nullable
- `cost_price` decimal default 0
- `selling_price` decimal default 0
- `wholesale_price` decimal nullable
- `profit_margin_type` string nullable
- `profit_margin` decimal nullable
- `alert_quantity` decimal default 0
- `tax_rate_id` nullable foreign key
- `tax_method` string nullable
- `warranty` nullable string
- `guarantee` nullable string
- `description` text nullable
- `is_featured` boolean default false
- `has_embedded_barcode` boolean default false
- `has_variants` boolean default false
- `has_different_warehouse_price` boolean default false
- `has_batch` boolean default false
- `has_imei` boolean default false
- `has_promo` boolean default false
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Product belongsTo Category`
- `Product belongsTo Brand`
- `Product belongsTo Unit`
- `Product hasMany ProductStock`
- `Product hasMany StockMovement`
- `Product hasMany SaleItem`
- `Product hasMany PurchaseItem`

UI support:

- Product list/detail/form
- Barcode printing
- POS product grid
- Stock overview
- Reports

### Product Warehouse Stock

Create `product_stocks`:

- `id`
- `product_id` foreign key
- `warehouse_id` foreign key
- `quantity` decimal default 0
- `reserved_quantity` decimal default 0
- timestamps
- unique index on `product_id`, `warehouse_id`

Purpose:

- Fast stock display while keeping `stock_movements` as the source of truth.

UI support:

- POS availability
- Stock overview
- Transfer source/destination stock

### Stock Movements

Create `stock_movements`:

- `id`
- `product_id` foreign key
- `warehouse_id` foreign key
- `user_id` nullable foreign key
- `reference_type` nullable string
- `reference_id` nullable unsigned big integer
- `movement_type` string, examples: `purchase`, `sale`, `sale_return`, `purchase_return`, `adjustment`, `transfer_in`, `transfer_out`
- `quantity` decimal, positive for in and negative for out
- `unit_cost` decimal nullable
- `note` text nullable
- `occurred_at` timestamp
- timestamps

Purpose:

- Auditable inventory history.
- Supports stock report and product movement report.

### Stock Adjustments

Create `stock_adjustments`:

- `id`
- `reference` unique nullable
- `warehouse_id` foreign key
- `user_id` nullable foreign key
- `date`
- `note` text nullable
- timestamps

Create `stock_adjustment_items`:

- `id`
- `stock_adjustment_id` foreign key
- `product_id` foreign key
- `type` string, `increase` or `decrease`
- `quantity` decimal
- `reason` string nullable
- `notes` text nullable
- timestamps

UI support:

- Inventory > Adjustments

### Stock Transfers

Create `stock_transfers`:

- `id`
- `reference` unique
- `from_warehouse_id` foreign key
- `to_warehouse_id` foreign key
- `user_id` nullable foreign key
- `date`
- `status` string default `pending`
- `note` text nullable
- timestamps

Create `stock_transfer_items`:

- `id`
- `stock_transfer_id` foreign key
- `product_id` foreign key
- `quantity` decimal
- timestamps

UI support:

- Inventory > Transfers

### Purchases

Replace/extend `purchases`:

- `id`
- `reference` unique
- `supplier_id` nullable foreign key
- `warehouse_id` nullable foreign key
- `user_id` nullable foreign key
- `purchase_date`
- `status` string default `pending`
- `payment_status` string default `unpaid`
- `subtotal` decimal default 0
- `tax_total` decimal default 0
- `discount_total` decimal default 0
- `shipping_total` decimal default 0
- `grand_total` decimal default 0
- `paid_total` decimal default 0
- `due_total` decimal default 0
- `note` text nullable
- timestamps
- soft deletes

Create `purchase_items`:

- `id`
- `purchase_id` foreign key
- `product_id` nullable foreign key
- `quantity` decimal
- `unit_cost` decimal
- `tax_amount` decimal default 0
- `discount_amount` decimal default 0
- `line_total` decimal
- timestamps

Create `purchase_payments`:

- `id`
- `purchase_id` foreign key
- `account_id` nullable foreign key
- `amount` decimal
- `payment_method` string
- `reference` nullable
- `paid_at` timestamp
- `note` text nullable
- timestamps

UI support:

- Purchases list/create
- Supplier payable tracking
- Purchase reports
- Stock movement on completed purchase

### Purchase Returns

Create `purchase_returns`:

- `id`
- `reference` unique
- `purchase_id` nullable foreign key
- `supplier_id` nullable foreign key
- `warehouse_id` nullable foreign key
- `user_id` nullable foreign key
- `return_date`
- `status` string default `completed`
- `grand_total` decimal default 0
- `note` text nullable
- timestamps

Create `purchase_return_items`:

- `id`
- `purchase_return_id` foreign key
- `product_id` nullable foreign key
- `quantity` decimal
- `unit_cost` decimal
- `line_total` decimal
- timestamps

UI support:

- Purchases > Return
- Inventory stock decrease
- Supplier account adjustment

### Sales

Replace/extend `sales`:

- `id`
- `reference` unique
- `customer_id` nullable foreign key
- `warehouse_id` nullable foreign key
- `cashier_id` nullable foreign key to users
- `sale_date`
- `status` string default `completed`
- `payment_status` string default `paid`
- `subtotal` decimal default 0
- `tax_total` decimal default 0
- `discount_total` decimal default 0
- `grand_total` decimal default 0
- `paid_total` decimal default 0
- `change_total` decimal default 0
- `due_total` decimal default 0
- `note` text nullable
- timestamps
- soft deletes

Replace/extend `sale_items`:

- `id`
- `sale_id` foreign key
- `product_id` nullable foreign key
- `product_name_snapshot` nullable
- `sku_snapshot` nullable
- `quantity` decimal
- `unit_price` decimal
- `unit_cost` decimal default 0
- `tax_amount` decimal default 0
- `discount_amount` decimal default 0
- `line_total` decimal
- timestamps

Create `sale_payments`:

- `id`
- `sale_id` foreign key
- `account_id` nullable foreign key
- `payment_method` string, examples: `cash`, `card`, `mobile_money`, `bank`
- `amount` decimal
- `received_amount` decimal nullable
- `change_amount` decimal default 0
- `reference` nullable
- `paid_at` timestamp
- timestamps

UI support:

- POS checkout
- Recent sales
- Receipt printing
- Sales list
- Sales reports
- Dashboard totals

### Held Sales

Create `held_sales`:

- `id`
- `reference` unique
- `customer_id` nullable foreign key
- `warehouse_id` nullable foreign key
- `cashier_id` nullable foreign key
- `cart_snapshot` json
- `subtotal` decimal default 0
- `tax_total` decimal default 0
- `discount_total` decimal default 0
- `grand_total` decimal default 0
- `held_at` timestamp
- timestamps

Purpose:

- Persist POS held carts across browser refreshes and sessions.

UI support:

- POS held sales drawer

### Sale Returns

Create `sale_returns`:

- `id`
- `reference` unique
- `sale_id` nullable foreign key
- `customer_id` nullable foreign key
- `warehouse_id` nullable foreign key
- `user_id` nullable foreign key
- `return_date`
- `status` string default `completed`
- `grand_total` decimal default 0
- `refund_method` nullable string
- `note` text nullable
- timestamps

Create `sale_return_items`:

- `id`
- `sale_return_id` foreign key
- `sale_item_id` nullable foreign key
- `product_id` nullable foreign key
- `quantity` decimal
- `unit_price` decimal
- `line_total` decimal
- timestamps

UI support:

- Sales > Return
- Inventory stock increase
- Customer refund/account adjustment

### Sale Exchanges

MVP recommendation:

- Do not build a separate exchange table first.
- Model exchanges as a sale return plus a new sale, linked by a nullable `exchange_reference` or `related_sale_id` if the feature is implemented.

Reason:

- The current UI only has an exchange placeholder.

### Quotations

Create `quotations`:

- `id`
- `reference` unique
- `customer_id` nullable foreign key
- `user_id` nullable foreign key
- `quotation_date`
- `status` string default `pending`
- `subtotal` decimal default 0
- `tax_total` decimal default 0
- `discount_total` decimal default 0
- `grand_total` decimal default 0
- `converted_sale_id` nullable foreign key to sales
- `note` text nullable
- timestamps
- soft deletes

Create `quotation_items`:

- `id`
- `quotation_id` foreign key
- `product_id` nullable foreign key
- `quantity` decimal
- `unit_price` decimal
- `tax_amount` decimal default 0
- `discount_amount` decimal default 0
- `line_total` decimal
- timestamps

UI support:

- Quotations list/create
- Convert quotation to sale

### Expense Categories

Create `expense_categories`:

- `id`
- `name` unique
- `description` nullable
- `status` string default `active`
- timestamps

### Expenses

Replace/extend `expenses`:

- `id`
- `reference` unique nullable
- `expense_category_id` nullable foreign key
- `account_id` nullable foreign key
- `user_id` nullable foreign key
- `expense_date`
- `amount` decimal
- `note` text nullable
- timestamps
- soft deletes

UI support:

- Expenses
- Expense categories
- Profit/loss report
- Account ledger

### Accounts

Create `accounts`:

- `id`
- `account_no` unique
- `name`
- `type` string nullable, examples: `cash`, `bank`, `mobile_money`
- `opening_balance` decimal default 0
- `current_balance` decimal default 0
- `status` string default `active`
- timestamps
- soft deletes

Relationships:

- `Account hasMany AccountTransaction`
- `Account hasMany SalePayment`
- `Account hasMany PurchasePayment`
- `Account hasMany Expense`

UI support:

- Accounting > Accounts
- Money transfer
- Account statement
- Payment methods

### Account Transactions

Create `account_transactions`:

- `id`
- `account_id` foreign key
- `user_id` nullable foreign key
- `reference_type` nullable string
- `reference_id` nullable unsigned big integer
- `transaction_date`
- `description` nullable
- `debit` decimal default 0
- `credit` decimal default 0
- `balance_after` decimal default 0
- timestamps

Purpose:

- Account statement ledger.
- Source for accounting reports.

### Money Transfers

Create `money_transfers`:

- `id`
- `reference` unique
- `from_account_id` foreign key
- `to_account_id` foreign key
- `user_id` nullable foreign key
- `transfer_date`
- `amount` decimal
- `note` text nullable
- timestamps

UI support:

- Accounting > Transfer

### Tax Rates

Create `tax_rates`:

- `id`
- `name`
- `rate` decimal, example `10.00`
- `status` string default `active`
- timestamps

UI support:

- Product tax
- POS tax calculation
- Reports

### Audit Logs

Create `audit_logs`:

- `id`
- `user_id` nullable foreign key
- `action` string, examples: `Create`, `Update`, `Delete`, `Login`
- `module` string
- `auditable_type` nullable string
- `auditable_id` nullable unsigned big integer
- `description` text
- `old_values` json nullable
- `new_values` json nullable
- `ip_address` nullable string
- `user_agent` nullable text
- timestamps

UI support:

- Settings > Audit Logs

### Notifications and Settings

MVP can start with simple tables:

Create `settings`:

- `id`
- `key` unique
- `value` json nullable
- timestamps

Create `notifications`:

- `id`
- `user_id` nullable foreign key
- `type` string
- `title`
- `body` text nullable
- `data` json nullable
- `read_at` nullable timestamp
- timestamps

UI support:

- Settings > Notifications placeholder
- Low stock notifications later

## Eloquent Model List

Create these models first:

- `Role`
- `Warehouse`
- `CustomerGroup`
- `Customer`
- `Supplier`
- `Category`
- `Brand`
- `Unit`
- `TaxRate`
- `Product`
- `ProductStock`
- `StockMovement`
- `StockAdjustment`
- `StockAdjustmentItem`
- `StockTransfer`
- `StockTransferItem`
- `Purchase`
- `PurchaseItem`
- `PurchasePayment`
- `PurchaseReturn`
- `PurchaseReturnItem`
- `Sale`
- `SaleItem`
- `SalePayment`
- `HeldSale`
- `SaleReturn`
- `SaleReturnItem`
- `Quotation`
- `QuotationItem`
- `ExpenseCategory`
- `Expense`
- `Account`
- `AccountTransaction`
- `MoneyTransfer`
- `AuditLog`
- `Setting`
- `Notification`

Update existing `User` model relationships.

## Important Relationship Summary

- Customer -> sales, quotations, sale returns
- Supplier -> purchases, purchase returns
- Product -> category, brand, units, stocks, sale items, purchase items, stock movements
- Warehouse -> product stocks, stock movements, transfers, sales, purchases
- Sale -> customer, warehouse, cashier, items, payments, returns
- Purchase -> supplier, warehouse, items, payments, returns
- Account -> payments, expenses, transfers, ledger transactions
- StockMovement -> product, warehouse, polymorphic reference by type/id
- AuditLog -> user and optional auditable reference

## Indexes and Constraints

Add indexes for:

- All foreign keys
- `products.sku`
- `products.barcode`
- `sales.reference`
- `purchases.reference`
- `quotations.reference`
- `sale_returns.reference`
- `purchase_returns.reference`
- `stock_transfers.reference`
- `money_transfers.reference`
- `expenses.reference`
- `account_transactions.account_id, transaction_date`
- `stock_movements.product_id, warehouse_id, occurred_at`
- `audit_logs.module, created_at`

Unique constraints:

- `roles.name`
- `warehouses.name`
- `categories.code` nullable unique
- `brands.name`
- `units.code`
- `products.sku`
- `products.barcode` nullable unique
- `accounts.account_no`
- Business document references
- `product_stocks.product_id, warehouse_id`

## Seed Data Needed

Create seeders for:

- Roles: Admin, Cashier, Inventory Manager, Accountant, Manager
- Admin user
- Customer groups: Regular, VIP
- Default customer: Walk-in Customer
- Warehouses: Main Warehouse, Store Front
- Units: Piece, KG, Liter
- Categories: Drinks, Snacks, Electronics, Grocery, Pharmacy
- Brands: basic sample brands
- Accounts: Cash, Bank Account, EVC Plus/Mobile Money
- Expense categories: Rent, Utilities
- Tax rates: No Tax, VAT 10%

## Backend Implementation Phases

### Phase 1: Schema Foundation

- Replace or expand current starter migrations.
- Add all Eloquent models and relationships.
- Add factories for the core models.
- Add seeders for UI-ready defaults.
- Run `php artisan migrate:fresh --seed`.

### Phase 2: Inventory Backend

- Products, categories, brands, units, warehouses.
- Product create/edit/detail/list pages receive data from controllers.
- Barcode page reads real products.
- Stock overview reads `product_stocks`.
- Stock adjustment writes adjustment rows, stock movements, and product stock balances in one transaction.

### Phase 3: POS and Sales Backend

- POS page receives products, categories, customers, tax, accounts/payment methods.
- Completing a sale creates sale, sale items, sale payments, stock movements, account transactions, and updates stock balances.
- Held sales persist to `held_sales`.
- Receipts use saved sale data.

### Phase 4: Purchases and Returns

- Purchase create/list/show.
- Completed purchase increases stock.
- Purchase payments update account ledger.
- Purchase returns decrease stock and update supplier/account totals.
- Sale returns increase stock and record refund/account effects.

### Phase 5: Finance, Reports, and Audit

- Expenses and expense categories.
- Accounts, money transfers, account statements.
- Dashboard aggregates from sales, purchases, expenses, and stock.
- Reports use query services.
- Audit logging for create/update/delete/login events.

## Notes Before Coding Migrations

- Since this is currently UI-first and mock-backed, confirm whether the local database has any real data before editing existing migrations.
- If real data exists, create additive migrations instead of replacing old ones.
- If no real data exists, prefer consolidating the early POS migrations now. It will prevent technical debt around narrow tables like `expenses.category` and `products.stock`.
- Decide whether to install `spatie/laravel-permission` for roles/permissions. For MVP, a simple `roles.permissions` JSON field is enough.
- Decide whether all money is USD only for MVP. If multi-currency is needed later, add `currency_code` to accounts and business documents.
