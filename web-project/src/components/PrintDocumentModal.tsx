import React from 'react';
import { Printer, Download, FileText, FileCode, CheckCircle, X, Shield, Zap, Building, Calendar, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Invoice, Quote } from '../types';
import { exportInvoiceToPDF, exportQuoteToPDF, exportInvoiceToWord, exportQuoteToWord } from '../utils/exportUtils';
import { EMLogo } from './EMLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  document: Invoice | Quote | null;
  type: 'invoice' | 'quote';
}

export const PrintDocumentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  document,
  type
}) => {
  if (!isOpen || !document) return null;

  const isInvoice = type === 'invoice';
  const invoice = isInvoice ? (document as Invoice) : null;
  const quote = !isInvoice ? (document as Quote) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (isInvoice && invoice) {
      exportInvoiceToPDF(invoice);
    } else if (!isInvoice && quote) {
      exportQuoteToPDF(quote);
    }
  };

  const handleDownloadWord = () => {
    if (isInvoice && invoice) {
      exportInvoiceToWord(invoice);
    } else if (!isInvoice && quote) {
      exportQuoteToWord(quote);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print-modal-overlay">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto print-modal-card flex flex-col max-h-[92vh]">
        
        {/* Top Action Control Bar (Hidden when printing) */}
        <div className="bg-[#06315a] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Printer className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black font-mono tracking-tight text-white uppercase flex items-center gap-2">
                VISTA DE IMPRESIÓN Y DOCUMENTO IMPRESO
              </h3>
              <p className="text-[11px] text-sky-200/90">
                Formato impreso oficial estandarizado según normas de la DGI Panamá.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Imprimir / Guardar PDF (Ctrl+P)</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={handleDownloadWord}
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-sky-200 hover:text-white hover:bg-sky-900 rounded-full transition cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center grow print:p-0 print:bg-white">
          
          <div className="printable-document bg-white border border-slate-200 shadow-lg rounded-2xl p-6 sm:p-10 w-full max-w-[210mm] min-h-[297mm] text-slate-900 space-y-6 text-xs font-sans print:shadow-none print:border-none print:rounded-none">
            
            {/* Header: Company Info & Document Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-[#06315a] pb-6">
              
              {/* Left Column: Logo & Company Specs */}
              <div className="space-y-2 max-w-sm">
                <EMLogo size="lg" />
                <div className="text-[11px] text-slate-700 space-y-0.5 font-medium leading-relaxed">
                  <p className="font-extrabold text-[#06315a] text-xs uppercase">EM SERVICIOS ELÉCTRICOS S.A.</p>
                  <p>RUC: 155712398-2-2021 DV 45</p>
                  <p>PAC Autorizado DGI — Facturación Electrónica DTE</p>
                  <p>Chiriquí y Ciudad de Panamá, República de Panamá</p>
                  <p>Teléfono: +507 6890-4422 / WhatsApp Corporativo</p>
                  <p>Correo: em.electricos.pa@gmail.com</p>
                </div>
              </div>

              {/* Right Column: Document Type Badge & Details */}
              <div className="text-right space-y-2 shrink-0 self-stretch sm:self-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 bg-print-light">
                <div className="inline-block bg-[#06315a] text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-print-dark">
                  {isInvoice ? 'FACTURA ELECTRÓNICA DTE' : 'COTIZACIÓN TÉCNICA Y PRESUPUESTO'}
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <p className="text-sm font-black text-[#06315a]">
                    NO: {isInvoice ? invoice?.invoiceNumber : quote?.quoteNumber}
                  </p>
                  <p className="text-slate-600 font-sans">
                    <strong>Fecha Emisión:</strong> {document.date}
                  </p>
                  {isInvoice ? (
                    <p className="text-slate-600 font-sans">
                      <strong>Vencimiento:</strong> {invoice?.dueDate}
                    </p>
                  ) : (
                    <p className="text-slate-600 font-sans">
                      <strong>Válida hasta:</strong> {quote?.validUntil} ({quote?.validityDays} días)
                    </p>
                  )}
                </div>

                {isInvoice && invoice?.cafeCode && (
                  <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                    <span className="block font-bold text-slate-700">CÓDIGO CAFE / CUFE DGI:</span>
                    <span className="break-all">{invoice.cafeCode}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Client & Project Information Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 bg-print-light">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-900 tracking-wider block">
                  DATOS DEL CLIENTE
                </span>
                <p className="text-xs font-bold text-slate-900">{document.clientName}</p>
                <p className="text-slate-700">RUC / Cédula: <strong>{document.clientRuc}</strong></p>
                {document.clientEmail && <p className="text-slate-700">Email: {document.clientEmail}</p>}
                {document.clientPhone && <p className="text-slate-700">Teléfono: {document.clientPhone}</p>}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-900 tracking-wider block">
                  DETALLES DE UBICACIÓN / PAGO
                </span>
                {isInvoice ? (
                  <>
                    <p className="text-slate-700">Dirección Fiscal: <strong>{invoice?.clientAddress || 'No especificada'}</strong></p>
                    <p className="text-slate-700">Forma de Pago: <strong>{invoice?.paymentMethod}</strong></p>
                    <p className="text-slate-700">Estado DTE: <strong>{invoice?.status}</strong></p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-700">Ubicación Obra / Proyecto: <strong>{quote?.projectAddress || 'No especificada'}</strong></p>
                    <p className="text-slate-700">Estado Cotización: <strong>{quote?.status}</strong></p>
                  </>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#06315a] text-white text-[11px] font-bold uppercase tracking-wider bg-print-dark">
                    <th className="p-2.5 w-12 text-center">#</th>
                    <th className="p-2.5">Descripción del Insumo / Servicio</th>
                    <th className="p-2.5 text-center w-16">Cant.</th>
                    <th className="p-2.5 text-center w-20">Unidad</th>
                    <th className="p-2.5 text-right w-24">Precio ($)</th>
                    <th className="p-2.5 text-right w-28">Subtotal ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {document.items.map((item, idx) => (
                    <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 bg-print-light'}>
                      <td className="p-2.5 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-medium text-slate-900">{item.description}</td>
                      <td className="p-2.5 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-center text-slate-600">{item.unit}</td>
                      <td className="p-2.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}

                  {/* Labor cost item for quotes if specified */}
                  {!isInvoice && quote && quote.laborCost > 0 && (
                    <tr className="bg-amber-50/50 bg-print-accent">
                      <td className="p-2.5 text-center font-mono text-slate-500">*</td>
                      <td className="p-2.5 font-bold text-amber-950">Mano de Obra Especializada y Dirección Técnica</td>
                      <td className="p-2.5 text-center font-mono font-bold">1</td>
                      <td className="p-2.5 text-center text-slate-600">servicio</td>
                      <td className="p-2.5 text-right font-mono">${quote.laborCost.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-amber-950">${quote.laborCost.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Bank Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 no-break">
              
              {/* Payment Details / Notes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 bg-print-light text-[11px]">
                <span className="font-extrabold text-[#06315a] uppercase tracking-wide block">
                  INFORMACIÓN PARA PAGO Y TRANSFERENCIAS
                </span>
                <p className="text-slate-700"><strong>Banco General:</strong> Cuenta Corriente #03-72-01-155829-1</p>
                <p className="text-slate-700"><strong>Titular:</strong> EM SERVICIOS ELÉCTRICOS S.A.</p>
                <p className="text-slate-700"><strong>Yappy Comercial:</strong> @em_electricos_pa</p>
                
                {document.notes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600">
                    <strong>Observaciones:</strong> {document.notes}
                  </div>
                )}
              </div>

              {/* Totals Table */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>SUBTOTAL:</span>
                  <span className="font-bold">${document.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>ITBMS TRIBUTARIO (7%):</span>
                  <span className="font-bold">${document.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-black text-[#06315a] bg-amber-100 p-3 rounded-xl border border-amber-300 bg-print-accent">
                  <span>TOTAL A PAGAR:</span>
                  <span>${document.total.toFixed(2)} USD</span>
                </div>
              </div>

            </div>

            {/* Attached Receipt Image Preview if present */}
            {isInvoice && invoice?.receiptImage && (
              <div className="pt-4 border-t border-slate-200 space-y-2 no-break">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  COMPROBANTE Y RECIBO ADJUNTO DE RESPALDO:
                </span>
                <div className="max-h-48 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 inline-block p-1">
                  <img 
                    src={invoice.receiptImage} 
                    alt="Recibo Adjunto" 
                    className="max-h-44 w-auto object-contain" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* Signature & Guarantee Footer Block */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-[11px] no-break">
              
              {/* Authorized Company Seal */}
              <div className="space-y-8">
                <div className="h-12 flex items-end justify-center">
                  <span className="text-slate-400 font-mono text-[10px] italic">[SELLO OFICIAL DE FIRMA REGISTRADA]</span>
                </div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                  <p>EM SERVICIOS ELÉCTRICOS S.A.</p>
                  <p className="text-[10px] text-slate-500 font-normal">Firma Autorizada / Dirección Técnica ID-115kV</p>
                </div>
              </div>

              {/* Client Signature or Approval Seal */}
              <div className="space-y-8">
                <div className="h-12 flex items-end justify-center">
                  {!isInvoice && quote?.clientSignature ? (
                    <img 
                      src={quote.clientSignature} 
                      alt="Firma del Cliente" 
                      className="max-h-12 object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-slate-400 font-mono text-[10px] italic">[FIRMA / ACEPTACIÓN DEL CLIENTE]</span>
                  )}
                </div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                  <p>{document.clientName}</p>
                  <p className="text-[10px] text-slate-500 font-normal">Conforme con Servicios y Garantía DGI</p>
                </div>
              </div>

            </div>

            {/* Legal Notice Footer */}
            <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 pt-4 leading-relaxed font-sans">
              <p>
                Documento legal emitido de conformidad con la Ley 72 de Facturación Electrónica DGI de la República de Panamá.
              </p>
              <p>
                Garantía técnica de 30 días calendario en mano de obra e insumos instalados. Dudas o soporte: em.electricos.pa@gmail.com
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
