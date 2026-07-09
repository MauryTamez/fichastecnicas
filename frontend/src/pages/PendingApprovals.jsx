import React from 'react';

const PendingApprovals = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">Aprobaciones Pendientes</h1>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 font-medium">Lista de fichas pendientes por aprobar. El backend filtrará los datos dependiendo de si eres moderador o encargado de departamento.</p>
            </div>
        </div>
    );
};

export default PendingApprovals;
