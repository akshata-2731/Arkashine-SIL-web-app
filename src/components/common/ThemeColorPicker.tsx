import React, { useState } from 'react';
import { Palette, Check, RefreshCw, Sliders, X } from 'lucide-react';
import { useTheme, PRESET_THEMES } from '../../context/ThemeContext';

export const ThemeColorPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { currentTheme, setThemeById, setCustomColor, resetDefaultTheme } = useTheme();

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Theme Colors"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs shrink-0"
          style={{ backgroundColor: currentTheme.accent }}
        />
        <Palette className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline">Theme Colors</span>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">Color Palette & Theme</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Curated Presets (Click to switch live):
              </p>

              <div className="grid grid-cols-2 gap-2">
                {PRESET_THEMES.map((theme) => {
                  const isSelected = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setThemeById(theme.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 group cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Swatch preview */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        <div
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {theme.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {theme.category}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Custom Color Pickers */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Custom Color Pickers
                </span>
                <span className="text-[11px] text-slate-400">
                  {showAdvanced ? 'Hide' : 'Fine Tune'}
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 animate-in fade-in duration-150">
                  {/* Primary / Sidebar Color */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">Sidebar / Brand</span>
                      <span className="text-[10px] font-mono text-slate-400">{currentTheme.primary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.primary}
                        onChange={(e) => {
                          setCustomColor('primary', e.target.value);
                          setCustomColor('primaryDark', e.target.value);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                    </div>
                  </div>

                  {/* Accent Highlight Color */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">Accent / Highlights</span>
                      <span className="text-[10px] font-mono text-slate-400">{currentTheme.accent}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.accent}
                        onChange={(e) => {
                          setCustomColor('accent', e.target.value);
                          setCustomColor('accentText', e.target.value);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                    </div>
                  </div>

                  {/* Page Background */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">Page Background</span>
                      <span className="text-[10px] font-mono text-slate-400">{currentTheme.bgPage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.bgPage}
                        onChange={(e) => setCustomColor('bgPage', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Reset */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Active: <strong className="text-slate-800">{currentTheme.name}</strong>
              </span>
              <button
                onClick={resetDefaultTheme}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Default
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
