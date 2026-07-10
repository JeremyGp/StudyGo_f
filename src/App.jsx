import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Acceso/Login.jsx";
import Registro from "./pages/Acceso/Registro.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PlanesAcademicos from "./pages/PlanesAcademicos/PlanesAcademicos.jsx";
import MiAgenda from "./pages/MiAgenda/MiAgenda.jsx";
import MisAsignaturas from "./pages/MisAsignaturas/MisAsignaturas.jsx";
import Progreso from "./pages/Progreso/Progreso.jsx";
import Directorio from "./pages/Directorio/Directorio.jsx";
import Horarios from "./pages/Horarios/Horarios.jsx";
import TutorIA from "./pages/TutorIA/TutorIA.jsx";
import Ajustes from "./pages/Ajustes/Ajustes.jsx";

// Componente para rutas protegidas
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planes-academicos"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PlanesAcademicos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mi-agenda"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MiAgenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-asignaturas"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MisAsignaturas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progreso"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Progreso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/directorio"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Directorio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horarios"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Horarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-ia"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TutorIA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajustes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Ajustes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
