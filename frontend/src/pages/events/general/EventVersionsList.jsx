import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Clock, History, CheckCircle2, ChevronRight, FileText, Calendar, GitCompare } from 'lucide-react';
import VersionDiffModal from '../../../components/VersionDiffModal';

const EventVersionsList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDiffModal, setShowDiffModal] = useState(false);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEventData(response.data);
            } catch (err) {
                setError('Error al cargar el historial de versiones.');
            } finally {
                setLoading(false);
            }
        };
        fetchVersions();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando Versiones</p>
        </div>
    );

    if (error || !eventData) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
            <p className="text-2xl font-bold text-gray-300">😕</p>
            <p className="text-gray-500 font-semibold">{error || 'Historial no encontrado.'}</p>
            <button onClick={() => navigate('/creador/eventos')} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition">
                Volver a Mis Eventos
            </button>
        </div>
    );

    const versions = eventData.versions || [];
    const mainTitle = versions.find(v => v.isCurrentVersion)?.name || versions[0]?.name || 'Ficha Técnica sin título';

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-4 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver
                </button>
                
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl opacity-60 -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner shrink-0">
                            <History size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 leading-tight">
                                {mainTitle}
                            </h1>
                            <p className="text-gray-500 font-medium">Historial de versiones y modificaciones de la ficha técnica.</p>
                        </div>
                    </div>

                    {versions.length > 1 && (
                        <button
                            onClick={() => setShowDiffModal(true)}
                            className="relative z-10 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all shrink-0"
                        >
                            <GitCompare size={18} /> Comparar Cambios
                        </button>
                    )}
                </div>
            </div>

            {/* Versions List */}
            <div className="space-y-6 relative">
                {/* Línea vertical de conexión (timeline decorativo) */}
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-100 -z-10 hidden md:block"></div>

                {versions.map((ver, index) => {
                    const isCurrent = ver.isCurrentVersion;
                    return (
                        <div 
                            key={ver.id}
                            onClick={() => navigate(`/evento/${id}/version/${ver.id}`)}
                            className={`group relative bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm hover:shadow-xl md:ml-16
                                ${isCurrent ? 'border-emerald-200 ring-4 ring-emerald-50/50' : 'border-gray-100 hover:border-emerald-100'}
                            `}
                        >
                            {/* Punto en el timeline */}
                            <div className={`absolute -left-[3.7rem] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white hidden md:flex items-center justify-center shadow-sm
                                ${isCurrent ? 'bg-emerald-500' : 'bg-gray-200'}
                            `}>
                                {isCurrent && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-xl font-display font-bold ${isCurrent ? 'text-emerald-700' : 'text-gray-800'} group-hover:text-emerald-600 transition-colors`}>
                                            Versión {ver.versionNumber}
                                        </h3>
                                        {isCurrent ? (
                                            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                <CheckCircle2 size={12} /> Versión Actual
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                Histórico
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl">
                                        {ver.description || 'Sin descripción para esta versión.'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 md:min-w-[200px]">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center md:justify-end gap-1">
                                            <Calendar size={12} /> Fecha del Evento
                                        </p>
                                        <p className="text-sm font-bold text-gray-700">
                                            {ver.startsAt ? format(new Date(ver.startsAt), "d MMM yyyy", { locale: es }) : 'No definida'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de Comparación de Cambios */}
            <VersionDiffModal 
                isOpen={showDiffModal}
                onClose={() => setShowDiffModal(false)}
                versions={versions}
            />
        </div>
    );
};

export default EventVersionsList;
