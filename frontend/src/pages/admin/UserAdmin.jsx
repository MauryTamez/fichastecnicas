import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser, getRoles } from '../../api/users';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { UserPlus, Edit2, Trash2, Shield, ShieldCheck, ShieldAlert, X, Users, ChevronDown } from 'lucide-react';

// ── Mapeo visual de roles ─────────────────────────────────────
const ROLE_STYLES = {
    admin:                   { label: 'Administrador',       color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: ShieldCheck, dot: 'bg-emerald-500' },
    moderador:               { label: 'Moderador',           color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: Shield,      dot: 'bg-blue-500' },
    encargado_departamento:  { label: 'Encargado Dpto.',     color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Shield,      dot: 'bg-violet-500' },
    creador:                 { label: 'Creador',             color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: ShieldAlert, dot: 'bg-amber-500' },
    auxiliar:                { label: 'Auxiliar',             color: 'bg-gray-100 text-gray-600 border-gray-200',      icon: ShieldAlert, dot: 'bg-gray-400' },
};

const getRoleStyle = (roleName) => ROLE_STYLES[roleName] || ROLE_STYLES.auxiliar;

export default function UserAdmin() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        roleId: '',
        departmentId: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, rolesData, deptRes] = await Promise.all([
                getUsers(), 
                getRoles(),
                api.get('/admin/departments')
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setDepartments(deptRes.data);
            // Set default roleId for new user form
            if (rolesData.length > 0) {
                const defaultRole = rolesData.find(r => r.name === 'creador') || rolesData[0];
                setFormData(prev => ({ ...prev, roleId: defaultRole.id }));
            }
        } catch (err) {
            setError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (u = null) => {
        setEditingUser(u);
        if (u) {
            setFormData({ nombre: u.nombre, email: u.email, password: '', roleId: u.roleId, departmentId: u.departmentId || '' });
        } else {
            const defaultRole = roles.find(r => r.name === 'creador') || roles[0];
            setFormData({ nombre: '', email: '', password: '', roleId: defaultRole?.id || '', departmentId: '' });
        }
        setIsFormOpen(true);
        setError('');
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingUser) {
                const dataToSend = { ...formData };
                if (!dataToSend.password) delete dataToSend.password;
                const updated = await updateUser(editingUser.id, dataToSend);
                setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
            } else {
                if (!formData.password) {
                    setError('La contraseña es obligatoria para nuevos usuarios');
                    return;
                }
                await createUser(formData);
                await loadData();
            }
            handleCloseForm();
            Swal.fire({ icon: 'success', title: 'Listo', text: editingUser ? 'Usuario actualizado.' : 'Usuario creado.', timer: 2000, showConfirmButton: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar usuario');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto. El usuario será eliminado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'El usuario ha sido eliminado.', timer: 2000, showConfirmButton: false });
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al eliminar usuario', 'error');
        }
    };

    // ── Loading ───────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Cargando Usuarios</p>
        </div>
    );

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                    <Users size={16} /> Configuración
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
                        <p className="text-gray-500">Administre los usuarios del sistema y asigne sus roles.</p>
                    </div>
                    <button
                        onClick={() => handleOpenForm()}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all whitespace-nowrap"
                    >
                        <UserPlus size={18} /> Nuevo Usuario
                    </button>
                </div>
            </div>

            {error && !isFormOpen && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center font-bold text-xs">!</span>
                    {error}
                </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-gray-50/80 border-b border-gray-100">
                    <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Usuario</div>
                    <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Email</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Rol</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Departamento</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Acciones</div>
                </div>

                {users.length === 0 ? (
                    <div className="px-8 py-16 text-center">
                        <Users size={40} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-sm text-gray-300 italic">No hay usuarios registrados.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {users.map(u => {
                            const roleStyle = getRoleStyle(u.role);
                            const isSelf = String(u.id) === String(currentUser?.id);
                            const RoleIcon = roleStyle.icon;

                            return (
                                <div key={u.id} className="grid grid-cols-12 gap-4 items-center px-8 py-5 group hover:bg-emerald-50/30 transition-colors">
                                    {/* User Info */}
                                    <div className="col-span-3 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-display font-bold text-lg flex-shrink-0">
                                            {u.nombre?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <Link to={`/admin/usuarios/${u.id}/eventos`} className="text-sm font-bold text-gray-900 truncate hover:text-emerald-600 transition-colors">
                                                {u.nombre}
                                            </Link>
                                            {isSelf && (
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">Tú</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-3 min-w-0">
                                        <p className="text-sm text-gray-500 truncate">{u.email}</p>
                                    </div>

                                    {/* Role Badge */}
                                    <div className="col-span-2">
                                        <div
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${roleStyle.color}`}
                                        >
                                            <RoleIcon size={14} />
                                            {roleStyle.label}
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500 truncate">
                                            {u.department || 'Sin asignar'}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleOpenForm(u)}
                                            disabled={isSelf}
                                            className={`p-2.5 rounded-xl transition-all ${isSelf
                                                ? 'text-gray-200 cursor-not-allowed'
                                                : 'text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 opacity-0 group-hover:opacity-100'
                                            }`}
                                            title={isSelf ? 'No puedes editarte a ti mismo' : 'Editar usuario'}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            disabled={isSelf}
                                            className={`p-2.5 rounded-xl transition-all ${isSelf
                                                ? 'text-gray-200 cursor-not-allowed'
                                                : 'text-gray-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100'
                                            }`}
                                            title={isSelf ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ═══ Modal de Formulario ═══ */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={handleCloseForm}>
                    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
                            <div>
                                <h2 className="text-xl font-display font-bold text-gray-900">
                                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    {editingUser ? 'Modifica los datos del usuario' : 'Crea una nueva cuenta en el sistema'}
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
                                    placeholder="Nombre completo"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="correo@ejemplo.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Contraseña {editingUser && <span className="text-gray-300 font-normal normal-case">(Dejar vacío para no cambiar)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rol</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-semibold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    value={formData.roleId}
                                    onChange={e => setFormData({ ...formData, roleId: Number(e.target.value) })}
                                >
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {ROLE_STYLES[r.name]?.label || r.name} — {r.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Departamento</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-semibold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    value={formData.departmentId}
                                    onChange={e => setFormData({ ...formData, departmentId: e.target.value ? Number(e.target.value) : '' })}
                                >
                                    <option value="">Sin asignar</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
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
                                    className="flex-1 px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                                >
                                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
