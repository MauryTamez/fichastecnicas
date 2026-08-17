import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText } from 'lucide-react';

const EventFormFeedbacks = ({
    isEditMode,
    detailedEvent,
    handleResolveFeedback,
    actionLoading
}) => {
    if (!isEditMode || !detailedEvent) return null;

    const selectedVersion = detailedEvent.versions?.find(v => v.isCurrentVersion === true) || {};
    const feedbacks = selectedVersion.feedbacks || [];
    if (feedbacks.length === 0) return null;

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-colors animate-slide-up mt-8">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" /> Feedbacks y Revisiones
            </h2>
            <div className="space-y-4">
                {feedbacks.map(f => (
                    <div key={f.id} className={`p-5 rounded-2xl border ${f.status === 'resolved' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                        <div className="flex items-center mb-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${f.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {f.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                            </span>
                            <span className="text-xs text-gray-500 ml-3">
                                {format(new Date(f.createdAt), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium whitespace-pre-line mt-3">{f.comment}</p>
                        {f.status === 'pending' && (
                            <div className="mt-4 pt-4 border-t border-red-100 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleResolveFeedback(f.id)}
                                    disabled={actionLoading}
                                    className="text-sm bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    Marcar como Resuelto
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventFormFeedbacks;
