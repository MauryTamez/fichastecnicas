import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventForm from './pages/EventForm';
import EventDetail from './pages/EventDetail';
import Layout from './components/Layout';
import CatalogAdmin from './pages/CatalogAdmin';
import UserAdmin from './pages/UserAdmin';
import VenueAdmin from './pages/VenueAdmin';
import EventTypeAdmin from './pages/EventTypeAdmin';
import Organigrama from './pages/Organigrama';
import FeedbackReview from './pages/FeedbackReview';
import PendingApprovals from './pages/PendingApprovals';
import AuxiliarInbox from './pages/AuxiliarInbox';

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
          <Route path="/evento/:id" element={
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
