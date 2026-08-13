import { X } from 'lucide-react';

const MicrophonesModal = ({
    showMicrophonesModal,
    setShowMicrophonesModal,
    microfonos,
    setMicrofonos,
}) => {
    if (!showMicrophonesModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">

                {/* Header */}
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🎤</span>
                        <h2 className="text-xl font-display font-bold">
                            Seleccionar Micrófonos
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowMicrophonesModal(false)}
                        className="text-emerald-100 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 bg-slate-50 space-y-4">

                    <label className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition">
                        <input
                            type="checkbox"
                            checked={microfonos.microfonoInalambrico}
                            onChange={() =>
                                setMicrofonos(prev => ({
                                    ...prev,
                                    microfonoInalambrico: !prev.microfonoInalambrico,
                                }))
                            }
                        />
                        <span>Micrófono Inalámbrico de mano</span>
                    </label>

                    <label className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition">
                        <input
                            type="checkbox"
                            checked={microfonos.microfonoMesa}
                            onChange={() =>
                                setMicrofonos(prev => ({
                                    ...prev,
                                    microfonoMesa: !prev.microfonoMesa,
                                }))
                            }
                        />
                        <span>Micrófono Inalámbrico con base de mesa</span>
                    </label>

                    <label className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition">
                        <input
                            type="checkbox"
                            checked={microfonos.microfonoPresidencial}
                            onChange={() =>
                                setMicrofonos(prev => ({
                                    ...prev,
                                    microfonoPresidencial: !prev.microfonoPresidencial,
                                }))
                            }
                        />
                        <span>Micrófono Presidencial</span>
                    </label>

                    <label className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition">
                        <input
                            type="checkbox"
                            checked={microfonos.microfonoDiadema}
                            onChange={() =>
                                setMicrofonos(prev => ({
                                    ...prev,
                                    microfonoDiadema: !prev.microfonoDiadema,
                                }))
                            }
                        />
                        <span>Micrófono de Diadema</span>
                    </label>

                    <label className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition">
                        <input
                            type="checkbox"
                            checked={microfonos.microfonoAlambrico}
                            onChange={() =>
                                setMicrofonos(prev => ({
                                    ...prev,
                                    microfonoAlambrico: !prev.microfonoAlambrico,
                                }))
                            }
                        />
                        <span>Micrófono Alámbrico</span>
                    </label>

                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowMicrophonesModal(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition"
                    >
                        Listo
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MicrophonesModal;