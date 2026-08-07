import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Mic, Lightbulb, Coffee, Tag, FileText, Plus, Trash2, Calendar, Building2, Package } from 'lucide-react';
import Swal from 'sweetalert2';

// ─── Catálogo Config ──────────────────────────────────────────
const CATEGORIAS = [
    { key: 'audio', label: 'Audio', icon: Mic, color: 'blue' },
    { key: 'iluminacion', label: 'Iluminación', icon: Lightbulb, color: 'amber' },
    { key: 'catering', label: 'Catering', icon: Coffee, color: 'orange' },
    { key: 'mobiliario', label: 'Mobiliario', icon: Tag, color: 'purple' },
    { key: 'documentacion', label: 'Documentación', icon: FileText, color: 'emerald' },
];
// Colors
const COLOR_STYLES = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
};

// ─── Tabs ─────────────────────────────────────────────────────
const TABS = [
    { key: 'event-types', label: 'Tipos de Evento', icon: Calendar },
    { key: 'catalog', label: 'Catálogo de Requisitos', icon: Package },
];

const EventTypeAndCatalogAdmin = () => {
    const [activeTab, setActiveTab] = useState('event-types');

    const { user: currentUser } = useAuth();
    // ── Event Types state ─────────────────────────────────────
    const [eventTypes, setEventTypes] = useState([]);
    const [newEventType, setNewEventType] = useState({ name: '', description: '' });
    const [addingEventType, setAddingEventType] = useState(false);

    // ── Catalog state ─────────────────────────────────────────
    const [catalog, setCatalog] = useState([]);
    const [newCatalogItem, setNewCatalogItem] = useState({ categoria: 'audio', nombre: '' });
    const [addingCatalogItem, setAddingCatalogItem] = useState(false);

    // ── Shared state ──────────────────────────────────────────
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ── Fetch all data ────────────────────────────────────────
    const fetchData = async () => {
        try {
            const [typesRes, catalogRes] = await Promise.all([
                api.get('/event-types'),
                api.get('/catalog'),
            ]);
            setEventTypes(typesRes.data);
            setCatalog(catalogRes.data);
        } catch {
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Event Type handlers ───────────────────────────────────
    const handleAddEventType = async (e) => {
        e.preventDefault();
        const orgId = currentUser?.organizationId || 1;
        if (!newEventType.name.trim() || !orgId) return;
        setAddingEventType(true);
        setError('');
        try {
            await api.post('/admin/event-types', {
                name: newEventType.name,
                description: newEventType.description,
                organizationId: Number(orgId)
            });
            setNewEventType(prev => ({ ...prev, name: '', description: '' }));
            fetchData();
            Swal.fire({ icon: 'success', title: 'Éxito', text: 'Tipo de evento agregado correctamente.', timer: 3000, showConfirmButton: false });
        } catch {
            setError('Error al agregar el tipo de evento.');
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al agregar el tipo de evento.' });
        } finally {
            setAddingEventType(false);
        }
    };

    const handleDeleteEventType = async (id) => {
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
            Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El tipo de evento ha sido eliminado.', timer: 3000, showConfirmButton: false });
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Error al eliminar el tipo de evento.';
            setError(errMsg);
            Swal.fire({ icon: 'error', title: 'Error', text: errMsg });
        }
    };

    // ── Catalog handlers ──────────────────────────────────────
    const handleAddCatalogItem = async (e) => {
        e.preventDefault();
        if (!newCatalogItem.nombre.trim()) return;
        setAddingCatalogItem(true);
        setError('');
        try {
            const { data } = await api.post('/admin/catalog', newCatalogItem);
            setCatalog(prev => [...prev, data]);
            setNewCatalogItem(prev => ({ ...prev, nombre: '' }));
        } catch {
            setError('Error al agregar el ítem.');
        } finally {
            setAddingCatalogItem(false);
        }
    };

    const handleDeleteCatalogItem = async (id) => {
        try {
            await api.delete(`/admin/catalog/${id}`);
            setCatalog(prev => prev.filter(c => c.id !== id));
        } catch {
            setError('Error al eliminar el ítem.');
        }
    };

    // ── Loading ───────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando datos</p>
        </div>
    );

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                    <Tag size={16} /> Configuración
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Eventos y Catálogo</h1>
                <p className="text-gray-500">Administre los tipos de eventos y los ítems del catálogo de requisitos.</p>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === tab.key
                                ? 'bg-white text-emerald-600 shadow-md shadow-emerald-100/50 border border-emerald-100'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center font-bold text-xs">!</span>
                    {error}
                </div>
            )}

            {/* ═══ TAB: Tipos de Evento ═══ */}
            {activeTab === 'event-types' && (
                <>
                    {/* Add form */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-emerald-500" /> Agregar Nuevo Tipo de Evento
                        </h2>
                        <form onSubmit={handleAddEventType} className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Nombre del tipo (ej: Seminario)..."
                                    value={newEventType.name}
                                    onChange={e => setNewEventType(prev => ({ ...prev, name: e.target.value }))}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Descripción (opcional)..."
                                    value={newEventType.description}
                                    onChange={e => setNewEventType(prev => ({ ...prev, description: e.target.value }))}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                                />
                                <button
                                    type="submit"
                                    disabled={addingEventType}
                                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all disabled:opacity-60 whitespace-nowrap"
                                >
                                    <Plus size={16} /> {addingEventType ? 'Agregando...' : 'Agregar'}
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
                                            onClick={() => handleDeleteEventType(type.id)}
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
                </>
            )}

            {/* ═══ TAB: Catálogo ═══ */}
            {activeTab === 'catalog' && (
                <>
                    {/* Add form */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-emerald-500" /> Agregar Nuevo Ítem
                        </h2>
                        <form onSubmit={handleAddCatalogItem} className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={newCatalogItem.categoria}
                                onChange={e => setNewCatalogItem(prev => ({ ...prev, categoria: e.target.value }))}
                                className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-semibold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            >
                                {CATEGORIAS.map(c => (
                                    <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                required
                                placeholder="Nombre del ítem (ej: Micrófono de mano)..."
                                value={newCatalogItem.nombre}
                                onChange={e => setNewCatalogItem(prev => ({ ...prev, nombre: e.target.value }))}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={addingCatalogItem}
                                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all disabled:opacity-60 whitespace-nowrap"
                            >
                                <Plus size={16} /> {addingCatalogItem ? 'Agregando...' : 'Agregar'}
                            </button>
                        </form>
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                        {CATEGORIAS.map(cat => {
                            const items = catalog.filter(c => c.categoria === cat.key);
                            const cs = COLOR_STYLES[cat.color];
                            return (
                                <div key={cat.key} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${cs.bg} ${cs.text} rounded-2xl flex items-center justify-center`}>
                                                <cat.icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-display font-bold text-gray-900">{cat.label}</h3>
                                                <p className="text-xs text-gray-400">{items.length} ítems</p>
                                            </div>
                                        </div>
                                    </div>

                                    {items.length === 0 ? (
                                        <p className="text-sm text-gray-300 italic text-center py-6">Sin ítems en esta categoría.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {items.map(item => (
                                                <li key={item.id} className={`flex items-center justify-between px-4 py-3 ${cs.bg} border ${cs.border} rounded-2xl group`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${cs.dot} flex-shrink-0`}></span>
                                                        <span className="text-sm font-semibold text-gray-700">{item.nombre}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCatalogItem(item.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Eliminar ítem"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default EventTypeAndCatalogAdmin;
