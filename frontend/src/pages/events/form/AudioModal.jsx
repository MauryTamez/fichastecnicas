import { X } from 'lucide-react';

const AudioModal = ({
    showAudioModal,
    setShowAudioModal,
    sonido,
    setSonido,
    proyeccion,
    setProyeccion
}) => {

    if (!showAudioModal) return null;

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">

            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">

                {/* Header */}
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <span className="text-xl">🎧</span>

                        <h2 className="text-xl font-display font-bold">
                            Audiovisual
                        </h2>
                    </div>

                    <button
                        onClick={() => setShowAudioModal(false)}
                        className="text-emerald-100 hover:text-white transition-colors"
                    >
                        <X size={24}/>
                    </button>

                </div>


                {/* Opciones */}
                <div className="p-6 space-y-4 bg-slate-50">

                    {/* Sonido */}
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={sonido.sonido}
                            onChange={() => toggleSonido('sonido')}
                        />
                        <span>Sonido</span>
                    </label>


                    {/* Proyección */}
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={proyeccion.proyeccionPresentacion}
                            onChange={() => toggleProyeccion('proyeccionPresentacion')}
                        />
                        <span>Proyección de Presentación</span>
                    </label>


                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={proyeccion.proyeccionVideo}
                            onChange={() => toggleProyeccion('proyeccionVideo')}
                        />
                        <span>Proyección de Video Institucional</span>
                    </label>


                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={proyeccion.videograbacion}
                            onChange={() => toggleProyeccion('videograbacion')}
                        />
                        <span>Videograbación</span>
                    </label>


                    {/* Opciones de sonido */}
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={sonido.personalApoyo}
                            onChange={() => toggleSonido('personalApoyo')}
                        />
                        <span>Personal de Apoyo</span>
                    </label>


                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={sonido.apuntador}
                            onChange={() => toggleSonido('apuntador')}
                        />
                        <span>Apuntador para pase de diapositivas</span>
                    </label>


                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={sonido.musicaFondo}
                            onChange={() => toggleSonido('musicaFondo')}
                        />
                        <span>Música de fondo</span>
                    </label>

                </div>


                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex justify-end">

                    <button
                        type="button"
                        onClick={() => setShowAudioModal(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
                    >
                        Listo
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AudioModal;