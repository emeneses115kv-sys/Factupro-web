import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  FileCheck, 
  Package, 
  Download, 
  ArrowUpRight, 
  TrendingUp, 
  Zap, 
  Building,
  ChevronRight,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  Plus,
  LayoutGrid,
  BarChart3,
  GitMerge,
  Columns,
  Sparkles,
  Users,
  Camera,
  Search,
  Check,
  X,
  FileCode,
  Shield,
  Layers,
  Palette
} from 'lucide-react';
import { Invoice, Quote, Material, TabType, DashboardMode, FavoriteClient, AppTheme } from '../types';
import { exportInvoicesToExcel, exportInvoiceToPDF, exportQuoteToPDF } from '../utils/exportUtils';
import { SummaryWidgets } from './SummaryWidgets';

interface Props {
  invoices: Invoice[];
  quotes: Quote[];
  materials: Material[];
  setActiveTab: (tab: TabType) => void;
  onOpenNewInvoice: () => void;
  onOpenNewQuote: () => void;
  onOpenNewMaterial: () => void;
  onOpenExportAllModal: () => void;
  onSelectInvoice: (inv: Invoice) => void;
  onSelectQuote: (q: Quote) => void;
  onClearAllData?: () => void;
  onRestoreSampleData?: () => void;
  currentMode?: DashboardMode;
  onModeChange?: (mode: DashboardMode) => void;
  selectedTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
}

