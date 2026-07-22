import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import EventStateBadge from '../components/EventStateBadge';

const PendingApprovals = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingApprovals = async () => {
            try {
                // El rol determinará el endpoint (encargado vs moderador)
                const isEncargado = window.location.pathname.includes('/encargado');
                const endpoint = isEncargado ? '/encargado/solicitudes' : '/moderador/solicitudes';
                
                const response = await api.get(endpoint);
                setEvents(response.data.data);
            } catch (error) {
                console.error('Error fetching pending approvals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingApprovals();
    }, [user]);

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">Aprobaciones Pendientes</h1>
            
            {events.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center">
                    <CheckCircle size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No hay fichas técnicas pendientes por aprobar en tu departamento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div 
                            key={event.id} 
                            onClick={() => navigate(`/evento/${event.id}/version/${event.versionId}`)}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-premium hover:border-emerald-100 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <EventStateBadge state={event.currentState} />
                            </div>
                            
                            <h3 className="text-lg font-display font-bold text-gray-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                {event.titulo}
                            </h3>
                            
                            <div className="mt-auto space-y-2 pt-4 relative z-10">
                                <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                    <User size={14} className="mr-2 text-gray-400" />
                                    <span className="font-semibold text-gray-700 truncate">{event.user_name}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                    <Calendar size={14} className="mr-2 text-gray-400" />
                                    {event.fecha_inicio ? format(new Date(event.fecha_inicio), "d 'de' MMMM, yyyy", { locale: es }) : 'Sin fecha'}
                                </div>
                                <div className="pt-2 flex gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/editar-evento/${event.id}`);
                                        }}
                                        className="flex-1 text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors border border-blue-200"
                                    >
                                        Editar Directo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingApprovals;
