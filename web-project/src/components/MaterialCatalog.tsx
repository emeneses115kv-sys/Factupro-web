import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Tag, 
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  Star,
  Wrench,
  Copy,
  Check,
  Zap,
  Eye,
  X,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Material, ProviderName, MaterialCategory } from '../types';
import { exportCatalogToExcel } from '../utils/exportUtils';

interface Props {
  materials: Material[];
  favoriteMaterialIds?: string[];
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial: (material: Material) => void;
  onToggleFavoriteMaterial?: (materialId: string) => void;
  onCloseSection?: () => void;
}

export const MaterialCatalog: React.FC<Props> = ({
  materials,
  favoriteMaterialIds = [],
  onAddMaterial,
  onUpdateMaterial,
  onToggleFavoriteMaterial,
  onCloseSection
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageMat, setSelectedImageMat] = useState<Material | null>(null);

  // Universal Search Modal State
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);
  const [universalQuery, setUniversalQuery] = useState('');
  const [universalProviderFilter, setUniversalProviderFilter] = useState<string>('Todos');
  const [universalCategoryFilter, setUniversalCategoryFilter] = useState<string>('Todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Profit Markup Margin Calculator state for custom items
  const [markupPercent, setMarkupPercent] = useState<number>(35); // 35% margin default

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Breakers y Tableros');
  const [provider, setProvider] = useState<ProviderName>('Novey');
  const [costPrice, setCostPrice] = useState<number>(10);
  const [unit, setUnit] = useState('unidad');
  const [stock, setStock] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Calculate public price with markup
  const calculatedPublicPrice = Number((costPrice * (1 + markupPercent / 100)).toFixed(2));

  // Filter materials for main view
  const filteredMaterials = materials.filter(m => {
    const isFav = favoriteMaterialIds.includes(m.id);
    if (showOnlyFavorites && !isFav) return false;
    const matchesProvider = selectedProvider === 'Todos' || m.provider === selectedProvider;
    const matchesCategory = selectedCategory === 'Todas' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesCategory && matchesSearch;
  });

  // Filter materials for Universal Search Overlay
  const universalResults = materials.filter(m => {
    const matchesProvider = universalProviderFilter === 'Todos' || m.provider === universalProviderFilter;
    const matchesCategory = universalCategoryFilter === 'Todas' || m.category === universalCategoryFilter;
    const q = universalQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      m.name.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q));
    return matchesProvider && matchesCategory && matchesQuery;
  });

  const handleCopyDetails = (mat: Material) => {
    const text = `[${mat.provider}] ${mat.name} - Código: ${mat.code} - Precio: $${mat.publicPrice.toFixed(2)} - Stock: ${mat.stock} ${mat.unit}s`;
    navigator.clipboard.writeText(text);
    setCopiedId(mat.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const finalImage = imageUrl.trim() || `https://picsum.photos/seed/${encodeURIComponent(name)}/300/200`;

    const newMat: Material = {
      id: `mat-${Date.now()}`,
      code,
      name,
      category,
      provider,
      costPrice: Number(costPrice),
      publicPrice: calculatedPublicPrice,
      unit,
      stock: Number(stock),
      description,
      imageUrl: finalImage
    };

    onAddMaterial(newMat);
    setIsModalOpen(false);

    // Reset Form
    setCode('');
    setName('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-black text-[#06315a] font-mono tracking-tight uppercase">
              CATÁLOGO DE MATERIALES MULTIPROVEEDOR
            </h2>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Novey · Cochez · Doit Center
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lista integrada de insumos eléctricos con precio de costo, margen de ganancia configurable y stock disponible en Panamá.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsUniversalSearchOpen(true)}
            className="bg-[#06315a] hover:bg-sky-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border border-sky-600"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>🔍 Buscador Universal Total</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agregar Insumo</span>
          </button>

          <button
            onClick={() => exportCatalogToExcel(materials)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
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

      {/* Provider & Category Selector Pills */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Provider Filters & Favorites Pill */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Proveedor:</span>
            {['Todos', 'Novey', 'Cochez', 'Doit Center', 'Personalizado'].map((prov) => (
              <button
                key={prov}
                onClick={() => {
                  setSelectedProvider(prov);
                  setShowOnlyFavorites(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedProvider === prov && !showOnlyFavorites
                    ? 'bg-[#06315a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {prov === 'Novey' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                {prov === 'Cochez' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                {prov === 'Doit Center' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                {prov}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Full Search Trigger */}
            <button
              onClick={() => setIsUniversalSearchOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-sky-600" />
              <span>Búsqueda Herramientas e Insumos</span>
            </button>

            {/* Star Favorites Filter Toggle */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border ${
                showOnlyFavorites
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-slate-950' : 'fill-amber-400 text-amber-500'}`} />
              <span>Mis Favoritos ⭐ ({favoriteMaterialIds.length})</span>
            </button>
          </div>
        </div>

        {/* Category & Search Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Categoría:</span>
            {[
              'Todas',
              'Breakers y Tableros',
              'Cables y Conductores',
              'Tuberías y Conectores',
              'Interruptores y Tomas',
              'Iluminación y Lámparas',
              'Herramientas y Equipos'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-100 text-[#06315a] font-bold border border-sky-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por código, cable, breaker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06315a]"
              />
            </div>
            <button
              onClick={() => {
                setUniversalQuery(searchTerm);
                setIsUniversalSearchOpen(true);
              }}
              className="bg-[#06315a] text-white p-2 rounded-xl text-xs font-bold hover:bg-sky-900 transition cursor-pointer"
              title="Abrir Buscador Universal Completo"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

        </div>

      </div>

      {/* Material Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMaterials.map((mat) => {
          const isFav = favoriteMaterialIds.includes(mat.id);
          const profitMargin = (mat.publicPrice - mat.costPrice).toFixed(2);
          const profitPercent = (((mat.publicPrice - mat.costPrice) / mat.costPrice) * 100).toFixed(0);

          return (
            <div 
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative"
            >
              <div>
                {/* Top Badge & Favorite Star */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${
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

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{mat.code}</span>
                    {onToggleFavoriteMaterial && (
                      <button
                        onClick={() => onToggleFavoriteMaterial(mat.id)}
                        className={`p-1 rounded-full hover:bg-amber-50 transition cursor-pointer ${
                          isFav ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                        }`}
                        title={isFav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Article Image Thumbnail */}
                <div className="relative mb-2.5 h-32 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 group-hover:border-[#06315a]/40 transition">
                  <img 
                    src={mat.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(mat.name)}/300/200`} 
                    alt={mat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(mat.category)}/300/200`;
                    }}
                  />
                  <button
                    onClick={() => setSelectedImageMat(mat)}
                    className="absolute bottom-1.5 right-1.5 bg-slate-900/80 hover:bg-slate-950 text-white px-2 py-1 rounded-lg text-[10px] backdrop-blur-xs flex items-center gap-1 font-bold transition cursor-pointer border border-white/20"
                    title="Ver imagen completa del insumo"
                  >
                    <Eye className="w-3 h-3 text-amber-400" />
                    <span>Ver Imagen</span>
                  </button>
                </div>

                {/* Name & Category */}
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#06315a] transition line-clamp-2">
                  {mat.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {mat.category}
                </p>

                {mat.description && (
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 italic">
                    "{mat.description}"
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Costo Tienda:</span>
                  <span className="font-mono font-medium text-slate-700">${mat.costPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">Precio Venta Cliente</span>
                    <span className="text-xs text-amber-700 font-semibold">Ganancia: +${profitMargin} ({profitPercent}%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#06315a] font-mono">${mat.publicPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 block">/ {mat.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Stock disponible: <strong className="text-slate-900">{mat.stock} {mat.unit}s</strong></span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD MATERIAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-[#06315a] font-mono uppercase">
                AÑADIR MATERIAL O INSUMO AL CATÁLOGO
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Proveedor *</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="Novey">Novey</option>
                    <option value="Cochez">Cochez</option>
                    <option value="Doit Center">Doit Center</option>
                    <option value="Personalizado">Personalizado / Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Código / Referencia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. NOV-BRK-50A"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nombre del Producto / Insumo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Breaker Doble Polo 30A Square D"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="Breakers y Tableros">Breakers y Tableros</option>
                    <option value="Cables y Conductores">Cables y Conductores</option>
                    <option value="Tuberías y Conectores">Tuberías y Conectores</option>
                    <option value="Interruptores y Tomas">Interruptores y Tomas</option>
                    <option value="Iluminación y Lámparas">Iluminación y Lámparas</option>
                    <option value="Herramientas y Equipos">Herramientas y Equipos</option>
                    <option value="Accesorios y Varios">Accesorios y Varios</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Unidad de Medida</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="unidad">unidad</option>
                    <option value="metro">metro</option>
                    <option value="tramo">tramo (10 pies)</option>
                    <option value="caja">caja</option>
                    <option value="global">global</option>
                  </select>
                </div>
              </div>

              {/* Profit Margin Calculator Slider */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    Cálculo de Margen de Ganancia
                  </span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full text-[10px]">
                    +{markupPercent}% Margen
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Precio Costo ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Precio Venta Cliente ($)</label>
                    <div className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-[#06315a]">
                      ${calculatedPublicPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    className="w-full accent-[#06315a] cursor-pointer"
                  />
                </div>
              </div>

              {/* Image URL & Preset Thumbnails */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#06315a]" />
                    <span>Imagen / Foto del Artículo (URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
                </label>
                
                <input
                  type="url"
                  placeholder="Ej. https://images.unsplash.com/photo-1544725176-7c40e5a71c5e..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">Fotos Automáticas:</span>
                  {[
                    { label: '⚡ Breaker', seed: 'breaker20a' },
                    { label: '🔌 Cable', seed: 'cable12th' },
                    { label: '💡 LED', seed: 'panelled' },
                    { label: '🛠️ Herramienta', seed: 'cinta3m' },
                    { label: '📦 Tablero', seed: 'tablerosqd' }
                  ].map((preset) => (
                    <button
                      key={preset.seed}
                      type="button"
                      onClick={() => setImageUrl(`https://picsum.photos/seed/${preset.seed}/300/200`)}
                      className="px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-[#06315a] rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  placeholder="Detalles adicionales del producto o especificaciones técnicas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Material
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* UNIVERSAL SEARCH OVERLAY MODAL */}
      {isUniversalSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#06315a] flex items-center justify-center text-amber-400 shadow-md">
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#06315a] font-mono uppercase tracking-tight flex items-center gap-2">
                    BUSCADOR UNIVERSAL MULTIPROVEEDOR (ACCESO TOTAL)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Búsqueda integrada instantánea en inventarios de Novey, Cochez, Doit Center e insumos locales.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsUniversalSearchOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Search Bar */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 text-[#06315a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe para buscar cualquier cable, breaker, herramienta, multímetro, lámpara, etc..."
                  value={universalQuery}
                  onChange={(e) => setUniversalQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border-2 border-[#06315a]/30 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06315a] font-medium shadow-inner"
                />
                {universalQuery && (
                  <button 
                    onClick={() => setUniversalQuery('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold p-1 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Tags row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0">Populares:</span>
                {[
                  'Breaker',
                  'Cable THHN',
                  'Fluke',
                  'Klein Tools',
                  'DeWalt',
                  'Lámpara LED',
                  'Tubo EMT',
                  'GFCI',
                  'Generador'
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setUniversalQuery(tag)}
                    className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 rounded-lg font-bold transition whitespace-nowrap cursor-pointer"
                  >
                    ⚡ {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Provider & Category Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              {/* Provider Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Proveedor:</span>
                {['Todos', 'Novey', 'Cochez', 'Doit Center', 'Personalizado'].map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setUniversalProviderFilter(prov)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      universalProviderFilter === prov
                        ? 'bg-[#06315a] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>

              {/* Counter Badge */}
              <div className="text-xs font-bold text-[#06315a] bg-sky-100/80 px-3 py-1 rounded-full border border-sky-300">
                {universalResults.length} Insumos & Herramientas Encontrados
              </div>
            </div>

            {/* Results Grid */}
            <div className="overflow-y-auto max-h-[45vh] pr-1 space-y-3">
              {universalResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {universalResults.map((mat) => {
                    const isFav = favoriteMaterialIds.includes(mat.id);
                    const isCopied = copiedId === mat.id;

                    return (
                      <div
                        key={mat.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-[#06315a] shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${
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
                          <div className="relative mb-2 h-24 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                            <img 
                              src={mat.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(mat.name)}/300/200`} 
                              alt={mat.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(mat.category)}/300/200`;
                              }}
                            />
                            <button
                              onClick={() => setSelectedImageMat(mat)}
                              className="absolute bottom-1 right-1 bg-slate-900/80 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1"
                            >
                              <Eye className="w-2.5 h-2.5 text-amber-400" />
                              <span>Ver</span>
                            </button>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#06315a] line-clamp-2">
                            {mat.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{mat.category}</p>
                          {mat.description && (
                            <p className="text-[10px] text-slate-600 italic line-clamp-2 mt-1 bg-slate-50 p-1.5 rounded-lg">
                              "{mat.description}"
                            </p>
                          )}
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Precio Venta</span>
                            <span className="text-sm font-black text-[#06315a] font-mono">${mat.publicPrice.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400"> / {mat.unit}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {onToggleFavoriteMaterial && (
                              <button
                                onClick={() => onToggleFavoriteMaterial(mat.id)}
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  isFav
                                    ? 'bg-amber-100 text-amber-600 border-amber-300'
                                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500'
                                }`}
                                title={isFav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                              >
                                <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyDetails(mat)}
                              className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Copiar detalles del producto"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span className="text-[10px]">{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                  <Wrench className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-bold">
                    No se encontraron insumos o herramientas para "<span className="text-[#06315a]">{universalQuery}</span>".
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Puedes añadir este insumo directamente al catálogo para personalizar el costo y precio de cliente.
                  </p>
                  <button
                    onClick={() => {
                      setName(universalQuery);
                      setCode(`CUSTOM-${Date.now().toString().slice(-4)}`);
                      setIsUniversalSearchOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Agregar "{universalQuery}" como Nuevo Insumo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                💡 Tip: Copia la información del insumo para cotizaciones rápidas.
              </span>
              <button
                onClick={() => setIsUniversalSearchOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Cerrar Buscador Universal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL PHOTO VIEW MODAL */}
      {selectedImageMat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedImageMat(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full font-bold transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#06315a] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {selectedImageMat.provider}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">Código: {selectedImageMat.code}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-3">{selectedImageMat.name}</h3>

            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-4 shadow-inner">
              <img
                src={selectedImageMat.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(selectedImageMat.name)}/600/400`}
                alt={selectedImageMat.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(selectedImageMat.category)}/600/400`;
                }}
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Categoría</span>
                <span className="font-bold text-slate-800">{selectedImageMat.category}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Precio Venta Público</span>
                <span className="text-base font-black font-mono text-[#06315a]">${selectedImageMat.publicPrice.toFixed(2)} / {selectedImageMat.unit}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedImageMat(null)}
              className="mt-4 w-full bg-[#06315a] hover:bg-sky-900 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Cerrar Vista de Imagen
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
