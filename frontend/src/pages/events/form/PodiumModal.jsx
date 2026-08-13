import { X } from 'lucide-react';

const PodiumModal = ({
    showPodiumModal,
    setShowPodiumModal,
    otros,
    setOtros
}) => {

    if (!showPodiumModal) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Pódium
                    </h2>

                    <button
                        onClick={() => setShowPodiumModal(false)}
                    >
                        <X size={22}/>
                    </button>
                </div>


                <label className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="checkbox"
                        checked={otros.podium}
                        onChange={() =>
                            setOtros(prev => ({
                                ...prev,
                                podium: !prev.podium
                            }))
                        }
                        className="h-5 w-5"
                    />

                    <span className="text-gray-700 font-medium">
                        Pódium
                    </span>

                </label>


                <button
                    onClick={() => setShowPodiumModal(false)}
                    className="mt-6 w-full rounded-xl bg-emerald-600 text-white py-2 font-bold hover:bg-emerald-700"
                >
                    Guardar
                </button>


            </div>

        </div>
    );
};

export default PodiumModal;