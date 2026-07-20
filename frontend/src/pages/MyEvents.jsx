import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Filter, Search, PlusCircle, Clock, CheckCircle2, XCircle, ChevronRight, FileText, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EventStateBadge from '../components/EventStateBadge';

const MyEvents = () => {
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
            console.error('Error fetching my events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = (event.name || event.titulo || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.currentState === statusFilter;
        // Filter by created_at or start date if dateFilter is set
        const matchesDate = !dateFilter || (event.fecha_inicio && event.fecha_inicio.startsWith(dateFilter));
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Mis Eventos</h1>
                    <p className="text-gray-500 font-medium text-sm">Gestiona las fichas técnicas que has creado o tienes a cargo.</p>
                </div>
                <button
                    onClick={() => navigate('/nuevo-evento')}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                    <PlusCircle size={20} />
                    Crear Ficha Técnica
                </button>
            </div>

            {/* Filters Section (Glassmorphism) */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-10">
                <div className="flex items-center bg-gray-50/50 px-4 py-2.5 rounded-2xl border border-gray-100 w-full md:max-w-md focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                    <Search size={18} className="text-gray-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre de evento..." 
                        className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select 
                            className="bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer appearance-none pr-8"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="in_review">Pendientes</option>
                            <option value="scheduled">Aceptados</option>
                            <option value="rejected">Rechazados</option>
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
                    <p className="text-gray-500 font-bold animate-pulse">Cargando tus eventos...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FileText size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">No se encontraron eventos</h3>
                    <p className="text-gray-500 mb-8 max-w-md">No tienes eventos que coincidan con los filtros actuales o aún no has creado ninguna ficha técnica.</p>
                    {searchTerm || statusFilter !== 'all' || dateFilter ? (
                        <button 
                            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateFilter(''); }}
                            className="text-emerald-600 font-bold hover:text-emerald-700 bg-emerald-50 px-6 py-2 rounded-xl transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/nuevo-evento')}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                        >
                            Crear mi primer evento
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                        <div 
                            key={event.id}
                            onClick={() => navigate(`/evento/${event.id}/versiones`)}
                            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-premium hover:shadow-2xl hover:border-emerald-100 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -mr-10 -mt-10"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <EventStateBadge state={event.currentState} />
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform">
                                    <Calendar size={20} />
                                </div>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h3 className="text-xl font-display font-bold text-gray-900 leading-tight mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                    {event.titulo || event.name || 'Sin Título'}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                                    {event.descripcion || event.description || 'Sin descripción detallada disponible para este evento.'}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-50 mt-auto relative z-10">
                                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    <span className="flex items-center gap-1"><Clock size={14} /> Fecha de Inicio</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-gray-700">
                                        {event.fecha_inicio ? format(new Date(event.fecha_inicio), "d 'de' MMM, yyyy", { locale: es }) : 'Por definir'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
