import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  FileCheck2, 
  History, 
  Plus, 
  Zap, 
  Download,
  Palette
} from 'lucide-react';
import { TabType, AppTheme } from '../types';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNewInvoice: () => void;
  onOpenNewQuote: () => void;
  onOpenNewMaterial: () => void;
  onOpenExportAllModal: () => void;
  selectedTheme: AppTheme;
  selectedLogo: string;
  onOpenThemeModal: () => void;
  onSelectTheme?: (theme: AppTheme) => void;
}

export const HeaderNavbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenNewInvoice,
  onOpenNewQuote,
  onOpenNewMaterial,
  onOpenExportAllModal,
  selectedTheme,
  selectedLogo,
  onOpenThemeModal,
  onSelectTheme
}) => {
  // Theme styling mapping
  const headerBg = {
    classic: 'bg-[#06315a] border-sky-900/60',
    electric: 'bg-sky-700 border-cyan-500/30',
    dark: 'bg-slate-950 border-slate-800',
    emerald: 'bg-emerald-900 border-emerald-800',
    amber: 'bg-amber-950 border-amber-800/80',
    midnight: 'bg-indigo-950 border-indigo-800/80',
    platinum: 'bg-slate-900 border-amber-400/40',
    cyberpunk: 'bg-black border-amber-500/80'
  }[selectedTheme] || 'bg-[#06315a] border-sky-900/60';

  const subBarBg = {
    classic: 'bg-[#042442] border-sky-900/80',
    electric: 'bg-sky-900 border-cyan-900/50',
    dark: 'bg-slate-900 border-slate-800',
    emerald: 'bg-emerald-950 border-emerald-900',
    amber: 'bg-amber-900/90 border-amber-950',
    midnight: 'bg-indigo-900 border-indigo-950',
    platinum: 'bg-slate-800 border-slate-700',
    cyberpunk: 'bg-zinc-900 border-amber-500/30'
  }[selectedTheme] || 'bg-[#042442] border-sky-900/80';

  const tabActiveStyle = {
    classic: 'bg-sky-600 text-white shadow-inner',
    electric: 'bg-cyan-600 text-white shadow-inner',
    dark: 'bg-amber-500 text-slate-950 font-black shadow-md',
    emerald: 'bg-emerald-600 text-white shadow-inner',
    amber: 'bg-amber-600 text-white shadow-inner',
    midnight: 'bg-indigo-600 text-white shadow-inner',
    platinum: 'bg-amber-400 text-slate-950 font-black shadow-md',
    cyberpunk: 'bg-amber-400 text-slate-950 font-black shadow-md'
  }[selectedTheme] || 'bg-sky-600 text-white shadow-inner';

  return (
    <header className={`${headerBg} text-white shadow-xl sticky top-0 z-30 border-b transition-colors duration-300`}>
      {/* Top corporate bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3.5">
            {/* Logo Button */}
            <button 
              onClick={onOpenThemeModal}
              title="Haz clic para personalizar el logotipo o tema de la app"
              className="relative group cursor-pointer focus:outline-none"
            >
              <div className="h-13 px-2 bg-white rounded-2xl border-2 border-amber-400 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden min-w-[52px]">
                <img 
                  src={selectedLogo} 
                  alt="EM SERVICIOS ELÉCTRICOS" 
                  className="h-10 w-auto object-contain max-w-[140px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/app-icon.jpg';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-[#06315a] shadow-xs">
                DTE
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-mono uppercase">
                  EM SERVICIOS ELÉCTRICOS
                </h1>
                <span className="bg-sky-900/80 text-sky-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-700/50 hidden sm:inline-block">
                  Panamá RUC 8-812-4910 DV 82
                </span>
              </div>
              <p className="text-xs text-sky-200/90 font-medium flex items-center gap-2 mt-0.5">
                <span>Instalaciones, Mantenimiento & Certificaciones Electrónicas DGI</span>
              </p>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={onOpenThemeModal}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-bold text-xs px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              title="Cambiar Tema Visual o Logo"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Tema / Logo</span>
            </button>

            <button
              onClick={onOpenNewInvoice}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg shadow-md hover:shadow-amber-400/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nueva Factura DTE</span>
            </button>

            <button
              onClick={onOpenNewQuote}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg border border-sky-400/30 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Cotización</span>
            </button>

            <button
              onClick={onOpenNewMaterial}
              className="bg-slate-800 hover:bg-slate-700 text-sky-100 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Material</span>
            </button>

            <button
              onClick={onOpenExportAllModal}
              className="bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-400/30 font-bold text-xs px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              title="Exportar Reportes PDF, Excel, Word"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className={`${subBarBg} border-t transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? tabActiveStyle
                  : 'text-sky-200/80 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-300" />
              Panel de Control (Dashboard)
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === 'invoices'
                  ? tabActiveStyle
                  : 'text-sky-200/80 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-300" />
              Facturación DTE
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === 'catalog'
                  ? tabActiveStyle
                  : 'text-sky-200/80 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-300" />
              Catálogo Novey / Cochez / Doit
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === 'quotes'
                  ? tabActiveStyle
                  : 'text-sky-200/80 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              Cotizaciones & Firma Digital
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? tabActiveStyle
                  : 'text-sky-200/80 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <History className="w-4 h-4 text-violet-300" />
              Historial & Evidencias
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

