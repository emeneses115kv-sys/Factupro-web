import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { Invoice, Quote, Material } from '../types';

// Company Constant Metadata
export const COMPANY_INFO = {
  name: 'EM SERVICIOS ELÉCTRICOS',
  tagline: 'Soluciones Eléctricas Residenciales, Comerciales e Industriales',
  ruc: 'RUC: 8-812-4910 DV 82',
  phone: '+507 6899-4321 / +507 392-1088',
  email: 'contacto@emservicios.pa',
  address: 'Vía Transístmica, Edificio Los Ángeles, Local 4B, Ciudad de Panamá',
  web: 'www.emservicios.pa'
};

/**
 * EXPORT INVOICE TO PDF
 */
export function exportInvoiceToPDF(invoice: Invoice) {
  const doc = new jsPDF();
  const primaryColor = [6, 49, 90]; // #06315a
  const accentYellow = [234, 179, 8]; // #eab308

  // Header Background Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('EM SERVICIOS ELÉCTRICOS', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY_INFO.tagline} | ${COMPANY_INFO.ruc}`, 14, 24);
  doc.text(`Tel: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}`, 14, 30);

  // Invoice Badge Right Top
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(140, 8, 56, 20, 2, 2, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA DTE', 144, 16);
  doc.setFontSize(10);
  doc.text(invoice.invoiceNumber, 144, 23);

  // Status Banner
  let statusBg = [220, 252, 231]; // Green
  let statusText = [22, 101, 52];
  if (invoice.status === 'Pendiente') {
    statusBg = [254, 243, 199];
    statusText = [146, 64, 14];
  } else if (invoice.status === 'Vencida') {
    statusBg = [254, 226, 226];
    statusText = [153, 27, 27];
  }

  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.roundedRect(140, 42, 56, 8, 1, 1, 'F');
  doc.setTextColor(statusText[0], statusText[1], statusText[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`ESTADO: ${invoice.status.toUpperCase()}`, 144, 47.5);

  // Client & Document Meta Info
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE / FACTURADO A:', 14, 46);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${invoice.clientName}`, 14, 52);
  doc.text(`RUC / Cédula: ${invoice.clientRuc}`, 14, 57);
  doc.text(`Teléfono: ${invoice.clientPhone} | Email: ${invoice.clientEmail}`, 14, 62);
  doc.text(`Dirección: ${invoice.clientAddress}`, 14, 67);

  doc.setFont('helvetica', 'bold');
  doc.text(`Fecha Emisión: ${invoice.date}`, 140, 57);
  doc.text(`Fecha Vencimiento: ${invoice.dueDate}`, 140, 62);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`CAFE: ${invoice.cafeCode}`, 14, 73);

  // Items Table
  const tableRows = invoice.items.map((item, idx) => [
    (idx + 1).toString(),
    item.description,
    `${item.quantity} ${item.unit}`,
    `$${item.unitPrice.toFixed(2)}`,
    `$${item.totalPrice.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 78,
    head: [['#', 'Descripción del Producto / Servicio', 'Cant.', 'P. Unitario', 'Total']],
    body: tableRows,
    headStyles: {
      fillColor: [6, 49, 90],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Totals Section
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });

  doc.text(`ITBMS (7%):`, 140, finalY + 6);
  doc.text(`$${invoice.taxAmount.toFixed(2)}`, 190, finalY + 6, { align: 'right' });

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(135, finalY + 11, 60, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TOTAL DTE:`, 138, finalY + 18);
  doc.text(`$${invoice.total.toFixed(2)}`, 192, finalY + 18, { align: 'right' });

  // Notes & Payment instructions
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MÉTODO DE PAGO & NOTAS:', 14, finalY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Método: ${invoice.paymentMethod}`, 14, finalY + 10);
  doc.text(`Banco General - Cuenta Corriente EM Servicios Eléctricos: #03-88-01-998822-1`, 14, finalY + 15);
  doc.text(`Yappy comercial: @EMServicios`, 14, finalY + 20);
  if (invoice.notes) {
    doc.text(`Observaciones: ${invoice.notes}`, 14, finalY + 25);
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Documento Tributario Electrónico (DTE) conforme a regulaciones de la DGI Panamá.', 105, 285, { align: 'center' });

  doc.save(`${invoice.invoiceNumber}_EM_Servicios.pdf`);
}

/**
 * EXPORT QUOTE TO PDF
 */
export function exportQuoteToPDF(quote: Quote) {
  const doc = new jsPDF();
  const primaryColor = [6, 49, 90];

  // Header Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('EM SERVICIOS ELÉCTRICOS', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY_INFO.tagline} | ${COMPANY_INFO.ruc}`, 14, 24);
  doc.text(`Tel: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}`, 14, 30);

  // Quote Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(140, 8, 56, 20, 2, 2, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESUPUESTO', 144, 16);
  doc.setFontSize(10);
  doc.text(quote.quoteNumber, 144, 23);

  // Client Info
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARADO PARA:', 14, 46);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${quote.clientName}`, 14, 52);
  doc.text(`RUC / Cédula: ${quote.clientRuc}`, 14, 57);
  doc.text(`Teléfono: ${quote.clientPhone} | Email: ${quote.clientEmail}`, 14, 62);
  doc.text(`Ubicación Proyecto: ${quote.projectAddress}`, 14, 67);

  doc.setFont('helvetica', 'bold');
  doc.text(`Fecha Emisión: ${quote.date}`, 140, 52);
  doc.text(`Validez: ${quote.validityDays} Días`, 140, 57);
  doc.text(`Válido hasta: ${quote.validUntil}`, 140, 62);

  // Items Table
  const tableRows = quote.items.map((item, idx) => [
    (idx + 1).toString(),
    item.description,
    `${item.quantity} ${item.unit}`,
    `$${item.unitPrice.toFixed(2)}`,
    `$${item.totalPrice.toFixed(2)}`
  ]);

  if (quote.laborCost > 0) {
    tableRows.push([
      (quote.items.length + 1).toString(),
      'Mano de Obra Especializada y Pruebas Técnicas',
      '1 Global',
      `$${quote.laborCost.toFixed(2)}`,
      `$${quote.laborCost.toFixed(2)}`
    ]);
  }

  autoTable(doc, {
    startY: 74,
    head: [['#', 'Descripción de Materiales / Mano de Obra', 'Cant.', 'P. Unitario', 'Total']],
    body: tableRows,
    headStyles: {
      fillColor: [6, 49, 90],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totals
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(`$${quote.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });

  doc.text(`ITBMS (7%):`, 140, finalY + 6);
  doc.text(`$${quote.taxAmount.toFixed(2)}`, 190, finalY + 6, { align: 'right' });

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(135, finalY + 11, 60, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TOTAL ESTIMA:`, 138, finalY + 18);
  doc.text(`$${quote.total.toFixed(2)}`, 192, finalY + 18, { align: 'right' });

  // Signature section
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  doc.text('Aceptación de Cotización (Firma del Cliente):', 14, finalY + 15);

  if (quote.clientSignature) {
    try {
      doc.addImage(quote.clientSignature, 'PNG', 14, finalY + 18, 50, 20);
    } catch (e) {
      doc.text('(Firma Digital Registrada)', 14, finalY + 28);
    }
  } else {
    doc.line(14, finalY + 35, 80, finalY + 35);
    doc.text('Firma Autorizada Cliente', 14, finalY + 39);
  }

  doc.save(`${quote.quoteNumber}_EM_Servicios.pdf`);
}

/**
 * EXPORT INVOICE OR QUOTE LIST TO EXCEL (.xlsx)
 */
export function exportInvoicesToExcel(invoices: Invoice[]) {
  const data = invoices.map(inv => ({
    'N° Factura': inv.invoiceNumber,
    'Código CAFE DTE': inv.cafeCode,
    'Fecha Emisión': inv.date,
    'Fecha Vencimiento': inv.dueDate,
    'Cliente': inv.clientName,
    'RUC Cliente': inv.clientRuc,
    'Teléfono': inv.clientPhone,
    'Subtotal ($)': inv.subtotal,
    'ITBMS 7% ($)': inv.taxAmount,
    'Total ($)': inv.total,
    'Estado': inv.status,
    'Método Pago': inv.paymentMethod
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas DTE');

  XLSX.writeFile(workbook, `Reporte_Facturas_EM_Servicios_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportCatalogToExcel(materials: Material[]) {
  const data = materials.map(m => ({
    'Código': m.code,
    'Nombre del Material': m.name,
    'Categoría': m.category,
    'Proveedor': m.provider,
    'Precio Costo ($)': m.costPrice,
    'Precio Venta ($)': m.publicPrice,
    'Margen Ganancia ($)': (m.publicPrice - m.costPrice).toFixed(2),
    'Margen %': (((m.publicPrice - m.costPrice) / m.costPrice) * 100).toFixed(1) + '%',
    'Unidad': m.unit,
    'Stock': m.stock
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo Materiales');

  XLSX.writeFile(workbook, `Catalogo_Materiales_EM_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * EXPORT INVOICE TO WORD (.docx)
 */
export async function exportInvoiceToWord(invoice: Invoice) {
  const tableHeaderRow = new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Descripción', bold: true })] })], width: { size: 50, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cantidad', bold: true })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Precio Unit ($)', bold: true })] })], width: { size: 12, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total ($)', bold: true })] })], width: { size: 13, type: WidthType.PERCENTAGE } }),
    ],
  });

  const tableBodyRows = invoice.items.map((item, idx) => {
    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph((idx + 1).toString())] }),
        new TableCell({ children: [new Paragraph(item.description)] }),
        new TableCell({ children: [new Paragraph(`${item.quantity} ${item.unit}`)] }),
        new TableCell({ children: [new Paragraph(`$${item.unitPrice.toFixed(2)}`)] }),
        new TableCell({ children: [new Paragraph(`$${item.totalPrice.toFixed(2)}`)] }),
      ],
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: COMPANY_INFO.name, bold: true, size: 32, color: '06315A' }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${COMPANY_INFO.tagline} | ${COMPANY_INFO.ruc}\n`, size: 20 }),
              new TextRun({ text: `Tel: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}`, size: 18 }),
            ],
          }),
          new Paragraph({ text: ' ' }),
          new Paragraph({
            children: [
              new TextRun({ text: `FACTURA DTE: ${invoice.invoiceNumber}`, bold: true, size: 28, color: '06315A' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Código CAFE: ${invoice.cafeCode}\n`, size: 18 }),
              new TextRun({ text: `Estado: ${invoice.status}\n`, bold: true, size: 20 }),
              new TextRun({ text: `Fecha: ${invoice.date} | Vencimiento: ${invoice.dueDate}`, size: 18 }),
            ],
          }),
          new Paragraph({ text: ' ' }),
          new Paragraph({
            children: [
              new TextRun({ text: 'DATOS DEL CLIENTE:', bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Cliente: ${invoice.clientName}\n` }),
              new TextRun({ text: `RUC: ${invoice.clientRuc}\n` }),
              new TextRun({ text: `Teléfono: ${invoice.clientPhone} | Email: ${invoice.clientEmail}\n` }),
              new TextRun({ text: `Dirección: ${invoice.clientAddress}` }),
            ],
          }),
          new Paragraph({ text: ' ' }),
          new Table({
            rows: [tableHeaderRow, ...tableBodyRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: ' ' }),
          new Paragraph({
            children: [
              new TextRun({ text: `Subtotal: $${invoice.subtotal.toFixed(2)}\n`, size: 20 }),
              new TextRun({ text: `ITBMS 7%: $${invoice.taxAmount.toFixed(2)}\n`, size: 20 }),
              new TextRun({ text: `TOTAL DTE: $${invoice.total.toFixed(2)}`, bold: true, size: 24, color: '06315A' }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${invoice.invoiceNumber}_EM_Servicios.docx`);
}

export async function exportQuoteToWord(quote: Quote) {
  const tableHeaderRow = new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Descripción Materiales / Mano de Obra', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cantidad', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Precio ($)', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total ($)', bold: true })] })] }),
    ],
  });

  const tableBodyRows = quote.items.map((item, idx) => {
    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph((idx + 1).toString())] }),
        new TableCell({ children: [new Paragraph(item.description)] }),
        new TableCell({ children: [new Paragraph(`${item.quantity} ${item.unit}`)] }),
        new TableCell({ children: [new Paragraph(`$${item.unitPrice.toFixed(2)}`)] }),
        new TableCell({ children: [new Paragraph(`$${item.totalPrice.toFixed(2)}`)] }),
      ],
    });
  });

  if (quote.laborCost > 0) {
    tableBodyRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph((quote.items.length + 1).toString())] }),
          new TableCell({ children: [new Paragraph('Mano de Obra y Certificación Técnica')] }),
          new TableCell({ children: [new Paragraph('1 Global')] }),
          new TableCell({ children: [new Paragraph(`$${quote.laborCost.toFixed(2)}`)] }),
          new TableCell({ children: [new Paragraph(`$${quote.laborCost.toFixed(2)}`)] }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: COMPANY_INFO.name, bold: true, size: 32, color: '06315A' }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `COTIZACIÓN / PRESUPUESTO: ${quote.quoteNumber}`, bold: true, size: 26 })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Cliente: ${quote.clientName}\n` }),
              new TextRun({ text: `Fecha: ${quote.date} | Validez: ${quote.validityDays} días` }),
            ],
          }),
          new Paragraph({ text: ' ' }),
          new Table({
            rows: [tableHeaderRow, ...tableBodyRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: ' ' }),
          new Paragraph({
            children: [
              new TextRun({ text: `Subtotal: $${quote.subtotal.toFixed(2)}\n` }),
              new TextRun({ text: `ITBMS 7%: $${quote.taxAmount.toFixed(2)}\n` }),
              new TextRun({ text: `TOTAL ESTIMADO: $${quote.total.toFixed(2)}`, bold: true, size: 24, color: '06315A' }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${quote.quoteNumber}_EM_Servicios.docx`);
}
