import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Camera, 
  CheckCircle, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2, 
  Sparkles, 
  Building, 
  Upload, 
  FileSpreadsheet,
  FileCode,
  DollarSign,
  Send,
  Zap,
  Printer,
  Star,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Invoice, InvoiceItem, Material, ProviderName, FavoriteClient } from '../types';
import { exportInvoiceToPDF, exportInvoiceToWord, exportInvoicesToExcel } from '../utils/exportUtils';
import { PrintDocumentModal } from './PrintDocumentModal';

interface Props {
  invoices: Invoice[];
  materials: Material[];
  favoriteClients?: FavoriteClient[];
  favoriteMaterialIds?: string[];
  onAddInvoice: (invoice: Invoice) => void;
  onDeleteInvoice?: (id: string) => void;
  onToggleFavoriteInvoice?: (id: string) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status'], receiptImage?: string) => void;
  onAddFavoriteClient?: (client: Omit<FavoriteClient, 'id'>) => void;
  onDeleteFavoriteClient?: (id: string) => void;
  onToggleFavoriteMaterial?: (materialId: string) => void;
  onCloseSection?: () => void;
}

export const InvoiceManagement: React.FC<Props> = ({
  invoices,
  materials,
  favoriteClients = [],
  favoriteMaterialIds = [],
  onAddInvoice,
  onDeleteInvoice,
  onToggleFavoriteInvoice,
  onUpdateInvoiceStatus,
  onAddFavoriteClient,
  onDeleteFavoriteClient,
  onToggleFavoriteMaterial,
  onCloseSection
}) => {
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Pagada' | 'Pendiente' | 'Vencida' | 'Favoritas'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [printableInvoice, setPrintableInvoice] = useState<Invoice | null>(null);

  // New Invoice Form state with auto-save draft initialization
  const [clientName, setClientName] = useState(() => {
    try {
      const draft = localStorage.getItem('em_invoice_draft');
      if (draft) return JSON.parse(draft).clientName || '';
    } catch (e) {}
    return '';
  });

  const [clientRuc, setClientRuc] = useState(() => {
    try {
      const draft = localStorage.getItem('em_invoice_draft');
      if (draft) return JSON.parse(draft).clientRuc || '';
    } catch (e) {}
    return '';
  });

  const [clientEmail, setClientEmail] = useState(() => {
    try {
      const draft = localStorage.getItem('em_invoice_draft');
      if (draft) return JSON.parse(draft).clientEmail || '';
    } catch (e) {}
    return '';
  });

  const [clientPhone, setClientPhone] = useState(() => {
    try {
      const draft = localStorage.getItem('em_invoice_draft');
      if (draft) return JSON.parse(draft).clientPhone || '';
    } catch (e) {}
    return '';
  });

  const [clientAddress, setClientAddress] = useState(() => {
    try {
      const draft = localStorage.getItem('em_invoice_draft');
      if (draft) return JSON.parse(draft).clientAddress || '';
    } catch (e) {}
    return '';
  });

  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('Yappy');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Invoice Items state
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    try {
      const draft = localStorage.getItem('em_invoice_draft');
      if (draft && JSON.parse(draft).items?.length > 0) return JSON.parse(draft).items;
    } catch (e) {}
    return [
      {
        id: 'item-init-1',
        description: 'Mano de obra instalación eléctrica general',
        unit: 'servicio',
        quantity: 1,
        unitPrice: 120.00,
        totalPrice: 120.00
      }
    ];
  });

  // Auto-save form draft to localStorage
  useEffect(() => {
    if (isCreating) {
      const draft = { clientName, clientRuc, clientEmail, clientPhone, clientAddress, items };
      localStorage.setItem('em_invoice_draft', JSON.stringify(draft));
    }
  }, [isCreating, clientName, clientRuc, clientEmail, clientPhone, clientAddress, items]);

  // Catalog picker search
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>('Todos');

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    if (activeFilter === 'Favoritas' && !inv.isFavorite) return false;
    const matchesFilter = activeFilter === 'Todas' || activeFilter === 'Favoritas' || inv.status === activeFilter;
    const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.clientRuc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate Form Totals
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const taxAmount = subtotal * 0.07; // ITBMS 7%
  const total = subtotal + taxAmount;

  // Auto-fill form from selected Favorite Client
  const handleSelectFavoriteClient = (fav: FavoriteClient) => {
    setClientName(fav.name);
    setClientRuc(fav.ruc);
    setClientEmail(fav.email);
    setClientPhone(fav.phone);
    setClientAddress(fav.address);
  };

  // Add Item to Form
  const addItemFromCatalog = (mat: Material) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      materialId: mat.id,
      description: `${mat.name} (${mat.provider})`,
      unit: mat.unit,
      quantity: 1,
      unitPrice: mat.publicPrice,
      totalPrice: mat.publicPrice
    };
    setItems([...items, newItem]);
  };

  const addCustomItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: 'Nuevo Servicio / Material Personalizado',
      unit: 'unidad',
      quantity: 1,
      unitPrice: 50.00,
      totalPrice: 50.00
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

  // Image upload handler
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Invoice Submit
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || items.length === 0) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `DTE-2026-${randomNum}`,
      cafeCode: `FE-PA-87213491-202607-${randomNum}`,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      clientName,
      clientRuc: clientRuc || '8-NT-000 DV 00',
      clientEmail: clientEmail || 'cliente@ejemplo.pa',
      clientPhone: clientPhone || '+507 6000-0000',
      clientAddress: clientAddress || 'Ciudad de Panamá',
      items,
      subtotal,
      taxAmount,
      total,
      status: receiptImage ? 'Pagada' : 'Pendiente',
      paymentMethod,
      receiptImage: receiptImage || undefined,
      notes
    };

    onAddInvoice(newInv);
    setIsCreating(false);
    localStorage.removeItem('em_invoice_draft'); // Clear draft after successful creation

    // Reset Form
    setClientName('');
    setClientRuc('');
    setClientEmail('');
    setClientPhone('');
    setClientAddress('');
    setReceiptImage('');
    setNotes('');

    // Trigger celebration confetti
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight uppercase">
              GESTIÓN DE FACTURACIÓN ELECTRÓNICA (DTE)
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              DGI Panamá
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generación oficial de facturas con cálculo automático de ITBMS (7%), vinculación al catálogo y comprobantes adjuntos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Factura DTE</span>
          </button>
          
          <button
            onClick={() => exportInvoicesToExcel(invoices)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>

          {onCloseSection && (
            <button
              onClick={onCloseSection}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-300"
              title="Cerrar esta sección y volver al Panel de Control"
            >
              <X className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Cerrar Ventana</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['Todas', 'Pagada', 'Pendiente', 'Vencida', 'Favoritas'] as const).map((filter) => (
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
              {filter === 'Pagada' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              {filter === 'Pendiente' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
              {filter === 'Vencida' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
              {filter === 'Favoritas' && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
              <span>{filter === 'Todas' ? 'Todas las Facturas' : filter}</span>
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

      {/* Main Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInvoices.map((inv) => (
          <div 
            key={inv.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between relative group"
          >
            <div>
              {/* Header Badge & Star */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-bold text-[#06315a] font-mono">{inv.invoiceNumber}</span>
                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]">{inv.cafeCode}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    inv.status === 'Pagada' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : inv.status === 'Pendiente'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {inv.status}
                  </span>

                  {onToggleFavoriteInvoice && (
                    <button
                      onClick={() => onToggleFavoriteInvoice(inv.id)}
                      className={`p-1 rounded-full hover:bg-amber-50 transition cursor-pointer ${
                        inv.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                      }`}
                      title={inv.isFavorite ? 'Quitar de Favoritos' : 'Marcar como Favorita'}
                    >
                      <Star className={`w-4 h-4 ${inv.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Client Details */}
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{inv.clientName}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{inv.clientRuc}</p>

              {/* Items preview */}
              <div className="my-3 py-2 px-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Conceptos ({inv.items.length}):</p>
                {inv.items.slice(0, 2).map((item, idx) => (
                  <p key={idx} className="text-slate-700 truncate font-medium">
                    · {item.quantity} {item.unit} - {item.description}
                  </p>
                ))}
                {inv.items.length > 2 && (
                  <p className="text-[10px] text-sky-700 font-semibold">+ {inv.items.length - 2} ítem(s) más</p>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">TOTAL DTE (con ITBMS 7%)</span>
                  <span className="text-lg font-black text-slate-900 font-mono">${inv.total.toFixed(2)}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">F. Venc: {inv.dueDate}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
              <button
                onClick={() => setSelectedInvoice(inv)}
                className="bg-sky-50 text-[#06315a] hover:bg-sky-100 text-xs font-bold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver / Recibo</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPrintableInvoice(inv)}
                  className="p-1.5 text-slate-700 hover:text-sky-900 bg-slate-100 hover:bg-amber-100 rounded-lg transition cursor-pointer font-bold text-xs flex items-center gap-1"
                  title="Vista de Impresión Oficial DTE"
                >
                  <Printer className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => exportInvoiceToPDF(inv)}
                  className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                  title="Exportar a PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportInvoiceToWord(inv)}
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

      {/* CREATE NEW INVOICE MODAL FORM */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-500" />
                  Factura Electrónica DTE Panamá
                </span>
                <h3 className="text-xl font-black text-[#06315a] font-mono">
                  GENERAR NUEVA FACTURA DE VENTA
                </h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-6">
              
              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre o Razón Social del Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Constructora El Dorado S.A."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06315a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RUC / Cédula y DV *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 8-765-4321 DV 99"
                    value={clientRuc}
                    onChange={(e) => setClientRuc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06315a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    placeholder="Ej. +507 6789-0011"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06315a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico para Factura</label>
                  <input
                    type="email"
                    placeholder="facturacion@cliente.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06315a] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección del Proyecto / Fiscal</label>
                  <input
                    type="text"
                    placeholder="Ej. Vía España, Edificio Obarrio Plaza, Piso 4"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06315a] outline-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#06315a]" />
                    Detalle de Materiales y Mano de Obra
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addCustomItem}
                      className="text-xs font-bold text-[#06315a] hover:bg-sky-50 px-3 py-1 rounded-lg border border-slate-200 transition"
                    >
                      + Ítem Personalizado
                    </button>
                  </div>
                </div>

                {/* Material Catalog Quick Picker */}
                <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100">
                  <span className="text-[11px] font-bold text-[#06315a] block mb-2">
                    ⚡ Vincular directo del Catálogo Novey / Cochez / Doit Center:
                  </span>
                  
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {materials.slice(0, 6).map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => addItemFromCatalog(mat)}
                        className="bg-white hover:bg-amber-50 border border-slate-200 rounded-xl p-2 text-left shrink-0 w-44 transition cursor-pointer shadow-2xs hover:border-amber-400"
                      >
                        <span className="text-[9px] font-bold text-amber-600 block uppercase">{mat.provider}</span>
                        <p className="text-xs font-bold text-slate-800 truncate">{mat.name}</p>
                        <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">${mat.publicPrice.toFixed(2)} / {mat.unit}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                        <th className="p-2.5">Descripción</th>
                        <th className="p-2.5 w-20">Unidad</th>
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
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#06315a]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#06315a]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#06315a] font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#06315a] font-mono"
                            />
                          </td>
                          <td className="p-2 text-right font-bold font-mono text-slate-900">
                            ${item.totalPrice.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-600 transition"
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

              {/* Payment Method & Attached Receipt Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Método de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06315a] outline-none"
                  >
                    <option value="Yappy">Yappy Comercial (@EMServicios)</option>
                    <option value="ACH / Transferencia">ACH / Transferencia Banco General</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito / Débito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adjuntar Foto de Recibo / Evidencia de Pago</label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer hover:border-[#06315a] transition">
                    <Camera className="w-4 h-4 text-[#06315a]" />
                    <span>{receiptImage ? 'Cambiar Foto Adjunta' : 'Subir Comprobante / Recibo'}</span>
                    <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                  </label>
                  {receiptImage && (
                    <div className="mt-2 relative w-20 h-14 rounded-lg overflow-hidden border border-slate-300">
                      <img src={receiptImage} alt="Receipt preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-bold text-center py-0.5">ADJUNTO</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-[#06315a] text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-sky-200">Factura DTE lista para emitirse</p>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">Cumple norma fiscal DGI Panamá con código CAFE asignado</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-sky-200 font-medium">Subtotal: ${subtotal.toFixed(2)} | ITBMS (7%): ${taxAmount.toFixed(2)}</div>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                    TOTAL: ${total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Emitir Factura DTE Oficial</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DETAIL INVOICE PREVIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#06315a]">{selectedInvoice.invoiceNumber}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedInvoice.clientName}</h3>
                <p className="text-xs text-slate-500">{selectedInvoice.clientRuc}</p>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-2 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 border border-slate-200">
                <p><strong>CAFE DTE:</strong> {selectedInvoice.cafeCode}</p>
                <p><strong>Fecha Emisión:</strong> {selectedInvoice.date} | <strong>Vencimiento:</strong> {selectedInvoice.dueDate}</p>
                <p><strong>Método Pago:</strong> {selectedInvoice.paymentMethod}</p>
                <p><strong>Estado Actual:</strong> <span className="font-bold text-emerald-700">{selectedInvoice.status}</span></p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Ítems Facturados:</h4>
                <div className="space-y-1">
                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-100">
                      <span>{item.quantity} {item.unit} - {item.description}</span>
                      <span className="font-mono font-bold">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receipt Preview */}
              {selectedInvoice.receiptImage && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Comprobante de Pago Adjunto:</h4>
                  <img src={selectedInvoice.receiptImage} alt="Receipt" className="max-h-48 rounded-xl border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              {/* Total */}
              <div className="text-right pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500 block">Subtotal: ${selectedInvoice.subtotal.toFixed(2)} + ITBMS 7%: ${selectedInvoice.taxAmount.toFixed(2)}</span>
                <span className="text-xl font-black text-[#06315a] font-mono">TOTAL: ${selectedInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setPrintableInvoice(selectedInvoice)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Vista e Impresión Oficial DTE</span>
              </button>

              <button
                onClick={() => exportInvoiceToPDF(selectedInvoice)}
                className="bg-[#06315a] hover:bg-sky-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRINT DOCUMENT MODAL */}
      <PrintDocumentModal
        isOpen={!!printableInvoice}
        onClose={() => setPrintableInvoice(null)}
        document={printableInvoice}
        type="invoice"
      />

    </div>
  );
};
