import { ArrowRight, Calendar, FileText, MapPin, Sparkles, Users } from 'lucide-react';

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
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Información Básica</h2>
                        <p className="text-sm font-medium text-slate-400">Ingrese los datos generales y el horario de su evento</p>
                    </div>
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
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Nombre del Evento</label>
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

                {/* Programación del Evento */}
                <div>
                    <div className="flex items-center gap-2 mb-3 ml-1">
                        <Calendar size={16} className="text-emerald-600" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Programación del Evento</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-2 ml-1 flex items-center gap-2 uppercase tracking-wide">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> INICIO DEL EVENTO
                            </label>
                            <div className="p-1 px-3 border border-emerald-200 rounded-xl bg-emerald-50/30 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm">
                                <input
                                    type="datetime-local"
                                    required
                                    name="startsAt"
                                    className="block w-full py-2 bg-transparent outline-none text-emerald-900 font-bold uppercase text-xs cursor-pointer"
                                    value={formData.startsAt}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-2 ml-1 flex items-center gap-2 uppercase tracking-wide">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div> FINALIZACIÓN
                            </label>
                            <div className="p-1 px-3 border border-red-200 rounded-xl bg-red-50/30 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all shadow-sm">
                                <input
                                    type="datetime-local"
                                    required
                                    name="endsAt"
                                    className="block w-full py-2 bg-transparent outline-none text-red-900 font-bold uppercase text-xs cursor-pointer"
                                    value={formData.endsAt}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recinto y Aforo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider flex items-center gap-2">
                            <Users size={16} className="text-emerald-600" />
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
                        <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider flex items-center gap-2">
                            <MapPin size={16} className="text-emerald-600" />
                            Recinto / Locación
                        </label>
                        <select
                            required
                            name="locationId"
                            className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 appearance-none shadow-sm cursor-pointer"
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

                {/* Tipo de Evento */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Tipo de Evento</label>
                        <select
                            required
                            name="eventTypeId"
                            className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 appearance-none shadow-sm cursor-pointer"
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
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Objetivo</label>
                    <input
                        type="text"
                        name="objective"
                        className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
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
