import { Briefcase, ChevronRight } from 'lucide-react';

const EventFormDetalles = ({
    formData,
    handleChange,
    loading,
    setStep
}) => {

    console.log("Estoy en detalles");

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow border border-gray-100 animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Briefcase size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">Detalles de la Ficha Técnica</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">
                        Dress Code
                    </label>
                    <select
                        name="dressCode"
                        value={formData.dressCode}
                        onChange={handleChange}
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="Formal">Formal</option>
                        <option value="Business Casual">Business Casual</option>
                        <option value="Casual">Casual</option>
                        <option value="Etiqueta">Etiqueta</option>
                        <option value="Gala">Gala</option>
                    </select>
                </div>

                <select
    name="programImpacted"
    className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
    value={formData.programImpacted}
    onChange={handleChange}
>
    <option value="">
        Selecciona un programa académico
    </option>

    <option value="Ingeniería Aeronáutica">
        Ingeniería Aeronáutica
    </option>

    <option value="Ingeniería Administrativa">
        Ingeniería Administrativa
    </option>

    <option value="Ingeniería Electrónica y Comunicaciones">
        Ingeniería Electrónica y Comunicaciones
    </option>

    <option value="Ingeniería en Manufactura">
        Ingeniería en Manufactura
    </option>

    <option value="Ingeniería en Materiales">
        Ingeniería en Materiales
    </option>

    <option value="Ingeniería en Mecatrónica">
        Ingeniería en Mecatrónica
    </option>

    <option value="Ingeniería en Sistemas">
        Ingeniería en Sistemas
    </option>

    <option value="Ingeniería Industrial">
        Ingeniería Industrial
    </option>

    <option value="Ingeniería Mecánica">
        Ingeniería Mecánica
    </option>

    <option value="Ingeniería Química">
        Ingeniería Química
    </option>

    <option value="Ingeniería en Tecnología de Software">
        Ingeniería en Tecnología de Software
    </option>

    <option value="Ingeniería Petrolera">
        Ingeniería Petrolera
    </option>

    <option value="Ingeniería Eléctrica">
        Ingeniería Eléctrica
    </option>

    <option value="Posgrado">
        Posgrado
    </option>
</select>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Especificaciones de Invitados</label>
                    <textarea
                        name="guestSpecifications"
                        rows="2"
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                        placeholder="Detalles sobre invitados especiales o requerimientos específicos..."
                        value={formData.guestSpecifications}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-tight">
                        Tipo de Acomodo
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="acomodo_tipo"
                                value='En "U" con mesas y sillas'
                                checked={formData.acomodo_tipo === 'En "U" con mesas y sillas'}
                                onChange={handleChange}
                            />
                            En "U" con mesas y sillas
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="acomodo_tipo"
                                value="Solo sillas tipo Auditorio"
                                checked={formData.acomodo_tipo === "Solo sillas tipo Auditorio"}
                                onChange={handleChange}
                            />
                            Solo sillas tipo Auditorio
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="acomodo_tipo"
                                value="Mesas y sillas en filas"
                                checked={formData.acomodo_tipo === "Mesas y sillas en filas"}
                                onChange={handleChange}
                            />
                            Mesas y sillas en filas
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="acomodo_tipo"
                                value="Otro"
                                checked={formData.acomodo_tipo === "Otro"}
                                onChange={handleChange}
                            />
                            Otro
                        </label>

                        {formData.acomodo_tipo === "Otro" && (
                            <textarea
                                name="otrosObservaciones"
                                value={formData.otrosObservaciones}
                                onChange={handleChange}
                                placeholder="Describa el tipo de acomodo o indique el croquis"
                                className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Detalles de Presídium</label>
                    <textarea
                        name="presidiumDetail"
                        rows="2"
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                        placeholder="Indicaciones para acomodo o protocolo del presídium..."
                        value={formData.presidiumDetail}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Acción del Director</label>
                    <textarea
                        name="directorAction"
                        rows="2"
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                        value={formData.directorAction}
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
    <button 
        type="button" 
        onClick={() => setStep(2)} 
        className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all"
    >
        Atrás
    </button>

    <button 
        type="button" 
        onClick={() => setStep(4)} 
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200/70 hover:shadow-xl hover:shadow-emerald-200/80 transition-all"
    >
        Continuar
        <ChevronRight size={18} />
    </button>
</div>
</div>  // div principal bg-white
);
};

export default EventFormDetalles;