export const Dashboard: React.FC<Props> = ({
  invoices,
  quotes,
  materials,
  setActiveTab,
  onOpenNewInvoice,
  onOpenNewQuote,
  onOpenNewMaterial,
  onOpenExportAllModal,
  onSelectInvoice,
  onSelectQuote,
  onClearAllData,
  onRestoreSampleData,
  currentMode,
  onModeChange,
  selectedTheme = 'classic',
  onSelectTheme
}) => {
  const [activeMode, setActiveMode] = useState<DashboardMode>(() => {
    if (currentMode) return currentMode;
    return (localStorage.getItem('em_dashboard_mode') as DashboardMode) || 'executive';
  });

  const handleSelectMode = (mode: DashboardMode) => {
    setActiveMode(mode);
    localStorage.setItem('em_dashboard_mode', mode);
    if (onModeChange) onModeChange(mode);
  };

  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalSubtotal = invoices.reduce((acc, inv) => acc + inv.subtotal, 0);
  const totalITBMS = invoices.reduce((acc, inv) => acc + inv.taxAmount, 0);
  
  const totalCollected = invoices
    .filter(inv => inv.status === 'Pagada')
    .reduce((acc, inv) => acc + inv.total, 0);
    
  const totalPending = invoices
    .filter(inv => inv.status === 'Pendiente' || inv.status === 'Vencida')
    .reduce((acc, inv) => acc + inv.total, 0);

  const pendingInvoices = invoices.filter(inv => inv.status === 'Pendiente' || inv.status === 'Vencida');

  const approvedQuotesCount = quotes.filter(q => q.status === 'Aprobada').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'Enviada' || q.status === 'Borrador').length;
  const totalQuotesValue = quotes.reduce((acc, q) => acc + q.total, 0);

  const noveyCount = materials.filter(m => m.provider === 'Novey').length;
  const cochezCount = materials.filter(m => m.provider === 'Cochez').length;
  const doitCount = materials.filter(m => m.provider === 'Doit Center').length;

  const collectionEfficiency = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const avgInvoiceValue = invoices.length > 0 ? (totalBilled / invoices.length) : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 6 DASHBOARD MODE SELECTOR CONTROL BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 px-2">
            <Layers className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-black font-mono tracking-tight uppercase text-amber-400 block">
                VISTAS Y PANELES DE CONTROL (6 OPCIONES)
              </span>
              <p className="text-[11px] text-slate-300">
                Selecciona la disposición de pantalla ideal para tu flujo operativo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 w-full md:w-auto">
            
            {/* Mode 1: Executive */}
            <button
              onClick={() => handleSelectMode('executive')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'executive'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Panel Clásico Ejecutivo con KPIs y tablas completas"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1. Ejecutivo</span>
            </button>

            {/* Mode 2: Compact Operations Grid */}
            <button
              onClick={() => handleSelectMode('compact')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'compact'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Matriz de 6 Tarjetas Operativas Tácticas"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>2. Matriz Grid</span>
            </button>

            {/* Mode 3: Financial Focus */}
            <button
              onClick={() => handleSelectMode('financial')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'financial'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Enfoque Analítico Financiero y Tributario ITBMS 7%"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>3. Financiero</span>
            </button>

            {/* Mode 4: Workflow Step-by-Step */}
            <button
              onClick={() => handleSelectMode('workflow')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'workflow'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Flujo de Trabajo Paso a Paso por Obras Eléctricas"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>4. Flujo Obra</span>
            </button>

            {/* Mode 5: Sidebar Layout */}
            <button
              onClick={() => handleSelectMode('sidebar')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'sidebar'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Barra Táctica Lateral con Acceso Rápido a Clientes"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>5. Barra Lateral</span>
            </button>

            {/* Mode 6: Minimalist DGI */}
            <button
              onClick={() => handleSelectMode('minimal')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'minimal'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Resumen Minimalista de Cumplimiento DTE Panamá"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>6. Minimal DGI</span>
            </button>

          </div>

        </div>

        {/* Theme Quick Selector Row */}
        {onSelectTheme && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>ESTILO Y TEMA VISUAL DEL DESPLIEGUE:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'classic', label: 'Azul DGI Clásico', color: 'bg-[#06315a]' },
                { id: 'electric', label: 'Azul Neón', color: 'bg-sky-500' },
                { id: 'dark', label: 'Oscuro Industrial', color: 'bg-slate-950 border border-slate-600' },
                { id: 'emerald', label: 'Verde Eco-Volt', color: 'bg-emerald-700' },
                { id: 'amber', label: 'Cobre Alto Voltaje', color: 'bg-amber-700' },
                { id: 'midnight', label: 'Azul Noche', color: 'bg-indigo-900' },
                { id: 'platinum', label: 'Platino', color: 'bg-slate-300 text-slate-900' },
                { id: 'cyberpunk', label: 'Cyber Gold', color: 'bg-amber-400 text-slate-950 font-black' }
              ].map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => onSelectTheme(thm.id as AppTheme)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedTheme === thm.id
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-2 ring-amber-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Cambiar a Tema ${thm.label}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${thm.color}`}></span>
                  <span>{thm.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SUMMARY WIDGETS COMPONENT WITH REAL-TIME METRICS */}
      <SummaryWidgets
        invoices={invoices}
        quotes={quotes}
        materials={materials}
        onNavigateTab={setActiveTab}
      />

      {/* ========================================================================= */}
      {/* MODE 1: EXECUTIVE CLASSIC DASHBOARD (Clásico Ejecutivo)                   */}
      {/* ========================================================================= */}
      {activeMode === 'executive' && (
        <div className="space-y-6">
          {/* Welcome & Quick Action Hero Section */}
          <div className="bg-gradient-to-r from-[#06315a] via-[#0a4278] to-[#042442] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-sky-800/40">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
              <Zap className="w-96 h-96 text-amber-400 stroke-1" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                Panel Ejecutivo EM Servicios Eléctricos Panamá
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono uppercase">
                RESUMEN FINANCIERO Y OPERATIVO
              </h2>
              <p className="text-sm text-sky-100/90 mt-2 max-w-2xl">
                Monitoreo en tiempo real de facturación electrónica DTE, cotizaciones autorizadas e inventario multiproveedor (Novey, Cochez y Doit Center).
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenNewInvoice}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Crear Factura DTE</span>
                </button>

                <button
                  onClick={onOpenNewQuote}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border border-sky-300/30 active:scale-95"
                >
                  <FileCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Nueva Cotización</span>
                </button>

                <button
                  onClick={onOpenExportAllModal}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border border-white/20 backdrop-blur-xs"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Exportar Reportes</span>
                </button>

                {onClearAllData && (
                  <button
                    onClick={onClearAllData}
                    className="bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-red-500/30 ml-auto"
                    title="Elimina todas las facturas y cotizaciones ingresadas"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Limpiar Registros</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Facturado</span>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#06315a] flex items-center justify-center border border-sky-100">
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-bold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {invoices.length}
                </span>
                <span>Facturas DTE</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cobrado (Efectivo/Yappy)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {invoices.filter(i => i.status === 'Pagada').length} Facturas pagadas
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Por Cobrar</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono">
                ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-amber-700/80 mt-1 font-medium">
                {pendingInvoices.length} Facturas pendientes
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cotizaciones</span>
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center border border-violet-100">
                  <FileCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ${totalQuotesValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-emerald-600 font-bold">{approvedQuotesCount} Aprobadas</span> · {pendingQuotesCount} Pendientes
              </p>
            </div>
          </div>

          {/* Provider Stock & Quote conversions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#06315a]" />
                    Catálogo Multiproveedor Integrado (Panamá)
                  </h3>
                  <p className="text-xs text-slate-500">Inventario cargado de Novey, Cochez y Doit Center</p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-bold text-[#06315a] hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Catálogo Completo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-900 uppercase">NOVEY</span>
                    <p className="text-lg font-black text-red-950 font-mono mt-0.5">{noveyCount} Productos</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">N</div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-900 uppercase">COCHEZ</span>
                    <p className="text-lg font-black text-blue-950 font-mono mt-0.5">{cochezCount} Productos</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center">C</div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 uppercase">DOIT CENTER</span>
                    <p className="text-lg font-black text-amber-950 font-mono mt-0.5">{doitCount} Productos</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">D</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-500" />
                  Conversión a Factura DTE
                </h3>
                <div className="space-y-3 mt-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Aprobadas con Firma</span>
                      <span className="text-emerald-600 font-bold">{approvedQuotesCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${quotes.length ? (approvedQuotesCount/quotes.length)*100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('quotes')}
                className="w-full mt-5 bg-[#06315a] hover:bg-sky-900 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Gestionar Cotizaciones</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: COMPACT OPERATIONS GRID (Matriz Operativa)                       */}
      {/* ========================================================================= */}
      {activeMode === 'compact' && (
        <div className="space-y-6">
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase font-mono">
                  MATRIZ OPERATIVA DE 6 MÓDULOS EN UN CLIC
                </h3>
                <p className="text-xs text-slate-600">Acceso inmediato a los 6 centros de control del sistema eléctrico.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Tile 1: Facturación DTE */}
            <div className="bg-white rounded-2xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#06315a] text-white flex items-center justify-center shadow-md">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="bg-sky-100 text-sky-900 text-xs font-black px-2.5 py-1 rounded-full">
                    {invoices.length} Emisiones
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 font-mono uppercase">1. FACTURACIÓN DTE</h4>
                <p className="text-xs text-slate-600 mt-1">Facturas electrónicas validadas por DGI Panamá con código CAFE.</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Facturado: <strong>${totalBilled.toFixed(2)}</strong></p>
                  <p>Por cobrar: <span className="text-amber-600 font-bold">${totalPending.toFixed(2)}</span></p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="grow bg-[#06315a] text-white font-extrabold text-xs py-2.5 rounded-xl hover:bg-sky-900 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ver Facturas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenNewInvoice}
                  className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-2.5 rounded-xl hover:bg-amber-300 cursor-pointer"
                  title="Nueva Factura"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tile 2: Cotizaciones & Firma */}
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-100 hover:border-amber-300 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                    <FileCheck className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-full">
                    {quotes.length} Presupuestos
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 font-mono uppercase">2. COTIZACIONES & FIRMA</h4>
                <p className="text-xs text-slate-600 mt-1">Presupuestos de mano de obra e insumos con captura de firma táctil.</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Aprobadas: <strong className="text-emerald-600">{approvedQuotesCount}</strong></p>
                  <p>Monto Total: <strong>${totalQuotesValue.toFixed(2)}</strong></p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('quotes')}
                  className="grow bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl hover:bg-amber-300 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ver Cotizaciones</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenNewQuote}
                  className="bg-[#06315a] text-white font-black text-xs px-3 py-2.5 rounded-xl hover:bg-sky-900 cursor-pointer"
                  title="Nueva Cotización"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tile 3: Catálogo Insumos */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 hover:border-emerald-300 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-full">
                    {materials.length} Insumos
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 font-mono uppercase">3. CATÁLOGO INSUMOS</h4>
                <p className="text-xs text-slate-600 mt-1">Precios en tiempo real de Novey, Cochez y Doit Center Panamá.</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Novey: <strong>{noveyCount}</strong> · Cochez: <strong>{cochezCount}</strong></p>
                  <p>Doit Center: <strong>{doitCount}</strong></p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="grow bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Abrir Catálogo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenNewMaterial}
                  className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-2.5 rounded-xl hover:bg-emerald-200 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tile 4: Evidencias Fotográficas */}
            <div className="bg-white rounded-2xl p-6 border-2 border-violet-100 hover:border-violet-300 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-700 text-white flex items-center justify-center shadow-md">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="bg-violet-100 text-violet-900 text-xs font-black px-2.5 py-1 rounded-full">
                    Garantía
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 font-mono uppercase">4. EVIDENCIAS & RECIBOS</h4>
                <p className="text-xs text-slate-600 mt-1">Captura de fotos antes/después del trabajo y recibos físicos de pago.</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p>Soporte técnico para garantías de 30 días.</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('history')}
                className="w-full mt-6 bg-violet-700 text-white font-black text-xs py-2.5 rounded-xl hover:bg-violet-600 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Ver Evidencias</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tile 5: Exportación DGI */}
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-slate-400 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-full">
                    DGI Export
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 font-mono uppercase">5. REPORTES DGI & EXCEL</h4>
                <p className="text-xs text-slate-600 mt-1">Exportación masiva de registros a Excel, Word y PDF certificado.</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p>Formato compatible con contabilidad fiscal Panamá.</p>
                </div>
              </div>

              <button
                onClick={onOpenExportAllModal}
                className="w-full mt-6 bg-slate-900 text-amber-300 font-black text-xs py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Exportar Todo</span>
              </button>
            </div>

            {/* Tile 6: Clientes Frecuentes */}
            <div className="bg-white rounded-2xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="bg-sky-100 text-sky-900 text-xs font-black px-2.5 py-1 rounded-full">
                    RUC Directo
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 font-mono uppercase">6. CLIENTES FRECUENTES</h4>
                <p className="text-xs text-slate-600 mt-1">Directorio de RUCs, correos y direcciones de clientes habituales.</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p>Auto-completado express en facturas.</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('invoices')}
                className="w-full mt-6 bg-sky-700 text-white font-black text-xs py-2.5 rounded-xl hover:bg-sky-600 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Gestión en Facturación</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: FINANCIAL & DGI TAX ANALYTICS (Análisis Financiero)              */}
      {/* ========================================================================= */}
      {activeMode === 'financial' && (
        <div className="space-y-6">
          <div className="bg-[#06315a] text-white rounded-2xl p-6 border border-sky-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-amber-400" />
                <div>
                  <h3 className="text-xl font-black font-mono tracking-tight text-white uppercase">
                    ANÁLISIS FINANCIERO Y TRIBUTARIO ITBMS (7%)
                  </h3>
                  <p className="text-xs text-sky-200">
                    Desglose de base imponible, impuesto recaudado DGI y eficiencia de cobro.
                  </p>
                </div>
              </div>

              <button
                onClick={() => exportInvoicesToExcel(invoices)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar Reporte Fiscal Excel</span>
              </button>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-sky-950/80 p-4 rounded-xl border border-sky-700/50">
                <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">BASE IMPONIBLE SUBTOTAL</span>
                <p className="text-2xl font-black text-white font-mono mt-1">${totalSubtotal.toFixed(2)}</p>
                <p className="text-[10px] text-sky-300 mt-1">Monto sin impuesto</p>
              </div>

              <div className="bg-sky-950/80 p-4 rounded-xl border border-sky-700/50">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">ITBMS RECAUDADO (7%)</span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-1">${totalITBMS.toFixed(2)}</p>
                <p className="text-[10px] text-sky-300 mt-1">Tributo a declarar DGI</p>
              </div>

              <div className="bg-sky-950/80 p-4 rounded-xl border border-sky-700/50">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">COBRADO EFECTIVO</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">${totalCollected.toFixed(2)}</p>
                <p className="text-[10px] text-emerald-300 mt-1">Tasa cobro: {collectionEfficiency}%</p>
              </div>

              <div className="bg-sky-950/80 p-4 rounded-xl border border-sky-700/50">
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">PROMEDIO POR FACTURA</span>
                <p className="text-2xl font-black text-white font-mono mt-1">${avgInvoiceValue.toFixed(2)}</p>
                <p className="text-[10px] text-sky-300 mt-1">Ticket promedio obra</p>
              </div>
            </div>
          </div>

          {/* Pending Receivables Detailed Action Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3 font-mono uppercase">
              <Clock className="w-5 h-5 text-amber-600" />
              CUENTAS POR COBRAR Y FACTURAS PENDIENTES (${totalPending.toFixed(2)})
            </h4>

            {pendingInvoices.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                ¡Felicidades! No hay facturas pendientes por cobrar en este momento.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingInvoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-[#06315a] font-mono">{inv.invoiceNumber} — {inv.clientName}</p>
                      <p className="text-slate-500">Fecha: {inv.date} · Vence: {inv.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-slate-900 text-sm">${inv.total.toFixed(2)}</p>
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="text-amber-600 hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Gestionar Cobro DTE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: WORKFLOW STEP-BY-STEP (Flujo de Trabajo por Obras)              */}
      {/* ========================================================================= */}
      {activeMode === 'workflow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <GitMerge className="w-7 h-7 text-[#06315a]" />
              <div>
                <h3 className="text-lg font-black text-slate-900 font-mono uppercase">
                  FLUJO DE TRABAJO TÉCNICO PASO A PASO
                </h3>
                <p className="text-xs text-slate-500">
                  Sigue la secuencia reglamentaria para cada proyecto eléctrico en Panamá.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              
              {/* Step 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-[#06315a] text-white text-xs font-black flex items-center justify-center">1</span>
                <h5 className="font-extrabold text-xs text-slate-900">COTIZAR OBRA</h5>
                <p className="text-[11px] text-slate-500">Crear presupuesto con mano de obra e insumos.</p>
                <button
                  onClick={onOpenNewQuote}
                  className="w-full mt-2 bg-sky-600 text-white font-bold text-[10px] py-1.5 rounded-lg cursor-pointer hover:bg-sky-500"
                >
                  + Nueva Cotización
                </button>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">2</span>
                <h5 className="font-extrabold text-xs text-slate-900">SELECCIÓN INSUMOS</h5>
                <p className="text-[11px] text-slate-500">Consultar precios de Novey, Cochez o Doit.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="w-full mt-2 bg-emerald-700 text-white font-bold text-[10px] py-1.5 rounded-lg cursor-pointer hover:bg-emerald-600"
                >
                  Ver Catálogo
                </button>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center">3</span>
                <h5 className="font-extrabold text-xs text-slate-900">EVIDENCIA TÉCNICA</h5>
                <p className="text-[11px] text-slate-500">Tomar fotos del tablero / medidor antes/después.</p>
                <button
                  onClick={() => setActiveTab('history')}
                  className="w-full mt-2 bg-violet-700 text-white font-bold text-[10px] py-1.5 rounded-lg cursor-pointer hover:bg-violet-600"
                >
                  Adjuntar Foto
                </button>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">4</span>
                <h5 className="font-extrabold text-xs text-slate-900">FACTURA DTE DGI</h5>
                <p className="text-[11px] text-slate-500">Generar documento electrónico con código CAFE.</p>
                <button
                  onClick={onOpenNewInvoice}
                  className="w-full mt-2 bg-amber-400 text-slate-950 font-bold text-[10px] py-1.5 rounded-lg cursor-pointer hover:bg-amber-300"
                >
                  + Emitir DTE
                </button>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center">5</span>
                <h5 className="font-extrabold text-xs text-slate-900">COBRO & RECIBO</h5>
                <p className="text-[11px] text-slate-500">Registrar pago por Yappy, ACH o Efectivo.</p>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="w-full mt-2 bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Capturar Pago
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 5: TACTICAL SIDEBAR LAYOUT (Barra Lateral Táctica)                  */}
      {/* ========================================================================= */}
      {activeMode === 'sidebar' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Tactical Left Drawer */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-5">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2 text-[#06315a] font-extrabold text-sm">
              <Columns className="w-4 h-4" />
              <span>BARRA TÁCTICA</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={onOpenNewInvoice}
                className="w-full text-left p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-between cursor-pointer shadow-xs"
              >
                <span>+ Factura DTE Rápida</span>
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenNewQuote}
                className="w-full text-left p-3 rounded-xl bg-[#06315a] hover:bg-sky-900 text-white font-bold text-xs flex items-center justify-between cursor-pointer"
              >
                <span>+ Cotización Express</span>
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenNewMaterial}
                className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-between cursor-pointer"
              >
                <span>+ Nuevo Insumo</span>
                <Package className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">PROVEEDORES RÁPIDOS</span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="flex justify-between"><span>Novey Panamá:</span> <strong>{noveyCount} ítems</strong></p>
                <p className="flex justify-between"><span>Cochez y Cía:</span> <strong>{cochezCount} ítems</strong></p>
                <p className="flex justify-between"><span>Doit Center:</span> <strong>{doitCount} ítems</strong></p>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Facturado</span>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">${totalBilled.toFixed(2)}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-emerald-600 uppercase">Cobrado</span>
                <p className="text-2xl font-black text-emerald-700 font-mono mt-1">${totalCollected.toFixed(2)}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-amber-600 uppercase">Por Cobrar</span>
                <p className="text-2xl font-black text-amber-600 font-mono mt-1">${totalPending.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 font-mono uppercase mb-3">
                REGISTROS RECIENTES EM EMISIONES
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {invoices.slice(0, 5).map(inv => (
                  <div key={inv.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#06315a] font-mono">{inv.invoiceNumber} — {inv.clientName}</p>
                      <p className="text-slate-500">{inv.date}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">${inv.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 6: MINIMALIST DGI COMPLIANCE (Minimalista DGI)                     */}
      {/* ========================================================================= */}
      {activeMode === 'minimal' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-mono uppercase tracking-tight">
                  PANEL MINIMALISTA DTE DGI
                </h3>
                <p className="text-xs text-slate-600">Vista ultralimpia de alta velocidad para facturación en sitio.</p>
              </div>
            </div>

            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
              PAC AUTORIZADO ACTIVO
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-slate-500 uppercase">Facturas</span>
              <p className="text-xl font-black text-slate-900 font-mono mt-1">{invoices.length}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-slate-500 uppercase">Total</span>
              <p className="text-xl font-black text-slate-900 font-mono mt-1">${totalBilled.toFixed(0)}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-emerald-700 uppercase">Cobrado</span>
              <p className="text-xl font-black text-emerald-700 font-mono mt-1">${totalCollected.toFixed(0)}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-amber-700 uppercase">Pendiente</span>
              <p className="text-xl font-black text-amber-700 font-mono mt-1">${totalPending.toFixed(0)}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={onOpenNewInvoice}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Crear Factura DTE</span>
            </button>

            <button
              onClick={onOpenNewQuote}
              className="bg-[#06315a] hover:bg-sky-900 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Cotización</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
