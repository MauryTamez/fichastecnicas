import React from 'react';
import { Briefcase, ChevronRight, Layers, Sparkles } from 'lucide-react';

const EventFormRequerimientos = ({
    formData,
    handleChange,
    audiovisual,
    audiovisualItems,
    toggleAudiovisual,
    otros,
    otrosItems,
    toggleOtro,
    setShowParkingModal,
    setShowPhotoModal,
    setShowPresidiumModal,
    setStep
}) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-1 ring-emerald-100 shadow-sm">
                    <Layers size={24} />
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Requerimientos del Evento</h2>
                    <p className="text-sm font-medium text-slate-400">Seleccione el equipo audiovisual y requerimientos logísticos necesarios</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Sparkles size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Audiovisual</h3>
                    </div>
                    <div className="space-y-3">
                        {audiovisualItems.map(({ key, label }) => (
                            <label key={key} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition-all duration-200 hover:scale-[1.01] hover:bg-slate-50 hover:border-emerald-200 shadow-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!audiovisual[key]}
                                    onChange={() => toggleAudiovisual(key)}
                                    className="mt-0.5 h-4 w-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700">{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Briefcase size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Otros Requerimientos</h3>
                    </div>
                    <div className="space-y-3">
                        {otrosItems.map(({ key, label }) => (
                            <div key={key} className="space-y-3">
                                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition-all duration-200 hover:scale-[1.01] hover:bg-slate-50 hover:border-emerald-200 shadow-sm">
                                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                                        <input
                                            type="checkbox"
                                            checked={otros[key]}
                                            onChange={() => toggleOtro(key)}
                                            className="mt-0.5 h-4 w-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{label}</span>
                                    </label>
                                    {otros[key] && (key === 'estacionamiento' || key === 'fotografia' || key === 'presidium') && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (key === 'estacionamiento') setShowParkingModal(true);
                                                if (key === 'fotografia') setShowPhotoModal(true);
                                                if (key === 'presidium') setShowPresidiumModal(true);
                                            }}
                                            className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100 transition-all"
                                        >
                                            Configurar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tight">Observaciones</label>
                <textarea
                    name="otrosObservaciones"
                    rows="4"
                    className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                    placeholder="Anota observaciones adicionales del evento..."
                    value={formData.otrosObservaciones}
                    onChange={handleChange}
                />
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all">Atrás</button>
                <button type="button" onClick={() => setStep(4)} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200/70 hover:shadow-xl hover:shadow-emerald-200/80 transition-all">Continuar <ChevronRight size={18} /></button>
            </div>
        </div>
    );
};

export default EventFormRequerimientos;
