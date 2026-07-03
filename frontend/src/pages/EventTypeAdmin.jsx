import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Tag, Plus, Trash2, Calendar, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';

const EventTypeAdmin = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', description: '', organizationId: '' });
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [typesRes, orgsRes] = await Promise.all([
                api.get('/admin/event-types'),
                api.get('/organizations')
            ]);
            setEventTypes(typesRes.data);
            setOrganizations(orgsRes.data);
            if (orgsRes.data.length > 0) {
                setNewItem(prev => ({ ...prev, organizationId: orgsRes.data[0].id }));
            }
        } catch {
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.name.trim() || !newItem.organizationId) return;
        setAdding(true);
        setError('');
        try {
            await api.post('/admin/event-types', {
                name: newItem.name,
                description: newItem.description,
                organizationId: Number(newItem.organizationId)
            });
            setNewItem(prev => ({ ...prev, name: '', description: '' }));
            fetchData(); // Refresh the list to get the preloaded organization relation
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Tipo de evento agregado correctamente.',
                timer: 3000,
                showConfirmButton: false
            });
        } catch {
            setError('Error al agregar el tipo de evento.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al agregar el tipo de evento.'
            });
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción. ¿Deseas eliminar este tipo de evento?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/admin/event-types/${id}`);
            setEventTypes(prev => prev.filter(c => c.id !== id));
            setError('');
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El tipo de evento ha sido eliminado.',
                timer: 3000,
                showConfirmButton: false
            });
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Error al eliminar el tipo de evento.';
            setError(errMsg);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errMsg
            });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando Tipos de Evento</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                    <Calendar size={16} /> Administración
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Tipos de Eventos</h1>
                <p className="text-gray-500">Administre los diferentes tipos de eventos que se pueden solicitar en la plataforma.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center font-bold text-xs">!</span>
                    {error}
                </div>
            )}

            {/* Add form */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
                <h2 className="text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus size={18} className="text-emerald-500" /> Agregar Nuevo Tipo de Evento
                </h2>
                <form onSubmit={handleAdd} className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={newItem.organizationId}
                            onChange={e => setNewItem(prev => ({ ...prev, organizationId: e.target.value }))}
                            required
                            className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-semibold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all sm:w-1/3"
                        >
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            required
                            placeholder="Nombre del tipo (ej: Seminario)..."
                            value={newItem.name}
                            onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Descripción (opcional)..."
                            value={newItem.description}
                            onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                        />
                        <button
                            type="submit"
                            disabled={adding}
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all disabled:opacity-60 whitespace-nowrap"
                        >
                            <Plus size={16} /> {adding ? 'Agregando...' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Tag size={20} />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-gray-900">Lista de Tipos</h3>
                            <p className="text-xs text-gray-400">{eventTypes.length} registrados</p>
                        </div>
                    </div>
                </div>

                {eventTypes.length === 0 ? (
                    <p className="text-sm text-gray-300 italic text-center py-6">No hay tipos de eventos registrados.</p>
                ) : (
                    <ul className="space-y-3">
                        {eventTypes.map(type => (
                            <li key={type.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl group gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-8 h-8 bg-white border border-gray-200 text-gray-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{type.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Building2 size={12} className="text-emerald-500" />
                                            <span className="text-xs font-semibold text-emerald-600">
                                                {type.organization?.name || 'Organización desconocida'}
                                            </span>
                                        </div>
                                        {type.description && (
                                            <p className="text-xs text-gray-500 mt-2">{type.description}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(type.id)}
                                    className="opacity-100 self-end sm:self-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Eliminar tipo"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EventTypeAdmin;
