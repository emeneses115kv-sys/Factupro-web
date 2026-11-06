import React from 'react';
import { Palette, CheckCircle2, Sparkles, Image, Shield, Zap, Moon, Sun, Leaf, Flame, Compass } from 'lucide-react';
import { AppTheme, LogoOption } from '../types';

export const LOGO_OPTIONS: LogoOption[] = [
  {
    id: 'logo-official-full',
    name: 'Logotipo Oficial Completo EM',
    description: 'Rayo dorado brillante con letras itálicas EM en Azul Marino y texto Servicios Eléctricos.',
    imageUrl: '/em-logo-full.jpg'
  },
  {
    id: 'logo-app-icon',
    name: 'Insignia Redonda App Icon',
    description: 'Icono de aplicación para acceso directo de escritorio con borde dorado y rayo EM.',
    imageUrl: '/app-icon.jpg'
  },
  {
    id: 'logo-classic',
    name: 'Emblema Corporativo Circular',
    description: 'Insignia circular institucional en Azul Marino #06315a con rayo dorado y letras EM.',
    imageUrl: '/src/assets/images/em_logo_circular_v2_1785118874413.jpg'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  selectedLogo: string;
  onSelectLogo: (logoUrl: string) => void;
}

export const ThemeAndLogoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedTheme,
  onSelectTheme,
  selectedLogo,
  onSelectLogo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
              <Palette className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#06315a] font-mono uppercase tracking-tight">
                PERSONALIZACIÓN DE LOGOTIPO Y TEMA VISUAL
              </h3>
              <p className="text-xs text-slate-500">
                Seleccione la insignia corporativa de EM Servicios Eléctricos y el esquema de colores para la app.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 font-bold text-xl p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8">
          
          {/* SECTION 1: LOGO OPTIONS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                1. Opciones de Logotipo Oficial EM
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {LOGO_OPTIONS.map((logo) => {
                const isSelected = selectedLogo === logo.imageUrl;
                return (
                  <button
                    key={logo.id}
                    onClick={() => onSelectLogo(logo.imageUrl)}
                    className={`relative p-3.5 rounded-2xl border text-left transition flex flex-col items-center cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/30 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-0.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4 fill-amber-400 text-slate-950" />
                      </span>
                    )}

                    <div className="w-20 h-20 rounded-full p-1 bg-white border border-slate-200 shadow-xs mb-3 flex items-center justify-center shrink-0">
                      <img
                        src={logo.imageUrl}
                        alt={logo.name}
                        className="w-18 h-18 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 text-center">{logo.name}</h5>
                    <p className="text-[10px] text-slate-500 text-center mt-1 leading-relaxed">
                      {logo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: THEME OPTIONS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                2. Tema de Color de la Aplicación
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Classic Corporate */}
              <button
                onClick={() => onSelectTheme('classic')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'classic'
                    ? 'border-[#06315a] bg-sky-50/60 ring-2 ring-sky-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#06315a] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Azul DGI Clásico
                    </span>
                    {selectedTheme === 'classic' && <CheckCircle2 className="w-4 h-4 text-[#06315a]" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#06315a]" title="#06315a Azul DGI"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-400" title="#f59e0b Oro Rayo"></div>
                    <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-300" title="Slate 50 Canvas"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Esquema institucional oficial con azul profundo de seguridad y acentos dorados.
                  </p>
                </div>
              </button>

              {/* Electric Neon */}
              <button
                onClick={() => onSelectTheme('electric')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'electric'
                    ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-400/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-sky-500" />
                      Azul Neón High-Tech
                    </span>
                    {selectedTheme === 'electric' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-sky-600"></div>
                    <div className="w-6 h-6 rounded-md bg-cyan-400"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-300"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Paleta tecnológica de alto contraste con azul brillante, cian eléctrico y resaltados amarillos.
                  </p>
                </div>
              </button>

              {/* Dark Industrial */}
              <button
                onClick={() => onSelectTheme('dark')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'dark'
                    ? 'border-amber-400 bg-slate-900 text-white ring-2 ring-amber-400/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-900 text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                      Modo Oscuro Industrial
                    </span>
                    {selectedTheme === 'dark' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-slate-950 border border-slate-700"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-400"></div>
                    <div className="w-6 h-6 rounded-md bg-sky-500"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Lienzo oscuro protector de vista para ambientes nocturnos o inspecciones en campo.
                  </p>
                </div>
              </button>

              {/* Eco Emerald */}
              <button
                onClick={() => onSelectTheme('emerald')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'emerald'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      Verde Eficiencia Eco-Volt
                    </span>
                    {selectedTheme === 'emerald' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-800"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-400"></div>
                    <div className="w-6 h-6 rounded-md bg-emerald-100"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Estilo sustentable enfocado en energía limpia, instalaciones solares y certificaciones verdes.
                  </p>
                </div>
              </button>

              {/* Amber Copper Industrial */}
              <button
                onClick={() => onSelectTheme('amber')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'amber'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Cobre Alto Voltaje
                    </span>
                    {selectedTheme === 'amber' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-amber-950"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-500"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-100"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Cobre electrizante y tonos industriales de advertencia para subestaciones y alta potencia.
                  </p>
                </div>
              </button>

              {/* Midnight Indigo */}
              <button
                onClick={() => onSelectTheme('midnight')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'midnight'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-indigo-600" />
                      Azul Noche Profesional
                    </span>
                    {selectedTheme === 'midnight' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-950"></div>
                    <div className="w-6 h-6 rounded-md bg-indigo-500"></div>
                    <div className="w-6 h-6 rounded-md bg-indigo-100"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Estilo ejecutivo refinado en azul noche índigo para empresas corporativas y comerciales.
                  </p>
                </div>
              </button>

              {/* Platinum Minimalist */}
              <button
                onClick={() => onSelectTheme('platinum')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'platinum'
                    ? 'border-slate-800 bg-slate-100 ring-2 ring-amber-400 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-700" />
                      Platino & Oro Minimalista
                    </span>
                    {selectedTheme === 'platinum' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-slate-800"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-400"></div>
                    <div className="w-6 h-6 rounded-md bg-slate-200"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Diseño limpio de alta gama en grises platinados con detalles dorados de lujo.
                  </p>
                </div>
              </button>

              {/* Cyber Gold High Voltage */}
              <button
                onClick={() => onSelectTheme('cyberpunk')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTheme === 'cyberpunk'
                    ? 'border-amber-400 bg-zinc-950 text-white ring-2 ring-amber-400 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-zinc-900 text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      Cyber Gold High-Voltage
                    </span>
                    {selectedTheme === 'cyberpunk' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md bg-black border border-amber-500/50"></div>
                    <div className="w-6 h-6 rounded-md bg-amber-400"></div>
                    <div className="w-6 h-6 rounded-md bg-sky-400"></div>
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-relaxed">
                    Estilo tecnológico extremo en negro profundo con resaltados en oro de alto voltaje.
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-[#06315a] hover:bg-sky-900 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition"
          >
            Aplicar y Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
