import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams, Outlet } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, ArrowLeft, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export interface CrudColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'currency' | 'date';
  badgeColors?: Record<string, string>;
}

export interface CrudFormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox' | 'file' | 'wysiwyg' | 'section';
  options?: { value: string; label: string }[];
  required?: boolean;
  colSpan?: 1 | 2 | 3 | 4;
  hint?: string;
  placeholder?: string;
}

export interface CrudConfig {
  moduleName: string;
  entityName: string;
  basePath: string;
  columns: CrudColumn[];
  formFields: CrudFormField[];
  mockData: any[];
  disableAdd?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
}

// ----------------------------------------------------
// SHARED COMPONENTS
// ----------------------------------------------------

export function StatusBadge({ status, colorMap }: { status: string, colorMap?: Record<string, string> }) {
  const map: Record<string, string> = colorMap || {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Paid': 'bg-emerald-100 text-emerald-800',
    'Unpaid': 'bg-rose-100 text-rose-800',
    'Partial': 'bg-amber-100 text-amber-800',
  };
  
  const defaultColor = 'bg-gray-100 text-gray-800';
  const colorClass = map[status] || map[status.charAt(0).toUpperCase() + status.slice(1)] || defaultColor;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

// ----------------------------------------------------
// LIST PAGE
// ----------------------------------------------------

function ListPage({ config }: { config: CrudConfig }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const filteredData = config.mockData.filter(item => {
    if (!search) return true;
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full bg-gray-50/50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{config.moduleName}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your {config.moduleName.toLowerCase()}</p>
        </div>
        {!config.disableAdd && (
          <Link to={`${config.basePath}/add`}>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
              <Plus className="w-4 h-4" /> Add {config.entityName}
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50/30">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={`Search ${config.moduleName.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex items-center gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 w-full sm:w-auto">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 uppercase">
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 tracking-wider w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                {config.columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-[11px] font-bold text-gray-500 tracking-wider whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                {!config.disableAdd && !config.disableEdit && !config.disableDelete && (
                  <th className="px-4 py-3 text-[11px] font-bold text-gray-500 tracking-wider text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    {config.columns.map(col => {
                      const val = row[col.key];
                      return (
                        <td key={col.key} className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                          {col.type === 'badge' ? (
                            <StatusBadge status={String(val)} colorMap={col.badgeColors} />
                          ) : col.type === 'currency' ? (
                            `$${Number(val).toFixed(2)}`
                          ) : col.type === 'date' ? (
                            new Date(val).toLocaleDateString()
                          ) : (
                            <span className="font-medium">{val}</span>
                          )}
                        </td>
                      );
                    })}
                    {(!config.disableAdd || !config.disableEdit || !config.disableDelete) && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link to={`${config.basePath}/${row.id}`}>
                            <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                          </Link>
                          {!config.disableEdit && (
                            <Link to={`${config.basePath}/${row.id}/edit`}>
                              <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                            </Link>
                          )}
                          {!config.disableDelete && (
                            <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={config.columns.length + 2} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-8 h-8 text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-900">No records found</p>
                      <p className="text-xs mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 text-sm">
          <span className="text-gray-500">Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of {config.mockData.length} entries</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="px-2 h-8 rounded-lg text-gray-500 hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="px-3 h-8 rounded-lg border-gray-200">1</Button>
            <Button variant="ghost" size="sm" className="px-2 h-8 rounded-lg text-gray-500 hover:text-gray-900"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ADD / EDIT PAGE
// ----------------------------------------------------

function FormPage({ config, isEdit = false }: { config: CrudConfig, isEdit?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const initialData = isEdit ? config.mockData.find(item => String(item.id) === String(id)) : {};

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link to={config.basePath}>
          <button className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors bg-white border border-gray-200 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{isEdit ? 'Edit' : 'Add'} {config.entityName}</h1>
          <p className="text-sm text-gray-500 mt-1">{isEdit ? `Update existing ${config.entityName.toLowerCase()} details` : `Create a new ${config.entityName.toLowerCase()} record`}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.formFields.map(field => {
              if (field.type === 'section') {
                return (
                  <div key={field.key} className="col-span-1 md:col-span-2 lg:col-span-3 pb-2 mb-2 border-b border-gray-100 mt-4">
                    <h3 className="text-lg font-bold text-gray-900">{field.label}</h3>
                    {field.hint && <p className="text-sm text-gray-500 mt-1">{field.hint}</p>}
                  </div>
                );
              }

              const spanClasses = 
                field.colSpan === 1 ? 'col-span-1' :
                field.colSpan === 2 ? 'col-span-1 md:col-span-2' :
                field.colSpan === 3 ? 'col-span-1 md:col-span-2 lg:col-span-3' :
                field.colSpan === 4 ? 'col-span-1 md:col-span-2 lg:col-span-4' : // Fallback
                (field.type === 'textarea' || field.type === 'wysiwyg' || field.type === 'file') ? 'col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-1';

              if (field.type === 'checkbox') {
                return (
                  <div key={field.key} className={cn("flex flex-col justify-center", spanClasses)}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="flex h-6 items-center">
                        <input 
                          type="checkbox" 
                          defaultChecked={initialData?.[field.key] ? true : false}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                        {field.hint && <span className="text-xs text-gray-500 mt-0.5">{field.hint}</span>}
                      </div>
                    </label>
                  </div>
                )
              }

              return (
                <div key={field.key} className={cn("space-y-1.5", spanClasses)}>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.hint && (
                      <div className="group relative flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-[10px] font-bold cursor-help tooltip-trigger">
                          i
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 text-center">
                           {field.hint}
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {field.type === 'textarea' ? (
                    <textarea 
                      defaultValue={initialData?.[field.key] || ''}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[100px]"
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : field.type === 'wysiwyg' ? (
                    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1">
                        <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-serif font-bold cursor-not-allowed">B</div>
                        <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-serif italic cursor-not-allowed">I</div>
                        <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-serif underline cursor-not-allowed">U</div>
                      </div>
                      <textarea 
                        defaultValue={initialData?.[field.key] || ''}
                        className="w-full px-4 py-3 text-sm min-h-[150px] outline-none resize-y"
                        placeholder={field.placeholder || "Start typing..."}
                      />
                    </div>
                  ) : field.type === 'file' ? (
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <span className="text-gray-400">📄</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Drop files here to upload</p>
                      <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                    </div>
                  ) : field.type === 'select' ? (
                    <select 
                      defaultValue={initialData?.[field.key] || ''}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none"
                    >
                      <option value="">{field.placeholder || `Select ${field.label}...`}</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type={field.type}
                      defaultValue={initialData?.[field.key] || ''}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 bg-white hover:bg-gray-50 h-11 px-6 font-semibold" onClick={() => navigate(config.basePath)}>
            Cancel
          </Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 font-semibold flex items-center gap-2 shadow-sm" onClick={() => {
            alert("Mock save successful!");
            navigate(config.basePath);
          }}>
            <Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Save'} {config.entityName}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// VIEW PAGE
// ----------------------------------------------------

function ViewPage({ config }: { config: CrudConfig }) {
  const { id } = useParams();
  const data = config.mockData.find(item => String(item.id) === String(id)) || {};

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to={config.basePath}>
            <button className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors bg-white border border-gray-200 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{config.entityName} Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: #{id} • Viewing standard details</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <Link to={`${config.basePath}/${id}/edit`}>
             <Button variant="outline" className="rounded-xl bg-white border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
               <Edit className="w-4 h-4" /> Edit
             </Button>
           </Link>
           <Button variant="outline" className="rounded-xl bg-white border-gray-200 text-red-600 hover:bg-red-50 flex items-center gap-2">
             <Trash2 className="w-4 h-4" /> Delete
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">General Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                {config.formFields.filter(f => f.type !== 'section' && f.type !== 'wysiwyg' && f.type !== 'file' && f.type !== 'textarea').map(field => {
                  const val = data[field.key];
                  return (
                    <div key={field.key} className={field.colSpan && field.colSpan > 1 ? "sm:col-span-2" : "sm:col-span-1"}>
                      <dt className="text-sm font-medium text-gray-500 mb-1">{field.label}</dt>
                      <dd className="text-sm font-semibold text-gray-900 break-words">
                        {field.type === 'checkbox' ? (
                          val ? 'Yes' : 'No'
                        ) : field.type === 'number' && val !== undefined ? (
                          String(val)
                        ) : (
                          String(val || '-')
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
            
            {config.formFields.filter(f => f.type === 'wysiwyg' || f.type === 'textarea').map(field => {
              const val = data[field.key];
              if (!val) return null;
              return (
                <div key={field.key} className="border-t border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{field.label}</h3>
                  <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-xl">
                    {String(val)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Related Activity / Details</h2>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-gray-400">
               <MoreVertical className="w-8 h-8 mb-2 text-gray-300" />
               <p className="text-sm font-medium text-gray-600">No recent activity</p>
               <p className="text-xs mt-1 text-center max-w-xs">There are no related transactions or historical records for this {config.entityName.toLowerCase()} yet.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-5 border-b border-gray-100 bg-gray-50/50">
               <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Summary actions</h2>
             </div>
             <div className="p-4 space-y-2">
               <Button variant="outline" className="w-full justify-start text-left bg-gray-50 hover:bg-gray-100 border-transparent rounded-xl text-sm font-medium text-gray-700">Send Email Notification</Button>
               <Button variant="outline" className="w-full justify-start text-left bg-gray-50 hover:bg-gray-100 border-transparent rounded-xl text-sm font-medium text-gray-700">Export as PDF</Button>
               <Button variant="outline" className="w-full justify-start text-left bg-gray-50 hover:bg-gray-100 border-transparent rounded-xl text-sm font-medium text-gray-700">Print Details</Button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// WRAPPER MODULE
// ----------------------------------------------------

export function GenericCrudModule({ config }: { config: CrudConfig }) {
  return (
    <Routes>
      <Route path="/" element={<ListPage config={config} />} />
      <Route path="/add" element={<FormPage config={config} />} />
      <Route path="/:id" element={<ViewPage config={config} />} />
      <Route path="/:id/edit" element={<FormPage config={config} isEdit={true} />} />
    </Routes>
  );
}
