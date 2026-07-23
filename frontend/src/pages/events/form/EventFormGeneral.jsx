import React from 'react';
import { ArrowRight, FileText, MapPin, Sparkles } from 'lucide-react';

const EventFormGeneral = ({
    formData,
    handleChange,
    filteredVenues,
    organizations,
    eventTypes,
    isEditMode,
    setShowAIModal,
    setStep
}) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-1 ring-emerald-100 shadow-sm">
                        <FileText size={24} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Información Básica</h2>
                </div>
                {!isEditMode && (
                    <button
                        type="button"
                        onClick={() => setShowAIModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <Sparkles size={16} /> Autorellenar con IA
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tight">Nombre del Evento</label>
                    <input
                        type="text"
                        required
                        name="name"
                        className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                        placeholder="Ej: Lanzamiento Web 3.0"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-4">
                    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight flex items-center gap-2">
                            <MapPin size={16} className="text-emerald-500" />
                            Cantidad de Personas
                        </label>
                        <input
                            type="number"
                            name="cantidadPersonas"
                            min="1"
                            className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                            placeholder="Ej. 170"
                            value={formData.cantidadPersonas || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight flex items-center gap-2">
                            <MapPin size={16} className="text-emerald-500" />
                            Recinto / Locación
                        </label>
                        <select
                            required
                            name="locationId"
                            className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                            value={formData.locationId}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Seleccione una locación...</option>
                            {filteredVenues.map((venue) => (
                                <option key={venue.id} value={venue.id}>
                                    {venue.nombre || venue.name} ({venue.capacidad || venue.capacity} personas)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Organización</label>
                        <select
                            required
                            name="organizationId"
                            className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                            value={formData.organizationId}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Seleccione organización...</option>
                            {organizations.map(o => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Tipo de Evento</label>
                        <select
                            required
                            name="eventTypeId"
                            className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                            value={formData.eventTypeId}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Seleccione tipo...</option>
                            {eventTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Objetivo</label>
                    <input
                        type="text"
                        name="objective"
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                        placeholder="Objetivo principal del evento..."
                        value={formData.objective}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                >
                    Continuar
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default EventFormGeneral;
