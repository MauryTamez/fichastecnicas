import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/events/Dashboard';
import EventForm from './pages/events/form/EventForm';
import EventDetail from './pages/events/EventDetail';
import EventVersionsList from './pages/events/EventVersionsList';
import Layout from './components/Layout';
import CatalogAdmin from './pages/admin/CatalogAdmin';
import UserAdmin from './pages/admin/UserAdmin';
import VenueAdmin from './pages/admin/VenueAdmin';
import EventTypeAdmin from './pages/admin/EventTypeAdmin';
import Organigrama from './pages/admin/Organigrama';
import FeedbackReview from './pages/events/FeedbackReview';
import PendingApprovals from './pages/events/PendingApprovals';
import AuxiliarInbox from './pages/events/AuxiliarInbox';
import MyEvents from './pages/events/MyEvents';
import DepartmentEvents from './pages/events/DepartmentEvents';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/nuevo-evento" element={
            <ProtectedRoute>
              <Layout>
                <EventForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/evento/:id/versiones" element={
            <ProtectedRoute>
              <Layout>
                <EventVersionsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/evento/:id/version/:versionId" element={
            <ProtectedRoute>
              <Layout>
                <EventDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/editar-evento/:id" element={
            <ProtectedRoute>
              <Layout>
                <EventForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/catalogo" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <CatalogAdmin />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/recintos" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <VenueAdmin />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <UserAdmin />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/tipos-evento" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <EventTypeAdmin />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Nuevas Rutas FASE 3 / FASE 4 */}
          <Route path="/moderador/organigrama" element={
            <ProtectedRoute allowedRoles={['admin', 'moderador']}>
              <Layout>
                <Organigrama />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/moderador/fichas-pendientes" element={
            <ProtectedRoute allowedRoles={['admin', 'moderador']}>
              <Layout>
                <PendingApprovals />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/encargado/solicitudes" element={
            <ProtectedRoute allowedRoles={['admin', 'encargado_departamento']}>
              <Layout>
                <PendingApprovals />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/encargado/eventos" element={
            <ProtectedRoute allowedRoles={['admin', 'encargado_departamento']}>
              <Layout>
                <DepartmentEvents />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/encargado/usuarios" element={
            <ProtectedRoute allowedRoles={['admin', 'encargado_departamento']}>
              <Layout>
                <UserAdmin />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/creador/feedback" element={
            <ProtectedRoute allowedRoles={['admin', 'creador']}>
              <Layout>
                <FeedbackReview />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/creador/eventos" element={
            <ProtectedRoute allowedRoles={['admin', 'creador']}>
              <Layout>
                <MyEvents />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/auxiliar/notificaciones" element={
            <ProtectedRoute allowedRoles={['admin', 'auxiliares', 'auxiliar']}>
              <Layout>
                <AuxiliarInbox />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/auxiliar/eventos" element={
            <ProtectedRoute allowedRoles={['admin', 'auxiliares', 'auxiliar']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
