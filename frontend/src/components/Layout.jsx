import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, User as UserIcon, Search, LayoutDashboard, Tag, MapPin, ChevronDown, Shield, ShieldCheck, ShieldAlert, Menu, X, Settings, Mail, Building2, PlusCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 1: return 'bg-emerald-500 shadow-md shadow-emerald-200';
            case 2: return 'bg-white border border-gray-200';
            case 3: return 'bg-slate-400';
            default: return 'bg-gray-200';
        }
    };

    // Items principales de navegación
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Nueva Ficha', path: '/nuevo-evento', icon: PlusCircle, roles: ['admin', 'moderador', 'encargado_departamento', 'creador'] },
        { name: 'Solicitudes', path: '/encargado/solicitudes', icon: CheckCircle, roles: ['admin', 'encargado_departamento'] },
        { name: 'Fichas Pendientes', path: '/moderador/fichas-pendientes', icon: CheckCircle, roles: ['admin', 'moderador'] },
        { name: 'Mis Eventos', path: '/creador/eventos', icon: Calendar, roles: ['admin', 'creador'] },
        { name: 'Feedback', path: '/creador/feedback', icon: Mail, roles: ['admin', 'creador'] },
    ];

    // Items de configuración del admin (agrupados)
    const configItems = [
        { name: 'Usuarios', path: '/admin/usuarios', icon: UserIcon, roles: ['admin'] },
        { name: 'Eventos Dpto', path: '/encargado/eventos', icon: Calendar, roles: ['encargado_departamento'] },
        { name: 'Organigrama Dpto', path: '/encargado/organigrama', icon: Building2, roles: ['admin', 'encargado_departamento'] },
        { name: 'Departamentos', path: '/admin/departamentos', icon: Building2, roles: ['admin'] },
        { name: 'Locaciones', path: '/admin/recintos', icon: MapPin, roles: ['admin'] },
        { name: 'Eventos y Catálogo', path: '/admin/tipos-evento', icon: Tag, roles: ['admin'] },
    ];

    const renderNavItem = (item) => {
        if (item.roles && !item.roles.includes(user?.role)) return null;
        return (
            <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group ${location.pathname === item.path
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 translate-x-1'
                    : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
            >
                <item.icon size={20} className={location.pathname === item.path ? '' : 'text-gray-300 group-hover:text-emerald-500'} />
                {item.name}
            </Link>
        );
    };

    // Determinar si se muestra la sección de configuración
    const showConfigSection = configItems.some(item => !item.roles || item.roles.includes(user?.role));

    return (
        <div className="min-h-screen bg-[#fafdfc] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-40 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-12">
                    <Link to="/" className="flex items-center gap-3 text-2xl font-display font-bold text-gray-900 group">
                        <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
                            <Calendar size={20} />
                        </div>
                        <span>Fichas<span className="text-emerald-600">.</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Menú Principal</p>
                    {menuItems.map(renderNavItem)}

                    {showConfigSection && (
                        <>
                            <div className="pt-6 pb-2">
                                <div className="flex items-center gap-2 px-4">
                                    <div className="h-px flex-1 bg-gray-100"></div>
                                    <Settings size={12} className="text-gray-300" />
                                    <div className="h-px flex-1 bg-gray-100"></div>
                                </div>
                                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-3">Configuración</p>
                            </div>
                            {configItems.map(renderNavItem)}
                        </>
                    )}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-[#fafdfc]/80 backdrop-blur-md px-4 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <button 
                            className="lg:hidden p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500 hover:text-emerald-600 transition-colors shrink-0"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm w-full max-w-sm hidden sm:flex">
                            <Search size={18} className="text-gray-300" />
                            <input
                                type="text"
                                placeholder="Buscar fichas o eventos..."
                                className="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-600 placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 relative" ref={dropdownRef}>
                        <div 
                            className="flex items-center gap-4 cursor-pointer group p-1.5 rounded-2xl hover:bg-gray-50 transition-all"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.nombre}</p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${user?.nivel_permiso === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        {user?.role === 'admin' ? 'Admin' : user?.role === 'moderador' ? 'Moderador' : user?.role === 'encargado_departamento' ? 'Encargado' : user?.role === 'creador' ? 'Creador' : 'Auxiliar'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-emerald-600 group-hover:border-emerald-200 transition-all overflow-hidden p-0.5">
                                    <div className="w-full h-full bg-emerald-50 rounded-xl flex items-center justify-center font-display font-bold text-lg">
                                        {user?.nombre?.charAt(0)}
                                    </div>
                                </div>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden animate-fade-in origin-top-right z-50">
                                <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-display font-bold text-lg shadow-md">
                                            {user?.nombre?.charAt(0)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-900 truncate leading-tight">{user?.nombre}</p>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider truncate">
                                                {user?.role === 'admin' ? 'Administrador' : user?.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-2 bg-white p-2 rounded-lg border border-gray-100">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="truncate">{user?.email || 'Sin correo electrónico'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-2 bg-white p-2 rounded-lg border border-gray-100">
                                        {user?.nivel_permiso === 1 ? <ShieldCheck size={14} className="text-emerald-500" /> : user?.nivel_permiso === 2 ? <Shield size={14} className="text-gray-400" /> : <ShieldAlert size={14} className="text-slate-400" />}
                                        <span className="truncate">Nivel de Acceso: {user?.nivel_permiso} ({user?.role})</span>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                            <LogOut size={16} />
                                        </div>
                                        Cerrar Sesión Segura
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-8 lg:p-12 w-full max-w-[100vw] overflow-x-hidden">
                    {children}
                </main>

                <footer className="px-12 py-8 text-center sm:text-left text-gray-400 text-xs border-t border-gray-100 bg-white">
                    <p>© 2026 Plataforma de Fichas Técnicas • Todos los derechos reservados.</p>
                </footer>
            </div>
            <ChatBot />
        </div>
    );
};

export default Layout;
