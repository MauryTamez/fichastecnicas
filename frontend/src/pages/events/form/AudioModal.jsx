import { X } from 'lucide-react';

const AudioModal = ({
    showAudioModal,
    setShowAudioModal,
    audiovisual,
    setAudiovisual
}) => {

    if (!showAudioModal) return null;


    const toggleAudiovisual = (key) => {
        setAudiovisual(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };


    const audiovisualItems = [
        {
            key: 'sonido',
            label: 'Sonido'
        },
        {
            key: 'proyeccionPresentacion',
            label: 'Proyección de Presentación'
        },
        {
            key: 'proyeccionVideo',
            label: 'Proyección de Video Institucional'
        },
        {
            key: 'videograbacion',
            label: 'Videograbación'
        },
        {
            key: 'personalApoyo',
            label: 'Personal de Apoyo'
        },
        {
            key: 'apuntador',
            label: 'Apuntador para pase de diapositivas'
        },
        {
            key: 'musicaFondo',
            label: 'Música de fondo'
        }
    ];


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">


            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">


                {/* Header */}
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <span className="text-xl">
                            🎧
                        </span>

                        <h2 className="text-xl font-bold">
                            Audiovisual
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={() => setShowAudioModal(false)}
                        className="text-emerald-100 hover:text-white"
                    >
                        <X size={24}/>
                    </button>

                </div>



                {/* Opciones */}
                <div className="p-6 bg-slate-50 space-y-4">


                    {audiovisualItems.map(item => (

                        <label
                            key={item.key}
                            className="flex items-center gap-3 cursor-pointer"
                        >

                            <input
                                type="checkbox"
                                checked={audiovisual[item.key]}
                                onChange={() => toggleAudiovisual(item.key)}
                            />


                            <span>
                                {item.label}
                            </span>


                        </label>

                    ))}


                </div>



                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex justify-end">

                    <button
                        type="button"
                        onClick={() => setShowAudioModal(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold"
                    >
                        Listo
                    </button>

                </div>


            </div>


        </div>
    );
};


export default AudioModal;