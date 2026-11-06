import { Material, Invoice, Quote, EvidenceItem } from '../types';

export const INITIAL_MATERIALS: Material[] = [
  // NOVEY
  {
    id: 'mat-001',
    code: 'NOV-BRK-201P',
    name: 'Breaker Termomagnético Square D 1P 20A Homeline',
    category: 'Breakers y Tableros',
    provider: 'Novey',
    costPrice: 5.25,
    publicPrice: 7.95,
    unit: 'unidad',
    stock: 45,
    description: 'Interruptor monopolar 20 amperios enchufable para tablero de residencia.',
    imageUrl: 'https://picsum.photos/seed/breaker20a/300/200'
  },
  {
    id: 'mat-002',
    code: 'NOV-CBL-12TH',
    name: 'Cable Eléctrico THHN/THWN #12 AWG Cobre (Negro)',
    category: 'Cables y Conductores',
    provider: 'Novey',
    costPrice: 0.42,
    publicPrice: 0.65,
    unit: 'metro',
    stock: 350,
    description: 'Conductor de cobre suave con aislamiento termoplástico PVC/Nylon 600V.',
    imageUrl: 'https://picsum.photos/seed/cable12th/300/200'
  },
  {
    id: 'mat-003',
    code: 'NOV-3M-TAPE',
    name: 'Cinta Aislante Vinílica 3M Super 33+ Profesional',
    category: 'Herramientas y Equipos',
    provider: 'Novey',
    costPrice: 2.80,
    publicPrice: 4.50,
    unit: 'unidad',
    stock: 28,
    description: 'Cinta aislante de vinilo para uso profesional resistente a intemperie y UV.',
    imageUrl: 'https://picsum.photos/seed/cinta3m/300/200'
  },
  {
    id: 'mat-004',
    code: 'NOV-PAN-LED',
    name: 'Panel LED Empotrizable 60x60cm 48W 6500K Luz Blanca',
    category: 'Iluminación y Lámparas',
    provider: 'Novey',
    costPrice: 18.50,
    publicPrice: 28.00,
    unit: 'unidad',
    stock: 16,
    description: 'Panel de iluminación LED para cielo raso comercial u oficina alta eficiencia.',
    imageUrl: 'https://picsum.photos/seed/panelled/300/200'
  },

  // COCHEZ
  {
    id: 'mat-005',
    code: 'COC-TAB-8ESP',
    name: 'Centro de Carga Square D 8 Espacios NEMA 1 Superficie',
    category: 'Breakers y Tableros',
    provider: 'Cochez',
    costPrice: 32.00,
    publicPrice: 46.50,
    unit: 'unidad',
    stock: 12,
    description: 'Tablero trifilar o bifilar para distribución eléctrica residencial Schneider Electric.',
    imageUrl: 'https://picsum.photos/seed/tablerosqd/300/200'
  },
  {
    id: 'mat-006',
    code: 'COC-TUB-EMT34',
    name: 'Tubo Conduit Metalico EMT 3/4" x 10 pies Galvanizado',
    category: 'Tuberías y Conectores',
    provider: 'Cochez',
    costPrice: 4.80,
    publicPrice: 6.95,
    unit: 'tramo',
    stock: 80,
    description: 'Tubería metálica rígida liviana para canalización de circuitos visibles.',
    imageUrl: 'https://picsum.photos/seed/tuboemt/300/200'
  },
  {
    id: 'mat-007',
    code: 'COC-CAJ-4X4',
    name: 'Caja Metálica Cuadrada 4x4" x 1-1/2" Knockouts 1/2 y 3/4',
    category: 'Tuberías y Conectores',
    provider: 'Cochez',
    costPrice: 0.95,
    publicPrice: 1.60,
    unit: 'unidad',
    stock: 120,
    description: 'Caja de registro de acero galvanizado para conexiones empotradas.',
    imageUrl: 'https://picsum.photos/seed/caja4x4/300/200'
  },
  {
    id: 'mat-008',
    code: 'COC-LEV-TOM20',
    name: 'Tomacorriente Doble Leviton Decora 15A 125V Blanco',
    category: 'Interruptores y Tomas',
    provider: 'Cochez',
    costPrice: 2.10,
    publicPrice: 3.45,
    unit: 'unidad',
    stock: 65,
    description: 'Receptáculo dúplex diseño moderno para instalaciones industriales o vivienda.',
    imageUrl: 'https://picsum.photos/seed/tomaleviton/300/200'
  },

  // DOIT CENTER
  {
    id: 'mat-009',
    code: 'DOI-KLN-MULT',
    name: 'Multímetro Digital Automático Klein Tools MM300 600V',
    category: 'Herramientas y Equipos',
    provider: 'Doit Center',
    costPrice: 29.90,
    publicPrice: 42.00,
    unit: 'unidad',
    stock: 8,
    description: 'Herramienta de medición para voltaje AC/DC, corriente DC y resistencia.',
    imageUrl: 'https://picsum.photos/seed/kleintools/300/200'
  },
  {
    id: 'mat-010',
    code: 'DOI-BRK-GFCI',
    name: 'Breaker de Protección Falla a Tierra GFCI 1P 20A',
    category: 'Breakers y Tableros',
    provider: 'Doit Center',
    costPrice: 38.50,
    publicPrice: 52.00,
    unit: 'unidad',
    stock: 10,
    description: 'Interruptor de seguridad contra descargas para áreas húmedas (baños/exteriores).',
    imageUrl: 'https://picsum.photos/seed/breakergfci/300/200'
  },
  {
    id: 'mat-011',
    code: 'DOI-REF-50W',
    name: 'Reflector LED Exterior IP65 50W Luz Fría 5000 Lumens',
    category: 'Iluminación y Lámparas',
    provider: 'Doit Center',
    costPrice: 14.20,
    publicPrice: 22.50,
    unit: 'unidad',
    stock: 22,
    description: 'Luminaria de alta potencia para fachadas, patios y estacionamientos.',
    imageUrl: 'https://picsum.photos/seed/reflectorled/300/200'
  },
  {
    id: 'mat-012',
    code: 'DOI-CBL-10TH',
    name: 'Cable Eléctrico THHN/THWN #10 AWG Cobre (Rojo)',
    category: 'Cables y Conductores',
    provider: 'Doit Center',
    costPrice: 0.68,
    publicPrice: 0.98,
    unit: 'metro',
    stock: 220,
    description: 'Conductor de cobre para alimentadores de acondicionadores de aire de 18k/24k BTU.',
    imageUrl: 'https://picsum.photos/seed/cable10red/300/200'
  },
  {
    id: 'mat-013',
    code: 'NOV-FLU-AMP',
    name: 'Pinza Amperimétrica Digital Fluke 323 True-RMS 400A',
    category: 'Herramientas y Equipos',
    provider: 'Novey',
    costPrice: 115.00,
    publicPrice: 155.00,
    unit: 'unidad',
    stock: 6,
    description: 'Medidor profesional True-RMS para corriente AC hasta 400A y voltaje AC/DC 600V.',
    imageUrl: 'https://picsum.photos/seed/fluke323/300/200'
  },
  {
    id: 'mat-014',
    code: 'COC-DEW-ROT',
    name: 'Rotomartillo Inalámbrico DeWalt 20V MAX 1/2" SDS-Plus',
    category: 'Herramientas y Equipos',
    provider: 'Cochez',
    costPrice: 185.00,
    publicPrice: 245.00,
    unit: 'unidad',
    stock: 5,
    description: 'Herramienta industrial para perforación pesada en concreto y losas de edificación.',
    imageUrl: 'https://picsum.photos/seed/dewaltrot/300/200'
  },
  {
    id: 'mat-015',
    code: 'DOI-GEN-3500',
    name: 'Generador Eléctrico Silencioso a Gasolina 3500W 120V/240V',
    category: 'Herramientas y Equipos',
    provider: 'Doit Center',
    costPrice: 380.00,
    publicPrice: 495.00,
    unit: 'unidad',
    stock: 4,
    description: 'Planta eléctrica portátil de respaldo para obras sin acometida o emergencias.',
    imageUrl: 'https://picsum.photos/seed/generador/300/200'
  },
  {
    id: 'mat-016',
    code: 'PER-BRK-3P100',
    name: 'Breaker Caja Moldeada Trifásico 3P 100A Schneider NSX',
    category: 'Breakers y Tableros',
    provider: 'Personalizado',
    costPrice: 145.00,
    publicPrice: 195.00,
    unit: 'unidad',
    stock: 3,
    description: 'Interruptor termomagnético industrial trifásico para tableros principales de distribución.',
    imageUrl: 'https://picsum.photos/seed/breaker3p100/300/200'
  },
  {
    id: 'mat-017',
    code: 'NOV-LMP-UFO',
    name: 'Campana Industrial LED UFO 150W 6500K High-Bay 21,000 LM',
    category: 'Iluminación y Lámparas',
    provider: 'Novey',
    costPrice: 48.00,
    publicPrice: 68.00,
    unit: 'unidad',
    stock: 14,
    description: 'Luminaria suspendida para galpones, depósitos y naves industriales alta potencia.',
    imageUrl: 'https://picsum.photos/seed/lampufo/300/200'
  },
  {
    id: 'mat-018',
    code: 'COC-CBL-4DES',
    name: 'Cable de Cobre Desnudo #4 AWG de Puesta a Tierra',
    category: 'Cables y Conductores',
    provider: 'Cochez',
    costPrice: 1.85,
    publicPrice: 2.60,
    unit: 'metro',
    stock: 180,
    description: 'Conductor sólido sin aislamiento para conexión al sistema de varilla de tierra (malla).',
    imageUrl: 'https://picsum.photos/seed/cabledesnudo/300/200'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'DTE-2026-0042',
    cafeCode: 'FE-PA-87213491-20260726-0042',
    date: '2026-07-20',
    dueDate: '2026-08-04',
    clientName: 'Constructora El Dorado S.A.',
    clientRuc: '15523910-2-2021 DV 44',
    clientEmail: 'compras@eldoradopa.com',
    clientPhone: '+507 6789-1122',
    clientAddress: 'Vía España, Edificio Obarrio Plaza, Piso 4, Ciudad de Panamá',
    items: [
      {
        id: 'item-1',
        description: 'Instalación de Centro de Carga Square D 12 Espacios',
        unit: 'servicio',
        quantity: 1,
        unitPrice: 150.00,
        totalPrice: 150.00
      },
      {
        id: 'item-2',
        materialId: 'mat-001',
        description: 'Breaker Termomagnético Square D 1P 20A Homeline',
        unit: 'unidad',
        quantity: 8,
        unitPrice: 7.95,
        totalPrice: 63.60
      },
      {
        id: 'item-3',
        materialId: 'mat-002',
        description: 'Cable Eléctrico THHN/THWN #12 AWG Cobre (Negro)',
        unit: 'metro',
        quantity: 80,
        unitPrice: 0.65,
        totalPrice: 52.00
      }
    ],
    subtotal: 265.60,
    taxAmount: 18.59,
    total: 284.19,
    status: 'Pagada',
    paymentMethod: 'Yappy',
    receiptImage: 'https://picsum.photos/seed/receiptyappy/400/300',
    notes: 'Trabajo entregado con certificación de pruebas de continuidad e insulación.'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'DTE-2026-0043',
    cafeCode: 'FE-PA-87213491-20260722-0043',
    date: '2026-07-22',
    dueDate: '2026-08-06',
    clientName: 'Residencial Altos del Golf - Familia Mendoza',
    clientRuc: '8-741-902 DV 12',
    clientEmail: 'mendoza.carlos@gmail.com',
    clientPhone: '+507 6223-9001',
    clientAddress: 'Calle 74 Este, San Francisco, Casa #45',
    items: [
      {
        id: 'item-10',
        description: 'Mantenimiento de Tablero Principal y Balanceo de Cargas',
        unit: 'servicio',
        quantity: 1,
        unitPrice: 180.00,
        totalPrice: 180.00
      },
      {
        id: 'item-11',
        materialId: 'mat-010',
        description: 'Breaker de Protección Falla a Tierra GFCI 1P 20A',
        unit: 'unidad',
        quantity: 2,
        unitPrice: 52.00,
        totalPrice: 104.00
      }
    ],
    subtotal: 284.00,
    taxAmount: 19.88,
    total: 303.88,
    status: 'Pendiente',
    paymentMethod: 'ACH / Transferencia',
    notes: 'Pendiente transferencia a cuenta Banco General.'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'DTE-2026-0038',
    cafeCode: 'FE-PA-87213491-20260615-0038',
    date: '2026-06-15',
    dueDate: '2026-06-30',
    clientName: 'Comercial Plaza Costa del Este',
    clientRuc: '2398104-1-80023 DV 89',
    clientEmail: 'admin@plazacostadeleste.com',
    clientPhone: '+507 390-4400',
    clientAddress: 'Av. Paseo del Mar, Costa del Este',
    items: [
      {
        id: 'item-20',
        materialId: 'mat-004',
        description: 'Panel LED Empotrizable 60x60cm 48W 6500K',
        unit: 'unidad',
        quantity: 12,
        unitPrice: 28.00,
        totalPrice: 336.00
      },
      {
        id: 'item-21',
        description: 'Mano de obra cambio de luminarias en pasillo principal',
        unit: 'global',
        quantity: 1,
        unitPrice: 160.00,
        totalPrice: 160.00
      }
    ],
    subtotal: 496.00,
    taxAmount: 34.72,
    total: 530.72,
    status: 'Vencida',
    paymentMethod: 'ACH / Transferencia',
    notes: 'Recordatorio enviado a contabilidad el 15 de julio.'
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'q-201',
    quoteNumber: 'COT-2026-0105',
    date: '2026-07-24',
    validityDays: 15,
    validUntil: '2026-08-08',
    clientName: 'Plaza Multicentro Marbella',
    clientRuc: '9821034-2-2018 DV 15',
    clientEmail: 'mantenimiento@marbellacentro.com',
    clientPhone: '+507 263-8890',
    projectAddress: 'Calle 50 y Marbella, Local #12',
    items: [
      {
        id: 'qitem-1',
        materialId: 'mat-011',
        description: 'Reflector LED Exterior IP65 50W Luz Fría',
        unit: 'unidad',
        quantity: 6,
        unitPrice: 22.50,
        totalPrice: 135.00
      },
      {
        id: 'qitem-2',
        materialId: 'mat-006',
        description: 'Tubo Conduit Metalico EMT 3/4" x 10 pies',
        unit: 'tramo',
        quantity: 10,
        unitPrice: 6.95,
        totalPrice: 69.50
      },
      {
        id: 'qitem-3',
        materialId: 'mat-012',
        description: 'Cable Eléctrico THHN/THWN #10 AWG Cobre (Rojo)',
        unit: 'metro',
        quantity: 100,
        unitPrice: 0.98,
        totalPrice: 98.00
      }
    ],
    laborCost: 350.00, // Mano de obra
    subtotal: 652.50,
    taxAmount: 45.68,
    total: 698.18,
    status: 'Enviada',
    notes: 'Incluye alquiler de andamio y pruebas nocturnas de encendido.'
  },
  {
    id: 'q-202',
    quoteNumber: 'COT-2026-0104',
    date: '2026-07-18',
    validityDays: 30,
    validUntil: '2026-08-17',
    clientName: 'Oficinas Torres de Las Américas',
    clientRuc: '8712390-1-2015 DV 08',
    clientEmail: 'gerencia@torresamericas.com',
    clientPhone: '+507 302-1200',
    projectAddress: 'Punta Pacífica, Torre B, Piso 18',
    items: [
      {
        id: 'qitem-10',
        materialId: 'mat-008',
        description: 'Tomacorriente Doble Leviton Decora 15A 125V Blanco',
        unit: 'unidad',
        quantity: 24,
        unitPrice: 3.45,
        totalPrice: 82.80
      },
      {
        id: 'qitem-11',
        materialId: 'mat-002',
        description: 'Cable Eléctrico THHN/THWN #12 AWG Cobre (Negro)',
        unit: 'metro',
        quantity: 150,
        unitPrice: 0.65,
        totalPrice: 97.50
      }
    ],
    laborCost: 280.00,
    subtotal: 460.30,
    taxAmount: 32.22,
    total: 492.52,
    status: 'Aprobada',
    clientSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADD621nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI+SURBVHhe7d2xihRBGIBhv1/F0O4DGIj4AMb0O3gE...',
    notes: 'Aprobada vía firma en pantalla por Arq. Fernando Ríos.'
  }
];

