import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Building2, Users, Mail, Phone, ShieldCheck, X, Calendar, User as UserIcon, CheckCircle2, Search } from 'lucide-react';
import Swal from 'sweetalert2';

const UserDetailsPanel = ({ user, onClose }) => {
    const [eventsData, setEventsData] = useState(null);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoadingEvents(true);
            try {
                const res = await api.get(`/users/${user.id}/events-summary`);
                setEventsData(res.data);
            } catch (err) {
                setError('Error al cargar los eventos del usuario.');
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, [user.id]);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right relative overflow-hidden">
                {/* Header */}
                <div className="relative p-6 pb-8 bg-emerald-600 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl shadow-inner border border-white/30">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="text-white flex-1 overflow-hidden">
                            <h2 className="text-2xl font-display font-bold truncate">{user.name}</h2>
                            <p className="text-emerald-100 text-sm flex items-center gap-1 mt-1">
                                <ShieldCheck size={14} />
                                {user.role?.name || 'Sin Rol'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-8 bg-gray-50/50">
                    
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Información de Contacto</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Mail size={16} />
                            </div>
                            <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Phone size={16} />
                                </div>
                                <span className="truncate">{user.phone}</span>
                            </div>
                        )}
                    </div>

                    {/* Events Data */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="text-emerald-500" size={20} />
                            Actividad de Eventos
                        </h3>

                        {loadingEvents ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 text-sm">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Encargado */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <UserIcon size={16} className="text-blue-500" />
                                        Eventos a cargo ({eventsData?.responsibleEvents?.length || 0})
                                    </h4>
                                    {eventsData?.responsibleEvents?.length > 0 ? (
                                        <div className="space-y-3">
                                            {eventsData.responsibleEvents.map(ev => (
                                                <div key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-gray-800 text-sm">Evento #{ev.id}</span>
                                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                                                            {ev.currentState}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex flex-col gap-1">
                                                        <span>Tipo: {ev.eventType?.name || 'N/A'}</span>
                                                        <span>Recinto: {ev.location?.name || 'Sin Asignar'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 text-center">
                                            No tiene eventos a cargo.
                                        </p>
                                    )}
                                </div>

                                {/* Creados */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        Eventos creados ({eventsData?.createdEvents?.length || 0})
                                    </h4>
                                    {eventsData?.createdEvents?.length > 0 ? (
                                        <div className="space-y-3">
                                            {eventsData.createdEvents.map(ev => (
                                                <div key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-gray-800 text-sm">Evento #{ev.id}</span>
                                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
                                                            {ev.currentState}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex flex-col gap-1">
                                                        <span>Tipo: {ev.eventType?.name || 'N/A'}</span>
                                                        <span>Recinto: {ev.location?.name || 'Sin Asignar'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 text-center">
                                            No ha creado eventos.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrganigramaEncargado = () => {
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrganigrama = async () => {
        try {
            const res = await api.get('/encargado/organigram');
            setDepartment(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar el organigrama del departamento.');
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganigrama();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando organigrama</p>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 font-bold">
            {error}
        </div>
    );

    if (!department) return null;

    const filteredUsers = (department.users || []).filter(u => 
        !searchTerm || u.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                        <Building2 size={16} /> Organigrama Departamental
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">{department.name}</h1>
                    <p className="text-gray-500">Usuarios asignados a tu subdirección.</p>
                </div>

                <div className="w-full md:w-96 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar usuario por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-gray-700 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Listado de Usuarios */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 rounded-l-[2rem]"></div>
                
                <div className="flex items-center justify-between mb-8 pl-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-bold text-gray-900">Personal del Departamento</h3>
                            <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                {filteredUsers.length} integrantes encontrados
                            </p>
                        </div>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 ml-4">
                        <p className="text-gray-400 font-medium text-sm">No hay usuarios asignados que coincidan con la búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ml-4">
                        {filteredUsers.map(u => (
                            <div 
                                key={u.id} 
                                onClick={() => setSelectedUser(u)}
                                className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 transition-all cursor-pointer group flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-600 font-display font-bold text-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors shrink-0">
                                        {u.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors" title={u.name}>{u.name}</h4>
                                        <span className="inline-flex mt-1 items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-wider group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                                            <ShieldCheck size={10} />
                                            {u.role?.name || 'Sin Rol'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Mail size={14} className="text-gray-400 shrink-0" />
                                        <span className="truncate">{u.email}</span>
                                    </div>
                                    {u.phone && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Phone size={14} className="text-gray-400 shrink-0" />
                                            <span className="truncate">{u.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* User Details Modal (Slide Over) */}
            {selectedUser && (
                <UserDetailsPanel 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </div>
    );
};

export default OrganigramaEncargado;
