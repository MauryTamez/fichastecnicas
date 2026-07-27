import React from 'react';
import { ChevronRight, Clock, Info, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

const EventFormOrdenDia = ({
    formData,
    setFormData,
    currentActivity,
    setCurrentActivity,
    setStep
}) => {
    const eventStartTime = formData.startsAt && formData.startsAt.includes('T')
        ? formData.startsAt.split('T')[1].slice(0, 5)
        : '';
    const eventEndTime = formData.endsAt && formData.endsAt.includes('T')
        ? formData.endsAt.split('T')[1].slice(0, 5)
        : '';

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        try {
            return new Date(isoString).toLocaleString('es-ES', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return isoString;
        }
    };

    const handleAddActivity = () => {
        if (!formData.startsAt || !formData.endsAt) {
            Swal.fire(
                'Horario del evento no definido',
                'Debe definir las fechas de inicio y finalización del evento en la sección General antes de agregar actividades.',
                'warning'
            );
            return;
        }

        if (!currentActivity.name.trim() || !currentActivity.startsAt || !currentActivity.endsAt) {
            Swal.fire('Campos incompletos', 'Asigna nombre, hora de inicio y de fin a la actividad.', 'warning');
            return;
        }

        if (currentActivity.startsAt >= currentActivity.endsAt) {
            Swal.fire('Error en horario', 'La hora de fin de la actividad debe ser posterior a la hora de inicio.', 'error');
            return;
        }

        if (eventStartTime && currentActivity.startsAt < eventStartTime) {
            Swal.fire(
                'Hora fuera de rango',
                `La hora de inicio de la actividad (${currentActivity.startsAt}) no puede ser anterior al inicio del evento (${eventStartTime}).`,
                'warning'
            );
            return;
        }

        if (eventEndTime && currentActivity.endsAt > eventEndTime) {
            Swal.fire(
                'Hora fuera de rango',
                `La hora de finalización de la actividad (${currentActivity.endsAt}) no puede ser posterior al término del evento (${eventEndTime}).`,
                'warning'
            );
            return;
        }

        setFormData({
            ...formData,
            activities: [...formData.activities, currentActivity].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
        });
        setCurrentActivity({ name: '', startsAt: '', endsAt: '', description: '' });
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-1 ring-emerald-100 shadow-sm">
                    <Clock size={24} />
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Orden del Día</h2>
                    <p className="text-sm font-medium text-slate-400">Configure la agenda minuto a minuto dentro del horario del evento</p>
                </div>
            </div>

            {formData.startsAt && formData.endsAt ? (
                <div className="mb-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Rango Horario del Evento</p>
                            <p className="text-sm font-bold text-slate-800">
                                {formatDateTime(formData.startsAt)} <span className="text-emerald-500 mx-1">➔</span> {formatDateTime(formData.endsAt)}
                            </p>
                        </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-xl">
                        {eventStartTime} - {eventEndTime} hs
                    </span>
                </div>
            ) : (
                <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-medium shadow-sm">
                    <Info size={22} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Horario del evento no configurado</p>
                        <p className="text-xs text-amber-700">Por favor regrese a la sección <strong>General</strong> para establecer las fechas de inicio y fin del evento.</p>
                    </div>
                </div>
            )}

            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
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
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                                Inicio {eventStartTime && <span className="text-emerald-600">(Min: {eventStartTime})</span>}
                            </label>
                            <input
                                type="time"
                                min={eventStartTime || undefined}
                                max={eventEndTime || undefined}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-700"
                                value={currentActivity.startsAt}
                                onChange={(e) => setCurrentActivity({ ...currentActivity, startsAt: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                                Fin {eventEndTime && <span className="text-emerald-600">(Máx: {eventEndTime})</span>}
                            </label>
                            <input
                                type="time"
                                min={eventStartTime || undefined}
                                max={eventEndTime || undefined}
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
                        onClick={handleAddActivity}
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

            <div className="mt-8 p-6 bg-amber-50/80 rounded-2xl border border-amber-100 flex gap-4 shadow-sm">
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

export default EventFormOrdenDia;
