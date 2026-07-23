import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { Calendar, Filter, Search, Clock, ChevronRight, FileText, User, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EventStateBadge from '../../../components/EventStateBadge';

const DepartmentEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            setEvents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching department events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const titleMatch = (event.name || event.titulo || '').toLowerCase().includes(searchTerm.toLowerCase());
        const userMatch = (event.user?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = titleMatch || userMatch;
        
        const matchesStatus = statusFilter === 'all' || event.currentState === statusFilter || event.estado === statusFilter;
        const matchesDate = !dateFilter || (event.fecha_inicio && String(event.fecha_inicio).startsWith(dateFilter));
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Eventos Dpto</h1>
                    <p className="text-gray-500 font-medium text-sm">Todas las fichas técnicas y eventos pertenecientes a tu departamento.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-10">
                <div className="flex items-center bg-gray-50/50 px-4 py-2.5 rounded-2xl border border-gray-100 w-full md:max-w-md focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                    <Search size={18} className="text-gray-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Buscar por evento o creador..." 
                        className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select 
                            className="bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="requested">Solicitados</option>
                            <option value="in_review">En Revisión</option>
                            <option value="scheduled">Aceptados</option>
                            <option value="rejected">Rechazados</option>
                            <option value="draft">Borradores</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <input 
                            type="date" 
                            className="bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content list */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Cargando eventos del departamento...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FileText size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">No se encontraron eventos</h3>
                    <p className="text-gray-500 mb-8 max-w-md">No hay eventos en tu departamento que coincidan con los filtros seleccionados.</p>
                    {(searchTerm || statusFilter !== 'all' || dateFilter) && (
                        <button 
                            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateFilter(''); }}
                            className="text-emerald-600 font-bold hover:text-emerald-700 bg-emerald-50 px-6 py-2 rounded-xl transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                        <div 
                            key={event.id}
                            onClick={() => navigate(`/evento/${event.id}/versiones`)}
                            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <EventStateBadge state={event.currentState || event.estado} />
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
                                    <Calendar size={18} />
                                </div>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h3 className="text-xl font-display font-bold text-gray-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                    {event.titulo || event.name || 'Sin Título'}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                    {event.descripcion || event.description || 'Sin descripción disponible.'}
                                </p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-50 mt-auto relative z-10">
                                {event.user?.nombre && (
                                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                        <User size={14} className="mr-2 text-gray-400 shrink-0" />
                                        <span className="font-semibold truncate">Creador: {event.user.nombre}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400" />
                                        <span className="font-semibold text-gray-700">
                                            {event.fecha_inicio ? format(new Date(event.fecha_inicio), "d MMM yyyy", { locale: es }) : 'Por definir'}
                                        </span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                </div>
                                <div className="pt-2 flex gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/editar-evento/${event.id}`);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors border border-blue-200"
                                    >
                                        <Edit size={14} /> Edición Directa
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

export default DepartmentEvents;
