import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, loginError } from "../../store/authSlice";
import { authService } from "../../services/authService";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Por favor completa todos los campos");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Correo electrónico inválido");
        return;
      }

      const response = await authService.login(email, password);

      if (response && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("tokenType", response.tokenType);
        localStorage.setItem("authUser", JSON.stringify(response.user));

        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        dispatch(loginSuccess(response));
        navigate("/dashboard");
      } else {
        setError("Error al iniciar sesión");
        dispatch(loginError("Credenciales inválidas"));
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor";
      setError(message);
      dispatch(loginError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Columna Izquierda */}
      <div className="login-left">
        <div className="login-left-content">
          {/* Logo y Tagline */}
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">📚</span>
              <h1>StudyGo</h1>
            </div>
            <p className="tagline">Tu asistente inteligente para tu excelencia académica</p>
          </div>

          {/* Imagen de Estudiante */}
          <div className="student-image">
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              {/* Escritorio */}
              <rect x="40" y="200" width="220" height="15" fill="#8B7355" />
              <rect x="50" y="150" width="20" height="50" fill="#A0826D" />
              <rect x="230" y="150" width="20" height="50" fill="#A0826D" />

              {/* Computadora */}
              <rect x="80" y="100" width="80" height="60" fill="#34495E" rx="5" />
              <rect x="85" y="105" width="70" height="45" fill="#2C3E50" rx="3" />
              <circle cx="120" cy="165" r="12" fill="#34495E" />

              {/* Cuaderno */}
              <rect x="170" y="120" width="60" height="40" fill="#E74C3C" rx="3" />
              <line x1="175" y1="125" x2="225" y2="125" stroke="#FFF" strokeWidth="1" />
              <line x1="175" y1="135" x2="225" y2="135" stroke="#FFF" strokeWidth="1" />
              <line x1="175" y1="145" x2="225" y2="145" stroke="#FFF" strokeWidth="1" />
              <line x1="175" y1="155" x2="220" y2="155" stroke="#FFF" strokeWidth="1" />

              {/* Taza de Café */}
              <ellipse cx="70" cy="105" rx="18" ry="12" fill="#D4A574" />
              <path d="M 55 105 Q 52 120 55 130 L 85 130 Q 88 120 85 105 Z" fill="#D4A574" />
              <path d="M 88 110 Q 95 110 95 118 Q 95 125 88 125" fill="none" stroke="#D4A574" strokeWidth="3" />

              {/* Persona (cabeza y cuerpo) */}
              <circle cx="120" cy="50" r="15" fill="#F4A460" />
              {/* Cabello */}
              <path d="M 105 50 Q 105 35 120 35 Q 135 35 135 50" fill="#8B4513" />
              {/* Cuerpo */}
              <ellipse cx="120" cy="85" rx="20" ry="25" fill="#3498DB" />
              {/* Brazos */}
              <line x1="100" y1="80" x2="70" y2="95" stroke="#F4A460" strokeWidth="4" strokeLinecap="round" />
              <line x1="140" y1="80" x2="160" y2="100" stroke="#F4A460" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bloque de Gestión de Tiempos */}
          <div className="time-management">
            <h3>⏰ Gestión de Tiempos</h3>
            <p>
              StudyGo organiza automáticamente tu tiempo de estudio según tus objetivos académicos, 
              personalizando un plan de aprendizaje que se adapta a tu ritmo.
            </p>
          </div>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="login-right">
        <div className="login-form-container">
          {/* Título */}
          <div className="form-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Inicia sesión para continuar tu aprendizaje</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={loading}
                className="form-input"
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="form-input"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="form-remember">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox"
              />
              <label htmlFor="rememberMe">Recuérdame en este dispositivo</label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Register Link */}
          <p className="register-link">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro">Regístrate ahora</Link>
          </p>

          {/* Footer Links */}
          <div className="footer-links">
            <a href="#ayuda">Ayuda</a>
            <a href="#privacidad">Privacidad</a>
            <a href="#terminos">Términos</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
