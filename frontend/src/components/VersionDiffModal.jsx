import React, { useState, useMemo } from 'react';
import { X, ArrowRight, CheckCircle2, GitCompare, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const VersionDiffModal = ({ isOpen, onClose, versions = [], defaultV1Id = null, defaultV2Id = null, venues = [] }) => {
    if (!isOpen || !versions || versions.length === 0) return null;

    // Ordenar versiones por ID / versión ascendente (1, 2, 3...)
    const sortedVersions = useMemo(() => {
        return [...versions].sort((a, b) => (a.versionNumber || a.id) - (b.versionNumber || b.id));
    }, [versions]);

    // Establecer selecciones por defecto (ej. Versión N-1 vs Versión N)
    const initialV2 = sortedVersions.find(v => String(v.id) === String(defaultV2Id)) || sortedVersions[sortedVersions.length - 1];
    const initialV1Index = sortedVersions.findIndex(v => String(v.id) === String(initialV2?.id)) - 1;
    const initialV1 = sortedVersions.find(v => String(v.id) === String(defaultV1Id)) || (initialV1Index >= 0 ? sortedVersions[initialV1Index] : sortedVersions[0]);

    const [v1Id, setV1Id] = useState(initialV1?.id);
    const [v2Id, setV2Id] = useState(initialV2?.id);
    const [onlyDifferences, setOnlyDifferences] = useState(true);

    const version1 = sortedVersions.find(v => String(v.id) === String(v1Id)) || sortedVersions[0];
    const version2 = sortedVersions.find(v => String(v.id) === String(v2Id)) || sortedVersions[sortedVersions.length - 1];

    const formatDate = (dateStr) => {
        if (!dateStr) return 'No definida';
        try {
            return format(new Date(dateStr), "d MMM yyyy HH:mm 'hrs'", { locale: es });
        } catch {
            return String(dateStr);
        }
    };

    // Helper para formatear objetos Boolean (Audiovisual y Requerimientos)
    const formatBoolMap = (obj = {}) => {
        if (!obj) return 'Ninguno';
        const activeKeys = Object.entries(obj).filter(([_, val]) => Boolean(val)).map(([key]) => key);
        if (activeKeys.length === 0) return 'Ninguno';
        return activeKeys.join(', ');
    };

    // Estructurar los campos para comparación
    const fieldComparisons = useMemo(() => {
        if (!version1 || !version2) return [];

        const rawFields = [
            { key: 'name', label: 'Nombre del Evento' },
            { key: 'objective', label: 'Objetivo' },
            { key: 'description', label: 'Descripción' },
            { 
                key: 'startsAt', 
                label: 'Fecha de Inicio', 
                formatVal: formatDate 
            },
            { 
                key: 'endsAt', 
                label: 'Fecha de Fin', 
                formatVal: formatDate 
            },
            { key: 'dressCode', label: 'Código de Vestimenta' },
            { key: 'programImpacted', label: 'Programa Impactado' },
            { key: 'guestSpecifications', label: 'Especificaciones de Invitados' },
            { key: 'presidiumDetail', label: 'Detalle de Presídium' },
            { key: 'directorAction', label: 'Acción del Director' },
            { key: 'cantidadPersonas', label: 'Cantidad de Personas' },
            { key: 'acomodo_tipo', label: 'Tipo de Acomodo' },
            { key: 'otrosObservaciones', label: 'Observaciones Adicionales' },
            { key: 'horaFotografia', label: 'Hora de Fotografía' },
            { 
                key: 'audiovisual', 
                label: 'Audiovisual', 
                formatVal: formatBoolMap 
            },
            { 
                key: 'requerimientosOtros', 
                label: 'Requerimientos Especiales', 
                formatVal: formatBoolMap 
            },
            { 
                key: 'activities', 
                label: 'Agenda / Minuto a Minuto', 
                formatVal: (acts) => Array.isArray(acts) ? acts.map(a => `${a.startsAt || ''}-${a.endsAt || ''} ${a.name}`).join(' | ') : '' 
            }
        ];

        return rawFields.map(field => {
            const val1Raw = version1[field.key];
            const val2Raw = version2[field.key];

            const val1 = field.formatVal ? field.formatVal(val1Raw) : (val1Raw ?? 'No especificado');
            const val2 = field.formatVal ? field.formatVal(val2Raw) : (val2Raw ?? 'No especificado');

            const isDifferent = String(val1).trim() !== String(val2).trim();

            return {
                label: field.label,
                val1,
                val2,
                isDifferent
            };
        });
    }, [version1, version2]);

    const displayedFields = onlyDifferences ? fieldComparisons.filter(f => f.isDifferent) : fieldComparisons;
    const diffCount = fieldComparisons.filter(f => f.isDifferent).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Header */}
                <div className="p-6 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                            <GitCompare size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold leading-tight">Comparador de Versiones</h2>
                            <p className="text-xs text-gray-400 font-medium">
                                Visualiza las modificaciones realizadas entre versiones de la ficha técnica.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Controls Bar */}
                <div className="p-6 bg-slate-50 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Versión Base (Anterior)</label>
                            <select 
                                value={v1Id} 
                                onChange={(e) => setV1Id(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {sortedVersions.map(v => (
                                    <option key={v.id} value={v.id}>
                                        Versión {v.versionNumber} {v.isCurrentVersion ? '(Actual)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4 hidden sm:block">
                            <ArrowRight size={18} className="text-gray-400" />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Versión Modificada</label>
                            <select 
                                value={v2Id} 
                                onChange={(e) => setV2Id(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {sortedVersions.map(v => (
                                    <option key={v.id} value={v.id}>
                                        Versión {v.versionNumber} {v.isCurrentVersion ? '(Actual)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${diffCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                                {diffCount} {diffCount === 1 ? 'cambio detectado' : 'cambios detectados'}
                            </span>
                        </div>

                        <button
                            onClick={() => setOnlyDifferences(!onlyDifferences)}
                            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                                onlyDifferences ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Eye size={14} />
                            {onlyDifferences ? 'Mostrando sólo diferencias' : 'Mostrando todos los campos'}
                        </button>
                    </div>
                </div>

                {/* Content Diff List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {displayedFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Sin diferencias detectadas</h3>
                            <p className="text-xs text-gray-500 max-w-sm mt-1">
                                {v1Id === v2Id ? 'Has seleccionado la misma versión en ambos lados.' : 'Los campos entre estas dos versiones son idénticos.'}
                            </p>
                        </div>
                    ) : (
                        displayedFields.map((field, idx) => (
                            <div 
                                key={idx} 
                                className={`rounded-2xl p-5 border transition-all ${
                                    field.isDifferent ? 'bg-white border-amber-200 shadow-sm' : 'bg-gray-50/50 border-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                                        {field.label}
                                        {field.isDifferent && (
                                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                                Modificado
                                            </span>
                                        )}
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Versión 1 */}
                                    <div className="bg-red-50/60 rounded-xl p-3.5 border border-red-100">
                                        <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            Versión {version1.versionNumber} (Anterior)
                                        </p>
                                        <p className={`text-xs font-semibold ${field.isDifferent ? 'text-red-900 line-through decoration-red-400' : 'text-gray-700'}`}>
                                            {field.val1 || <span className="italic text-gray-400">Vacío</span>}
                                        </p>
                                    </div>

                                    {/* Versión 2 */}
                                    <div className="bg-emerald-50/80 rounded-xl p-3.5 border border-emerald-200">
                                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            Versión {version2.versionNumber} (Nueva)
                                        </p>
                                        <p className={`text-xs font-bold ${field.isDifferent ? 'text-emerald-950' : 'text-gray-700'}`}>
                                            {field.val2 || <span className="italic text-gray-400">Vacío</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                    >
                        Cerrar Comparador
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VersionDiffModal;
