import React, { useEffect, useMemo, useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Percent,
  CreditCard,
  Printer,
  Pause,
  FileClock,
  Maximize,
  X,
  Smartphone,
  Banknote,
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { cn } from '@/lib/utils';

interface POSProduct {
  id: number;
  name: string;
  sku: string;
  barcode?: string | null;
  selling_price: number;
  cost_price: number;
  stock: number;
  category: { id: number; name: string } | null;
  image_path?: string | null;
}

interface CartItem {
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  tax_amount: number;
  discount_amount: number;
  line_total: number;
  image_path?: string | null;
  stock: number;
  category_id?: number | null;
}

interface Payment {
  account_id: number | null;
  method: string;
  amount: number;
  received_amount: number;
  change_amount: number;
  reference?: string;
}

interface HeldSale {
  id: number;
  reference: string;
  customer_id: number | null;
  cart_snapshot: CartItem[];
  subtotal: number;
  tax_total: number;
  discount_total: number;
  grand_total: number;
  held_at?: string;
}

interface SaleReceipt {
  id: number;
  reference: string;
  customer?: { name: string } | null;
  cashier?: { name: string } | null;
  sale_date: string;
  subtotal: number | string;
  tax_total: number | string;
  discount_total: number | string;
  grand_total: number | string;
  paid_total: number | string;
  change_total: number | string;
  items: {
    id: number;
    product_name_snapshot: string;
    sku_snapshot: string;
    quantity: number | string;
    unit_price: number | string;
    line_total: number | string;
  }[];
  payments: {
    id: number;
    payment_method: string;
    amount: number | string;
    received_amount: number | string;
    change_amount: number | string;
  }[];
}

interface POSProps {
  warehouse?: { id: number; name: string } | null;
  customers?: { id: number; name: string; phone: string | null }[];
  accounts?: { id: number; name: string; type: string; current_balance: number | string }[];
  taxRates?: { id: number; name: string; rate: number | string }[];
  heldSales?: HeldSale[];
  products?: POSProduct[];
  flash?: { sale?: SaleReceipt | null };
  auth?: { user?: { name?: string } | null };
}

interface CheckoutForm {
  warehouse_id: number | '';
  customer_id: number | null;
  cart: CartItem[];
  payments: Payment[];
  subtotal: number;
  tax_total: number;
  discount_total: number;
  grand_total: number;
  note: string;
}

const money = (value: number | string | null | undefined) => Number(value ?? 0).toFixed(2);

const productImage = (item: Pick<CartItem, 'image_path'>) =>
  item.image_path || 'https://placehold.co/300x300/f8fafc/94a3b8?text=POS';

export function POS() {
  const { props } = usePage<POSProps>();
  const warehouse = props.warehouse ?? null;
  const customers = props.customers ?? [];
  const accounts = props.accounts ?? [];
  const products = props.products ?? [];
  const heldSales = props.heldSales ?? [];
  const cashierName = props.auth?.user?.name ?? 'Admin';
  const defaultTaxRate = Number(props.taxRates?.find((rate) => Number(rate.rate) > 0)?.rate ?? 0) / 100;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [customDiscount, setCustomDiscount] = useState('0');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(accounts[0]?.id ?? null);
  const [amountReceivedInput, setAmountReceivedInput] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isHeldSalesOpen, setHeldSalesOpen] = useState(false);
  const [isReceiptOpen, setReceiptOpen] = useState(false);
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
  const [receiptSale, setReceiptSale] = useState<SaleReceipt | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm<CheckoutForm>({
    warehouse_id: warehouse?.id ?? '',
    customer_id: null,
    cart: [],
    payments: [],
    subtotal: 0,
    tax_total: 0,
    discount_total: 0,
    grand_total: 0,
    note: '',
  });

  const categories = useMemo(() => {
    const seen = new Map<number, string>();
    products.forEach((product) => {
      if (product.category) {
        seen.set(product.category.id, product.category.name);
      }
    });

    return [{ id: 'all', name: 'All' }, ...Array.from(seen, ([id, name]) => ({ id: String(id), name }))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'all' || String(product.category?.id ?? '') === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, products, searchQuery]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0), [cart]);
  const lineTaxTotal = useMemo(() => cart.reduce((sum, item) => sum + item.tax_amount, 0), [cart]);
  const taxTotal = subtotal * defaultTaxRate + lineTaxTotal;
  const discountTotal = subtotal * discountRate + cart.reduce((sum, item) => sum + item.discount_amount, 0);
  const grandTotal = Math.max(subtotal + taxTotal - discountTotal, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const paymentMethods = useMemo(
    () => [
      { id: 'cash', name: 'Cash', type: 'cash', icon: Banknote },
      { id: 'card', name: 'Card', type: 'bank', icon: CreditCard },
      { id: 'mobile_money', name: 'Mobile', type: 'mobile_money', icon: Smartphone },
    ],
    [],
  );

  useEffect(() => {
    setData('warehouse_id', warehouse?.id ?? '');
  }, [setData, warehouse?.id]);

  useEffect(() => {
    setData('cart', cart);
    setData('subtotal', subtotal);
    setData('tax_total', taxTotal);
    setData('discount_total', discountTotal);
    setData('grand_total', grandTotal);
  }, [cart, discountTotal, grandTotal, setData, subtotal, taxTotal]);

  useEffect(() => {
    const method = paymentMethods.find((paymentMethod) => paymentMethod.id === selectedPaymentMethod) ?? paymentMethods[0];
    const matchingAccount = accounts.find((account) => account.type === method.type) ?? accounts[0];
    const accountId = selectedAccountId ?? matchingAccount?.id ?? null;
    const received = Number(amountReceivedInput || grandTotal);
    const payment: Payment = {
      account_id: accountId,
      method: method.id,
      amount: grandTotal,
      received_amount: received,
      change_amount: Math.max(received - grandTotal, 0),
    };

    setSelectedAccountId(accountId);
    setPayments([payment]);
    setData('payments', [payment]);
  }, [accounts, amountReceivedInput, grandTotal, selectedAccountId, selectedPaymentMethod, setData]);

  const updateCartItem = (productId: number, quantity: number) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.product_id !== productId) return item;

          const nextQuantity = Math.max(1, Math.min(quantity, item.stock));

          return {
            ...item,
            quantity: nextQuantity,
            line_total: nextQuantity * item.unit_price + item.tax_amount - item.discount_amount,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const addToCart = (product: POSProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.product_id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) return current;

        return current.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                line_total: (item.quantity + 1) * item.unit_price + item.tax_amount - item.discount_amount,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          quantity: 1,
          unit_price: Number(product.selling_price),
          unit_cost: Number(product.cost_price ?? 0),
          tax_amount: 0,
          discount_amount: 0,
          line_total: Number(product.selling_price),
          image_path: product.image_path,
          stock: Number(product.stock),
          category_id: product.category?.id ?? null,
        },
      ];
    });
  };

  const clearSale = () => {
    setCart([]);
    setAmountReceivedInput('');
    setDiscountRate(0);
    reset();
  };

  const handleCheckout = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (cart.length === 0 || !warehouse) return;
    if (payments[0] && payments[0].received_amount < grandTotal) return;

    post('/pos/sale', {
      preserveScroll: true,
      onSuccess: (page) => {
        const sale = (page.props as POSProps).flash?.sale;

        if (sale) {
          setReceiptSale(sale);
          setReceiptOpen(true);
        }

        setCheckoutOpen(false);
        clearSale();
      },
      onError: (checkoutErrors) => {
        console.error('Checkout failed:', checkoutErrors);
      },
    });
  };

  const holdSale = () => {
    if (cart.length === 0 || !warehouse) return;

    router.post(
      '/pos/held',
      {
        cart_snapshot: cart,
        customer_id: data.customer_id,
        warehouse_id: warehouse.id,
        subtotal,
        tax_total: taxTotal,
        discount_total: discountTotal,
        grand_total: grandTotal,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          clearSale();
          router.reload({ only: ['heldSales'] });
        },
      },
    );
  };

  const restoreHeldSale = (heldSale: HeldSale) => {
    setCart(heldSale.cart_snapshot);
    setData('customer_id', heldSale.customer_id);
    setHeldSalesOpen(false);

    router.delete(`/pos/held/${heldSale.id}`, {
      preserveScroll: true,
      onSuccess: () => router.reload({ only: ['heldSales'] }),
    });
  };

  const printReceiptAction = () => window.print();

  return (
    <div className="flex h-full w-full flex-col bg-[#f4f6f8] relative">
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <div className="flex w-full max-w-2xl items-center gap-3">
          <Link href="/dashboard" className="hidden sm:block">
            <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>

          <div className="flex items-center">
            <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-sm">
              <ShoppingCart className="h-3.5 w-3.5 text-white" />
            </div>
            <h1 className="mr-2 hidden text-lg font-semibold text-gray-900 lg:block font-display">
              Ruku<span className="text-primary">n</span><span className="ml-1 text-gray-500">POS</span>
            </h1>
            <span className="mr-4 hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 xl:inline-flex">
              {warehouse?.name ?? 'No Warehouse'}
            </span>
          </div>

          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Scan barcode or search..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border-transparent bg-gray-100/80 py-1.5 pl-9 pr-3 text-sm font-medium text-gray-900 transition-all placeholder:text-gray-500 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-2 hidden items-center text-xs font-medium text-gray-500 lg:flex">
            <span className="mr-2">Cashier: {cashierName}</span>
            <span>|</span>
            <span className="ml-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="relative hidden w-44 md:block">
            <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <select
              value={data.customer_id ?? ''}
              onChange={(event) => setData('customer_id', event.target.value ? Number(event.target.value) : null)}
              className="w-full cursor-pointer appearance-none rounded-lg border-transparent bg-gray-100/80 py-1.5 pl-8 pr-3 text-sm font-medium text-gray-700 transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mx-0.5 hidden h-4 w-px bg-gray-200 md:block" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHeldSalesOpen(true)}
            className="hidden h-8 items-center gap-1.5 rounded-lg px-2 font-medium text-gray-600 hover:text-gray-900 md:flex"
          >
            <Pause className="h-4 w-4" /> <span className="hidden xl:inline">Held</span>
            {heldSales.length > 0 && (
              <span className="ml-1 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700 tabular-nums">
                {heldSales.length}
              </span>
            )}
          </Button>
          <button className="hidden rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900 md:flex">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 flex-col-reverse overflow-hidden lg:flex-row">
        <div className="z-10 flex h-[45vh] min-h-0 w-full shrink-0 flex-col border-r border-gray-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:h-auto lg:w-[320px] xl:w-[360px]">
          <div className="shrink-0 border-b border-gray-100 bg-white p-3 sm:hidden">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={data.customer_id ?? ''}
                onChange={(event) => setData('customer_id', event.target.value ? Number(event.target.value) : null)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm font-medium text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Walk-in Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto bg-gray-50/50 p-2">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-400 opacity-80">
                <ShoppingCart className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product_id}
                  className="group relative flex items-start gap-2 rounded-lg border border-gray-100 bg-white p-2 shadow-sm transition-all hover:border-primary/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-100/60 bg-gray-50 p-1">
                    <img src={productImage(item)} className="h-full w-full object-contain mix-blend-multiply" alt={item.product_name} />
                  </div>

                  <div className="min-w-0 flex-1 pr-5">
                    <div className="flex items-start justify-between">
                      <h4 className="pr-2 text-xs font-semibold leading-tight text-gray-900">{item.product_name}</h4>
                      <span className="shrink-0 text-xs font-bold text-gray-900 tabular-nums">${money(item.line_total)}</span>
                    </div>
                    <p className="mb-1.5 mt-0.5 text-[10px] text-gray-400">
                      ${money(item.unit_price)} <span className="mx-0.5 text-gray-300">|</span> {item.sku}
                    </p>

                    <div className="flex items-center">
                      <div className="flex items-center rounded border border-gray-200 bg-white shadow-sm">
                        <button
                          onClick={() => updateCartItem(item.product_id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center text-gray-500 transition-colors hover:text-gray-900"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center text-gray-500 transition-colors hover:text-gray-900"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCart((current) => current.filter((cartItem) => cartItem.product_id !== item.product_id))}
                    className="absolute right-1 top-1 rounded-md p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="z-20 shrink-0 border-t border-gray-100 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="mb-3 space-y-1 px-1">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900 tabular-nums">${money(subtotal)}</span>
              </div>
              <div className="group flex cursor-pointer items-center justify-between text-[13px]" onClick={() => setDiscountModalOpen(true)}>
                <span className="flex items-center gap-1 border-b border-dashed border-gray-300 text-gray-500 transition-colors group-hover:border-primary group-hover:text-primary">
                  <Percent className="h-3 w-3" /> Discount {discountRate > 0 ? `(${(discountRate * 100).toFixed(0)}%)` : ''}
                </span>
                <span className="font-semibold text-red-600 tabular-nums">-${money(discountTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500">Tax ({(defaultTaxRate * 100).toFixed(0)}%)</span>
                <span className="font-semibold text-gray-900 tabular-nums">${money(taxTotal)}</span>
              </div>

              <div className="mt-2 flex items-end justify-between border-t border-gray-100 pt-2">
                <div className="text-xs font-medium text-gray-500">{itemCount} items</div>
                <div className="text-3xl font-black leading-none tracking-tight text-gray-900 tabular-nums">${money(grandTotal)}</div>
              </div>
            </div>

            {(errors.cart || errors.warehouse_id || errors.payments) && (
              <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{errors.cart || errors.warehouse_id || errors.payments}</span>
              </div>
            )}

            <div className="mt-1 grid grid-cols-1 gap-2">
              <div className="mb-1 grid grid-cols-3 gap-1.5">
                {paymentMethods.map((paymentMethod) => {
                  const Icon = paymentMethod.icon;

                  return (
                    <Button
                      key={paymentMethod.id}
                      variant="secondary"
                      className={cn(
                        'h-9 rounded-lg border px-1 text-[11px] font-semibold transition-colors',
                        selectedPaymentMethod === paymentMethod.id
                          ? 'border-primary/40 bg-primary-light text-primary-text'
                          : 'border-gray-200 bg-gray-100 text-gray-700 hover:border-primary/40 hover:bg-primary-light hover:text-primary-text',
                      )}
                      disabled={cart.length === 0}
                      onClick={() => {
                        const account = accounts.find((item) => item.type === paymentMethod.type) ?? accounts[0];
                        setSelectedPaymentMethod(paymentMethod.id);
                        setSelectedAccountId(account?.id ?? null);
                        setCheckoutOpen(true);
                      }}
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {paymentMethod.name}
                    </Button>
                  );
                })}
              </div>

              <Button
                className={cn(
                  'flex h-12 w-full items-center justify-center gap-2 rounded-xl text-lg font-bold shadow-sm transition-all',
                  cart.length === 0 || !warehouse
                    ? 'cursor-not-allowed border-0 bg-gray-100 text-gray-400'
                    : 'border-0 bg-primary text-white hover:bg-primary-dark hover:shadow-md',
                )}
                disabled={cart.length === 0 || !warehouse}
                onClick={() => setCheckoutOpen(true)}
              >
                Complete Sale | ${money(grandTotal)}
              </Button>

              <div className="mt-0.5 hidden grid-cols-2 gap-2 sm:grid">
                <Button
                  variant="outline"
                  onClick={holdSale}
                  className="h-9 rounded-lg border-gray-200 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  disabled={cart.length === 0 || !warehouse}
                >
                  <Pause className="mr-1 h-3.5 w-3.5" /> Hold
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 rounded-lg text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                  onClick={clearSale}
                  disabled={cart.length === 0}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50/50">
          <div className="z-10 shrink-0 border-b border-gray-100 bg-white px-3 py-2 shadow-sm">
            <div className="custom-scrollbar flex gap-1.5 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'whitespace-nowrap rounded-lg border px-3 py-1.5 text-[13px] font-semibold shadow-sm transition-all',
                    activeCategory === category.id
                      ? 'border-primary/40 bg-primary-light text-primary-text'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className={cn(
                    'group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all',
                    product.stock <= 0
                      ? 'cursor-not-allowed border-gray-100 opacity-60'
                      : 'cursor-pointer border-gray-200/60 hover:border-primary hover:shadow-md active:scale-[0.98]',
                  )}
                >
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden border-b border-gray-50/50 bg-white p-2">
                    <img
                      src={product.image_path || 'https://placehold.co/300x300/f8fafc/94a3b8?text=POS'}
                      alt={product.name}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                        <span className="rounded border border-red-100 bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600 shadow-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col bg-white p-2.5">
                    <div className="mb-0.5 truncate text-[9px] font-semibold uppercase tracking-wider text-gray-400">{product.sku}</div>
                    <h3 className="mb-2 line-clamp-2 text-xs font-semibold leading-snug text-gray-800">{product.name}</h3>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="text-sm font-bold text-gray-900 tabular-nums">${money(product.selling_price)}</div>
                      <div className="rounded border border-gray-100 bg-gray-50 px-1 py-0.5 text-[10px] font-medium text-gray-500">
                        {product.stock} left
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-16 text-gray-400">
                <Search className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-base font-bold text-gray-900">{products.length === 0 ? 'Loading products...' : 'No products found'}</p>
                <p className="mt-1 text-xs">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)} />
          <form onSubmit={handleCheckout} className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6">
              <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-primary-light/60 p-6">
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary">Total Due</p>
                <p className="text-5xl font-extrabold tracking-tight text-primary-text tabular-nums">${money(grandTotal)}</p>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;

                  return (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => {
                        const account = accounts.find((item) => item.type === method.type) ?? accounts[0];
                        setSelectedPaymentMethod(method.id);
                        setSelectedAccountId(account?.id ?? null);
                      }}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary',
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-primary-light text-primary-text'
                          : 'border-gray-200 text-gray-600 hover:border-primary hover:bg-primary-light/60',
                      )}
                    >
                      <Icon className={cn('mb-2 h-6 w-6', selectedPaymentMethod === method.id ? 'text-primary' : 'text-gray-500')} />
                      <span className="text-sm font-semibold">{method.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Deposit Account</label>
                  <select
                    value={selectedAccountId ?? ''}
                    onChange={(event) => setSelectedAccountId(event.target.value ? Number(event.target.value) : null)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">No account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} (${money(account.current_balance)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount Received ($)</label>
                  <input
                    type="number"
                    value={amountReceivedInput}
                    onChange={(event) => setAmountReceivedInput(event.target.value)}
                    placeholder={money(grandTotal)}
                    className={cn(
                      'w-full rounded-xl border bg-white px-4 py-3 text-lg font-medium shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20',
                      payments[0]?.received_amount < grandTotal ? 'border-red-300' : 'border-gray-200',
                    )}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <span className="text-sm font-medium text-gray-600">Change Due:</span>
                  <span className="text-xl font-bold text-gray-900 tabular-nums">${money(Math.max((Number(amountReceivedInput) || grandTotal) - grandTotal, 0))}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:p-6">
              <Button type="button" variant="outline" className="h-12 w-full rounded-xl border-gray-200 font-semibold text-gray-600 hover:bg-gray-100 sm:w-auto" onClick={() => setCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="h-12 w-full rounded-xl bg-primary px-8 font-bold text-white shadow-sm hover:bg-primary-dark sm:w-auto" disabled={processing || cart.length === 0}>
                {processing ? 'Completing...' : 'Complete Sale'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isReceiptOpen && receiptSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="no-scrollbar flex max-h-[100dvh] w-full max-w-sm flex-col items-center overflow-y-auto py-8">
            <div className="mb-4 flex w-full shrink-0 justify-center">
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 shadow-lg">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-bold text-green-800">Sale Completed</span>
              </div>
            </div>

            <div className="ReceiptPrint-container mb-6 w-full max-w-[320px] shrink-0 overflow-hidden rounded-md bg-white p-6 font-mono text-sm text-black shadow-2xl print:shadow-none">
              <div className="mb-4 border-b border-dashed border-gray-400 pb-4 text-center">
                <h2 className="mb-1 text-xl font-bold uppercase tracking-widest">RukunPOS</h2>
                <p className="text-xs text-gray-600">Retail workspace</p>
              </div>
              <div className="mb-4 text-xs">
                <p><span className="font-semibold">Invoice:</span> {receiptSale.reference}</p>
                <p><span className="font-semibold">Date:</span> {new Date(receiptSale.sale_date).toLocaleString()}</p>
                <p><span className="font-semibold">Cashier:</span> {receiptSale.cashier?.name ?? cashierName}</p>
                <p><span className="font-semibold">Customer:</span> {receiptSale.customer?.name ?? 'Walk-in Customer'}</p>
              </div>
              <table className="mb-4 w-full border-y border-dashed border-gray-400 py-2 text-xs">
                <thead>
                  <tr className="text-left font-semibold">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptSale.items.map((item) => (
                    <tr key={item.id}>
                      <td className="max-w-[150px] truncate py-1 pr-2">{item.product_name_snapshot}</td>
                      <td className="py-1 text-center">{Number(item.quantity)}</td>
                      <td className="py-1 text-right">${money(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-4 space-y-1 border-b border-dashed border-gray-400 pb-4 text-xs">
                <div className="flex justify-between"><span>Subtotal:</span><span>${money(receiptSale.subtotal)}</span></div>
                <div className="flex justify-between"><span>Tax:</span><span>${money(receiptSale.tax_total)}</span></div>
                <div className="flex justify-between text-red-600"><span>Discount:</span><span>-${money(receiptSale.discount_total)}</span></div>
                <div className="mt-2 flex justify-between text-base font-bold"><span>Total:</span><span>${money(receiptSale.grand_total)}</span></div>
              </div>
              <div className="mb-6 space-y-1 text-xs">
                {receiptSale.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between">
                    <span>{payment.payment_method}:</span>
                    <span>${money(payment.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold"><span>Change:</span><span>${money(receiptSale.change_total)}</span></div>
              </div>
              <div className="text-center text-xs">
                <p className="font-bold">Thank you for your business.</p>
                <p className="mt-4 text-[10px] text-gray-500">Powered by RukunPOS</p>
              </div>
            </div>

            <div className="flex w-full max-w-[320px] shrink-0 gap-3">
              <Button variant="outline" className="h-12 flex-1 rounded-xl border-none bg-white font-bold text-gray-900 shadow-sm hover:bg-gray-50" onClick={() => setReceiptOpen(false)}>
                New Sale
              </Button>
              <Button className="h-12 flex-1 rounded-xl bg-primary font-bold text-white shadow-lg hover:bg-primary-dark" onClick={printReceiptAction}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setDiscountModalOpen(false)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Apply Discount</h3>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount Percentage (%)</label>
              <input
                type="number"
                value={customDiscount}
                onChange={(event) => setCustomDiscount(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:ring-2"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDiscountModalOpen(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-primary"
                onClick={() => {
                  setDiscountRate((Number(customDiscount) || 0) / 100);
                  setDiscountModalOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {isHeldSalesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setHeldSalesOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-[#f8f9fa] shadow-2xl">
            <div className="z-10 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-100 bg-orange-50">
                  <Pause className="h-4 w-4 text-orange-600" />
                </div>
                Held Sales
              </h2>
              <button onClick={() => setHeldSalesOpen(false)} className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-6">
              {heldSales.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center text-gray-500">
                  <Pause className="mb-3 h-12 w-12 text-gray-300" />
                  <p>No held sales.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {heldSales.map((sale) => (
                    <div key={sale.id} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <span className="rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                            {sale.reference}
                          </span>
                          <h4 className="mt-2 font-semibold text-gray-900">
                            {customers.find((customer) => customer.id === sale.customer_id)?.name ?? 'Walk-in'}
                          </h4>
                          <p className="mt-0.5 text-xs text-gray-500">{sale.cart_snapshot.length} items</p>
                        </div>
                        <span className="text-lg font-bold text-gray-900 tabular-nums">${money(sale.grand_total)}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">
                          {sale.held_at ? new Date(sale.held_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        <Button variant="default" size="sm" className="h-8 rounded-lg bg-gray-900 text-xs font-semibold text-white hover:bg-black" onClick={() => restoreHeldSale(sale)}>
                          Resume Sale
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
        @media print {
          body * { visibility: hidden; }
          .ReceiptPrint-container, .ReceiptPrint-container * { visibility: visible; }
          .ReceiptPrint-container { position: absolute; left: 0; top: 0; margin: 0; box-shadow: none; border: none; }
          button { display: none !important; }
        }
      ` }} />
    </div>
  );
}
