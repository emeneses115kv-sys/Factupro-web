export type ProviderName = 'Novey' | 'Cochez' | 'Doit Center' | 'Personalizado';

export type MaterialCategory = 
  | 'Breakers y Tableros'
  | 'Cables y Conductores'
  | 'Tuberías y Conectores'
  | 'Interruptores y Tomas'
  | 'Iluminación y Lámparas'
  | 'Herramientas y Equipos'
  | 'Accesorios y Varios';

export interface Material {
  id: string;
  code: string;
  name: string;
  category: MaterialCategory;
  provider: ProviderName;
  costPrice: number; // Precio de compra/costo en Panamá ($ USD)
  publicPrice: number; // Precio de venta al cliente ($ USD)
  unit: string; // 'unidad', 'metro', 'caja', 'tramo', 'pie'
  stock: number;
  description?: string;
  imageUrl?: string;
}

export interface FavoriteClient {
  id: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address: string;
}

export type InvoiceStatus = 'Pagada' | 'Pendiente' | 'Vencida' | 'Anulada';

export interface InvoiceItem {
  id: string;
  materialId?: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // ej. DTE-2026-0042
  cafeCode: string; // Código de Autorización de Factura Electrónica DTE Panamá
  date: string; // YYYY-MM-DD
  dueDate: string;
  clientName: string;
  clientRuc: string; // ej. 8-765-4321 DV 99
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number; // ITBMS 7%
  total: number;
  status: InvoiceStatus;
  paymentMethod: 'Efectivo' | 'ACH / Transferencia' | 'Tarjeta de Crédito' | 'Yappy';
  receiptImage?: string; // Base64 or image URL of payment receipt or work evidence
  notes?: string;
  isFavorite?: boolean;
}

export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aprobada' | 'Rechazada' | 'Vencida';

export interface Quote {
  id: string;
  quoteNumber: string; // ej. COT-2026-0105
  date: string;
  validityDays: number;
  validUntil: string;
  clientName: string;
  clientRuc: string;
  clientEmail: string;
  clientPhone: string;
  projectAddress: string;
  items: InvoiceItem[];
  laborCost: number; // Costo de Mano de Obra
  subtotal: number;
  taxAmount: number; // ITBMS 7%
  total: number;
  status: QuoteStatus;
  clientSignature?: string; // Base64 PNG image of signature
  notes?: string;
  isFavorite?: boolean;
}

export interface EvidenceItem {
  id: string;
  documentId: string;
  documentType: 'Invoice' | 'Quote';
  title: string;
  imageUrl: string;
  category: 'Comprobante de Pago' | 'Antes del Trabajo' | 'Después del Trabajo' | 'Medidor / Tablero' | 'Firma Cliente';
  dateUploaded: string;
}

export type TabType = 'dashboard' | 'invoices' | 'catalog' | 'quotes' | 'history';

export type DashboardMode = 'executive' | 'compact' | 'financial' | 'workflow' | 'sidebar' | 'minimal';

export type AppTheme = 'classic' | 'electric' | 'dark' | 'emerald' | 'amber' | 'midnight' | 'platinum' | 'cyberpunk';

export interface LogoOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}
