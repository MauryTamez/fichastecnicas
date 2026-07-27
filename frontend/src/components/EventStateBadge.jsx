import React from 'react';

const STATE_CONFIG = {
    draft: { label: 'Borrador', class: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-500' },
    requested: { label: 'Solicitado', class: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
    in_review: { label: 'Pendiente', class: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
    scheduled: { label: 'Aceptado', class: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
    rejected: { label: 'Rechazado', class: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
    cancelled: { label: 'Cancelado', class: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
    historical: { label: 'Histórico', class: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500' },
};

// Legacy support for when backend sends translated status or for backward compatibility
const LEGACY_MAPPING = {
    'borrador': 'draft',
    'solicitado': 'requested',
    'en revisión': 'in_review',
    'en revision': 'in_review',
    'pendiente': 'in_review',
    'aceptado': 'scheduled',
    'programado': 'scheduled',
    'rechazado': 'rejected',
    'cancelado': 'cancelled',
    'histórico': 'historical',
    'historico': 'historical'
};

const EventStateBadge = ({ state, className = '' }) => {
    const normalizedState = LEGACY_MAPPING[state?.toLowerCase()] || state;
    const config = STATE_CONFIG[normalizedState] || { label: state || 'Desconocido', class: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-500' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider border shadow-sm ${config.class} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

export default EventStateBadge;
