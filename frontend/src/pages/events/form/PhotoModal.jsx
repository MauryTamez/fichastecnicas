import React from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

const PhotoModal = ({
    showPhotoModal,
    setShowPhotoModal,
    horaFotografia,
    setHoraFotografia
}) => {
    if (!showPhotoModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📸</span>
                        <h2 className="text-xl font-display font-bold">Horario Programado (Foto)</h2>
                    </div>
                    <button onClick={() => setShowPhotoModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4 bg-slate-50">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Hora Exacta para la Toma</label>
                        <input
                            type="time"
                            value={horaFotografia}
                            onChange={(e) => setHoraFotografia(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold text-emerald-700 outline-none shadow-sm"
                        />
                    </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            if (!horaFotografia) {
                                Swal.fire('Atención', 'Por favor especifica un horario para continuar.', 'info');
                                return;
                            }
                            setShowPhotoModal(false);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                    >
                        Guardar Horario
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;
