import React from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, CheckCircle, Zap, Database } from 'lucide-react';
import { Invoice, Quote, Material, FavoriteClient, EvidenceItem } from '../types';
import { exportInvoicesToExcel, exportCatalogToExcel } from '../utils/exportUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  quotes: Quote[];
  materials: Material[];
  favoriteClients?: FavoriteClient[];
  evidences?: EvidenceItem[];
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  invoices,
  quotes,
  materials,
  favoriteClients = [],
  evidences = []
}) => {
  if (!isOpen) return null;

  const handleDownloadJsonBackup = () => {
    const backupData = {
      appName: 'EM Servicios Eléctricos',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      invoices,
      quotes,
      materials,
      clients: favoriteClients,
      evidences
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `EM_Servicios_Electricos_Backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              EXPORTACIÓN MULTIFORMATO UNIFICADA
            </span>
            <h3 className="text-lg font-black text-[#06315a] font-mono">
              DESCARGAR REPORTES TRIBUTARIOS Y RESPALDO
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer">✕</button>
        </div>

        <div className="space-y-3">
          
          {/* JSON Backup Export */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-indigo-700" />
                Respaldo Completo del Sistema (JSON Backup)
              </h4>
              <p className="text-[11px] text-indigo-900/80 mt-0.5">
                Guarda {invoices.length} facturas, {quotes.length} cotizaciones, {materials.length} insumos y {favoriteClients.length} clientes en un solo archivo .json.
              </p>
            </div>
            <button
              onClick={() => {
                handleDownloadJsonBackup();
                onClose();
              }}
              className="bg-[#06315a] hover:bg-sky-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Descargar .json</span>
            </button>
          </div>

          {/* Excel Invoices Export */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                Reporte de Facturación DTE (Excel)
              </h4>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                Incluye {invoices.length} facturas emitidas, códigos CAFE DGI e ITBMS.
              </p>
            </div>
            <button
              onClick={() => {
                exportInvoicesToExcel(invoices);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0"
            >
              Descargar .xlsx
            </button>
          </div>

          {/* Excel Catalog Export */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                Inventario Catálogo Multiproveedor (Excel)
              </h4>
              <p className="text-[11px] text-amber-900/80 mt-0.5">
                Listado de {materials.length} insumos con costos de Novey, Cochez y Doit Center.
              </p>
            </div>
            <button
              onClick={() => {
                exportCatalogToExcel(materials);
                onClose();
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0"
            >
              Descargar .xlsx
            </button>
          </div>

          {/* Note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Para exportaciones individuales en formato <strong>PDF</strong> o <strong>Word (.docx)</strong>, utilice las opciones de descarga rápida en la vista de detalle de cada Factura o Cotización.
            </span>
          </div>

        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
