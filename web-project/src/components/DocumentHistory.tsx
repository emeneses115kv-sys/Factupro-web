import React, { useState, useRef, useEffect } from 'react';
import { 
  History, 
  FileText, 
  FileCheck2, 
  FileCheck,
  FolderOpen,
  Camera, 
  CameraOff,
  Image as ImageIcon, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Upload, 
  Plus, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  FileSpreadsheet,
  RefreshCw,
  X,
  Check,
  Zap,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Invoice, Quote, EvidenceItem } from '../types';
import { exportInvoiceToPDF, exportQuoteToPDF, exportInvoicesToExcel } from '../utils/exportUtils';
import { PrintDocumentModal } from './PrintDocumentModal';

interface Props {
  invoices: Invoice[];
  quotes: Quote[];
  evidences: EvidenceItem[];
  onAddEvidence: (evidence: EvidenceItem) => void;
  onUpdateInvoiceStatus?: (id: string, status: Invoice['status'], receiptImage?: string) => void;
  onCloseSection?: () => void;
}

export const DocumentHistory: React.FC<Props> = ({
  invoices,
  quotes,
  evidences,
  onAddEvidence,
  onUpdateInvoiceStatus,
  onCloseSection
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'invoices' | 'quotes' | 'evidences'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [printableDoc, setPrintableDoc] = useState<{ doc: Invoice | Quote; type: 'invoice' | 'quote' } | null>(null);

  // New Evidence state
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceCategory, setEvidenceCategory] = useState<EvidenceItem['category']>('Después del Trabajo');
  const [evidenceDocumentId, setEvidenceDocumentId] = useState(invoices[0]?.id || '');
  const [evidenceImage, setEvidenceImage] = useState<string>('');

  // Camera Receipt Capture State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [capturedReceipt, setCapturedReceipt] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [autoMarkPaid, setAutoMarkPaid] = useState<boolean>(true);
  const [receiptNote, setReceiptNote] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Preview Receipt Modal
  const [viewingReceipt, setViewingReceipt] = useState<{
    url: string;
    invoiceNumber: string;
    clientName: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera stream error:', err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (fallbackErr) {
        setCameraError('No se pudo acceder a la cámara del dispositivo. Puedes seleccionar o subir la foto del recibo desde tus archivos.');
        setIsCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedReceipt(dataUrl);
        stopCamera();
      }
    }
  };

  const handleOpenReceiptCamera = (invoiceId?: string) => {
    const targetId = invoiceId || invoices[0]?.id || '';
    setSelectedInvoiceId(targetId);
    setCapturedReceipt('');
    setReceiptNote('');
    setAutoMarkPaid(true);
    setIsCameraModalOpen(true);
    startCamera('environment');
  };

  const handleCloseCameraModal = () => {
    stopCamera();
    setIsCameraModalOpen(false);
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleFileUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedReceipt(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !capturedReceipt) return;

    const targetInvoice = invoices.find(i => i.id === selectedInvoiceId);
    if (!targetInvoice) return;

    if (onUpdateInvoiceStatus) {
      const newStatus = autoMarkPaid ? 'Pagada' : targetInvoice.status;
      onUpdateInvoiceStatus(selectedInvoiceId, newStatus, capturedReceipt);
    }

    onAddEvidence({
      id: `ev-receipt-${Date.now()}`,
      documentId: targetInvoice.invoiceNumber,
      documentType: 'Invoice',
      title: `Recibo Físico - Factura ${targetInvoice.invoiceNumber}${receiptNote ? ` (${receiptNote})` : ''}`,
      imageUrl: capturedReceipt,
      category: 'Comprobante de Pago',
      dateUploaded: new Date().toISOString().slice(0, 10)
    });

    handleCloseCameraModal();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle || !evidenceImage) return;

    const newEv: EvidenceItem = {
      id: `ev-${Date.now()}`,
      documentId: evidenceDocumentId,
      documentType: 'Invoice',
      title: evidenceTitle,
      imageUrl: evidenceImage,
      category: evidenceCategory,
      dateUploaded: new Date().toISOString().slice(0, 10)
    };

    onAddEvidence(newEv);
    setIsEvidenceModalOpen(false);
    setEvidenceTitle('');
    setEvidenceImage('');
  };

  // Filtered lists
  const filteredInvoices = invoices.filter(inv => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return inv.invoiceNumber.toLowerCase().includes(q) || 
      inv.clientName.toLowerCase().includes(q) ||
      inv.clientRuc.toLowerCase().includes(q);
  });

  const filteredQuotes = quotes.filter(qItem => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return qItem.quoteNumber.toLowerCase().includes(q) || 
      qItem.clientName.toLowerCase().includes(q) ||
      qItem.clientRuc.toLowerCase().includes(q);
  });

  const filteredEvidences = evidences.filter(ev => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return ev.title.toLowerCase().includes(q) || 
      ev.documentId.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-12">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#06315a] font-mono tracking-tight uppercase">
              HISTORIAL DE DOCUMENTOS Y GALERÍA DE EVIDENCIAS
            </h2>
            <span className="bg-sky-100 text-[#06315a] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
              Registros EM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Archivo digital unificado de Facturas DTE, Cotizaciones aprobadas y respaldo fotográfico de recibos físicos e insumos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => handleOpenReceiptCamera()}
            className="bg-[#06315a] hover:bg-sky-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border border-sky-600"
          >
            <Camera className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            <span>📷 Capturar Recibo Físico</span>
          </button>

          <button
            onClick={() => setIsEvidenceModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Adjuntar Evidencia</span>
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

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todos los Documentos', icon: FolderOpen },
            { id: 'invoices', label: `Facturas DTE (${invoices.length})`, icon: FileText },
            { id: 'quotes', label: `Cotizaciones (${quotes.length})`, icon: FileCheck },
            { id: 'evidences', label: `Galería Evidencias (${evidences.length})`, icon: Camera }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#06315a] text-white shadow-xs ring-1 ring-sky-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06315a]"
          />
        </div>
      </div>

      {/* GALLERIES OR LISTS */}
      {activeTab === 'evidences' ? (
        /* Evidences Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvidences.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition">
              <div 
                className="h-44 relative bg-slate-100 cursor-pointer group"
                onClick={() => setViewingReceipt({ url: ev.imageUrl, invoiceNumber: ev.documentId, clientName: ev.title })}
              >
                <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                <span className="absolute top-2 left-2 bg-slate-900/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {ev.category}
                </span>
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white text-slate-900 font-bold text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Ampliar Foto
                  </span>
                </div>
              </div>
              <div className="p-3.5">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ev.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1">Fecha: {ev.dateUploaded} · Ref: {ev.documentId}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Document Table List */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Número / Ref</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5 text-right">Monto Total ($)</th>
                  <th className="p-3.5 text-center">Estado</th>
                  <th className="p-3.5 text-center">Recibo Físico</th>
                  <th className="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {/* Invoices */}
                {(activeTab === 'all' || activeTab === 'invoices') && filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-sky-100 text-[#06315a] font-bold text-[10px] px-2 py-0.5 rounded-md">
                        <FileText className="w-3 h-3" /> Factura DTE
                      </span>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-[#06315a]">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-medium">{inv.clientName}</td>
                    <td className="p-3.5 font-mono text-slate-500">{inv.date}</td>
                    <td className="p-3.5 text-right font-black font-mono text-slate-900">${inv.total.toFixed(2)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Pagada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    {/* Receipt Status / Camera trigger */}
                    <td className="p-3.5 text-center">
                      {inv.receiptImage ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingReceipt({ url: inv.receiptImage!, invoiceNumber: inv.invoiceNumber, clientName: inv.clientName })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                            title="Ver Recibo Adjunto"
                          >
                            <ImageIcon className="w-3 h-3 text-emerald-600" />
                            <span>Recibo Adjunto</span>
                          </button>
                          <button
                            onClick={() => handleOpenReceiptCamera(inv.id)}
                            className="p-1 bg-slate-100 text-slate-600 hover:text-sky-800 hover:bg-sky-100 rounded-md transition cursor-pointer"
                            title="Refotografiar o Cambiar Recibo"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenReceiptCamera(inv.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-100 rounded-lg text-[10px] font-extrabold transition cursor-pointer"
                        >
                          <Camera className="w-3 h-3 text-amber-600 stroke-[2.5]" />
                          <span>Capturar Recibo</span>
                        </button>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintableDoc({ doc: inv, type: 'invoice' })}
                          className="p-1.5 text-slate-700 hover:text-sky-900 bg-slate-100 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                          title="Vista e Impresión Oficial DTE"
                        >
                          <Printer className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          onClick={() => exportInvoiceToPDF(inv)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Quotes */}
                {(activeTab === 'all' || activeTab === 'quotes') && filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                        <FileCheck2 className="w-3 h-3" /> Cotización
                      </span>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-amber-700">{q.quoteNumber}</td>
                    <td className="p-3.5 font-medium">{q.clientName}</td>
                    <td className="p-3.5 font-mono text-slate-500">{q.date}</td>
                    <td className="p-3.5 text-right font-black font-mono text-slate-900">${q.total.toFixed(2)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        q.status === 'Aprobada' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center text-slate-400 text-[10px]">N/A</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintableDoc({ doc: q, type: 'quote' })}
                          className="p-1.5 text-slate-700 hover:text-sky-900 bg-slate-100 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                          title="Vista e Impresión Oficial"
                        >
                          <Printer className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          onClick={() => exportQuoteToPDF(q)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CAMERA RECEIPT CAPTURE MODAL */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#06315a] flex items-center justify-center text-amber-400 shadow-md">
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#06315a] font-mono uppercase tracking-tight">
                    CAPTURAR RECIBO FÍSICO CON CÁMARA
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Toma una fotografía directa del comprobante de caja o depósito.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseCameraModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttachReceiptSubmit} className="space-y-4 text-xs">
              
              {/* Select Target Invoice */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Factura de Destino *
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold text-slate-800 text-xs focus:ring-2 focus:ring-[#06315a]"
                  required
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.clientName} (${inv.total.toFixed(2)}) [{inv.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Camera Feed or Photo Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 uppercase">
                    Fotografía del Recibo *
                  </label>
                  {isCameraActive && (
                    <button
                      type="button"
                      onClick={handleToggleFacingMode}
                      className="text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Cambiar Cámara ({facingMode === 'environment' ? 'Trasera' : 'Frontal'})
                    </button>
                  )}
                </div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-900 min-h-[260px] flex items-center justify-center">
                  
                  {/* Option A: Preview captured receipt */}
                  {capturedReceipt ? (
                    <div className="relative w-full h-full min-h-[260px]">
                      <img 
                        src={capturedReceipt} 
                        alt="Recibo Capturado" 
                        className="w-full h-64 object-contain bg-slate-950" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-700">
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Foto Lista
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCapturedReceipt('');
                            startCamera(facingMode);
                          }}
                          className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Repetir Foto
                        </button>
                      </div>
                    </div>
                  ) : isCameraActive ? (
                    /* Option B: Active Live Camera View */
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                        <button
                          type="button"
                          onClick={takeSnapshot}
                          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-full shadow-2xl transition cursor-pointer flex items-center gap-2 border-2 border-slate-950 hover:scale-105 active:scale-95"
                        >
                          <Camera className="w-5 h-5 stroke-[2.5]" />
                          <span>📸 Tomar Captura del Recibo</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Option C: Camera Initializing / Fallback File Input */
                    <div className="p-6 text-center space-y-3">
                      {cameraError ? (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] font-medium text-left">
                          ⚠️ {cameraError}
                        </div>
                      ) : (
                        <CameraOff className="w-10 h-10 text-slate-500 mx-auto" />
                      )}

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => startCamera(facingMode)}
                          className="bg-[#06315a] hover:bg-sky-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Camera className="w-4 h-4 text-amber-400" />
                          <span>Activar Cámara</span>
                        </button>

                        <label className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-700">
                          <Upload className="w-4 h-4" />
                          <span>Subir desde Archivo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment"
                            onChange={handleFileUploadReceipt} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Status & Options */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoMarkPaid}
                    onChange={(e) => setAutoMarkPaid(e.target.checked)}
                    className="w-4 h-4 text-[#06315a] rounded border-slate-300 focus:ring-[#06315a]"
                  />
                  <span className="font-bold text-slate-800">
                    Marcar estado de factura automáticamente como "PAGADA"
                  </span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Nota o Referencia Corta (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Recibo No. 0481 Yappy / Depósito Banco General"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none text-xs"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseCameraModal}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!capturedReceipt}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5 ${
                    capturedReceipt
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar y Adjuntar a Factura</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW RECEIPT ZOOM MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#06315a] font-mono">
                  COMPROBANTE / RECIBO FÍSICO — {viewingReceipt.invoiceNumber}
                </h3>
                <p className="text-xs text-slate-500">Cliente: {viewingReceipt.clientName}</p>
              </div>
              <button 
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl overflow-hidden p-2 flex items-center justify-center max-h-[70vh]">
              <img 
                src={viewingReceipt.url} 
                alt="Recibo Ampliado" 
                className="max-h-[65vh] w-auto object-contain rounded-xl" 
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={viewingReceipt.url}
                download={`Recibo_${viewingReceipt.invoiceNumber}.jpg`}
                className="bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Imagen</span>
              </a>

              <button
                onClick={() => setViewingReceipt(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD EVIDENCE MODAL */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-[#06315a] font-mono uppercase">
                ADJUNTAR EVIDENCIA FOTOGRÁFICA
              </h3>
              <button onClick={() => setIsEvidenceModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Título de la Fotografía *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tablero Eléctrico Terminado / Recibo Yappy"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Categoría</label>
                <select
                  value={evidenceCategory}
                  onChange={(e) => setEvidenceCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                >
                  <option value="Comprobante de Pago">Comprobante de Pago</option>
                  <option value="Antes del Trabajo">Antes del Trabajo</option>
                  <option value="Después del Trabajo">Después del Trabajo</option>
                  <option value="Medidor / Tablero">Medidor / Tablero</option>
                  <option value="Firma Cliente">Firma Cliente</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Seleccionar / Capturar Imagen *</label>
                <label className="flex items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-[#06315a] transition">
                  <Camera className="w-6 h-6 text-[#06315a]" />
                  <span className="font-semibold text-slate-700">Subir Archivo de Foto</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {evidenceImage && (
                  <img src={evidenceImage} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-slate-200" referrerPolicy="no-referrer" />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-3 py-2 text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Evidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT DOCUMENT MODAL */}
      <PrintDocumentModal
        isOpen={!!printableDoc}
        onClose={() => setPrintableDoc(null)}
        document={printableDoc?.doc || null}
        type={printableDoc?.type || 'invoice'}
      />

    </div>
  );
};

