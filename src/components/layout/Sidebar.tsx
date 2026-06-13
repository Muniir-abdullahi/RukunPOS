import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Box,
  Store,
  LineChart,
  Users2,
  Wallet,
  Settings,
  ChevronDown,
  FileText,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

// We could make this a recursive component, but for MVP keep it flat/simple
const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Operations',
    icon: Store,
    children: [
      { name: 'Point of Sale', path: '/pos' },
      { name: 'Orders', path: '/sales' },
      { name: 'Returns & Exchanges', path: '/sales/return' },
      { name: 'Quotations', path: '/quotations' },
    ]
  },
  {
    name: 'Catalog',
    icon: Box,
    children: [
      { name: 'Products', path: '/products' },
      { name: 'Categories', path: '/products/categories' },
      { name: 'Brands', path: '/products/brands' },
      { name: 'Units', path: '/products/units' },
      { name: 'Barcode Center', path: '/products/barcode' },
    ]
  },
  {
    name: 'Contacts',
    icon: Users2,
    children: [
      { name: 'Customers', path: '/people/customers' },
      { name: 'Suppliers', path: '/people/suppliers' },
      { name: 'Team Members', path: '/people/users' },
    ]
  },
  {
    name: 'Inventory',
    icon: Package,
    children: [
      { name: 'Stock Overview', path: '/reports/stock' },
      { name: 'Purchases', path: '/purchases' },
      { name: 'Transfers', path: '/inventory/transfers' },
      { name: 'Inventory Adjustments', path: '/inventory/adjustments' },
    ]
  },
  {
    name: 'Finance',
    icon: Wallet,
    children: [
      { name: 'Expenses', path: '/expenses' },
      { name: 'Accounts', path: '/accounting' },
      { name: 'Transactions', path: '/accounting/statement' },
      { name: 'Cash Flow', path: '/accounting/transfer' },
    ]
  },
  {
    name: 'Insights',
    icon: LineChart,
    children: [
      { name: 'Sales Analytics', path: '/reports/sales' },
      { name: 'Inventory Reports', path: '/reports/products' },
      { name: 'Revenue Reports', path: '/reports/purchases' },
      { name: 'Profit & Loss', path: '/reports/profit-loss' },
    ]
  },
  {
    name: 'Workspace',
    icon: Settings,
    children: [
      { name: 'Roles', path: '/settings/roles' },
      { name: 'Warehouses', path: '/settings/warehouses' },
      { name: 'Audit Logs', path: '/settings/audit-logs' },
      { name: 'Notifications', path: '/settings/notifications' },
      { name: 'Preferences', path: '/settings' },
    ]
  },
  { name: 'System Design', path: '/system-design', icon: FileText } // MVP requirement
];

import { useLocation } from 'react-router-dom';

const NavItemGroup: React.FC<{ item: any; onClose?: () => void; collapsed?: boolean; onExpand?: () => void }> = ({ item, onClose, collapsed, onExpand }) => {
  const location = useLocation();
  const isActiveGroup = item.children?.some((child: any) => location.pathname.startsWith(child.path));
  const [isOpen, setIsOpen] = React.useState(isActiveGroup || false);

  React.useEffect(() => {
    if (isActiveGroup && !collapsed) {
      setIsOpen(true);
    }
  }, [isActiveGroup, collapsed]);

  if (!item.children) {
    return (
      <NavLink
        to={item.path}
        onClick={onClose}
        title={collapsed ? item.name : undefined}
        className={({ isActive }) =>
          cn(
            "group flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative mb-0.5",
            collapsed ? "justify-center p-3" : "px-3 py-2",
            isActive 
              ? "bg-primary-50 text-primary-700 font-semibold" 
              : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
          )
        }
      >
        {({ isActive }) => (
          <>
            <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600")} />
            {!collapsed && <span className="ml-3 tracking-wide">{item.name}</span>}
          </>
        )}
      </NavLink>
    );
  }

  const handleGroupClick = () => {
    if (collapsed && onExpand) {
      onExpand();
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-0.5">
      <button
        onClick={handleGroupClick}
        title={collapsed ? item.name : undefined}
        className={cn(
          "w-full group flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative",
          collapsed ? "justify-center p-3" : "justify-between px-3 py-2",
          isOpen ? "text-gray-900" : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
        )}
      >
        <div className="flex items-center">
          <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isOpen ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600")} />
          {!collapsed && <span className="ml-3 tracking-wide">{item.name}</span>}
        </div>
        {!collapsed && <ChevronDown className={cn("w-3.5 h-3.5 opacity-50 transition-transform shrink-0", isOpen && "rotate-180")} />}
      </button>
      {isOpen && !collapsed && (
        <div className="pl-9 space-y-0.5 mt-0.5 mb-2">
          {item.children.map((child: any) => (
            <NavLink
              key={child.path}
              to={child.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-1.5 text-[13px] rounded-lg transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-semibold shadow-sm border border-primary-100/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium"
                )
              }
            >
              {child.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ className, onClose, collapsed = false, onExpand }: { className?: string; onClose?: () => void; collapsed?: boolean; onExpand?: () => void }) {
  return (
    <div className={cn("flex flex-col bg-white border-r border-gray-100 h-full overflow-y-auto transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]", className)}>
      <div className={cn("p-4 flex items-center h-16 shrink-0", collapsed ? "justify-center" : "space-x-3 px-6")}>
        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <Package className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight text-gray-900 shrink-0">SaleLite</span>}
      </div>
      
      <div className={cn("flex-1 py-4 overflow-x-hidden", "px-3")}>
        {SIDEBAR_ITEMS.map((item) => (
          <NavItemGroup key={item.name} item={item} onClose={onClose} collapsed={collapsed} onExpand={onExpand} />
        ))}
      </div>
    </div>
  );
}
