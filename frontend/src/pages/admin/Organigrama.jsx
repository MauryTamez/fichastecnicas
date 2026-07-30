import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Building2, Users, Mail, Phone, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const Organigrama = () => {
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrganigrama = async () => {
        try {
            const res = await api.get('/encargado/organigram');
            setDepartment(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar el organigrama.');
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información del departamento.' });
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

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-3">
                        <Building2 size={16} /> Organigrama Departamental
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">{department.name}</h1>
                    <p className="text-gray-500">Usuarios asociados a este departamento.</p>
                </div>
            </div>

            {/* Listado de Usuarios */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-gray-900">Personal del Departamento</h3>
                            <p className="text-xs text-gray-400">{department.users?.length || 0} integrantes</p>
                        </div>
                    </div>
                </div>

                {!department.users || department.users.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Users size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No hay usuarios asignados a este departamento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {department.users.map(u => (
                            <div key={u.id} className="bg-gray-50 border border-gray-100 p-6 rounded-3xl hover:shadow-lg hover:shadow-emerald-50 hover:border-emerald-100 transition-all group">
                                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200/60">
                                    <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-emerald-600 font-display font-bold text-xl">
                                        {u.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-gray-900 truncate" title={u.name}>{u.name}</h4>
                                        <span className="inline-flex mt-1 items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                                            <ShieldCheck size={10} />
                                            {u.role?.name || 'Sin Rol'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="truncate">{u.email}</span>
                                    </div>
                                    {u.phone && (
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <Phone size={16} className="text-gray-400" />
                                            <span className="truncate">{u.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Organigrama;
