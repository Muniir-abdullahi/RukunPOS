import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { cn } from '@/lib/utils';

export interface SelectProduct {
  id: number;
  name: string;
  sku: string;
  cost_price?: number | string;
  selling_price?: number | string;
  stock?: number | string;
}

export interface ProductRow {
  product_id: number | '';
  quantity: number;
  unit_cost?: number;
  unit_price?: number;
  tax_amount: number;
  discount_amount: number;
  line_total: number;
  sale_item_id?: number | null;
  max_quantity?: number;
}

interface ProductRowTableProps {
  rows: ProductRow[];
  products: SelectProduct[];
  onChange: (rows: ProductRow[]) => void;
  mode: 'purchase' | 'sale' | 'quotation';
  errors?: Record<string, string>;
}

const numberValue = (value: string | number | undefined) => Number(value ?? 0);

const calculateLineTotal = (row: ProductRow, mode: ProductRowTableProps['mode']) => {
  const price = mode === 'purchase' ? numberValue(row.unit_cost) : numberValue(row.unit_price);

  return Math.max((numberValue(row.quantity) * price) + numberValue(row.tax_amount) - numberValue(row.discount_amount), 0);
};

const emptyRow = (): ProductRow => ({
  product_id: '',
  quantity: 1,
  unit_cost: 0,
  unit_price: 0,
  tax_amount: 0,
  discount_amount: 0,
  line_total: 0,
});

export function ProductRowTable({ rows, products, onChange, mode, errors = {} }: ProductRowTableProps) {
  const priceKey = mode === 'purchase' ? 'unit_cost' : 'unit_price';
  const priceLabel = mode === 'purchase' ? 'Unit Cost' : 'Unit Price';

  const updateRow = (index: number, patch: Partial<ProductRow>) => {
    onChange(rows.map((row, rowIndex) => {
      if (rowIndex !== index) return row;

      const next = { ...row, ...patch };

      return { ...next, line_total: calculateLineTotal(next, mode) };
    }));
  };

  const selectProduct = (index: number, productId: string) => {
    if (!productId) {
      updateRow(index, { product_id: '', unit_cost: 0, unit_price: 0, line_total: 0 });
      return;
    }

    const id = Number(productId);
    const product = products.find((item) => item.id === id);
    const duplicate = rows.some((row, rowIndex) => rowIndex !== index && row.product_id === id);

    if (!product || duplicate) return;

    updateRow(index, {
      product_id: id,
      unit_cost: numberValue(product.cost_price),
      unit_price: numberValue(product.selling_price),
      max_quantity: mode === 'sale' ? numberValue(product.stock) || undefined : undefined,
    });
  };

  const fieldError = (index: number, field: string) => errors[`items.${index}.${field}`];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Products</h3>
          <p className="text-xs text-gray-500">Add products and adjust quantities, pricing, tax, and discounts.</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, emptyRow()])}>
          <Plus className="mr-1.5 h-4 w-4" /> Add row
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] table-fixed text-left">
          <thead className="border-b border-gray-100 bg-gray-50/70">
            <tr className="text-[11px] font-bold uppercase text-gray-500">
              <th className="w-[30%] px-3 py-2.5">Product</th>
              <th className="w-[11%] px-3 py-2.5">Quantity</th>
              <th className="w-[14%] px-3 py-2.5">{priceLabel}</th>
              {mode !== 'sale' && <th className="w-[12%] px-3 py-2.5">Tax</th>}
              {mode !== 'sale' && <th className="w-[12%] px-3 py-2.5">Discount</th>}
              <th className="w-[15%] px-3 py-2.5 text-right">Line Total</th>
              <th className="w-12 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={mode === 'sale' ? 5 : 7} className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-gray-700">No products added</p>
                  <p className="mt-1 text-xs text-gray-500">Use Add row to begin.</p>
                </td>
              </tr>
            ) : rows.map((row, index) => (
              <tr key={`${row.product_id || 'new'}-${index}`} className="align-top">
                <td className="px-3 py-3">
                  {products.length > 0 ? (
                    <select
                      value={row.product_id}
                      onChange={(event) => selectProduct(index, event.target.value)}
                      className={cn('w-full rounded-md border bg-white px-2.5 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20', fieldError(index, 'product_id') ? 'border-red-300' : 'border-gray-300')}
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                          disabled={rows.some((item, rowIndex) => rowIndex !== index && item.product_id === product.id)}
                        >
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      value={row.product_id}
                      onChange={(event) => updateRow(index, { product_id: event.target.value ? Number(event.target.value) : '' })}
                      placeholder="Product ID"
                      className={cn('w-full rounded-md border bg-white px-2.5 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20', fieldError(index, 'product_id') ? 'border-red-300' : 'border-gray-300')}
                    />
                  )}
                  {fieldError(index, 'product_id') && <p className="mt-1 text-xs text-red-600">{fieldError(index, 'product_id')}</p>}
                </td>
                <td className="px-3 py-3">
                  <input
                    type="number"
                    min="0.001"
                    step="0.001"
                    max={row.max_quantity}
                    value={row.quantity}
                    onChange={(event) => updateRow(index, { quantity: Math.max(numberValue(event.target.value), 0) })}
                    className={cn('w-full rounded-md border px-2.5 py-2 text-sm tabular-nums focus:border-primary focus:ring-2 focus:ring-primary/20', fieldError(index, 'quantity') ? 'border-red-300' : 'border-gray-300')}
                  />
                  {row.max_quantity !== undefined && <p className="mt-1 text-[11px] text-gray-500">Max {row.max_quantity}</p>}
                  {fieldError(index, 'quantity') && <p className="mt-1 text-xs text-red-600">{fieldError(index, 'quantity')}</p>}
                </td>
                <td className="px-3 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={numberValue(row[priceKey])}
                    onChange={(event) => updateRow(index, { [priceKey]: Math.max(numberValue(event.target.value), 0) })}
                    className={cn('w-full rounded-md border px-2.5 py-2 text-sm tabular-nums focus:border-primary focus:ring-2 focus:ring-primary/20', fieldError(index, priceKey) ? 'border-red-300' : 'border-gray-300')}
                  />
                  {fieldError(index, priceKey) && <p className="mt-1 text-xs text-red-600">{fieldError(index, priceKey)}</p>}
                </td>
                {mode !== 'sale' && (
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.tax_amount}
                      onChange={(event) => updateRow(index, { tax_amount: Math.max(numberValue(event.target.value), 0) })}
                      className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-sm tabular-nums focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </td>
                )}
                {mode !== 'sale' && (
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.discount_amount}
                      onChange={(event) => updateRow(index, { discount_amount: Math.max(numberValue(event.target.value), 0) })}
                      className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-sm tabular-nums focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </td>
                )}
                <td className="px-3 py-5 text-right text-sm font-bold text-gray-900 tabular-nums">${row.line_total.toFixed(2)}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    title="Remove product"
                    onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {errors.items && <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-medium text-red-700">{errors.items}</p>}
    </div>
  );
}
