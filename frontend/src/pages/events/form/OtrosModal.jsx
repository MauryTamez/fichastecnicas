import { X } from "lucide-react";

const OtrosModal = ({
    showOtrosModal,
    setShowOtrosModal,
    otros,
    setOtros
}) => {

    if (!showOtrosModal) return null;

    const otrosItems = [
        { key: "manteles", label: "Manteles" },
        { key: "banderas", label: "Banderas" },
        { key: "coffeeBreak", label: "Coffee Break" },
        { key: "estacionamiento", label: "Estacionamiento" },
        { key: "fotografia", label: "Fotografía" },
        { key: "podium", label: "Podium" },
        { key: "presidium", label: "Presidium" },
        { key: "edecanes", label: "Edecanes" },
        { key: "himno", label: "Himno" },
        { key: "separadorHimno", label: "Separador Himno" },
    ];

    const handleChange = (key) => {
        setOtros(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">
                        Otros requerimientos
                    </h2>

                    <button
                        onClick={() => setShowOtrosModal(false)}
                    >
                        <X />
                    </button>
                </div>


                <div className="grid grid-cols-2 gap-3">

                    {otrosItems.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => handleChange(key)}
                            className={`rounded-xl p-3 border transition ${
                                otros[key]
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100"
                            }`}
                        >
                            {label}
                        </button>
                    ))}

                </div>


                <button
                    onClick={() => setShowOtrosModal(false)}
                    className="mt-6 w-full rounded-xl bg-slate-800 text-white py-3"
                >
                    Guardar
                </button>

            </div>

        </div>
    );
};

export default OtrosModal;