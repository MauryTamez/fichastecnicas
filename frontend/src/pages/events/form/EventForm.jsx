import { AlertTriangle, ArrowLeft, Briefcase, Clock, ChevronRight, FileText, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { getVenues } from '../../../api/venues';
import { resolveFeedback } from '../../../api/feedbacks';

// Componentes del formulario
import EventFormGeneral from './EventFormGeneral';
import EventFormHorario from './EventFormHorario';
import EventFormDetalles from './EventFormDetalles';
import EventFormSidebar from './EventFormSidebar';
import EventFormFeedbacks from './EventFormFeedbacks';
import AIAutofillModal from './AIAutofillModal';
import ParkingModal from './ParkingModal';
import PhotoModal from './PhotoModal';
import PresidiumModal from './PresidiumModal';

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

    // ESTADOS PARA MÚLTIPLES CARROS
    const [parkingList, setParkingList] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState({
        nombreResponsable: '',
        marcaVehiculo: '',
        placaVehiculo: '',
        colorVehiculo: ''
    });

    // Horario fotográfico
    const [horaFotografia, setHoraFotografia] = useState('');

    // Lista de presídium
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
            const formattedName = value.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
            setCurrentVehicle(prev => ({ ...prev, [name]: formattedName }));
        } else if (name === 'placaVehiculo') {
            setCurrentVehicle(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else {
            setCurrentVehicle(prev => ({ ...prev, [name]: value }));
        }
    };

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
                        <EventFormGeneral
                            formData={formData}
                            handleChange={handleChange}
                            filteredVenues={filteredVenues}
                            organizations={organizations}
                            eventTypes={eventTypes}
                            isEditMode={isEditMode}
                            setShowAIModal={setShowAIModal}
                            setStep={setStep}
                        />
                    )}

                    {step === 2 && (
                        <EventFormHorario
                            formData={formData}
                            handleChange={handleChange}
                            setFormData={setFormData}
                            audiovisual={audiovisual}
                            audiovisualItems={audiovisualItems}
                            toggleAudiovisual={toggleAudiovisual}
                            otros={otros}
                            otrosItems={otrosItems}
                            toggleOtro={toggleOtro}
                            setShowParkingModal={setShowParkingModal}
                            setShowPhotoModal={setShowPhotoModal}
                            setShowPresidiumModal={setShowPresidiumModal}
                            currentActivity={currentActivity}
                            setCurrentActivity={setCurrentActivity}
                            setStep={setStep}
                        />
                    )}

                    {step === 3 && (
                        <EventFormDetalles
                            formData={formData}
                            handleChange={handleChange}
                            loading={loading}
                            setStep={setStep}
                        />
                    )}
                </form>

                {/* Sección de Feedbacks para Modo Edición */}
                <EventFormFeedbacks
                    isEditMode={isEditMode}
                    detailedEvent={detailedEvent}
                    handleResolveFeedback={handleResolveFeedback}
                    actionLoading={actionLoading}
                />

                {/* Sidebar Summary */}
                <EventFormSidebar
                    formData={formData}
                    venues={venues}
                />
            </div>

            {/* Modales */}
            <AIAutofillModal
                showAIModal={showAIModal}
                setShowAIModal={setShowAIModal}
                aiPrompt={aiPrompt}
                setAIPrompt={setAIPrompt}
                handleAutoFill={handleAutoFill}
                isAILoading={isAILoading}
            />

            <ParkingModal
                showParkingModal={showParkingModal}
                setShowParkingModal={setShowParkingModal}
                currentVehicle={currentVehicle}
                handleVehicleChange={handleVehicleChange}
                handleAddVehicle={handleAddVehicle}
                parkingList={parkingList}
                setParkingList={setParkingList}
            />

            <PhotoModal
                showPhotoModal={showPhotoModal}
                setShowPhotoModal={setShowPhotoModal}
                horaFotografia={horaFotografia}
                setHoraFotografia={setHoraFotografia}
            />

            <PresidiumModal
                showPresidiumModal={showPresidiumModal}
                setShowPresidiumModal={setShowPresidiumModal}
                currentMember={currentMember}
                setCurrentMember={setCurrentMember}
                handleAddMember={handleAddMember}
                presidiumList={presidiumList}
                setPresidiumList={setPresidiumList}
            />
        </div>
    );
};

export default EventForm;