export const INITIAL_EVIDENCES: EvidenceItem[] = [
  {
    id: 'ev-1',
    documentId: 'inv-101',
    documentType: 'Invoice',
    title: 'Comprobante de Pago Yappy - $284.19',
    imageUrl: 'https://picsum.photos/seed/yappypayment/600/400',
    category: 'Comprobante de Pago',
    dateUploaded: '2026-07-20'
  },
  {
    id: 'ev-2',
    documentId: 'inv-101',
    documentType: 'Invoice',
    title: 'Tablero Square D Terminado',
    imageUrl: 'https://picsum.photos/seed/electricalpanel/600/400',
    category: 'Después del Trabajo',
    dateUploaded: '2026-07-20'
  },
  {
    id: 'ev-3',
    documentId: 'q-202',
    documentType: 'Quote',
    title: 'Firma Digital Aceptación Arq. Ríos',
    imageUrl: 'https://picsum.photos/seed/signaturedoc/600/300',
    category: 'Firma Cliente',
    dateUploaded: '2026-07-18'
  },
  {
    id: 'ev-4',
    documentId: 'inv-103',
    documentType: 'Invoice',
    title: 'Fotografía de Luminarias LED Comercial',
    imageUrl: 'https://picsum.photos/seed/ledlighting/600/400',
    category: 'Antes del Trabajo',
    dateUploaded: '2026-06-15'
  }
];
