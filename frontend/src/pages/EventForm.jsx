import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle, ArrowLeft, ArrowRight, Briefcase, Calendar, CheckCircle2, ChevronRight, Clock, FileText, Info, MapPin, Plus, Save, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getVenues } from '../api/venues';
import { resolveFeedback } from '../api/feedbacks';
import { getVenues } from '../api/venues';

// Catálogos globales de opciones comunes con opción "Otro / Otra" integrada
const MARCAS_POPULARES = [
    "Toyota", "Nissan", "Chevrolet", "Ford", "Honda", 
    "Kia", "Hyundai", "Mazda", "Volkswagen", "BMW", 
    "Jeep", "Dodge", "GMC", "Subaru", "Otro / Otra"
];

const COLORES_COMUNES = [
    "Blanco", "Negro", "Gris", "Plata", "Rojo", 
    "Azul", "Verde", "Amarillo", "Naranja", "Café", "Otro / Otra"
];
const EventForm = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [venues, setVenues] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [step, setStep] = useState(1);
    const [detailedEvent, setDetailedEvent] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
   const [formData, setFormData] = useState({
    name: '',
    objective: '',
    description: '',
    startsAt: '',
    endsAt: '',
    locationId: '',
    organizationId: '',
    eventTypeId: '',
    cantidadPersonas: '',
    dressCode: '',
    programImpacted: '',
    guestSpecifications: '',
    acomodo_tipo: '',
    presidiumDetail: '',
    directorAction: '',
    activities: [],
    otrosObservaciones: ''
});
    const [audiovisual, setAudiovisual] = useState({
    sonido: false,
    microfonoInalambrico: false,
    microfonoMesa: false,
    microfonoPresidencial: false,
    microfonoDiadema: false,
    microfonoAlambrico: false,
    proyeccionPresentacion: false,
    proyeccionVideo: false,
    videograbacion: false,
    personalApoyo: false,
    apuntador: false,
    musicaFondo: false,
});

    const [currentActivity, setCurrentActivity] = useState({
        name: '',
        startsAt: '',
        endsAt: '',
        description: ''
    });

    const [showAIModal, setShowAIModal] = useState(false);
    const [aiPrompt, setAIPrompt] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiWarning, setAiWarning] = useState(false);

    const [otros, setOtros] = useState({
        manteles: false,
        banderas: false,
        coffeeBreak: false,
        estacionamiento: false,
        fotografia: false,
        podium: false,
        presidium: false,
        edecanes: false,
        himno: false,
        separadorHimno: false,
    });
    const [showParkingModal, setShowParkingModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showPresidiumModal, setShowPresidiumModal] = useState(false);

    // 🚗 ESTADOS PARA MÚLTIPLES CARROS
    const [parkingList, setParkingList] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState({
        nombreResponsable: '',
        marcaVehiculo: '',
        placaVehiculo: '',
        colorVehiculo: ''
    });

    // 📸 Horario fotográfico
    const [horaFotografia, setHoraFotografia] = useState('');

    // 👥 Lista de presídium
    const [presidiumList, setPresidiumList] = useState([]);
    const [currentMember, setCurrentMember] = useState({ nombre: '', puesto: '' });

    

    const otrosItems = [
        { key: 'manteles', label: 'Manteles' },
        { key: 'banderas', label: 'Banderas' },
        { key: 'coffeeBreak', label: 'Mesa para Coffee break' },
        { key: 'estacionamiento', label: 'Acceso a Estacionamiento (Múltiples vehículos)' },
        { key: 'fotografia', label: 'Toma de Fotografía (especificar horario de la toma)' },
        { key: 'podium', label: 'Pódium' },
        { key: 'presidium', label: 'Presídium (Anexar listado con nombre y puesto)' },
        { key: 'edecanes', label: 'Edecanes' },
        { key: 'himno', label: 'Himno de la UANL' },
        { key: 'separadorHimno', label: 'Separador con himno' },
    ];

    const audiovisualItems = [
        { key: 'sonido', label: 'Sonido' },
        { key: 'microfonoInalambrico', label: 'Micrófono Inalámbrico de mano' },
        { key: 'microfonoMesa', label: 'Micrófono Inalámbrico de mano con base de mesa' },
        { key: 'microfonoPresidencial', label: 'Micrófono Presidencial' },
        { key: 'microfonoDiadema', label: 'Micrófono de Diadema' },
        { key: 'microfonoAlambrico', label: 'Micrófono Alámbrico' },
        { key: 'proyeccionPresentacion', label: 'Proyección de Presentación' },
        { key: 'proyeccionVideo', label: 'Proyección de Video Institucional' },
        { key: 'videograbacion', label: 'Videograbación' },
        { key: 'personalApoyo', label: 'Personal de Apoyo' },
        { key: 'apuntador', label: 'Apuntador para pase de diapositivas' },
        { key: 'musicaFondo', label: 'Música de fondo' },
    ];

    const handleVehicleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nombreResponsable') {
            // Capitaliza automáticamente cada palabra
            const formattedName = value.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
            setCurrentVehicle(prev => ({ ...prev, [name]: formattedName }));
        } else if (name === 'placaVehiculo') {
            // Convierte automáticamente las placas a mayúsculas
            setCurrentVehicle(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else {
            setCurrentVehicle(prev => ({ ...prev, [name]: value }));
        }
    };

    // Agregar carro a la lista dinámica
    const handleAddVehicle = (e) => {
        if (e) e.preventDefault();
        if (!currentVehicle.nombreResponsable.trim() || !currentVehicle.placaVehiculo.trim() || !currentVehicle.marcaVehiculo.trim()) {
            Swal.fire('Campos incompletos', 'Nombre, Placas y Marca son obligatorios para el acceso vehicular.', 'warning');
            return;
        }
        setParkingList(prev => [...prev, { ...currentVehicle }]);
        setCurrentVehicle({ nombreResponsable: '', marcaVehiculo: '', placaVehiculo: '', colorVehiculo: '' });
    };

    const handleAddMember = (e) => {
        if (e) e.preventDefault();
        if (!currentMember.nombre.trim() || !currentMember.puesto.trim()) {
            Swal.fire('Campos incompletos', 'Nombre y Puesto son requeridos para el integrante del presídium.', 'warning');
            return;
        }
        setPresidiumList(prev => [...prev, { ...currentMember }]);
        setCurrentMember({ nombre: '', puesto: '' });
    };

    const toggleOtro = (key) => {
        setOtros(prev => {
            const newValue = !prev[key];
            if (key === 'estacionamiento') {
                if (!newValue) {
                    setParkingList([]);
                    setCurrentVehicle({ nombreResponsable: '', marcaVehiculo: '', placaVehiculo: '', colorVehiculo: '' });
                } else {
                    setShowParkingModal(true);
                }
            }
            if (key === 'fotografia') {
                if (!newValue) {
                    setHoraFotografia('');
                } else {
                    setShowPhotoModal(true);
                }
            }
            if (key === 'presidium') {
                if (!newValue) {
                    setPresidiumList([]);
                } else {
                    setShowPresidiumModal(true);
                }
            }
            return { ...prev, [key]: newValue };
        });
    };

    const handleAutoFill = async () => {
        if (!aiPrompt.trim()) return;
        setIsAILoading(true);
        try {
            const res = await api.post('/ai/autofill', { prompt: aiPrompt });
            const data = res.data;
            setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                objective: data.objective || prev.objective,
                description: data.description || prev.description,
                dressCode: data.dressCode || prev.dressCode,
                programImpacted: data.programImpacted || prev.programImpacted,
                guestSpecifications: data.guestSpecifications || prev.guestSpecifications,
                presidiumDetail: data.presidiumDetail || prev.presidiumDetail,
                directorAction: data.directorAction || prev.directorAction,
                activities: data.activities?.length ? data.activities : prev.activities
            }));
            setAiWarning(true);
            setShowAIModal(false);
            setAIPrompt('');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al autorellenar la ficha. Intenta de nuevo.', 'error');
        } finally {
            setIsAILoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const venuesRes = await getVenues();
                setVenues(venuesRes || []);

                const [orgsRes, typesRes] = await Promise.all([
                    api.get('/organizations'),
                    api.get('/event-types')
                ]);
                setOrganizations(orgsRes.data || []);
                setEventTypes(typesRes.data || []);

                if (isEditMode) {
                    try {
                        const eventDetailRes = await api.get(`/events/${id}`);
                        const currentEvent = eventDetailRes.data;
                        setDetailedEvent(currentEvent);
                        if (currentEvent) {
                            const currentVersion = currentEvent.versions?.find(v => v.isCurrentVersion) || currentEvent.versions?.[0] || {};
                            setFormData({
                                name: currentVersion.name || currentEvent.titulo || currentEvent.name || '',
                                objective: currentVersion.objective || currentEvent.objective || '',
                                description: currentVersion.description || currentEvent.descripcion || currentEvent.description || '',
                                startsAt: currentVersion.startsAt || currentEvent.startsAt || currentEvent.fecha_inicio ? new Date(currentVersion.startsAt || currentEvent.startsAt || currentEvent.fecha_inicio).toISOString().slice(0, 16) : '',
                                endsAt: currentVersion.endsAt || currentEvent.endsAt || currentEvent.fecha_fin ? new Date(currentVersion.endsAt || currentEvent.endsAt || currentEvent.fecha_fin).toISOString().slice(0, 16) : '',
                                locationId: currentEvent.locationId || currentEvent.venue_id || '',
                                organizationId: currentEvent.organizationId || '',
                                eventTypeId: currentEvent.eventTypeId || '',
                                cantidadPersonas: currentVersion.cantidadPersonas || currentEvent.cantidadPersonas || '',
                                dressCode: currentVersion.dressCode || currentEvent.dressCode || '',
                                programImpacted: currentVersion.programImpacted || currentEvent.programImpacted || '',
                                guestSpecifications: currentVersion.guestSpecifications || currentEvent.asistentes || currentEvent.guestSpecifications || '',
                                acomodo_tipo: currentVersion.acomodo_tipo || currentEvent.acomodo_tipo || '',
                                presidiumDetail: currentVersion.presidiumDetail || currentEvent.presidiumDetail || '',
                                directorAction: currentVersion.directorAction || currentEvent.directorAction || '',
                                activities: currentVersion.activities || currentEvent.activities || [],
                                otrosObservaciones: currentVersion.otrosObservaciones || currentEvent.otrosObservaciones || ''
                            });

                            const targetAv = currentVersion.audiovisual || currentEvent.audiovisual;
                            if (targetAv) setAudiovisual(prev => ({ ...prev, ...targetAv }));

                            const targetOtros = currentVersion.requerimientosOtros || currentEvent.requerimientosOtros;
                            if (targetOtros) setOtros(prev => ({ ...prev, ...targetOtros }));

                            const parking = currentVersion.listaEstacionamiento || currentEvent.listaEstacionamiento;
                            if (parking) setParkingList(parking);

                            const photo = currentVersion.horaFotografia || currentEvent.horaFotografia;
                            if (photo) setHoraFotografia(photo);

                            const presidium = currentVersion.listaPresidium || currentEvent.listaPresidium;
                            if (presidium) setPresidiumList(presidium);
                        }
                    } catch (e) {
                        const eventsRes = await api.get('/events');
                        const currentEvent = eventsRes.data.data.find(e => String(e.id) === String(id));
                        setDetailedEvent(currentEvent);
                        if (currentEvent) {
                            setFormData({
                                name: currentEvent.name || currentEvent.titulo || '',
                                objective: currentEvent.objective || '',
                                description: currentEvent.description || currentEvent.descripcion || '',
                                startsAt: currentEvent.startsAt || currentEvent.fecha_inicio ? new Date(currentEvent.startsAt || currentEvent.fecha_inicio).toISOString().slice(0, 16) : '',
                                endsAt: currentEvent.endsAt || currentEvent.fecha_fin ? new Date(currentEvent.endsAt || currentEvent.fecha_fin).toISOString().slice(0, 16) : '',
                                locationId: currentEvent.locationId || currentEvent.venue_id || '',
                                organizationId: currentEvent.organizationId || '',
                                eventTypeId: currentEvent.eventTypeId || '',
                                dressCode: currentEvent.dressCode || '',
                                programImpacted: currentEvent.programImpacted || '',
                                guestSpecifications: currentEvent.guestSpecifications || currentEvent.asistentes || '',
                                acomodo_tipo: currentEvent.acomodo_tipo || '',
                                presidiumDetail: currentEvent.presidiumDetail || '',
                                directorAction: currentEvent.directorAction || '',
                                activities: currentEvent.activities || [],
                                otrosObservaciones: currentEvent.otrosObservaciones || ''
                            });

                            if (currentEvent.audiovisual) setAudiovisual(prev => ({ ...prev, ...currentEvent.audiovisual }));
                            if (currentEvent.requerimientosOtros) setOtros(prev => ({ ...prev, ...currentEvent.requerimientosOtros }));
                            if (currentEvent.listaEstacionamiento) setParkingList(currentEvent.listaEstacionamiento);
                            if (currentEvent.horaFotografia) setHoraFotografia(currentEvent.horaFotografia);
                            if (currentEvent.listaPresidium) setPresidiumList(currentEvent.listaPresidium);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar datos necesarios.');
            }
        };
        fetchInitialData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
const toggleAudiovisual = (key) => {
     setAudiovisual((prev) => ({
        ...prev,
        [key]: !prev[key],
     }));
 };
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
      e.preventDefault();
        if (!formData.name.trim() || !formData.locationId || !formData.organizationId || !formData.eventTypeId) {
            setStep(1);
            setError('Por favor complete todos los campos obligatorios (Nombre, Organización, Tipo y Recinto).');
            return;
        }

        if (!formData.startsAt || !formData.endsAt) {
            setStep(2);
            setError('Por favor seleccione las fechas del evento.');
            return;
        }
        if (new Date(formData.endsAt) <= new Date(formData.startsAt)) {
            setStep(2);
            setError('La fecha de finalización debe ser posterior a la de inicio.');
            return;
        }
        setError('');
        setLoading(true);
        try {
           const payload = {
    ...formData,
    locationId: Number(formData.locationId),
    organizationId: Number(formData.organizationId),
    eventTypeId: Number(formData.eventTypeId),

    audiovisual,

    requerimientosOtros: otros,
    listaEstacionamiento: otros.estacionamiento ? parkingList : null,
    horaFotografia: otros.fotografia ? horaFotografia : null,
    listaPresidium: otros.presidium ? presidiumList : null
};
            if (isEditMode) {
                const endpoint = (user?.role === 'encargado_departamento' || user?.role === 'subdirector') 
                    ? `/encargado/events/${id}` 
                    : `/creador/events/${id}`;
                await api.put(endpoint, payload);
            } else {
                await api.post('/creador/events', payload);
            }
            navigate('/');
        } catch (err) {
            setError('Error al guardar la ficha técnica: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };


    const handleResolveFeedback = async (feedbackId) => {
        setActionLoading(true);
        try {
            await resolveFeedback(feedbackId);
            Swal.fire('¡Resuelto!', 'El feedback ha sido marcado como resuelto.', 'success');
            // Reload detailed event
            const res = await api.get(`/events/${id}`);
            setDetailedEvent(res.data);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error al resolver feedback.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const steps = [
        { id: 1, name: 'General', icon: FileText },
        { id: 2, name: 'Horario', icon: Clock },
        { id: 3, name: 'Detalles Específicos', icon: Briefcase },
    ];

    const filteredVenues = useMemo(() => {
        const personas = parseInt(formData.cantidadPersonas, 10);
        if (!personas || isNaN(personas)) {
            return [...venues].sort((a, b) => (Number(a.capacidad || a.capacity) || 0) - (Number(b.capacidad || b.capacity) || 0));
        }
        return venues
            .filter(venue => (Number(venue.capacidad || venue.capacity) || 0) >= personas)
            .sort((a, b) => (Number(a.capacidad || a.capacity) || 0) - (Number(b.capacidad || b.capacity) || 0));
    }, [venues, formData.cantidadPersonas]);

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-2 transition-all font-bold text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </button>
                    <h1 className="text-4xl font-display font-bold text-gray-900">{isEditMode ? 'Reagendar Evento' : 'Nueva Ficha Técnica'}</h1>
                    <p className="text-gray-500 font-medium">{isEditMode ? 'Edite los detalles de su ficha técnica' : 'Configure los detalles de su ficha técnica (Adonis)'}</p>
                </div>

                <div className="flex items-center bg-white/90 p-2 rounded-2xl shadow-sm border border-slate-200 backdrop-blur-sm">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setStep(s.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <s.icon size={18} />
                                <span className="text-sm font-bold">{s.name}</span>
                            </button>
                            {i < steps.length - 1 && <ChevronRight size={16} className="mx-1 text-gray-200" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
                            <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center font-bold text-xs">!</span>
                            {error}
                        </div>
                    )}

                    {aiWarning && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-2xl text-sm flex items-start gap-3 animate-fade-in shadow-sm">
                            <AlertTriangle className="flex-shrink-0 w-5 h-5 text-amber-500 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">Verifica la información</p>
                                <p>Estos datos fueron generados por Inteligencia Artificial y pueden contener inconsistencias. Por favor, revisa cuidadosamente todos los campos antes de guardar.</p>
                            </div>
                            <button type="button" onClick={() => setAiWarning(false)} className="ml-auto p-1 text-amber-400 hover:text-amber-600 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-1 ring-emerald-100 shadow-sm">
                                        <FileText size={24} />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Información Básica</h2>
                                </div>
                                {!isEditMode && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAIModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                    >
                                        <Sparkles size={16} /> Autorellenar con IA
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tight">Nombre del Evento</label>
                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                                        placeholder="Ej: Lanzamiento Web 3.0"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight flex items-center gap-2">
                                            <MapPin size={16} className="text-emerald-500" />
                                            Cantidad de Personas
                                        </label>
                                        <input
                                            type="number"
                                            name="cantidadPersonas"
                                            min="1"
                                            className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                                            placeholder="Ej. 170"
                                            value={formData.cantidadPersonas || ''}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight flex items-center gap-2">
                                            <MapPin size={16} className="text-emerald-500" />
                                            Recinto / Locación
                                        </label>
                                        <select
                                            required
                                            name="locationId"
                                            className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                                            value={formData.locationId}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Seleccione una locación...</option>
                                            {filteredVenues.map((venue) => (
                                                <option key={venue.id} value={venue.id}>
                                                    {venue.nombre || venue.name} ({venue.capacidad || venue.capacity} personas)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Organización</label>
                                        <select
                                            required
                                            name="organizationId"
                                            className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                                            value={formData.organizationId}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Seleccione organización...</option>
                                            {organizations.map(o => (
                                                <option key={o.id} value={o.id}>{o.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Tipo de Evento</label>
                                        <select
                                            required
                                            name="eventTypeId"
                                            className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                                            value={formData.eventTypeId}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Seleccione tipo...</option>
                                            {eventTypes.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Objetivo</label>
                                    <input
                                        type="text"
                                        name="objective"
                                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                        placeholder="Objetivo principal del evento..."
                                        value={formData.objective}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                                >
                                    Continuar
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100 animate-slide-up">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center ring-1 ring-amber-100 shadow-sm">
                                    <Calendar size={24} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Requerimientos de Evento</h2>
                            </div>

                            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                            <Sparkles size={18} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">Audiovisual</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {audiovisualItems.map(({ key, label }) => (
                                            <label key={key} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition-all duration-200 hover:scale-[1.01] hover:bg-slate-50 hover:border-emerald-200 shadow-sm cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!audiovisual[key]}
                                                    onChange={() => toggleAudiovisual(key)}
                                                    className="mt-0.5 h-4 w-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <Briefcase size={18} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">Otros Requerimientos</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {otrosItems.map(({ key, label }) => (
                                            <div key={key} className="space-y-3">
                                                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition-all duration-200 hover:scale-[1.01] hover:bg-slate-50 hover:border-emerald-200 shadow-sm">
                                                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={otros[key]}
                                                            onChange={() => toggleOtro(key)}
                                                            className="mt-0.5 h-4 w-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">{label}</span>
                                                    </label>
                                                    {otros[key] && (key === 'estacionamiento' || key === 'fotografia' || key === 'presidium') && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (key === 'estacionamiento') setShowParkingModal(true);
                                                                if (key === 'fotografia') setShowPhotoModal(true);
                                                                if (key === 'presidium') setShowPresidiumModal(true);
                                                            }}
                                                            className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100 transition-all"
                                                        >
                                                            Configurar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center ring-1 ring-amber-100 shadow-sm">
                                        <Calendar size={24} />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Programación</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> INICIO DEL EVENTO
                                        </label>
                                        <div className="p-1 px-2 border border-emerald-100 rounded-2xl bg-emerald-50/10 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                                            <input
                                                type="datetime-local"
                                                name="startsAt"
                                                className="block w-full px-2 py-3 bg-transparent outline-none text-emerald-900 font-bold uppercase text-xs"
                                                value={formData.startsAt}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div> FINALIZACIÓN
                                        </label>
                                        <div className="p-1 px-2 border border-red-100 rounded-2xl bg-red-50/10 focus-within:ring-4 focus-within:ring-red-500/10 transition-all">
                                            <input
                                                type="datetime-local"
                                                name="endsAt"
                                                className="block w-full px-2 py-3 bg-transparent outline-none text-red-900 font-bold uppercase text-xs"
                                                value={formData.endsAt}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Agenda Section */}
                                <div className="mt-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                                            <Clock size={20} className="text-emerald-500" /> Agenda (Minuto a Minuto)
                                        </h3>
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase">
                                            {formData.activities.length} Actividades
                                        </span>
                                    </div>

                                    <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre de la actividad (Ej: Bienvenida, Ponencia...)"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-slate-700 shadow-sm"
                                                    value={currentActivity.name}
                                                    onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Inicio</label>
                                                <input
                                                    type="time"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-700"
                                                    value={currentActivity.startsAt}
                                                    onChange={(e) => setCurrentActivity({ ...currentActivity, startsAt: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Fin</label>
                                                <input
                                                    type="time"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-700"
                                                    value={currentActivity.endsAt}
                                                    onChange={(e) => setCurrentActivity({ ...currentActivity, endsAt: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-2 mt-2">
                                                <textarea
                                                    placeholder="Descripción o detalles de la actividad..."
                                                    rows="2"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-slate-700 resize-none shadow-sm"
                                                    value={currentActivity.description || ''}
                                                    onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (currentActivity.name && currentActivity.startsAt && currentActivity.endsAt) {
                                                    if (currentActivity.startsAt >= currentActivity.endsAt) {
                                                        Swal.fire('Error', 'La hora de fin debe ser posterior a la de inicio', 'error');
                                                        return;
                                                    }
                                                    setFormData({
                                                        ...formData,
                                                        activities: [...formData.activities, currentActivity].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
                                                    });
                                                    setCurrentActivity({ name: '', startsAt: '', endsAt: '', description: '' });
                                                } else {
                                                    Swal.fire('Campos incompletos', 'Asigna nombre, hora de inicio y de fin a la actividad', 'warning');
                                                }
                                            }}
                                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                                        >
                                            <Plus size={18} /> Agregar Actividad
                                        </button>

                                        {formData.activities.length > 0 && (
                                            <div className="space-y-2.5 mt-6 max-h-72 overflow-y-auto pr-1">
                                                {formData.activities.map((act, index) => (
                                                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition-all duration-200 animate-fade-in">
                                                        <div className="flex gap-4 items-center">
                                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-800">{act.name}</h4>
                                                                <p className="text-xs text-gray-400 font-medium">{act.startsAt} - {act.endsAt}</p>
                                                                {act.description && (
                                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{act.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, activities: formData.activities.filter((_, i) => i !== index) });
                                                            }}
                                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-15px_rgba(15,23,42,0.12)]">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tight">Observaciones</label>
                                <textarea
                                    name="otrosObservaciones"
                                    rows="4"
                                    className="block w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                                    placeholder="Anota observaciones adicionales del evento..."
                                    value={formData.otrosObservaciones}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mt-12 p-6 bg-amber-50/80 rounded-2xl border border-amber-100 flex gap-4 shadow-sm">
                                <div className="text-amber-600"><Info size={24} /></div>
                                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                                    Asegúrese de incluir tiempo adicional para pruebas técnicas antes del inicio oficial.
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all">Atrás</button>
                                <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200/70 hover:shadow-xl hover:shadow-emerald-200/80 transition-all">Continuar <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white p-8 rounded-[2rem] shadow border border-gray-100 animate-slide-up">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Briefcase size={24} />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-gray-900">Detalles de la Ficha Técnica</h2>
                            </div>

                            <div className="space-y-6">
                               <div>
    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">
        Dress Code
    </label>

    <select
        name="dressCode"
        value={formData.dressCode}
        onChange={handleChange}
        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
    >
        <option value="">Seleccione una opción</option>
        <option value="Formal">Formal</option>
        <option value="Business Casual">Business Casual</option>
        <option value="Casual">Casual</option>
        <option value="Etiqueta">Etiqueta</option>
        <option value="Gala">Gala</option>
    </select>
</div>

                               <div>
    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">
        Programa Impactado
    </label>

    <select
        name="programImpacted"
        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
        value={formData.programImpacted}
        onChange={handleChange}
    >
        <option value="">
            Selecciona un programa académico
        </option>

        <option value="Ingeniería en Sistemas">
            Ingeniería en Sistemas
        </option>

        <option value="Ingeniería Mecatrónica">
            Ingeniería Mecatrónica
        </option>

        <option value="Ingeniería Mecánica">
            Ingeniería Mecánica
        </option>

        <option value="Ingeniería Industrial">
            Ingeniería Industrial
        </option>

        <option value="Ingeniería Electrónica">
            Ingeniería Electrónica
        </option>

        <option value="Ingeniería Administrativa">
            Ingeniería Administrativa
        </option>

        <option value="Ingeniería Aeronáutica">
            Ingeniería Aeronáutica
        </option>
    </select>
</div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Especificaciones de Invitados</label>
                                    <textarea
                                        name="guestSpecifications"
                                        rows="2"
                                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                        placeholder="Detalles sobre invitados especiales o requerimientos específicos..."
                                        value={formData.guestSpecifications}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                              <div>
    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-tight">
        Tipo de Acomodo
    </label>

    <div className="space-y-3">

        <label className="flex items-center gap-2">
            <input
                type="radio"
                name="acomodo_tipo"
                value='En "U" con mesas y sillas'
                checked={formData.acomodo_tipo === 'En "U" con mesas y sillas'}
                onChange={handleChange}
            />
            En "U" con mesas y sillas
        </label>

        <label className="flex items-center gap-2">
            <input
                type="radio"
                name="acomodo_tipo"
                value="Solo sillas tipo Auditorio"
                checked={formData.acomodo_tipo === "Solo sillas tipo Auditorio"}
                onChange={handleChange}
            />
            Solo sillas tipo Auditorio
        </label>

        <label className="flex items-center gap-2">
            <input
                type="radio"
                name="acomodo_tipo"
                value="Mesas y sillas en filas"
                checked={formData.acomodo_tipo === "Mesas y sillas en filas"}
                onChange={handleChange}
            />
            Mesas y sillas en filas
        </label>

        <label className="flex items-center gap-2">
            <input
                type="radio"
                name="acomodo_tipo"
                value="Otro"
                checked={formData.acomodo_tipo === "Otro"}
                onChange={handleChange}
            />
            Otro
        </label>

        {formData.acomodo_tipo === "Otro" && (
            <textarea
                name="otrosObservaciones"
                value={formData.otrosObservaciones}
                onChange={handleChange}
                placeholder="Describa el tipo de acomodo o indique el croquis"
                className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
        )}

    </div>
</div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Detalles de Presídium</label>
                                    <textarea
                                        name="presidiumDetail"
                                        rows="2"
                                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                        placeholder="Indicaciones para acomodo o protocolo del presídium..."
                                        value={formData.presidiumDetail}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-tight">Acción del Director</label>
                                    <textarea
                                        name="directorAction"
                                        rows="2"
                                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                        value={formData.directorAction}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
                                <button type="button" onClick={() => setStep(2)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all">Atrás</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-3.5 rounded-2xl font-bold shadow-xl shadow-emerald-200/70 hover:shadow-2xl hover:shadow-emerald-200/80 transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Guardando...
                                        </div>
                                    ) : (
                                        <>
                                            <Save size={20} /> Guardar Ficha Técnica
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                    {/* Feedbacks Section for Edit Mode */}
                    {
                        isEditMode && detailedEvent && (() => {
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
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${f.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {f.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-3">
                                                            {format(new Date(f.createdAt), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                                                        </span>
                                                    </div>
                                                    {f.status === 'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResolveFeedback(f.id)}
                                                            disabled={actionLoading}
                                                            className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                                                        >
                                                            Marcar como Resuelto
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-800 font-medium whitespace-pre-line mt-3">{f.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()
                    }


                {/* Sidebar Summary */}
                <div className="hidden lg:block">
                    <div className="sticky top-10 bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-40 -mr-20 -mt-20"></div>
                        <h3 className="text-2xl font-display font-bold mb-8 relative z-10">Resumen</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-1">
                                <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Proyecto</p>
                                <p className="font-bold text-lg leading-tight truncate">{formData.name || 'Sin título'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Locación</p>
                                <p className="font-bold text-lg leading-tight truncate">
                                    {venues.find(v => String(v.id) === String(formData.locationId))?.nombre || venues.find(v => String(v.id) === String(formData.locationId))?.name || 'Pendiente'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Programación</p>
                                <p className="text-sm font-medium text-emerald-50/80">
                                    {formData.startsAt ? new Date(formData.startsAt).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pendiente de definir'}
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-emerald-800 space-y-4">
                                <div className={`flex items-center gap-2 text-sm ${formData.name ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    <CheckCircle2 size={16} /> Informacion basica
                                </div>
                                <div className={`flex items-center gap-2 text-sm ${formData.startsAt ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    <CheckCircle2 size={16} /> Fecha y Hora
                                </div>
                                <div className={`flex items-center gap-2 text-sm ${formData.locationId ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    <CheckCircle2 size={16} /> Asignación de Recinto
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 🤖 MODAL DE AUTORELLENADO POR IA */}
            {/* ========================================================================= */}
            {showAIModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                        <div className="p-6 bg-emerald-950 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles size={24} className="text-emerald-200" />
                                <h2 className="text-xl font-display font-bold">Asistente de Autorellenado IA</h2>
                            </div>
                            <button onClick={() => setShowAIModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8 space-y-4 bg-gray-50 flex-1">
                            <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                Describe el evento que deseas crear. La Inteligencia Artificial analizará tu solicitud y utilizará fichas técnicas pasadas para intentar rellenar todos los campos del formulario por ti.
                            </p>
                            <textarea
                                className="w-full h-40 p-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none font-medium text-gray-700 shadow-inner"
                                placeholder="Ej: Necesito una ficha para el Foro Anual de Innovación..."
                                value={aiPrompt}
                                onChange={(e) => setAIPrompt(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAIModal(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 border border-transparent transition-all"
                                disabled={isAILoading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAutoFill}
                                disabled={!aiPrompt.trim() || isAILoading}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all"
                            >
                                {isAILoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} /> Autorellenar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 🚗 MODAL DE CONTROL DE VEHÍCULOS (ESTACIONAMIENTO) */}
            {/* ========================================================================= */}
            {showParkingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                        <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🚗</span>
                                <h2 className="text-xl font-display font-bold">Control de Vehículos para Acceso</h2>
                            </div>
                            <button onClick={() => setShowParkingModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="nombreResponsable"
                                    placeholder="Nombre del Responsable"
                                    value={currentVehicle.nombreResponsable}
                                    onChange={handleVehicleChange}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
                                />
                                <input
                                    type="text"
                                    name="placaVehiculo"
                                    placeholder="Placas (Ej: XYZ-123-A)"
                                    value={currentVehicle.placaVehiculo}
                                    onChange={handleVehicleChange}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm uppercase outline-none shadow-sm animate-fade-in"
                                />
                                <select
                                    name="marcaVehiculo"
                                    value={currentVehicle.marcaVehiculo}
                                    onChange={handleVehicleChange}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm font-medium text-slate-700"
                                >
                                    <option value="" disabled>Selecciona una marca...</option>
                                    {MARCAS_POPULARES.map((marca) => (
                                        <option key={marca} value={marca}>{marca}</option>
                                    ))}
                                </select>
                                <select
                                    name="colorVehiculo"
                                    value={currentVehicle.colorVehiculo}
                                    onChange={handleVehicleChange}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm font-medium text-slate-700"
                                >
                                    <option value="" disabled>Selecciona un color...</option>
                                    {COLORES_COMUNES.map((color) => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddVehicle}
                                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-colors"
                            >
                                <Plus size={14} /> Agregar Vehículo
                            </button>

                            {parkingList.length > 0 && (
                                <div className="space-y-2 mt-2 border-t border-slate-200 pt-3 max-h-52 overflow-y-auto">
                                    {parkingList.map((vehicle, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-sm shadow-sm animate-fade-in">
                                            <div className="truncate flex-1 pr-2">
                                                <p className="font-bold text-slate-800 truncate">{vehicle.marcaVehiculo} • <span className="text-emerald-600">{vehicle.placaVehiculo}</span></p>
                                                <p className="text-xs text-slate-400 font-medium truncate">Resp: {vehicle.nombreResponsable} {vehicle.colorVehiculo ? `(${vehicle.colorVehiculo})` : ''}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setParkingList(prev => prev.filter((_, i) => i !== idx))}
                                                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowParkingModal(false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                            >
                                Listo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 📸 MODAL DE TOMA DE FOTOGRAFÍA */}
            {/* ========================================================================= */}
            {showPhotoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                        <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📸</span>
                                <h2 className="text-xl font-display font-bold">Horario Programado (Foto)</h2>
                            </div>
                            <button onClick={() => setShowPhotoModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 bg-slate-50">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Hora Exacta para la Toma</label>
                                <input
                                    type="time"
                                    value={horaFotografia}
                                    onChange={(e) => setHoraFotografia(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold text-emerald-700 outline-none shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!horaFotografia) {
                                        Swal.fire('Atención', 'Por favor especifica un horario para continuar.', 'info');
                                        return;
                                    }
                                    setShowPhotoModal(false);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                            >
                                Guardar Horario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 👥 MODAL DE PRESÍDIUM */}
            {/* ========================================================================= */}
            {showPresidiumModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                        <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">👥</span>
                                <h2 className="text-xl font-display font-bold">Listado de Integrantes del Presídium</h2>
                            </div>
                            <button onClick={() => setShowPresidiumModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Nombre Completo"
                                    value={currentMember.nombre}
                                    onChange={(e) => setCurrentMember(prev => ({ ...prev, nombre: e.target.value }))}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Puesto / Cargo"
                                    value={currentMember.puesto}
                                    onChange={(e) => setCurrentMember(prev => ({ ...prev, puesto: e.target.value }))}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none shadow-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddMember}
                                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-colors"
                            >
                                <Plus size={14} /> Agregar Integrante
                            </button>

                            {presidiumList.length > 0 && (
                                <div className="space-y-2 mt-2 border-t border-slate-200 pt-3 max-h-52 overflow-y-auto">
                                    {presidiumList.map((member, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-sm shadow-sm animate-fade-in">
                                            <div className="truncate flex-1 pr-2">
                                                <p className="font-bold text-slate-800 truncate">{member.nombre}</p>
                                                <p className="text-xs text-slate-400 font-medium truncate">{member.puesto}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPresidiumList(prev => prev.filter((_, i) => i !== idx))}
                                                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPresidiumModal(false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                            >
                                Listo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventForm;