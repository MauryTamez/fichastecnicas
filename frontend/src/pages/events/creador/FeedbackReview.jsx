import React, { useState, useEffect } from 'react';
import { getPendingFeedbacks, resolveFeedback } from '../../../api/feedbacks';
import { CheckCircle, Clock, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FeedbackReview = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const data = await getPendingFeedbacks();
            setFeedbacks(data.data || []);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            Swal.fire('Error', 'No se pudieron cargar los feedbacks pendientes.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (feedbackId) => {
        try {
            await resolveFeedback(feedbackId);
            Swal.fire({
                title: 'Resuelto',
                text: 'El feedback ha sido marcado como resuelto.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            fetchFeedbacks();
        } catch (error) {
            Swal.fire('Error', 'Error al resolver el feedback', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando Feedback</p>
            </div>
        );
    }

    return (
        <div className="pb-20 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">
                        <MessageSquare size={16} />
                        Feedback Pendiente
                    </div>
                    <h2 className="text-4xl font-display font-bold text-gray-900 capitalize">
                        Revisión de Fichas
                    </h2>
                    <p className="text-gray-500 font-medium">Gestiona y resuelve las observaciones de los moderadores y encargados.</p>
                </div>
            </div>

            {feedbacks.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">¡Todo al día!</h3>
                    <p className="text-gray-500 font-medium">No tienes feedbacks pendientes por resolver en tus eventos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {feedbacks.map(feedback => {
                        const content = feedback.eventVersion?.versionContent;
                        const event = feedback.eventVersion?.event;
                        const eventTitle = content?.name || 'Evento sin título';
                        
                        return (
                            <div key={feedback.id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-premium hover:border-emerald-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full blur-2xl opacity-50 -mr-8 -mt-8 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-bold">
                                        <AlertCircle size={14} />
                                        Pendiente
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold bg-gray-50 px-2 py-1 rounded-md">
                                        <Clock size={12} />
                                        {format(new Date(feedback.createdAt), 'dd MMM, HH:mm', { locale: es })}
                                    </div>
                                </div>

                                <div className="relative z-10 mb-4">
                                    <h4 className="text-lg font-display font-bold text-gray-900 mb-1 leading-tight group-hover:text-emerald-700 transition-colors">
                                        {eventTitle}
                                    </h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Versión {content?.versionNumber || 1} • {feedback.reviewer?.name || 'Moderador'}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-grow relative z-10 mb-6">
                                    {feedback.fieldName && (
                                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-2">
                                            Campo: {feedback.fieldName}
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-700 font-medium italic">"{feedback.comment}"</p>
                                </div>

                                <div className="flex items-center gap-3 relative z-10 mt-auto">
                                    <button
                                        onClick={() => handleResolve(feedback.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100 transform hover:-translate-y-0.5"
                                    >
                                        <CheckCircle size={16} />
                                        Resuelto
                                    </button>
                                    <button
                                        onClick={() => navigate(`/editar-evento/${event?.id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 py-2.5 rounded-xl text-xs font-bold transition-all"
                                    >
                                        <RefreshCw size={14} />
                                        Editar Evento
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FeedbackReview;
