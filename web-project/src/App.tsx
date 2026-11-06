import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { TabType, Invoice, Quote, Material, EvidenceItem, AppTheme, FavoriteClient } from './types';
import { INITIAL_INVOICES, INITIAL_QUOTES, INITIAL_MATERIALS, INITIAL_EVIDENCES } from './data/initialData';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Dashboard } from './components/Dashboard';
import { InvoiceManagement } from './components/InvoiceManagement';
import { MaterialCatalog } from './components/MaterialCatalog';
import { QuoteSystem } from './components/QuoteSystem';
import { DocumentHistory } from './components/DocumentHistory';
import { ExportModal } from './components/ExportModal';
import { ThemeAndLogoModal, LOGO_OPTIONS } from './components/ThemeAndLogoModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Theme & Branding Customization State
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('em_theme') as AppTheme) || 'classic';
  });
  
  const [selectedLogo, setSelectedLogo] = useState<string>(() => {
    return localStorage.getItem('em_logo') || LOGO_OPTIONS[0].imageUrl;
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // App Persistent State (Default to empty arrays for invoices/quotes/evidences as requested)
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('em_invoices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return []; // Clean slate by default
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('em_quotes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return []; // Clean slate by default
  });

  const [evidences, setEvidences] = useState<EvidenceItem[]>(() => {
    const saved = localStorage.getItem('em_evidences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return []; // Clean slate by default
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('em_materials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MATERIALS; // Keep base catalog for easy line item selection
  });

  const [favoriteClients, setFavoriteClients] = useState<FavoriteClient[]>(() => {
    const saved = localStorage.getItem('em_favorite_clients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [favoriteMaterialIds, setFavoriteMaterialIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('em_favorite_material_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['mat-001', 'mat-002', 'mat-005', 'mat-008', 'mat-010'];
  });

  // Modals & Selection State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatic localStorage Auto-Save Effects
  useEffect(() => {
    localStorage.setItem('em_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('em_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('em_evidences', JSON.stringify(evidences));
  }, [evidences]);

  useEffect(() => {
    localStorage.setItem('em_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('em_favorite_clients', JSON.stringify(favoriteClients));
  }, [favoriteClients]);

  useEffect(() => {
    localStorage.setItem('em_favorite_material_ids', JSON.stringify(favoriteMaterialIds));
  }, [favoriteMaterialIds]);

  useEffect(() => {
    localStorage.setItem('em_theme', selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    localStorage.setItem('em_logo', selectedLogo);
  }, [selectedLogo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // State Handlers
  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices]);
    showToast(`Factura ${newInvoice.invoiceNumber} guardada en memoria local.`);
  };

  const handleAddQuote = (newQuote: Quote) => {
    setQuotes([newQuote, ...quotes]);
    showToast(`Cotización ${newQuote.quoteNumber} guardada automáticamente.`);
  };

  const handleUpdateQuote = (updatedQuote: Quote) => {
    setQuotes(quotes.map(q => q.id === updatedQuote.id ? updatedQuote : q));
    showToast(`Cotización ${updatedQuote.quoteNumber} actualizada.`);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    showToast('Factura eliminada de los registros.');
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
    showToast('Cotización eliminada.');
  };

  const handleToggleFavoriteInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, isFavorite: !inv.isFavorite } : inv));
  };

  const handleToggleFavoriteQuote = (id: string) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  const handleAddMaterial = (newMaterial: Material) => {
    setMaterials([newMaterial, ...materials]);
    showToast(`Insumo ${newMaterial.name} añadido al catálogo.`);
  };

  const handleAddEvidence = (newEvidence: EvidenceItem) => {
    setEvidences([newEvidence, ...evidences]);
    showToast(`Evidencia fotográfica "${newEvidence.title}" guardada.`);
  };

  // Toggle Material Favorite
  const handleToggleFavoriteMaterial = (materialId: string) => {
    if (favoriteMaterialIds.includes(materialId)) {
      setFavoriteMaterialIds(favoriteMaterialIds.filter(id => id !== materialId));
      showToast('Insumo removido de Favoritos.');
    } else {
      setFavoriteMaterialIds([...favoriteMaterialIds, materialId]);
      showToast('Insumo agregado a Favoritos ⭐.');
    }
  };

  // Add / Delete Favorite Client
  const handleAddFavoriteClient = (client: Omit<FavoriteClient, 'id'>) => {
    const existing = favoriteClients.find(c => c.ruc.trim().toLowerCase() === client.ruc.trim().toLowerCase());
    if (existing) {
      showToast('Este cliente ya se encuentra en tus Favoritos.');
      return;
    }
    const newFav: FavoriteClient = {
      ...client,
      id: `fav-cli-${Date.now()}`
    };
    setFavoriteClients([...favoriteClients, newFav]);
    showToast(`Cliente "${client.name}" guardado en Favoritos Frecuentes ⭐.`);
  };

  const handleDeleteFavoriteClient = (id: string) => {
    setFavoriteClients(favoriteClients.filter(c => c.id !== id));
    showToast('Cliente removido de Favoritos.');
  };

  // Clear All User Data
  const handleClearAllData = () => {
    if (window.confirm('¿Está seguro de eliminar todas las facturas, cotizaciones, evidencias y clientes? Esta acción dejará los registros en blanco.')) {
      setInvoices([]);
      setQuotes([]);
      setEvidences([]);
      setFavoriteClients([]);
      localStorage.removeItem('em_invoices');
      localStorage.removeItem('em_quotes');
      localStorage.removeItem('em_evidences');
      localStorage.removeItem('em_favorite_clients');
      showToast('Todos los registros ingresados han sido eliminados.');
    }
  };

  // Restore Sample Demo Data
  const handleRestoreSampleData = () => {
    if (window.confirm('¿Desea restaurar los registros de ejemplo para pruebas?')) {
      setInvoices(INITIAL_INVOICES);
      setQuotes(INITIAL_QUOTES);
      setEvidences(INITIAL_EVIDENCES);
      showToast('Datos de ejemplo cargados.');
    }
  };

  // Convert Approved Quote to DTE Invoice
  const handleApproveAndConvertToInvoice = (quote: Quote) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const convertedInvoice: Invoice = {
      id: `inv-conv-${Date.now()}`,
      invoiceNumber: `DTE-2026-${randomNum}`,
      cafeCode: `FE-PA-87213491-202607-${randomNum}`,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      clientName: quote.clientName,
      clientRuc: quote.clientRuc,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientAddress: quote.projectAddress,
      items: quote.items,
      subtotal: quote.subtotal,
      taxAmount: quote.taxAmount,
      total: quote.total,
      status: 'Pendiente',
      paymentMethod: 'ACH / Transferencia',
      notes: `Factura generada automáticamente desde la Cotización Aprobada ${quote.quoteNumber}`
    };

    // Update quote status
    const updatedQuote: Quote = { ...quote, status: 'Aprobada' };
    setQuotes(quotes.map(q => q.id === quote.id ? updatedQuote : q));

    // Add invoice
    setInvoices([convertedInvoice, ...invoices]);
    setActiveTab('invoices');

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } catch (e) {}

    showToast(`¡Cotización ${quote.quoteNumber} convertida exitosamente a Factura DTE ${convertedInvoice.invoiceNumber}!`);
  };

  // Background style based on theme
  const appBgStyle = {
    classic: 'bg-slate-100 text-slate-900',
    electric: 'bg-sky-50/60 text-slate-900',
    dark: 'bg-slate-950 text-slate-100',
    emerald: 'bg-emerald-50/40 text-slate-900',
    amber: 'bg-amber-50/40 text-slate-900',
    midnight: 'bg-indigo-950/20 text-slate-900',
    platinum: 'bg-slate-200/60 text-slate-900',
    cyberpunk: 'bg-zinc-950 text-amber-100'
  }[selectedTheme] || 'bg-slate-100 text-slate-900';

  return (
    <div className={`min-h-screen ${appBgStyle} font-sans transition-colors duration-300 selection:bg-amber-300 selection:text-slate-950`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06315a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-xs font-bold flex items-center gap-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewInvoice={() => setActiveTab('invoices')}
        onOpenNewQuote={() => setActiveTab('quotes')}
        onOpenNewMaterial={() => setActiveTab('catalog')}
        onOpenExportAllModal={() => setIsExportModalOpen(true)}
        selectedTheme={selectedTheme}
        selectedLogo={selectedLogo}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onSelectTheme={(theme) => {
          setSelectedTheme(theme);
          showToast(`Tema de despliegue cambiado a: ${theme.toUpperCase()}`);
        }}
      />

      {/* Main Screen Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            invoices={invoices}
            quotes={quotes}
            materials={materials}
            setActiveTab={setActiveTab}
            onOpenNewInvoice={() => setActiveTab('invoices')}
            onOpenNewQuote={() => setActiveTab('quotes')}
            onOpenNewMaterial={() => setActiveTab('catalog')}
            onOpenExportAllModal={() => setIsExportModalOpen(true)}
            onSelectInvoice={(inv) => setActiveTab('invoices')}
            onSelectQuote={(q) => setActiveTab('quotes')}
            onClearAllData={handleClearAllData}
            onRestoreSampleData={handleRestoreSampleData}
            selectedTheme={selectedTheme}
            onSelectTheme={(theme) => {
              setSelectedTheme(theme);
              showToast(`Tema de despliegue cambiado a: ${theme.toUpperCase()}`);
            }}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceManagement
            invoices={invoices}
            materials={materials}
            favoriteClients={favoriteClients}
            favoriteMaterialIds={favoriteMaterialIds}
            onAddInvoice={handleAddInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onToggleFavoriteInvoice={handleToggleFavoriteInvoice}
            onUpdateInvoiceStatus={(id, status, receiptImage) => {
              setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status, receiptImage: receiptImage || inv.receiptImage } : inv));
            }}
            onAddFavoriteClient={handleAddFavoriteClient}
            onDeleteFavoriteClient={handleDeleteFavoriteClient}
            onToggleFavoriteMaterial={handleToggleFavoriteMaterial}
            onCloseSection={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'catalog' && (
          <MaterialCatalog
            materials={materials}
            favoriteMaterialIds={favoriteMaterialIds}
            onAddMaterial={handleAddMaterial}
            onUpdateMaterial={(updated) => {
              setMaterials(materials.map(m => m.id === updated.id ? updated : m));
            }}
            onToggleFavoriteMaterial={handleToggleFavoriteMaterial}
            onCloseSection={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'quotes' && (
          <QuoteSystem
            quotes={quotes}
            materials={materials}
            favoriteClients={favoriteClients}
            favoriteMaterialIds={favoriteMaterialIds}
            onAddQuote={handleAddQuote}
            onDeleteQuote={handleDeleteQuote}
            onToggleFavoriteQuote={handleToggleFavoriteQuote}
            onApproveAndConvertToInvoice={handleApproveAndConvertToInvoice}
            onUpdateQuote={handleUpdateQuote}
            onAddFavoriteClient={handleAddFavoriteClient}
            onDeleteFavoriteClient={handleDeleteFavoriteClient}
            onToggleFavoriteMaterial={handleToggleFavoriteMaterial}
            onCloseSection={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'history' && (
          <DocumentHistory
            invoices={invoices}
            quotes={quotes}
            evidences={evidences}
            onAddEvidence={handleAddEvidence}
            onUpdateInvoiceStatus={(id, status, receiptImage) => {
              setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status, receiptImage: receiptImage || inv.receiptImage } : inv));
              showToast('Factura actualizada con el recibo físico capturado.');
            }}
            onCloseSection={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Theme & Logo Selector Modal */}
      <ThemeAndLogoModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        selectedTheme={selectedTheme}
        onSelectTheme={(theme) => {
          setSelectedTheme(theme);
          showToast(`Tema visual cambiado a: ${theme.toUpperCase()}`);
        }}
        selectedLogo={selectedLogo}
        onSelectLogo={(logoUrl) => {
          setSelectedLogo(logoUrl);
          showToast('Logotipo corporativo actualizado.');
        }}
      />

      {/* Global Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        invoices={invoices}
        quotes={quotes}
        materials={materials}
        favoriteClients={favoriteClients}
        evidences={evidences}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-xs py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            EM SERVICIOS ELÉCTRICOS © {new Date().getFullYear()} — RUC 8-812-4910 DV 82 Panamá
          </p>
          <div className="flex items-center gap-3">
            <button onClick={handleClearAllData} className="text-red-600 hover:underline text-[11px] font-bold cursor-pointer">
              🗑️ Limpiar Todos los Datos
            </button>
            <span>·</span>
            <button onClick={handleRestoreSampleData} className="text-slate-500 hover:underline text-[11px] cursor-pointer">
              🔄 Restaurar Datos de Prueba
            </button>
          </div>
        </div>
      </footer>

      {/* Vercel Speed Insights */}
      <SpeedInsights />

    </div>
  );
}

