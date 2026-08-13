import { useState, useEffect } from 'react';
import { 
    getVenues, createVenue, updateVenue, deleteVenue,
    getLocationTypes, createLocationType, updateLocationType, deleteLocationType
} from '../../api/venues';
import Swal from 'sweetalert2';
import { MapPin, Plus, Trash2, Edit2, X, Check, Building2, Layers } from 'lucide-react';

const TABS = [
    { key: 'venues', label: 'Recintos', icon: MapPin },
    { key: 'location-types', label: 'Tipos de Locación', icon: Layers },
];

const VenueAdmin = () => {
    const [activeTab, setActiveTab] = useState('venues');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Venues State ---
    const [venues, setVenues] = useState([]);
    const [newVenue, setNewVenue] = useState({ nombre: '', capacidad: '', activo: true });
    const [addingVenue, setAddingVenue] = useState(false);
    const [editingVenueId, setEditingVenueId] = useState(null);
    const [editVenueForm, setEditVenueForm] = useState({ nombre: '', capacidad: '', activo: true });

    // --- Location Types State ---
    const [locationTypes, setLocationTypes] = useState([]);
    const [newLocationType, setNewLocationType] = useState({ name: '', allowsExternalStaff: false });
    const [addingLocationType, setAddingLocationType] = useState(false);
    const [editingLocationTypeId, setEditingLocationTypeId] = useState(null);
    const [editLocationTypeForm, setEditLocationTypeForm] = useState({ name: '', allowsExternalStaff: false });

    const fetchData = async () => {
        try {
            const [venuesData, locationTypesData] = await Promise.all([
                getVenues(),
                getLocationTypes()
            ]);
            setVenues(venuesData);
            setLocationTypes(locationTypesData);
        } catch {
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- Venues Handlers ---
    const handleAddVenue = async (e) => {
        e.preventDefault();
        if (!newVenue.nombre.trim() || !newVenue.capacidad) return;
        setAddingVenue(true);
        setError('');
        try {
            const data = await createVenue({
                ...newVenue,
                capacidad: parseInt(newVenue.capacidad)
            });
            setVenues(prev => [...prev, data]);
            setNewVenue({ nombre: '', capacidad: '', activo: true });
            Swal.fire({ icon: 'success', title: 'Agregado', timer: 1500, showConfirmButton: false });
        } catch {
            setError('Error al agregar el recinto.');
        } finally {
            setAddingVenue(false);
        }
    };

    const handleDeleteVenue = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto. El recinto será eliminado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            await deleteVenue(id);
            setVenues(prev => prev.filter(v => v.id !== id));
            Swal.fire('¡Eliminado!', 'El recinto ha sido eliminado.', 'success');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al eliminar recinto', 'error');
        }
    };

    const startEditingVenue = (venue) => {
        setEditingVenueId(venue.id);
        setEditVenueForm({
            nombre: venue.nombre,
            capacidad: venue.capacidad,
            activo: venue.activo
        });
    };

    const handleUpdateVenue = async () => {
        if (!editVenueForm.nombre.trim() || !editVenueForm.capacidad) return;
        try {
            const updated = await updateVenue(editingVenueId, {
                ...editVenueForm,
                capacidad: parseInt(editVenueForm.capacidad)
            });
            setVenues(prev => prev.map(v => v.id === editingVenueId ? updated : v));
            setEditingVenueId(null);
        } catch {
            setError('Error al actualizar el recinto.');
        }
    };

    // --- Location Types Handlers ---
    const handleAddLocationType = async (e) => {
        e.preventDefault();
        if (!newLocationType.name.trim()) return;
        setAddingLocationType(true);
        setError('');
        try {
            const data = await createLocationType(newLocationType);
            setLocationTypes(prev => [...prev, data]);
            setNewLocationType({ name: '', allowsExternalStaff: false });
            Swal.fire({ icon: 'success', title: 'Agregado', timer: 1500, showConfirmButton: false });
        } catch {
            setError('Error al agregar el tipo de locación.');
        } finally {
            setAddingLocationType(false);
        }
    };

    const handleDeleteLocationType = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto. El tipo de locación será eliminado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            await deleteLocationType(id);
            setLocationTypes(prev => prev.filter(lt => lt.id !== id));
            Swal.fire('¡Eliminado!', 'El tipo de locación ha sido eliminado.', 'success');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al eliminar tipo de locación', 'error');
        }
    };

    const startEditingLocationType = (lt) => {
        setEditingLocationTypeId(lt.id);
        setEditLocationTypeForm({
            name: lt.name,
            allowsExternalStaff: lt.allowsExternalStaff
        });
    };

    const handleUpdateLocationType = async () => {
        if (!editLocationTypeForm.name.trim()) return;
        try {
            const updated = await updateLocationType(editingLocationTypeId, editLocationTypeForm);
            setLocationTypes(prev => prev.map(lt => lt.id === editingLocationTypeId ? updated : lt));
            setEditingLocationTypeId(null);
        } catch {
            setError('Error al actualizar el tipo de locación.');
        }
    };

    // --- Loading View ---
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando Datos</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                    <Building2 size={16} /> Configuración
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Locaciones</h1>
                <p className="text-gray-500">Administre los recintos y sus respectivos tipos.</p>
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

            {/* ═══ TAB: Recintos ═══ */}
            {activeTab === 'venues' && (
                <>
                    {/* Add form */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-emerald-500" /> Nuevo Recinto
                        </h2>
                        <form onSubmit={handleAddVenue} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                required
                                placeholder="Nombre (ej: Aula Magna)"
                                value={newVenue.nombre}
                                onChange={e => setNewVenue(prev => ({ ...prev, nombre: e.target.value }))}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                            />
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="Capacidad"
                                value={newVenue.capacidad}
                                onChange={e => setNewVenue(prev => ({ ...prev, capacidad: e.target.value }))}
                                className="w-32 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                            />
                            <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newVenue.activo}
                                    onChange={(e) => setNewVenue(prev => ({ ...prev, activo: e.target.checked }))}
                                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                />
                                Activo
                            </label>
                            <button
                                type="submit"
                                disabled={addingVenue}
                                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all disabled:opacity-60 whitespace-nowrap"
                            >
                                <Plus size={16} /> {addingVenue ? 'Guardando...' : 'Agregar'}
                            </button>
                        </form>
                    </div>

                    {/* Venues List */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        {venues.length === 0 ? (
                            <p className="text-sm text-gray-300 italic text-center py-6">No hay recintos registrados.</p>
                        ) : (
                            <ul className="space-y-3">
                                {venues.map(venue => (
                                    <li key={venue.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl group transition-colors">
                                        {editingVenueId === venue.id ? (
                                            <div className="flex flex-1 items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={editVenueForm.nombre}
                                                    onChange={e => setEditVenueForm(prev => ({ ...prev, nombre: e.target.value }))}
                                                    className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                                <input
                                                    type="number"
                                                    value={editVenueForm.capacidad}
                                                    onChange={e => setEditVenueForm(prev => ({ ...prev, capacidad: e.target.value }))}
                                                    className="w-24 px-3 py-2 bg-white border border-emerald-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editVenueForm.activo}
                                                        onChange={(e) => setEditVenueForm(prev => ({ ...prev, activo: e.target.checked }))}
                                                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 items-center justify-between pl-2 sm:pr-8">
                                                <div className="flex items-center gap-4">
                                                    <MapPin size={18} className="text-emerald-500 opacity-70" />
                                                    <div>
                                                        <span className="text-sm font-bold text-gray-900 block">{venue.nombre}</span>
                                                        <span className="text-xs font-semibold text-emerald-600">Capacidad: {venue.capacidad} pers.</span>
                                                    </div>
                                                </div>
                                                <div className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${venue.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                                                    {venue.activo ? 'Activo' : 'Inactivo'}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-4 sm:mt-0 justify-end">
                                            {editingVenueId === venue.id ? (
                                                <>
                                                    <button
                                                        onClick={handleUpdateVenue}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                                                        title="Guardar Cambios"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingVenueId(null)}
                                                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
                                                        title="Cancelar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditingVenue(venue)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                                                        title="Editar Recinto"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVenue(venue.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Eliminar Recinto"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}

            {/* ═══ TAB: Tipos de Locación ═══ */}
            {activeTab === 'location-types' && (
                <>
                    {/* Add form */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
                        <h2 className="text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-emerald-500" /> Nuevo Tipo de Locación
                        </h2>
                        <form onSubmit={handleAddLocationType} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                required
                                placeholder="Nombre (ej: Auditorio)"
                                value={newLocationType.name}
                                onChange={e => setNewLocationType(prev => ({ ...prev, name: e.target.value }))}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                            />
                            <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newLocationType.allowsExternalStaff}
                                    onChange={(e) => setNewLocationType(prev => ({ ...prev, allowsExternalStaff: e.target.checked }))}
                                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                />
                                Permite Staff Externo
                            </label>
                            <button
                                type="submit"
                                disabled={addingLocationType}
                                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all disabled:opacity-60 whitespace-nowrap"
                            >
                                <Plus size={16} /> {addingLocationType ? 'Guardando...' : 'Agregar'}
                            </button>
                        </form>
                    </div>

                    {/* Location Types List */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        {locationTypes.length === 0 ? (
                            <p className="text-sm text-gray-300 italic text-center py-6">No hay tipos de locación registrados.</p>
                        ) : (
                            <ul className="space-y-3">
                                {locationTypes.map(lt => (
                                    <li key={lt.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl group transition-colors">
                                        {editingLocationTypeId === lt.id ? (
                                            <div className="flex flex-1 items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={editLocationTypeForm.name}
                                                    onChange={e => setEditLocationTypeForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editLocationTypeForm.allowsExternalStaff}
                                                        onChange={(e) => setEditLocationTypeForm(prev => ({ ...prev, allowsExternalStaff: e.target.checked }))}
                                                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                                    />
                                                    Permite Staff Externo
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 items-center justify-between pl-2 sm:pr-8">
                                                <div className="flex items-center gap-4">
                                                    <Layers size={18} className="text-emerald-500 opacity-70" />
                                                    <span className="text-sm font-bold text-gray-900 block">{lt.name}</span>
                                                </div>
                                                <div className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${lt.allowsExternalStaff ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                                                    {lt.allowsExternalStaff ? 'Staff Externo Habilitado' : 'Solo Interno'}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-4 sm:mt-0 justify-end">
                                            {editingLocationTypeId === lt.id ? (
                                                <>
                                                    <button
                                                        onClick={handleUpdateLocationType}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                                                        title="Guardar Cambios"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingLocationTypeId(null)}
                                                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
                                                        title="Cancelar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditingLocationType(lt)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                                                        title="Editar Tipo de Locación"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLocationType(lt.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Eliminar Tipo de Locación"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default VenueAdmin;
