import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, ChevronRight, FileText, Clock, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EventStateBadge from '../../components/EventStateBadge';

const UserEvents = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [createdEvents, setCreatedEvents] = useState([]);
    const [responsibleEvents, setResponsibleEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('created');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch events
            const response = await api.get(`/users/${id}/events-summary`);
            setCreatedEvents(response.data.createdEvents || []);
            setResponsibleEvents(response.data.responsibleEvents || []);

            // Fetch user info
            const usersResponse = await api.get('/admin/users');
            const currentUser = usersResponse.data.find(u => String(u.id) === String(id));
            if (currentUser) {
                setUserData(currentUser);
            }
        } catch (error) {
            console.error('Error fetching user events summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderEventsList = (eventsList) => {
        if (eventsList.length === 0) {
            return (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center mt-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FileText size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">No se encontraron eventos</h3>
                    <p className="text-gray-500 max-w-md">El usuario no tiene eventos en esta categoría.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {eventsList.map(event => (
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
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header section */}
            <div className="mb-10">
                <Link to="/admin/usuarios" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors mb-6 uppercase tracking-wider">
                    <ArrowLeft size={16} /> Volver a Usuarios
                </Link>
                
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-display font-bold text-2xl flex-shrink-0">
                        {userData ? userData.nombre?.charAt(0)?.toUpperCase() : <User size={32} />}
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Eventos de {userData?.nombre || 'Usuario'}</h1>
                        <p className="text-gray-500 font-medium text-sm">Visualiza las fichas creadas y asignadas a este usuario.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Cargando eventos del usuario...</p>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 mb-6">
                        <button
                            className={`px-6 py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                                activeTab === 'created'
                                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('created')}
                        >
                            Fichas Creadas ({createdEvents.length})
                        </button>
                        <button
                            className={`px-6 py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                                activeTab === 'responsible'
                                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('responsible')}
                        >
                            Fichas a Cargo ({responsibleEvents.length})
                        </button>
                    </div>

                    {/* Events list based on tab */}
                    {activeTab === 'created' ? renderEventsList(createdEvents) : renderEventsList(responsibleEvents)}
                </>
            )}
        </div>
    );
};

export default UserEvents;
