import React from 'react';

const Organigrama = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">Organigrama Departamental</h1>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 font-medium">Esta vista cargará el organigrama interactivo desde el nuevo endpoint /api/departments/organigram.</p>
                <div className="mt-8 flex justify-center">
                    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default Organigrama;
