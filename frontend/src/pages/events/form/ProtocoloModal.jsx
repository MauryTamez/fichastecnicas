import { X } from 'lucide-react';

const ProtocoloModal = ({
    showProtocoloModal,
    setShowProtocoloModal,
    otros,
    setOtros
}) => {

    if (!showProtocoloModal) return null;

    const toggle = (key) => {
        setOtros(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const items = [
        { key: 'banderas', label: 'Banderas' },
        { key: 'himno', label: 'Himno de la UANL' },
        { key: 'separadorHimno', label: 'Separador con himno' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">

            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">


                {/* Header */}
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <span className="text-xl">
                            🏳️
                        </span>

                        <h2 className="text-xl font-display font-bold">
                            Protocolo y Banderas
                        </h2>

                    </div>


                    <button
    type="button"
    onClick={() => setShowProtocoloModal(false)}
    className="text-emerald-100 hover:text-white transition-colors"
>
    <X size={24}/>
</button>
                </div>


                {/* Opciones */}
                <div className="p-6 space-y-3 bg-slate-50">

                    {items.map(item => (

                        <label
                            key={item.key}
                            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
                        >

                            <input
                                type="checkbox"
                                checked={otros[item.key]}
                                onChange={() => toggle(item.key)}
                                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />


                            <span className="text-sm font-medium text-slate-700">
                                {item.label}
                            </span>


                        </label>

                    ))}

                </div>


                {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end">

    <button
        type="button"
        onClick={() => setShowProtocoloModal(false)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
    >
        Listo
    </button>

</div>


            </div>

        </div>
    );
};

export default ProtocoloModal;