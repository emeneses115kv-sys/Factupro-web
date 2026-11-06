import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Plus, 
  PenTool, 
  Check, 
  Download, 
  FileCode, 
  Sparkles, 
  Trash2, 
  Zap, 
  Clock, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Star,
  Printer,
  Search,
  FileText,
  Package,
  Tag,
  Filter,
  ShoppingBag,
  X,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quote, InvoiceItem, Material, Invoice, FavoriteClient } from '../types';
import { DigitalSignaturePad } from './DigitalSignaturePad';
import { exportQuoteToPDF, exportQuoteToWord } from '../utils/exportUtils';
import { PrintDocumentModal } from './PrintDocumentModal';

interface Props {
  quotes: Quote[];
  materials: Material[];
  favoriteClients?: FavoriteClient[];
  favoriteMaterialIds?: string[];
  onAddQuote: (quote: Quote) => void;
  onDeleteQuote?: (id: string) => void;
  onApproveAndConvertToInvoice: (quote: Quote) => void;
  onUpdateQuote: (quote: Quote) => void;
  onToggleFavoriteQuote?: (id: string) => void;
  onCloseSection?: () => void;
}

export const QuoteSystem: React.FC<Props> = ({
  quotes,
  materials,
  favoriteClients = [],
  favoriteMaterialIds = [],
  onAddQuote,
  onDeleteQuote,
  onApproveAndConvertToInvoice,
  onUpdateQuote,
  onToggleFavoriteQuote,
  onCloseSection
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [printableQuote, setPrintableQuote] = useState<Quote | null>(null);
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Aprobada' | 'Enviada' | 'Borrador' | 'Favoritas'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Supplier Search Modal State
  const [isSupplierSearchOpen, setIsSupplierSearchOpen] = useState(false);
  const [searchSupplierQuery, setSearchSupplierQuery] = useState('');
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState<string>('Todos');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas');
  const [addedNoticeMatId, setAddedNoticeMatId] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Form State with draft auto-save initialization
  const [clientName, setClientName] = useState(() => {
    try {
      const draft = localStorage.getItem('em_quote_draft');
      if (draft) return JSON.parse(draft).clientName || '';
    } catch (e) {}
    return '';
  });

  const [clientRuc, setClientRuc] = useState(() => {
    try {
      const draft = localStorage.getItem('em_quote_draft');
      if (draft) return JSON.parse(draft).clientRuc || '';
    } catch (e) {}
    return '';
  });

  const [clientEmail, setClientEmail] = useState(() => {
    try {
      const draft = localStorage.getItem('em_quote_draft');
      if (draft) return JSON.parse(draft).clientEmail || '';
    } catch (e) {}
    return '';
  });

  const [clientPhone, setClientPhone] = useState(() => {
    try {
      const draft = localStorage.getItem('em_quote_draft');
      if (draft) return JSON.parse(draft).clientPhone || '';
    } catch (e) {}
    return '';
  });

  const [projectAddress, setProjectAddress] = useState(() => {
    try {
      const draft = localStorage.getItem('em_quote_draft');
      if (draft) return JSON.parse(draft).projectAddress || '';
    } catch (e) {}
    return '';
  });

  const [validityDays, setValidityDays] = useState<number>(15);
  const [laborCost, setLaborCost] = useState<number>(180);
  const [notes, setNotes] = useState('');
  const [signatureData, setSignatureData] = useState<string>('');

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    try {
      const draft = localStorage.getItem('em_quote_draft');
      if (draft && JSON.parse(draft).items?.length > 0) return JSON.parse(draft).items;
    } catch (e) {}
    return [
      {
        id: 'qitem-init-1',
        description: 'Breaker Termomagnético Square D 1P 20A',
        unit: 'unidad',
        quantity: 4,
        unitPrice: 7.95,
        totalPrice: 31.80
      }
    ];
  });

  // Auto-save quote draft to localStorage
  useEffect(() => {
    if (isCreating) {
      const draft = { clientName, clientRuc, clientEmail, clientPhone, projectAddress, items };
      localStorage.setItem('em_quote_draft', JSON.stringify(draft));
    }
  }, [isCreating, clientName, clientRuc, clientEmail, clientPhone, projectAddress, items]);

  // Calculations
  const materialsSubtotal = items.reduce((acc, it) => acc + it.totalPrice, 0);
  const subtotal = materialsSubtotal + Number(laborCost || 0);
  const taxAmount = subtotal * 0.07; // ITBMS 7%
  const total = subtotal + taxAmount;

  const addItemFromCatalog = (mat: Material, customQty?: number) => {
    const qty = customQty || itemQuantities[mat.id] || 1;
    const newItem: InvoiceItem = {
      id: `qitem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      materialId: mat.id,
      description: `[${mat.provider}] ${mat.name} (${mat.code})`,
      unit: mat.unit,
      quantity: qty,
      unitPrice: mat.publicPrice,
      totalPrice: Number((mat.publicPrice * qty).toFixed(2))
    };
    setItems(prev => [...prev, newItem]);
    setAddedNoticeMatId(mat.id);
    setTimeout(() => setAddedNoticeMatId(null), 1800);
  };

  const addCustomItem = () => {
    const newItem: InvoiceItem = {
      id: `qitem-${Date.now()}-${Math.random()}`,
      description: 'Material / Insumo adicional',
      unit: 'unidad',
      quantity: 1,
      unitPrice: 25.00,
      totalPrice: 25.00
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        const q = field === 'quantity' ? Number(value) : item.quantity;
        const p = field === 'unitPrice' ? Number(value) : item.unitPrice;
        updated.totalPrice = (isNaN(q) ? 0 : q) * (isNaN(p) ? 0 : p);
      }
      return updated;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || items.length === 0) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const validUntilDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      quoteNumber: `COT-2026-${randomNum}`,
      date: new Date().toISOString().slice(0, 10),
      validityDays,
      validUntil: validUntilDate,
      clientName,
      clientRuc: clientRuc || '8-NT-000 DV 00',
      clientEmail: clientEmail || 'contacto@cliente.pa',
      clientPhone: clientPhone || '+507 6000-0000',
      projectAddress: projectAddress || 'Ciudad de Panamá',
      items,
      laborCost: Number(laborCost),
      subtotal,
      taxAmount,
      total,
      status: signatureData ? 'Aprobada' : 'Enviada',
      clientSignature: signatureData || undefined,
      notes
    };

    onAddQuote(newQuote);
    setIsCreating(false);
    localStorage.removeItem('em_quote_draft');

    // Reset Form
    setClientName('');
    setClientRuc('');
    setClientEmail('');
    setClientPhone('');
    setProjectAddress('');
    setSignatureData('');
    setNotes('');

    try {
      confetti({ particleCount: 70, spread: 50 });
    } catch (e) {}
  };

  const handleSaveSignatureForExistingQuote = (q: Quote, sig: string) => {
    const updated: Quote = {
      ...q,
      clientSignature: sig,
      status: sig ? 'Aprobada' : q.status
    };
    onUpdateQuote(updated);
    if (selectedQuote && selectedQuote.id === q.id) {
      setSelectedQuote(updated);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#06315a] font-mono tracking-tight uppercase">
              SISTEMA DE COTIZACIONES Y FIRMA DIGITAL
            </h2>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Aprobación In Situ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Presupuestos desglosados (Mano de Obra + Materiales), firma interactiva del cliente y conversión en 1-clic a Factura DTE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Cotización</span>
          </button>

          {onCloseSection && (
            <button
              onClick={onCloseSection}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-300"
              title="Cerrar esta sección y volver al Panel de Control"
            >
              <XCircle className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Cerrar Ventana</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Choice Buttons & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['Todas', 'Aprobada', 'Enviada', 'Borrador', 'Favoritas'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeFilter === filter
                  ? 'bg-[#06315a] text-white shadow-xs ring-1 ring-sky-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter === 'Todas' && <FileText className="w-3.5 h-3.5 text-sky-400" />}
              {filter === 'Aprobada' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              {filter === 'Enviada' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
              {filter === 'Borrador' && <PenTool className="w-3.5 h-3.5 text-slate-500" />}
              {filter === 'Favoritas' && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
              <span>{filter === 'Todas' ? 'Todas las Cotizaciones' : filter}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, RUC o N°..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06315a]"
          />
        </div>

      </div>

      {/* Quote List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotes.filter((q) => {
          if (activeFilter === 'Favoritas' && !q.isFavorite) return false;
          const matchesFilter = activeFilter === 'Todas' || activeFilter === 'Favoritas' || q.status === activeFilter;
          const matchesSearch = q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                q.clientRuc.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesFilter && matchesSearch;
        }).map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-bold text-[#06315a] font-mono">{q.quoteNumber}</span>
                  <p className="text-[10px] text-slate-400">Emisión: {q.date} · Válido {q.validityDays} días</p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  q.status === 'Aprobada'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : q.status === 'Enviada'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {q.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{q.clientName}</h3>
              <p className="text-xs text-slate-500">{q.projectAddress}</p>

              {/* Cost breakdown */}
              <div className="my-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Materiales ({q.items.length}):</span>
                  <span className="font-mono">${(q.subtotal - q.laborCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mano de Obra:</span>
                  <span className="font-mono">${q.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Estima (con ITBMS 7%):</span>
                  <span className="font-mono text-amber-600">${q.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Signature Indicator */}
              {q.clientSignature ? (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Firma Digital Autorizada</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pendiente de Firma del Cliente</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedQuote(q)}
                className="bg-sky-50 text-[#06315a] hover:bg-sky-100 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Ver / Firmar</span>
              </button>

              {q.status === 'Aprobada' && (
                <button
                  onClick={() => onApproveAndConvertToInvoice(q)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Convertir a Factura</span>
                </button>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPrintableQuote(q)}
                  className="p-1.5 text-slate-700 hover:text-sky-900 bg-slate-100 hover:bg-amber-100 rounded-lg transition cursor-pointer font-bold text-xs flex items-center gap-1"
                  title="Vista de Impresión Oficial"
                >
                  <Printer className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => exportQuoteToPDF(q)}
                  className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                  title="Exportar a PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportQuoteToWord(q)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  title="Exportar a Word"
                >
                  <FileCode className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE QUOTE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-500" />
                  Presupuesto Eléctrico Profesional
                </span>
                <h3 className="text-xl font-black text-[#06315a] font-mono">
                  CREAR COTIZACIÓN DE PROYECTO
                </h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 p-2 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-6">
              
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Cliente / Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Plaza Multicentro Marbella"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RUC / Cédula</label>
                  <input
                    type="text"
                    placeholder="Ej. 9821034-2-2018 DV 15"
                    value={clientRuc}
                    onChange={(e) => setClientRuc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ubicación del Trabajo / Proyecto</label>
                  <input
                    type="text"
                    placeholder="Ej. Calle 50 y Marbella, Local #12"
                    value={projectAddress}
                    onChange={(e) => setProjectAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Validez de la Oferta</label>
                  <select
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value={15}>15 Días Calendario</option>
                    <option value={30}>30 Días Calendario</option>
                    <option value={60}>60 Días Calendario</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#06315a]" />
                    <span>1. Desglose de Materiales de Proveedores</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSupplierSearchOpen(true)}
                      className="bg-[#06315a] hover:bg-sky-900 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer border border-sky-600"
                    >
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                      <span>🔍 Buscador de Proveedores (Novey, Cochez...)</span>
                    </button>

                    <button
                      type="button"
                      onClick={addCustomItem}
                      className="text-xs font-bold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
                    >
                      + Ítem Libre
                    </button>
                  </div>
                </div>

                {/* Quick Catalog picker with Thumbnails */}
                <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#06315a]">
                      Añadir con 1 clic desde Catálogo con Foto:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSupplierSearchOpen(true)}
                      className="text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <span>Ver Todos los Proveedores ({materials.length}) →</span>
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {materials.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => addItemFromCatalog(mat, 1)}
                        className="bg-white hover:bg-amber-50 border border-slate-200 rounded-xl p-2 text-left shrink-0 w-52 transition cursor-pointer shadow-2xs flex items-center gap-2 group relative"
                      >
                        <img
                          src={mat.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(mat.name)}/100/100`}
                          alt={mat.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(mat.category)}/100/100`;
                          }}
                        />
                        <div className="overflow-hidden pr-2">
                          <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#06315a]">{mat.name}</p>
                          <div className="flex items-center justify-between text-[10px] mt-0.5">
                            <span className="text-slate-400 font-extrabold">{mat.provider}</span>
                            <span className="font-mono font-bold text-emerald-700">${mat.publicPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        {addedNoticeMatId === mat.id && (
                          <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md animate-bounce shadow-xs">
                            ✓ Añadido
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                        <th className="p-2.5">Descripción</th>
                        <th className="p-2.5 w-20">Cant.</th>
                        <th className="p-2.5 w-28">P. Unit ($)</th>
                        <th className="p-2.5 w-28 text-right">Total ($)</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded-lg outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded-lg outline-none font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded-lg outline-none font-mono"
                            />
                          </td>
                          <td className="p-2 text-right font-bold font-mono">
                            ${item.totalPrice.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Labor Cost Section */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold uppercase text-amber-900">2. Costo de Mano de Obra Especializada</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-700 font-medium">Mano de Obra ($):</span>
                  <input
                    type="number"
                    step="5"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                    className="w-36 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-bold font-mono text-[#06315a] outline-none"
                  />
                  <span className="text-xs text-slate-500">Incluye instalación, pruebas técnicas y entrega de certificación.</span>
                </div>
              </div>

              {/* Digital Signature Pad */}
              <div>
                <DigitalSignaturePad
                  onSaveSignature={(sig) => setSignatureData(sig)}
                  initialSignature={signatureData}
                />
              </div>

              {/* Total Banner */}
              <div className="bg-[#06315a] text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-sky-200">Presupuesto Estimado con ITBMS (7%)</p>
                  <p className="text-xs text-amber-300 font-semibold">Validez por {validityDays} días calendario</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-sky-200">Subtotal: ${subtotal.toFixed(2)} | ITBMS: ${taxAmount.toFixed(2)}</div>
                  <div className="text-2xl font-black font-mono text-amber-400">${total.toFixed(2)}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg cursor-pointer"
                >
                  Guardar y Emitir Cotización
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW & SIGN EXISTING QUOTE MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#06315a]">{selectedQuote.quoteNumber}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedQuote.clientName}</h3>
                <p className="text-xs text-slate-500">{selectedQuote.projectAddress}</p>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>
            </div>

            <div className="my-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                <p><strong>Mano de Obra:</strong> ${selectedQuote.laborCost.toFixed(2)}</p>
                <p><strong>Total Estimado:</strong> <span className="font-bold text-[#06315a] font-mono">${selectedQuote.total.toFixed(2)}</span></p>
              </div>

              {/* Signature section */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Firma del Cliente para Autorizar:</h4>
                <DigitalSignaturePad
                  initialSignature={selectedQuote.clientSignature}
                  onSaveSignature={(sig) => handleSaveSignatureForExistingQuote(selectedQuote, sig)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrintableQuote(selectedQuote)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4 stroke-[2.5]" />
                  <span>Vista e Impresión Oficial</span>
                </button>

                <button
                  onClick={() => exportQuoteToPDF(selectedQuote)}
                  className="bg-[#06315a] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </button>
              </div>

              {selectedQuote.clientSignature && (
                <button
                  onClick={() => {
                    onApproveAndConvertToInvoice(selectedQuote);
                    setSelectedQuote(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Convertir a Factura DTE Oficial</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SUPPLIER MATERIAL SEARCH MODAL */}
      {isSupplierSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#06315a] text-amber-400 rounded-2xl shadow-md">
                  <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Buscador de Materiales de Proveedores</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                      Novey, Cochez, Doit Center
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Busca rápidamente por nombre, código o categoría y añade insumos directo a tu cotización.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSupplierSearchOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input & Filters */}
            <div className="py-4 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe para buscar... Ej. Breaker 20A, Cable THHN #12, Tubo PVC 3/4, Cochez, Novey..."
                  value={searchSupplierQuery}
                  onChange={(e) => setSearchSupplierQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium outline-none focus:border-[#06315a] focus:bg-white transition"
                />
                {searchSupplierQuery && (
                  <button
                    onClick={() => setSearchSupplierQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Provider Tabs */}
              <div className="flex items-center gap-2 flex-wrap bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 px-2 uppercase">Proveedor:</span>
                {['Todos', 'Novey', 'Cochez', 'Doit Center', 'Personalizado'].map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setSelectedSupplierFilter(prov)}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                      selectedSupplierFilter === prov
                        ? 'bg-[#06315a] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/60'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['Todas', 'Breakers y Tableros', 'Cables y Conductores', 'Tuberías y Conectores', 'Interruptores y Tomas', 'Iluminación y Lámparas', 'Herramientas y Equipos', 'Accesorios y Varios'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3">
              {(() => {
                const results = materials.filter(m => {
                  const matchesProv = selectedSupplierFilter === 'Todos' || m.provider === selectedSupplierFilter;
                  const matchesCat = selectedCategoryFilter === 'Todas' || m.category === selectedCategoryFilter;
                  const q = searchSupplierQuery.toLowerCase().trim();
                  const matchesSearch = !q ||
                    m.name.toLowerCase().includes(q) ||
                    m.code.toLowerCase().includes(q) ||
                    m.provider.toLowerCase().includes(q) ||
                    m.category.toLowerCase().includes(q) ||
                    (m.description && m.description.toLowerCase().includes(q));
                  return matchesProv && matchesCat && matchesSearch;
                });

                if (results.length === 0) {
                  return (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                      <Package className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        No se encontraron insumos para "<span className="text-[#06315a]">{searchSupplierQuery}</span>"
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Prueba ajustando el filtro de proveedor o borrando el texto de búsqueda.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.map((mat) => {
                      const qty = itemQuantities[mat.id] || 1;
                      const isAddedNotice = addedNoticeMatId === mat.id;

                      return (
                        <div
                          key={mat.id}
                          className="bg-white p-3 rounded-2xl border border-slate-200/90 hover:border-[#06315a] transition shadow-2xs flex flex-col justify-between space-y-2 group relative"
                        >
                          <div>
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                mat.provider === 'Novey'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : mat.provider === 'Cochez'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : mat.provider === 'Doit Center'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}>
                                {mat.provider}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{mat.code}</span>
                            </div>

                            {/* Image Thumbnail */}
                            <div className="relative mb-2 h-28 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                              <img
                                src={mat.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(mat.name)}/300/200`}
                                alt={mat.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(mat.category)}/300/200`;
                                }}
                              />
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#06315a] line-clamp-2">
                              {mat.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{mat.category}</p>
                          </div>

                          {/* Price & Add to Quote Controls */}
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-semibold">Precio Cliente:</span>
                              <span className="text-sm font-black text-[#06315a] font-mono">${mat.publicPrice.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">/ {mat.unit}</span></span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Quantity Selector */}
                              <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 w-24">
                                <button
                                  type="button"
                                  onClick={() => setItemQuantities({ ...itemQuantities, [mat.id]: Math.max(1, qty - 1) })}
                                  className="w-6 h-6 flex items-center justify-center font-black text-slate-700 hover:bg-white rounded-lg transition cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={qty}
                                  onChange={(e) => setItemQuantities({ ...itemQuantities, [mat.id]: Math.max(1, Number(e.target.value)) })}
                                  className="w-10 text-center text-xs font-bold bg-transparent outline-none font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => setItemQuantities({ ...itemQuantities, [mat.id]: qty + 1 })}
                                  className="w-6 h-6 flex items-center justify-center font-black text-slate-700 hover:bg-white rounded-lg transition cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              {/* Add Button */}
                              <button
                                type="button"
                                onClick={() => addItemFromCatalog(mat, qty)}
                                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 shadow-xs ${
                                  isAddedNotice
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#06315a] hover:bg-sky-900 text-white'
                                }`}
                              >
                                {isAddedNotice ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
                                    <span>¡Añadido!</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Añadir</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-bold">
                Items añadidos a la cotización actual: <strong className="text-[#06315a] font-mono">{items.length} ítems</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSupplierSearchOpen(false)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-2 rounded-xl shadow-md transition cursor-pointer"
              >
                Listo / Volver a la Cotización
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRINT DOCUMENT MODAL */}
      <PrintDocumentModal
        isOpen={!!printableQuote}
        onClose={() => setPrintableQuote(null)}
        document={printableQuote}
        type="quote"
      />

    </div>
  );
};
