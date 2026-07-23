import React from 'react';
import { Briefcase, Calendar, ChevronRight, Clock, Info, Plus, Sparkles, X } from 'lucide-react';
import Swal from 'sweetalert2';

const EventFormHorario = ({
    formData,
    handleChange,
    setFormData,
    audiovisual,
    audiovisualItems,
    toggleAudiovisual,
    otros,
    otrosItems,
    toggleOtro,
    setShowParkingModal,
    setShowPhotoModal,
    setShowPresidiumModal,
    currentActivity,
    setCurrentActivity,
    setStep
}) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center ring-1 ring-amber-100 shadow-sm">
                    <Calendar size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Requerimientos de Evento</h2>
            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
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

            <div className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center ring-1 ring-amber-100 shadow-sm">
                        <Calendar size={24} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Programación</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> INICIO DEL EVENTO
                        </label>
                        <div className="p-1 px-2 border border-emerald-100 rounded-2xl bg-emerald-50/10 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <input
                                type="datetime-local"
                                name="startsAt"
                                className="block w-full px-2 py-3 bg-transparent outline-none text-emerald-900 font-bold uppercase text-xs"
                                value={formData.startsAt}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> FINALIZACIÓN
                        </label>
                        <div className="p-1 px-2 border border-red-100 rounded-2xl bg-red-50/10 focus-within:ring-4 focus-within:ring-red-500/10 transition-all">
                            <input
                                type="datetime-local"
                                name="endsAt"
                                className="block w-full px-2 py-3 bg-transparent outline-none text-red-900 font-bold uppercase text-xs"
                                value={formData.endsAt}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Agenda Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={20} className="text-emerald-500" /> Agenda (Minuto a Minuto)
                        </h3>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase">
                            {formData.activities.length} Actividades
                        </span>
                    </div>

                    <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Nombre de la actividad (Ej: Bienvenida, Ponencia...)"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-slate-700 shadow-sm"
                                    value={currentActivity.name}
                                    onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Inicio</label>
                                <input
                                    type="time"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-700"
                                    value={currentActivity.startsAt}
                                    onChange={(e) => setCurrentActivity({ ...currentActivity, startsAt: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Fin</label>
                                <input
                                    type="time"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-700"
                                    value={currentActivity.endsAt}
                                    onChange={(e) => setCurrentActivity({ ...currentActivity, endsAt: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 mt-2">
                                <textarea
                                    placeholder="Descripción o detalles de la actividad..."
                                    rows="2"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-slate-700 resize-none shadow-sm"
                                    value={currentActivity.description || ''}
                                    onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (currentActivity.name && currentActivity.startsAt && currentActivity.endsAt) {
                                    if (currentActivity.startsAt >= currentActivity.endsAt) {
                                        Swal.fire('Error', 'La hora de fin debe ser posterior a la de inicio', 'error');
                                        return;
                                    }
                                    setFormData({
                                        ...formData,
                                        activities: [...formData.activities, currentActivity].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
                                    });
                                    setCurrentActivity({ name: '', startsAt: '', endsAt: '', description: '' });
                                } else {
                                    Swal.fire('Campos incompletos', 'Asigna nombre, hora de inicio y de fin a la actividad', 'warning');
                                }
                            }}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                        >
                            <Plus size={18} /> Agregar Actividad
                        </button>

                        {formData.activities.length > 0 && (
                            <div className="space-y-2.5 mt-6 max-h-72 overflow-y-auto pr-1">
                                {formData.activities.map((act, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition-all duration-200 animate-fade-in">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">{act.name}</h4>
                                                <p className="text-xs text-gray-400 font-medium">{act.startsAt} - {act.endsAt}</p>
                                                {act.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{act.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, activities: formData.activities.filter((_, i) => i !== index) });
                                            }}
                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
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

            <div className="mt-12 p-6 bg-amber-50/80 rounded-2xl border border-amber-100 flex gap-4 shadow-sm">
                <div className="text-amber-600"><Info size={24} /></div>
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                    Asegúrese de incluir tiempo adicional para pruebas técnicas antes del inicio oficial.
                </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all">Atrás</button>
                <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200/70 hover:shadow-xl hover:shadow-emerald-200/80 transition-all">Continuar <ChevronRight size={18} /></button>
            </div>
        </div>
    );
};

export default EventFormHorario;
