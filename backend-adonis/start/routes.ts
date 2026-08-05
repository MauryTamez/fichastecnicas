/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import LoginController from '#controllers/auth/login_controller'
import DashboardController from '#controllers/dashboard_controller'
const EventsController = () => import('#controllers/events_controller')
const VenuesController = () => import('#controllers/venues_controller')
const LocationTypesController = () => import('#controllers/location_types_controller')
const UsersController = () => import('#controllers/users_controller')
const LoginControllerIntegration = () => import('#controllers/auth/login_controller')
const EventTypesController = () => import('#controllers/event_types_controller')
const FeedbacksController = () => import('#controllers/feedbacks_controller')
// --- Rutas de IA y Chatbot (Protegidas) ---
const RagController = () => import('#controllers/rag_controller')

router.get('/', () => {
    return { status: 'API is running' }
})

router.group(() => {

    router.post('/login', [LoginController, 'login']).as('login.store')
    router.post('/logout', [LoginController, 'logout']).as('login.destroy')
}).as('auth')

// --- Rutas Protegidas por Rol (Legacy/Views) ---
router.group(() => {
    router.get('/dashboard', [DashboardController, 'admin']).as('admin.dashboard')
}).prefix('/admin-legacy').use([middleware.jwtAuth(), middleware.role(['admin'])])

router.group(() => {
    router.get('/dashboard', [DashboardController, 'auxiliar']).as('auxiliar.dashboard')
}).prefix('/auxiliar-legacy').use([middleware.jwtAuth(), middleware.role(['auxiliares', 'auxiliar'])])

router.group(() => {
    router.post('/chat', [RagController, 'chat']).as('rag.chat')
    router.post('/vectorize', [RagController, 'vectorizeVersion']).as('rag.vectorize')
    router.post('/autofill', [RagController, 'autoFill']).as('rag.autofill')
}).prefix('/api/ai').use([middleware.jwtAuth()])

// --- API Integrada con Frontend (Fichas Técnicas) ---
router.group(() => {
    router.post('/auth/login', [LoginControllerIntegration, 'login'])
    router.post('/auth/logout', [LoginControllerIntegration, 'logout'])
    router.post('/auth/register', [UsersController, 'store'])

    router.group(() => {
        // Eventos generales (index es filtrado por controlador)
        // Eventos generales (index es filtrado por controlador)
        router.get('/events', [EventsController, 'index'])
        router.get('/events/:id', [EventsController, 'show'])
        router.patch('/events/:id/status', [EventsController, 'updateStatus'])
        router.post('/events/:id/request-review', [EventsController, 'requestReview'])
        router.post('/events/:id/pass-to-review', [EventsController, 'passToReview'])

        // Feedbacks
        router.get('/feedbacks/pending', [FeedbacksController, 'pendingUserFeedbacks'])
        router.get('/events/:eventId/versions/:versionId/feedbacks', [FeedbacksController, 'index'])
        router.post('/events/:eventId/versions/:versionId/feedbacks', [FeedbacksController, 'store'])
        router.patch('/feedbacks/:id/resolve', [FeedbacksController, 'resolve'])

        const EventsPdfController = () => import('#controllers/events_pdf_controller')
        router.get('/events/:id/pdf', [EventsPdfController, 'generatePdf'])

        // Data for dropdowns (accessible to all authenticated roles)
        router.get('/event-types', [EventTypesController, 'index'])
        router.get('/venues', [VenuesController, 'index'])
        const DepartmentsController = () => import('#controllers/departments_controller')
        router.get('/departments', [DepartmentsController, 'index'])
        router.get('/users/:id/events-summary', [UsersController, 'userEventsSummary'])

        const CatalogsController = () => import('#controllers/catalogs_controller')
        router.get('/organizations', [CatalogsController, 'getOrganizations'])
        router.get('/catalog', [CatalogsController, 'index'])
        router.get('/roles', [UsersController, 'roles'])

        // 1. Admin Group
        router.group(() => {
            router.post('/venues', [VenuesController, 'store'])
            router.put('/venues/:id', [VenuesController, 'update'])
            router.delete('/venues/:id', [VenuesController, 'destroy'])

            router.get('/location-types', [LocationTypesController, 'index'])
            router.post('/location-types', [LocationTypesController, 'store'])
            router.put('/location-types/:id', [LocationTypesController, 'update'])
            router.delete('/location-types/:id', [LocationTypesController, 'destroy'])

            router.get('/users', [UsersController, 'index'])
            router.post('/users', [UsersController, 'store'])
            router.put('/users/:id', [UsersController, 'update'])
            router.delete('/users/:id', [UsersController, 'destroy'])

            router.post('/catalog', [CatalogsController, 'store'])
            router.delete('/catalog/:id', [CatalogsController, 'destroy'])

            router.post('/event-types', [EventTypesController, 'store'])
            router.get('/event-types/:id', [EventTypesController, 'show'])
            router.put('/event-types/:id', [EventTypesController, 'update'])
            router.delete('/event-types/:id', [EventTypesController, 'destroy'])

            // Departments
            const DepartmentsController = () => import('#controllers/departments_controller')
            router.get('/departments', [DepartmentsController, 'index'])
            router.post('/departments', [DepartmentsController, 'store'])
            router.get('/departments/:id', [DepartmentsController, 'show'])
            router.put('/departments/:id', [DepartmentsController, 'update'])
            router.delete('/departments/:id', [DepartmentsController, 'destroy'])
        }).prefix('/admin').use(middleware.role(['admin']))

        // 2. Moderador Group
        router.group(() => {
            // Endpoints para moderador
            router.get('/solicitudes', [EventsController, 'pendingApprovals'])
            
            const DepartmentsController = () => import('#controllers/departments_controller')
            router.get('/organigram-all', [DepartmentsController, 'organigramAll'])
        }).prefix('/moderador').use(middleware.role(['moderador']))

        // 3. Encargado de Departamento Group (Subdirector)
        router.group(() => {
            // Endpoints para encargado
            const DepartmentsController = () => import('#controllers/departments_controller')
            router.get('/organigram', [DepartmentsController, 'organigram'])
            router.get('/solicitudes', [EventsController, 'pendingApprovals'])
            router.put('/events/:id', [EventsController, 'update'])
            router.post('/events', [EventsController, 'store'])
        }).prefix('/encargado').use(middleware.role(['encargado_departamento']))

        // 4. Creador Group
        router.group(() => {
            router.post('/events', [EventsController, 'store'])
            router.put('/events/:id', [EventsController, 'update'])
            router.delete('/events/:id', [EventsController, 'destroy'])
        }).prefix('/creador').use(middleware.role(['creador']))

        // 5. Auxiliares Group
        router.group(() => {
            // Endpoints exclusivos auxiliares
        }).prefix('/auxiliar').use(middleware.role(['auxiliares', 'auxiliar']))

    }).use([middleware.jwtAuth()])
}).prefix('/api')

