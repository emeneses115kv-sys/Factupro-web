# Factupro-web
App mobile Android 
{
  "name": "facturacion-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.4"
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Users, Plus, Trash2, Printer, 
  CheckCircle2, Clock, AlertCircle, Sparkles, Download, 
  Phone, Mail, MapPin, Edit3, RotateCcw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'clients' | 'create' | 'preview'
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('app_invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('app_clients');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Empresa Demo S.A.', phone: '+507 6000-1122', email: 'contacto@demo.com', address: 'Ciudad de Panamá' }
    ];
  });

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form State para nueva Factura/Cotización
  const [formType, setFormType] = useState('Factura'); // 'Factura' | 'Cotización'
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [abono, setAbono] = useState(0);
  const [items, setItems] = useState([
    { id: 1, cant: 1, desc: 'Servicio de Mantenimiento', precio: 150 }
  ]);
  const [clientSignature, setClientSignature] = useState('');
  const [emitterSignature, setEmitterSignature] = useState('');

  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem('app_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('app_clients', JSON.stringify(clients));
  }, [clients]);

  // Cálculos
  const subtotal = items.reduce((acc, item) => acc + (Number(item.cant) * Number(item.precio || 0)), 0);
  const itbms = subtotal * 0.07;
  const total = subtotal + itbms - Number(abono || 0);

  // Manejadores de Ítems
  const addItem = () => {
    setItems([...items, { id: Date.now(), cant: 1, desc: '', precio: 0 }]);
  };

  const updateItem = (id, field, val) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Guardar Factura
  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      type: formType,
      clientName,
      clientPhone,
      clientAddress,
      date: invoiceDate,
      description,
      items,
      subtotal,
      itbms,
      abono: Number(abono),
      total,
      status,
      clientSignature,
      emitterSignature,
      timestamp: Date.now()
    };

    setInvoices([newInvoice, ...invoices]);
    // Guardar cliente si no existe
    if (clientName && !clients.some(c => c.name.toLowerCase() === clientName.toLowerCase())) {
      setClients([...clients, { id: Date.now(), name: clientName, phone: clientPhone, email: '', address: clientAddress }]);
    }
    resetForm();
    setActiveTab('invoices');
  };

  const resetForm = () => {
    setClientName('');
    setClientPhone('');
    setClientAddress('');
    setDescription('');
    setAbono(0);
    setStatus('Pendiente');
    setItems([{ id: 1, cant: 1, desc: '', precio: 0 }]);
    setClientSignature('');
    setEmitterSignature('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FactuPro Cloud</h1>
              <p className="text-xs text-slate-400">Sistema de Facturas, Cotizaciones & Firmas</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex space-x-1 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'invoices' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Facturas ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'clients' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Clientes ({clients.length})
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab('create'); }}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'create' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" /> Nueva
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* LISTADO DE FACTURAS */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Documentos Emitidos</h2>
                <p className="text-slate-500 text-sm">Gestiona y exporta tus facturas y cotizaciones</p>
              </div>
              <button
                onClick={() => { resetForm(); setActiveTab('create'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Crear Documento
              </button>
            </div>

            {invoices.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">No hay facturas registradas</h3>
                <p className="text-slate-500 text-sm mb-4">Crea tu primera factura o cotización con firma digital.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Comenzar ahora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invoices.map((inv) => (
                  <div key={inv.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          inv.type === 'Cotización' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {inv.type}
                        </span>
                        <h3 className="font-bold text-lg text-slate-800 mt-1">{inv.id}</h3>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                        inv.status === 'Pagada' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.status === 'Pagada' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {inv.status}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-700 mb-1">{inv.clientName}</p>
                    <p className="text-xs text-slate-400 mb-4">{inv.date}</p>

                    <div className="bg-slate-50 p-3 rounded-xl mb-4 flex justify-between items-center">
                      <span className="text-xs text-slate-500">Monto Total:</span>
                      <span className="text-lg font-bold text-slate-900">${inv.total.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedInvoice(inv); setActiveTab('preview'); }}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Printer className="w-4 h-4" /> Ver / Imprimir
                      </button>
                      <button
                        onClick={() => setInvoices(invoices.filter(i => i.id !== inv.id))}
                        className="p-2 border border-slate-200 text-red-500 hover:bg-red-50 rounded-xl"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CREAR FACTURA / COTIZACIÓN */}
        {activeTab === 'create' && (
          <form onSubmit={handleSaveInvoice} className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Nuevo Documento</h2>
                <p className="text-slate-500 text-sm">Completa los datos del cliente, productos y firmas</p>
              </div>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormType('Factura')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium ${formType === 'Factura' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                >
                  Factura
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('Cotización')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium ${formType === 'Cotización' ? 'bg-white shadow text-purple-600' : 'text-slate-600'}`}
                >
                  Cotización
                </button>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">1. Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre o Empresa *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Juan Pérez / Acero S.A."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+507 6000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Dirección / Ubicación</label>
                <input
                  type="text"
                  placeholder="Calle 50, Edificio Royal, Piso 4"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Ítems de la Factura */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">2. Productos / Servicios</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Ítem
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <input
                      type="number"
                      min="1"
                      placeholder="Cant."
                      value={item.cant}
                      onChange={(e) => updateItem(item.id, 'cant', e.target.value)}
                      className="w-20 border border-slate-300 rounded-xl px-3 py-2 text-sm text-center"
                    />
                    <input
                      type="text"
                      placeholder="Descripción del trabajo o producto..."
                      value={item.desc}
                      onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm"
                      required
                    />
                    <div className="relative w-32">
                      <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.precio}
                        onChange={(e) => updateItem(item.id, 'precio', e.target.value)}
                        className="w-full pl-7 pr-3 border border-slate-300 rounded-xl py-2 text-sm"
                        required
                      />
                    </div>
                    <span className="font-semibold text-sm w-24 text-right text-slate-800">
                      ${(Number(item.cant) * Number(item.precio || 0)).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales y Abono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Observaciones o Términos</label>
                <textarea
                  rows="3"
                  placeholder="Garantía de 30 días en mano de obra. Válido por 15 días."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm"
                />
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-200">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>ITBMS (7%):</span>
                  <span>${itbms.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-600 pt-1">
                  <span>Abono Inicial:</span>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={abono}
                      onChange={(e) => setAbono(e.target.value)}
                      className="w-full pl-6 pr-2 py-1 text-right text-sm border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-2">
                  <span>Total a Pagar:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Firmas Digitales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">3. Firmas Digitales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SignatureBox title="Firma del Emisor" onSave={setEmitterSignature} signature={emitterSignature} />
                <SignatureBox title="Firma del Cliente" onSave={setClientSignature} signature={clientSignature} />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => setActiveTab('invoices')}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition"
              >
                Guardar Documento
              </button>
            </div>
          </form>
        )}

        {/* VISTA PREVIA IMPRIMIBLE (PDF) */}
        {activeTab === 'preview' && selectedInvoice && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center no-print">
              <button
                onClick={() => setActiveTab('invoices')}
                className="text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                ← Volver a Facturas
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" /> Imprimir o Guardar PDF
              </button>
            </div>

            {/* Hoja de Factura */}
            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-lg print:shadow-none print:border-none print:p-0">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">FACTURA COMERCIAL</h2>
                  <p className="text-sm font-semibold text-blue-600 mt-1">{selectedInvoice.type.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">N° Documento</p>
                  <p className="text-xl font-bold text-slate-900">{selectedInvoice.id}</p>
                  <p className="text-xs text-slate-500 mt-1">Fecha: {selectedInvoice.date}</p>
                </div>
              </div>

              {/* Cliente */}
              <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cliente:</p>
                <p className="text-base font-bold text-slate-800">{selectedInvoice.clientName}</p>
                {selectedInvoice.clientPhone && <p className="text-xs text-slate-600">Tel: {selectedInvoice.clientPhone}</p>}
                {selectedInvoice.clientAddress && <p className="text-xs text-slate-600">Dir: {selectedInvoice.clientAddress}</p>}
              </div>

              {/* Tabla de Productos */}
              <table className="w-full text-left mb-6">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-2">Cant.</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2 text-right">Precio Unit.</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {selectedInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 text-slate-600">{it.cant}</td>
                      <td className="py-3 font-medium text-slate-800">{it.desc}</td>
                      <td className="py-3 text-right text-slate-600">${Number(it.precio).toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-slate-900">
                        ${(Number(it.cant) * Number(it.precio)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totales */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ITBMS (7%):</span>
                    <span>${selectedInvoice.itbms.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.abono > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Abono:</span>
                      <span>-${selectedInvoice.abono.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-slate-900 border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Firmas Impresas */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                <div className="text-center">
                  {selectedInvoice.emitterSignature ? (
                    <img src={selectedInvoice.emitterSignature} alt="Firma Emisor" className="h-16 mx-auto mb-2 object-contain" />
                  ) : (
                    <div className="h-16 border-b border-dashed border-slate-300 mb-2"></div>
                  )}
                  <p className="text-xs font-semibold text-slate-700">Firma Autorizada (Emisor)</p>
                </div>

                <div className="text-center">
                  {selectedInvoice.clientSignature ? (
                    <img src={selectedInvoice.clientSignature} alt="Firma Cliente" className="h-16 mx-auto mb-2 object-contain" />
                  ) : (
                    <div className="h-16 border-b border-dashed border-slate-300 mb-2"></div>
                  )}
                  <p className="text-xs font-semibold text-slate-700">Firma de Conformidad (Cliente)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA CLIENTES */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Directorio de Clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clients.map((cli) => (
                <div key={cli.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {cli.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{cli.name}</h4>
                      <p className="text-xs text-slate-400">{cli.email || 'Sin correo'}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {cli.phone || 'No registrado'}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {cli.address || 'Sin dirección'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Componente para Dibujar Firma en Canvas
function SignatureBox({ title, onSave, signature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSave('');
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-slate-700">{title}</span>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Limpiar
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={120}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-28 bg-white border border-slate-300 rounded-xl cursor-crosshair touch-none"
      />
    </div>
  );
}

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FactuPro - Facturas & Cotizaciones</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
opencode github install
ext install GitHub.copilot-chat
https://opencode.ai/install
name: Scheduled OpenCode Task

on:
  schedule:
    - cron: "0 9 * * 1" # Every Monday at 9am UTC

jobs:
  opencode:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review the codebase for any TODO comments and create a summary.
            If you find issues worth addressing, open an issue to track them.
            npm i -g opencode-ai
