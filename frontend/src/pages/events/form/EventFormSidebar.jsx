import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const EventFormSidebar = ({ formData, venues }) => {
    const venueName = venues.find(v => String(v.id) === String(formData.locationId))?.nombre 
        || venues.find(v => String(v.id) === String(formData.locationId))?.name 
        || 'Pendiente';

    return (
        <div className="hidden lg:block">
            <div className="sticky top-10 bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-40 -mr-20 -mt-20"></div>
                <h3 className="text-2xl font-display font-bold mb-8 relative z-10">Resumen</h3>
                <div className="space-y-6 relative z-10">
                    <div className="space-y-1">
                        <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Proyecto</p>
                        <p className="font-bold text-lg leading-tight truncate">{formData.name || 'Sin título'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Locación</p>
                        <p className="font-bold text-lg leading-tight truncate">{venueName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Programación</p>
                        <p className="text-sm font-medium text-emerald-50/80">
                            {formData.startsAt 
                                ? new Date(formData.startsAt).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                                : 'Pendiente de definir'}
                        </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-emerald-800 space-y-4">
                        <div className={`flex items-center gap-2 text-sm ${formData.name ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <CheckCircle2 size={16} /> Informacion basica
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${formData.startsAt ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <CheckCircle2 size={16} /> Fecha y Hora
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${formData.locationId ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <CheckCircle2 size={16} /> Asignación de Recinto
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventFormSidebar;
