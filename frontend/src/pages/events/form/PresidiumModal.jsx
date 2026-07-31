import { Plus, X } from 'lucide-react';

const PresidiumModal = ({
    showPresidiumModal,
    setShowPresidiumModal,
    currentMember,
    setCurrentMember,
    handleAddMember,
    presidiumList,
    setPresidiumList
}) => {
    if (!showPresidiumModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">👥</span>
                        <h2 className="text-xl font-display font-bold">Listado de Integrantes del Presídium</h2>
                    </div>
                    <button onClick={() => setShowPresidiumModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

  <input
    type="number"
    min="1"
    step="1"
    placeholder="Lugar asignado"
    value={currentMember.lugarAsignado}
    onChange={(e) =>
        setCurrentMember(prev => ({
            ...prev,
            lugarAsignado: e.target.value
        }))
    }
    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
/>
    <input
        type="text"
        placeholder="Nombre Completo"
        value={currentMember.nombre}
        onChange={(e) => {
    const formattedName = e.target.value.replace(
        /(^\w|\s\w)/g,
        (match) => match.toUpperCase()
    );

    setCurrentMember(prev => ({
        ...prev,
        nombre: formattedName
    }));
}}
        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
    />

    <input
        type="text"
        placeholder="Puesto / Cargo"
        value={currentMember.puesto}
        onChange={(e) => {
    const formattedPosition = e.target.value.replace(
        /(^\w|\s\w)/g,
        (match) => match.toUpperCase()
    );

    setCurrentMember(prev => ({
        ...prev,
        puesto: formattedPosition
    }));
}}
        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
    />

</div>
                    <button
                        type="button"
                        onClick={handleAddMember}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                        <Plus size={14} /> Agregar Integrante
                    </button>

                    {presidiumList.length > 0 && (
                        <div className="space-y-2 mt-2 border-t border-slate-200 pt-3 max-h-52 overflow-y-auto">
                            {presidiumList.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-sm shadow-sm animate-fade-in">
                                    <div className="truncate flex-1 pr-2">
                                       <p className="font-bold text-slate-800 truncate">
    Lugar {member.lugarAsignado} - {member.nombre}
</p>

<p className="text-xs text-slate-400 font-medium truncate">
    {member.puesto}
</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPresidiumList(prev => prev.filter((_, i) => i !== idx))}
                                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowPresidiumModal(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PresidiumModal;
