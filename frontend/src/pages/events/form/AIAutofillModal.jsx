import React from 'react';
import { Sparkles, X } from 'lucide-react';

const AIAutofillModal = ({
    showAIModal,
    setShowAIModal,
    aiPrompt,
    setAIPrompt,
    handleAutoFill,
    isAILoading
}) => {
    if (!showAIModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                <div className="p-6 bg-emerald-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles size={24} className="text-emerald-200" />
                        <h2 className="text-xl font-display font-bold">Asistente de Autorellenado IA</h2>
                    </div>
                    <button onClick={() => setShowAIModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-8 space-y-4 bg-gray-50 flex-1">
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                        Describe el evento que deseas crear. La Inteligencia Artificial analizará tu solicitud y utilizará fichas técnicas pasadas para intentar rellenar todos los campos del formulario por ti.
                    </p>
                    <textarea
                        className="w-full h-40 p-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none font-medium text-gray-700 shadow-inner"
                        placeholder="Ej: Necesito una ficha para el Foro Anual de Innovación..."
                        value={aiPrompt}
                        onChange={(e) => setAIPrompt(e.target.value)}
                    ></textarea>
                </div>
                <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={() => setShowAIModal(false)}
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 border border-transparent transition-all"
                        disabled={isAILoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAutoFill}
                        disabled={!aiPrompt.trim() || isAILoading}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all"
                    >
                        {isAILoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Procesando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} /> Autorellenar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAutofillModal;
