import React from 'react';
import { Clock, DollarSign, FileCheck, Package, TrendingUp, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Invoice, Quote, Material, TabType } from '../types';

interface SummaryWidgetsProps {
  invoices: Invoice[];
  quotes: Quote[];
  materials: Material[];
  onNavigateTab?: (tab: TabType) => void;
}

export const SummaryWidgets: React.FC<SummaryWidgetsProps> = ({
  invoices,
  quotes,
  materials,
  onNavigateTab
}) => {
  // 1. Total Pending Invoices
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pendiente' || inv.status === 'Vencida');
  const totalPendingAmount = pendingInvoices.reduce((acc, inv) => acc + inv.total, 0);

  // 2. Total Monthly Revenue
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const monthlyInvoices = invoices.filter(inv => {
    if (!inv.date) return false;
    return inv.date.startsWith(currentYearMonth);
  });
  
  const monthlyCollectedRevenue = monthlyInvoices
    .filter(inv => inv.status === 'Pagada')
    .reduce((acc, inv) => acc + inv.total, 0);

  const totalAllTimeCollected = invoices
    .filter(inv => inv.status === 'Pagada')
    .reduce((acc, inv) => acc + inv.total, 0);

  // Fallback if no specific month matches, display total collected
  const displayMonthlyRevenue = monthlyCollectedRevenue > 0 ? monthlyCollectedRevenue : totalAllTimeCollected;
  const isCurrentMonth = monthlyCollectedRevenue > 0;

  // 3. Active Quotes Count
  const activeQuotes = quotes.filter(q => q.status === 'Enviada' || q.status === 'Borrador' || q.status === 'Aprobada');
  const activeQuotesValue = activeQuotes.reduce((acc, q) => acc + q.total, 0);

  // 4. Available Inventory Count
  const totalStockCount = materials.reduce((acc, m) => acc + (m.stock || 0), 0);
  const totalMaterialTypes = materials.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black font-mono tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          INDICADORES EN TIEMPO REAL (SUMMARY WIDGETS)
        </h3>
        <span className="text-[11px] font-bold text-slate-400">Actualizado al instante</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* WIDGET 1: Total Pending Invoices */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('invoices')}
          className="bg-amber-500/10 hover:bg-amber-500/15 border-2 border-amber-400/40 hover:border-amber-400 rounded-2xl p-4 transition-all shadow-sm cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wide text-amber-900">
                Facturas Pendientes
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="text-2xl font-black text-slate-900 font-mono">
              ${totalPendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-semibold">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              {pendingInvoices.length} {pendingInvoices.length === 1 ? 'factura por cobrar' : 'facturas por cobrar'}
            </span>
            <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* WIDGET 2: Total Monthly Revenue */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('invoices')}
          className="bg-emerald-500/10 hover:bg-emerald-500/15 border-2 border-emerald-400/40 hover:border-emerald-400 rounded-2xl p-4 transition-all shadow-sm cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wide text-emerald-900">
                {isCurrentMonth ? 'Ingresos del Mes' : 'Ingresos Cobrados'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="text-2xl font-black text-emerald-950 font-mono">
              ${displayMonthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900 font-semibold">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              {invoices.filter(i => i.status === 'Pagada').length} cobradas
            </span>
            <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* WIDGET 3: Active Quotes Count */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('quotes')}
          className="bg-sky-500/10 hover:bg-sky-500/15 border-2 border-sky-400/40 hover:border-sky-400 rounded-2xl p-4 transition-all shadow-sm cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wide text-sky-900">
                Cotizaciones Activas
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#06315a] text-white flex items-center justify-center font-bold shadow-xs">
                <FileCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="text-2xl font-black text-slate-900 font-mono">
              {activeQuotes.length} <span className="text-xs font-sans font-normal text-slate-500">activas</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs text-sky-900 font-semibold">
            <span>Valor: ${activeQuotesValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <ChevronRight className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* WIDGET 4: Available Inventory Count */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('catalog')}
          className="bg-violet-500/10 hover:bg-violet-500/15 border-2 border-violet-400/40 hover:border-violet-400 rounded-2xl p-4 transition-all shadow-sm cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wide text-violet-900">
                Inventario Disponible
              </span>
              <div className="w-8 h-8 rounded-xl bg-violet-700 text-white flex items-center justify-center font-bold shadow-xs">
                <Package className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="text-2xl font-black text-slate-900 font-mono">
              {totalStockCount.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">unidades</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-violet-200/60 flex items-center justify-between text-xs text-violet-900 font-semibold">
            <span>{totalMaterialTypes} tipos de insumos</span>
            <ChevronRight className="w-4 h-4 text-violet-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
};
