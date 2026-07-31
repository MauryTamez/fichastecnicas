import { CalendarDays, FileText, Save } from 'lucide-react';

const EventFormOpciones = ({
    setStep,
    handleSubmit
}) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-1 ring-emerald-100 shadow-sm">
                    <FileText size={24} />
                </div>

                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                        Finalizar ficha técnica
                    </h2>

                    <p className="text-sm font-medium text-slate-400">
                        Puedes guardar la ficha ahora o agregar más información
                    </p>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                {/* Guardar directamente */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 text-white flex flex-col items-center gap-3"
                >
                    <Save size={32} />

                    <span className="text-xl font-bold">
                        Guardar ficha
                    </span>

                    <span className="text-sm text-emerald-100">
                        Finalizar sin más detalles
                    </span>
                </button>



                {/* Ir a detalles técnicos */}
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 text-white flex flex-col centered gap-3 items-center"
                >
                    <FileText size={32} />

                    <span className="text-xl font-bold">
                        Detalles técnicos
                    </span>

                    <span className="text-sm text-emerald-100">
                        Agregar información adicional
                    </span>
                </button>



                {/* Ir a orden del día */}
                <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="rounded-[1.75rem] bg-emerald-700 p-6 shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 hover:scale-105 text-white flex flex-col items-center gap-3"
                >
                    <CalendarDays size={32} />

                    <span className="text-xl font-bold">
                        Orden del día
                    </span>

                    <span className="text-sm text-emerald-100">
                        Agregar agenda del evento
                    </span>
                </button>


            </div>


            <div className="mt-10 pt-8 border-t border-gray-50 flex justify-start">

                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all"
                >
                    Atrás
                </button>

            </div>

        </div>
    );
};


export default EventFormOpciones;