import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ArrowLeft, Calendar, Clock, User, Users, Mic,
    FileText, CheckCircle, XCircle, Check, MapPin, Edit, Download, History, Send
} from 'lucide-react';
import { getVenues } from '../api/venues';
import { createFeedback, resolveFeedback } from '../api/feedbacks';
import Swal from 'sweetalert2';

const StatusBadge = ({ currentState }) => {
    const stateMap = {
        'scheduled': { label: 'Aceptado', class: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
        'rejected': { label: 'Rechazado', class: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
        'requested': { label: 'Solicitado', class: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
        'in_review': { label: 'Pendiente', class: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
        'draft': { label: 'Borrador', class: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-500' },
        'cancelled': { label: 'Cancelado', class: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
    };
    
    const config = stateMap[currentState] || stateMap['in_review'];
    
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${config.class}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

const EventDetail = () => {
    const { id, versionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackField, setFeedbackField] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, catalogRes, venuesRes] = await Promise.all([
                    api.get(`/events/${id}`),
                    api.get('/catalog'),
                    getVenues()
                ]);

                if (!eventRes.data) setError('Evento no encontrado.');
                else {
                    setEvent(eventRes.data);
                    setCatalog(catalogRes.data);
                    setVenues(venuesRes);
                }
            } catch (err) {
                setError('Error al cargar la información.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleStatus = async (newStatus) => {
        setActionLoading(true);
        try {
            await api.patch(`/events/${id}/status`, { estado: newStatus });
            setEvent(prev => ({ ...prev, currentState: newStatus === 'aceptado' ? 'scheduled' : (newStatus === 'rechazado' ? 'rejected' : 'in_review') }));
        } catch (error) {
            Swal.fire('Error', 'Error al actualizar el estado del evento.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        setActionLoading(true);
        try {
            const response = await api.get(`/events/${id}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ficha_tecnica_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            Swal.fire('Error', 'Error al generar el PDF.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestReview = async () => {
        setActionLoading(true);
        try {
            await api.post(`/events/${id}/request-review`);
            setEvent(prev => ({ ...prev, currentState: 'requested' }));
            Swal.fire('¡Éxito!', 'La solicitud de revisión ha sido enviada.', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error al enviar la solicitud.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePassToReview = async () => {
        setActionLoading(true);
        try {
            await api.post(`/events/${id}/pass-to-review`);
            setEvent(prev => ({ ...prev, currentState: 'in_review' }));
            Swal.fire('¡Aprobado!', 'El evento ha pasado a revisión (Pendiente).', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error al pasar a revisión.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddFeedback = async (e) => {
        e.preventDefault();
        if (!feedbackComment.trim()) return;
        
        setActionLoading(true);
        try {
            await createFeedback(id, versionId, {
                comment: feedbackComment,
                fieldName: feedbackField || null
            });
            Swal.fire('¡Éxito!', 'Feedback añadido correctamente.', 'success');
            setFeedbackComment('');
            setFeedbackField('');
            // Reload event
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error al añadir feedback.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResolveFeedback = async (feedbackId) => {
        setActionLoading(true);
        try {
            await resolveFeedback(feedbackId);
            Swal.fire('¡Resuelto!', 'El feedback ha sido marcado como resuelto.', 'success');
            // Reload event
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error al resolver feedback.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando Ficha</p>
        </div>
    );

    if (error || !event) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
            <p className="text-2xl font-bold text-gray-300">😕</p>
            <p className="text-gray-500 font-semibold">{error || 'Evento no encontrado.'}</p>
            <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition">
                Volver
            </button>
        </div>
    );

    const selectedVersion = event.versions?.find(v => String(v.id) === String(versionId)) || {};
    const isCurrentVersion = selectedVersion.isCurrentVersion === true;
    
    // El creador solo puede editar si está en draft o si tiene feedbacks
    const hasPendingFeedbacks = selectedVersion.feedbacks?.some(f => f.status === 'pending');
    const canEdit = isCurrentVersion && (String(event.userId) === String(user?.id) || user?.role === 'admin' || user?.nivel_permiso === 1) && (event.currentState === 'draft' || hasPendingFeedbacks);
    
    const isReviewer = user?.role === 'moderador' || user?.role === 'encargado_departamento' || user?.role === 'admin';
    const canAddFeedback = isReviewer && isCurrentVersion && (event.currentState === 'in_review' || event.currentState === 'requested');
    const isCreator = String(event.userId) === String(user?.id);

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Back + Title */}
            <div className="mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-4 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Versiones
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                                {selectedVersion.name || 'Sin Título'}
                            </h1>
                            {!isCurrentVersion && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-black uppercase tracking-wider border border-amber-200">
                                    <History size={14} /> Histórico (Modo Lectura)
                                </span>
                            )}
                            {isCurrentVersion && isReviewer && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-black uppercase tracking-wider border border-blue-200">
                                    <FileText size={14} /> Modo Revisión
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <StatusBadge currentState={event.currentState} />
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                                Versión {selectedVersion.versionNumber}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {(user?.nivel_permiso === 1 || user?.role === 'moderador') && event.currentState === 'in_review' && isCurrentVersion && (
                            <>
                                <button
                                    onClick={() => handleStatus('aceptado')}
                                    disabled={actionLoading || hasPendingFeedbacks}
                                    title={hasPendingFeedbacks ? "Debes resolver todo el feedback pendiente primero" : ""}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle size={16} /> Aceptar
                                </button>
                                <button
                                    onClick={() => handleStatus('rechazado')}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 bg-white border border-red-100 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-60"
                                >
                                    <XCircle size={16} /> Rechazar
                                </button>
                            </>
                        )}

                        {user?.role === 'encargado_departamento' && event.currentState === 'requested' && isCurrentVersion && (
                            <button
                                onClick={handlePassToReview}
                                disabled={actionLoading || hasPendingFeedbacks}
                                title={hasPendingFeedbacks ? "Debes resolver todo el feedback pendiente primero" : ""}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Check size={16} /> Aprobar Revisión
                            </button>
                        )}
                        
                        {canEdit && (
                            <>
                                {event.currentState === 'draft' && (
                                    <button
                                        onClick={handleRequestReview}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-60"
                                    >
                                        <Send size={16} /> Enviar solicitud
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate(`/editar-evento/${event.id}`)}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-60"
                                >
                                    <Edit size={16} /> Editar
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleDownloadPdf}
                            disabled={actionLoading}
                            className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-all disabled:opacity-60"
                        >
                            <Download size={16} /> Descargar PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className={`bg-white rounded-[2rem] p-8 border shadow-sm transition-colors ${!isCurrentVersion ? 'border-amber-100' : 'border-gray-100'}`}>
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-emerald-500" /> Descripción
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {selectedVersion.description || <span className="italic text-gray-300">Sin descripción adicional.</span>}
                        </p>
                    </div>

                    {/* Agenda / Minuto a Minuto */}
                    <div className={`bg-white rounded-[2rem] p-8 border shadow-sm transition-colors ${!isCurrentVersion ? 'border-amber-100' : 'border-gray-100'}`}>
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock size={18} className="text-emerald-500" /> Agenda del Evento
                        </h2>
                        {selectedVersion.activities && selectedVersion.activities.length > 0 ? (
                            <div className="space-y-4">
                                {selectedVersion.activities.map((act, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                {index + 1}
                                            </div>
                                            {index < selectedVersion.activities.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-50 group-hover:bg-emerald-50 transition-colors my-1"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-gray-900">{act.name}</h4>
                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                    {act.startsAt} - {act.endsAt}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{act.description || 'Sin descripción adicional.'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No se registraron actividades.</p>
                        )}
                    </div>

                    {/* Technical Requirements / Detalles Específicos */}
                    <div className={`bg-white rounded-[2rem] p-8 border shadow-sm space-y-6 transition-colors ${!isCurrentVersion ? 'border-amber-100' : 'border-gray-100'}`}>
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <Mic size={18} className="text-blue-500" /> Detalles de la Ficha Técnica
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Objetivo</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedVersion.objective || <span className="text-gray-300 italic">No especificado</span>}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dress Code</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedVersion.dressCode || <span className="text-gray-300 italic">No especificado</span>}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Programa Impactado</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedVersion.programImpacted || <span className="text-gray-300 italic">No especificado</span>}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Especificaciones de Invitados</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedVersion.guestSpecifications || <span className="text-gray-300 italic">No especificado</span>}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Detalle de Presidium</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedVersion.presidiumDetail || <span className="text-gray-300 italic">No especificado</span>}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Acción del Director</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedVersion.directorAction || <span className="text-gray-300 italic">No especificado</span>}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className={`bg-emerald-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden transition-colors ${!isCurrentVersion ? 'bg-amber-900' : ''}`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40 -mr-16 -mt-16 ${!isCurrentVersion ? 'bg-amber-800' : 'bg-emerald-800'}`}></div>
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-6 relative z-10 ${!isCurrentVersion ? 'text-amber-300' : 'text-emerald-300'}`}>
                            Detalles del Evento
                        </h3>
                        <div className="space-y-5 relative z-10">
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className={`mt-0.5 ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`} />
                                <div>
                                    <p className={`text-[10px] font-black uppercase ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`}>Inicio</p>
                                    <p className="text-sm font-bold">
                                        {selectedVersion.startsAt ? format(new Date(selectedVersion.startsAt), "d 'de' MMMM yyyy", { locale: es }) : 'Por definir'}
                                    </p>
                                    <p className={`text-xs font-medium ${!isCurrentVersion ? 'text-amber-300/70' : 'text-emerald-300/70'}`}>
                                        {selectedVersion.startsAt ? format(new Date(selectedVersion.startsAt), 'HH:mm', { locale: es }) : ''} hrs
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock size={18} className={`mt-0.5 ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`} />
                                <div>
                                    <p className={`text-[10px] font-black uppercase ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`}>Finalización</p>
                                    <p className="text-sm font-bold">
                                        {selectedVersion.endsAt ? format(new Date(selectedVersion.endsAt), "d 'de' MMMM yyyy", { locale: es }) : 'Por definir'}
                                    </p>
                                    <p className={`text-xs font-medium ${!isCurrentVersion ? 'text-amber-300/70' : 'text-emerald-300/70'}`}>
                                        {selectedVersion.endsAt ? format(new Date(selectedVersion.endsAt), 'HH:mm', { locale: es }) : ''} hrs
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className={`mt-0.5 ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`} />
                                <div>
                                    <p className={`text-[10px] font-black uppercase ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`}>Recinto</p>
                                    <p className="text-sm font-bold truncate">
                                        {venues.find(v => String(v.id) === String(event.locationId))?.nombre || 'No especificado'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User size={18} className={`mt-0.5 ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`} />
                                <div>
                                    <p className={`text-[10px] font-black uppercase ${!isCurrentVersion ? 'text-amber-400' : 'text-emerald-400'}`}>Responsable</p>
                                    <p className="text-sm font-bold">{event.user?.name || 'No asignado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedbacks Section */}
            {(selectedVersion.feedbacks?.length > 0 || canAddFeedback) && (
                <div className="mt-8 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-colors">
                    <h2 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" /> Feedbacks y Revisiones
                    </h2>
                    
                    {selectedVersion.feedbacks?.length > 0 && (
                        <div className="space-y-4 mb-8">
                            {selectedVersion.feedbacks.map(f => (
                                <div key={f.id} className={`p-5 rounded-2xl border ${f.status === 'resolved' ? 'bg-gray-50 border-gray-200' : 'bg-amber-50/50 border-amber-100'} flex justify-between items-start`}>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-gray-900 text-sm">{f.reviewer?.name}</span>
                                            <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{f.reviewer?.role}</span>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${f.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {f.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                                            </span>
                                        </div>
                                        {f.fieldName && (
                                            <p className="text-xs font-bold text-blue-600 mb-1">Campo: {f.fieldName}</p>
                                        )}
                                        <p className="text-sm text-gray-700">{f.comment}</p>
                                        <p className="text-xs text-gray-400 mt-2">{format(new Date(f.createdAt), "d 'de' MMMM yyyy HH:mm", { locale: es })}</p>
                                    </div>
                                    {isCreator && f.status === 'pending' && isCurrentVersion && (
                                        <button 
                                            onClick={() => handleResolveFeedback(f.id)}
                                            disabled={actionLoading}
                                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                                        >
                                            Marcar Resuelto
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {canAddFeedback && (
                        <form onSubmit={handleAddFeedback} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Añadir Nuevo Feedback</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Campo Específico (Opcional)</label>
                                    <input 
                                        type="text" 
                                        value={feedbackField}
                                        onChange={(e) => setFeedbackField(e.target.value)}
                                        placeholder="Ej. Objetivo, Dress Code" 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Comentario *</label>
                                    <textarea 
                                        value={feedbackComment}
                                        onChange={(e) => setFeedbackComment(e.target.value)}
                                        placeholder="Escribe el feedback aquí..." 
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={actionLoading || !feedbackComment.trim()}
                                    className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    Enviar Feedback
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventDetail;
