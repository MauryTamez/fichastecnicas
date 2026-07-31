import { Layers } from 'lucide-react';

const EventFormRequerimientos = ({
     formData,
    handleChange,

    audiovisual,
    setAudiovisual,

    microfonos,
    setMicrofonos,

    otros,
    otrosItems,
    toggleOtro,

    setShowParkingModal,
    setShowPhotoModal,
    setShowPresidiumModal,

    setShowAudioModal,
    setShowMicrophonesModal,
    setShowOtrosModal,

    setShowPodiumModal,
    setShowProtocoloModal,
    setShowLogisticaModal,


  audiovisualCount,
microfonosCount,
protocoloCount,
logisticaCount,
    podiumSelected,
    presidiumCount,
    estacionamientoCount,
    fotografiaSelected,

    setStep,

}) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-1 ring-emerald-100 shadow-sm">
                    <Layers size={24} />
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Requerimientos del Evento</h2>
                    <p className="text-sm font-medium text-slate-400">Seleccione el equipo audiovisual y requerimientos logísticos necesarios</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

 


  {/* Sonido */}
<div
    onClick={() => setShowAudioModal(true)}
    className="cursor-pointer rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
>
    <h3 className="text-xl font-bold text-white">
        Sonido

        {audiovisualCount > 0 && (
    <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
        {audiovisualCount}
    </span>
)}
    </h3>
</div>
   {/* Micrófonos */}
<div
    onClick={() => setShowMicrophonesModal(true)}
    className="cursor-pointer rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
>
    <h3 className="text-xl font-bold text-white">
        Micrófonos

        {microfonosCount > 0 && (
            <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
                {microfonosCount}
            </span>
        )}
    </h3>
</div>
    {/* Estacionamiento */}
    <div
        onClick={() => setShowParkingModal(true)}
        className="cursor-pointer rounded-[1.75rem] bg-emerald-700  p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
    >
       <h3 className="text-xl font-bold text-white">

    Estacionamiento

    {estacionamientoCount > 0 && (
        <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
            {estacionamientoCount}
        </span>
    )}

</h3>
    </div>

    {/* Fotografía */}
    <div
        onClick={() => setShowPhotoModal(true)}
        className="cursor-pointer rounded-[1.75rem] bg-emerald-700  p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
    >
       <h3 className="text-xl font-bold text-white">

Fotografía

{fotografiaSelected && (
    <span className="ml-2 text-sm">
        ✔
    </span>
)}

</h3>
    </div>

    {/* Protocolo y Banderas */}
    <div
         onClick={() => setShowProtocoloModal(true)}
        className="cursor-pointer rounded-[1.75rem] bg-emerald-700  p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
    >
       <h3 className="text-xl font-bold text-white">

Protocolo y Banderas

{protocoloCount > 0 && (
    <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
        {protocoloCount}
    </span>
)}

</h3>
    </div>

    {/* Logística y Mobiliario */}
    <div
         onClick={() => setShowLogisticaModal(true)}
        className="cursor-pointer rounded-[1.75rem] bg-emerald-700  p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
    >
       <h3 className="text-xl font-bold text-white">

Logística y Mobiliario

{logisticaCount > 0 && (
    <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
        {logisticaCount}
    </span>
)}

</h3>
    </div>

   {/* Presídium */}
<div
    onClick={() => setShowPresidiumModal(true)}
    className="cursor-pointer rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
>
    <h3 className="text-xl font-bold text-white">
        Presídium

        {presidiumCount > 0 && (
            <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
                {presidiumCount}
            </span>
        )}

    </h3>
</div>

  {/* Pódium */}
<div
    onClick={() => setShowPodiumModal(true)}
    className="cursor-pointer rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105"
>
    <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
            Pódium
        </h3>

        {podiumSelected && (
            <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full font-bold">
                1
            </span>
        )}
    </div>

   
</div>

</div>
            <div className="mt-8 rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tight">Observaciones</label>
                <textarea
                    name="otrosObservaciones"
                    rows="4"
                    className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                    placeholder="Anota observaciones adicionales del evento..."
                    value={formData.otrosObservaciones}
                    onChange={handleChange}
                />
            </div>

           <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
    <button
        type="button"
        onClick={() => setStep(1)}
        className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all"
    >
        Atrás
    </button>

    <button
        type="button"
        onClick={() => {
            if (podiumSelected || presidiumCount > 0) {
                setStep(3);
            } else {
                setStep(5);
            }
        }}
        className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
    >
        Continuar
    </button>
</div>
        </div>
    );
};

export default EventFormRequerimientos;
