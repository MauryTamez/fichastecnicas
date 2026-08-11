import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, Trash2, Edit2, ShieldAlert, X } from 'lucide-react';
import Swal from 'sweetalert2';

const DepartmentAdmin = () => {
    const { user: currentUser } = useAuth();
    const [departments, setDepartments] = useState([]);
    
    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', priority: 1 });
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const deptRes = await api.get('/admin/departments');
            setDepartments(deptRes.data);
        } catch (err) {
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, priority } = formData;
        const orgId = currentUser?.organizationId || 1;
        if (!name.trim() || !orgId) return;

        setIsSubmitting(true);
        setError('');
        
        try {
            const payload = {
                name,
                priority: Number(priority),
                organizationId: Number(orgId)
            };

            if (editingId) {
                await api.put(`/admin/departments/${editingId}`, payload);
                Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Departamento actualizado correctamente.', timer: 2000, showConfirmButton: false });
            } else {
                await api.post('/admin/departments', payload);
                Swal.fire({ icon: 'success', title: 'Agregado', text: 'Departamento creado correctamente.', timer: 2000, showConfirmButton: false });
            }
            
            handleCloseForm();
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el departamento.');
            Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un problema al guardar los datos.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (dept) => {
        setEditingId(dept.id);
        setFormData({
            name: dept.name,
            priority: dept.priority
        });
        setError('');
        setIsFormOpen(true);
    };

    const handleOpenForm = () => {
        setEditingId(null);
        setFormData({ name: '', priority: 1 });
        setError('');
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', priority: 1 });
        setError('');
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/admin/departments/${id}`);
            setDepartments(prev => prev.filter(d => d.id !== id));
            Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Departamento eliminado.', timer: 2000, showConfirmButton: false });
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Error al eliminar el departamento.';
            setError(errMsg);
            Swal.fire({ icon: 'error', title: 'Error', text: errMsg });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando datos</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                        <Building2 size={16} /> Administración
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Departamentos</h1>
                    <p className="text-gray-500">Gestiona los departamentos y sus prioridades en la organización.</p>
                </div>
                <button
                    onClick={handleOpenForm}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all whitespace-nowrap"
                >
                    <Plus size={18} /> Nuevo Departamento
                </button>
            </div>

            {error && !isFormOpen && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-center gap-3">
                    <ShieldAlert size={18} className="flex-shrink-0" />
                    {error}
                </div>
            )}



            {/* Lista */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-gray-900">Departamentos Registrados</h3>
                            <p className="text-xs text-gray-400">{departments.length} en total</p>
                        </div>
                    </div>
                </div>

                {departments.length === 0 ? (
                    <p className="text-sm text-gray-300 italic text-center py-6">No hay departamentos registrados.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {departments.map(dept => (
                            <div key={dept.id} className="flex flex-col p-5 bg-gray-50 border border-gray-100 rounded-2xl group transition-all hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-50/50">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-900 truncate pr-2">{dept.name}</h4>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(dept)}
                                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(dept.id)}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-semibold mt-auto pt-2 border-t border-gray-200">
                                    <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                        Prioridad: {dept.priority}
                                    </span>
                                    <span className="text-gray-500 truncate" title={dept.organization?.name}>
                                        {dept.organization?.name || 'Sin organización'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Formulario */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={handleCloseForm}>
                    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
                            <div>
                                <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                                    {editingId ? <Edit2 size={20} className="text-emerald-500" /> : <Plus size={20} className="text-emerald-500" />}
                                    {editingId ? 'Editar Departamento' : 'Nuevo Departamento'}
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    {editingId ? 'Modifica los datos del departamento' : 'Crea un nuevo departamento'}
                                </p>
                            </div>
                            <button onClick={handleCloseForm} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center font-bold text-xs">!</span>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Dirección General"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prioridad (Orden)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    value={formData.priority}
                                    onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentAdmin;
