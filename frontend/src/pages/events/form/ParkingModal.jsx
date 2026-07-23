import React from 'react';
import { Plus, X } from 'lucide-react';

const MARCAS_POPULARES = [
    "Toyota", "Nissan", "Chevrolet", "Ford", "Honda", 
    "Kia", "Hyundai", "Mazda", "Volkswagen", "BMW", 
    "Jeep", "Dodge", "GMC", "Subaru", "Otro / Otra"
];

const COLORES_COMUNES = [
    "Blanco", "Negro", "Gris", "Plata", "Rojo", 
    "Azul", "Verde", "Amarillo", "Naranja", "Café", "Otro / Otra"
];

const ParkingModal = ({
    showParkingModal,
    setShowParkingModal,
    currentVehicle,
    handleVehicleChange,
    handleAddVehicle,
    parkingList,
    setParkingList
}) => {
    if (!showParkingModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🚗</span>
                        <h2 className="text-xl font-display font-bold">Control de Vehículos para Acceso</h2>
                    </div>
                    <button onClick={() => setShowParkingModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            name="nombreResponsable"
                            placeholder="Nombre del Responsable"
                            value={currentVehicle.nombreResponsable}
                            onChange={handleVehicleChange}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
                        />
                        <input
                            type="text"
                            name="placaVehiculo"
                            placeholder="Placas (Ej: XYZ-123-A)"
                            value={currentVehicle.placaVehiculo}
                            onChange={handleVehicleChange}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm uppercase outline-none shadow-sm animate-fade-in"
                        />
                        <select
                            name="marcaVehiculo"
                            value={currentVehicle.marcaVehiculo}
                            onChange={handleVehicleChange}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm font-medium text-slate-700"
                        >
                            <option value="" disabled>Selecciona una marca...</option>
                            {MARCAS_POPULARES.map((marca) => (
                                <option key={marca} value={marca}>{marca}</option>
                            ))}
                        </select>
                        <select
                            name="colorVehiculo"
                            value={currentVehicle.colorVehiculo}
                            onChange={handleVehicleChange}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm font-medium text-slate-700"
                        >
                            <option value="" disabled>Selecciona un color...</option>
                            {COLORES_COMUNES.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddVehicle}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                        <Plus size={14} /> Agregar Vehículo
                    </button>

                    {parkingList.length > 0 && (
                        <div className="space-y-2 mt-2 border-t border-slate-200 pt-3 max-h-52 overflow-y-auto">
                            {parkingList.map((vehicle, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-sm shadow-sm animate-fade-in">
                                    <div className="truncate flex-1 pr-2">
                                        <p className="font-bold text-slate-800 truncate">{vehicle.marcaVehiculo} • <span className="text-emerald-600">{vehicle.placaVehiculo}</span></p>
                                        <p className="text-xs text-slate-400 font-medium truncate">Resp: {vehicle.nombreResponsable} {vehicle.colorVehiculo ? `(${vehicle.colorVehiculo})` : ''}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setParkingList(prev => prev.filter((_, i) => i !== idx))}
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
                        onClick={() => setShowParkingModal(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParkingModal;
