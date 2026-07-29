import { X } from 'lucide-react';

const VideoModal = ({
    showVideoModal,
    setShowVideoModal,
    sonido,
    setSonido,
    proyeccion,
    setProyeccion,
}) => {
    if (!showVideoModal) return null;

    const toggleSonido = (key) => {
        setSonido(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleProyeccion = (key) => {
        setProyeccion(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const sonidoItems = [
        { key: 'sonido', label: 'Sonido' },
        { key: 'personalApoyo', label: 'Personal de Apoyo' },
        { key: 'apuntador', label: 'Apuntador para pase de diapositivas' },
        { key: 'musicaFondo', label: 'Música de fondo' },
    ];

    const proyeccionItems = [
        { key: 'proyeccionPresentacion', label: 'Proyección de Presentación' },
        { key: 'proyeccionVideo', label: 'Proyección de Video Institucional' },
        { key: 'videograbacion', label: 'Videograbación' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">

                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📽️</span>
                        <h2 className="text-xl font-display font-bold">
                            Audiovisual
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowVideoModal(false)}
                        className="text-emerald-100 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 bg-slate-50 space-y-6">

                    <div>
                        <h3 className="font-semibold text-slate-700 mb-3">
                            Sonido
                        </h3>

                        <div className="space-y-3">
                            {sonidoItems.map(item => (
                                <label
                                    key={item.key}
                                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={sonido[item.key]}
                                        onChange={() => toggleSonido(item.key)}
                                        className="h-4 w-4"
                                    />
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-700 mb-3">
                            Proyección
                        </h3>

                        <div className="space-y-3">
                            {proyeccionItems.map(item => (
                                <label
                                    key={item.key}
                                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={proyeccion[item.key]}
                                        onChange={() => toggleProyeccion(item.key)}
                                        className="h-4 w-4"
                                    />
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowVideoModal(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm"
                    >
                        Listo
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VideoModal;