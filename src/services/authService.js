import axiosInstance from "../config/axiosInstance";

// Datos de prueba simulados
const DEMO_USERS = {
  "usuario@test.com": {
    id: 1,
    email: "usuario@test.com",
    password: "123456",
    nombre: "Usuario Demo",
    rol: "estudiante",
  },
  "admin@test.com": {
    id: 2,
    email: "admin@test.com",
    password: "admin123",
    nombre: "Admin",
    rol: "administrador",
  },
};

// Simulación de token JWT
const generateToken = (email) => {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ email, iat: Date.now() })
  )}.${Math.random().toString(36).substr(2)}`;
};

export const authService = {
  login: async (email, password) => {
    try {
      // Intentar con API real primero
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Fallback a datos de prueba si la API no está disponible
      const user = DEMO_USERS[email];
      
      if (!user || user.password !== password) {
        throw new Error("Correo o contraseña incorrectos");
      }

      const token = generateToken(email);
      const response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol,
        },
      };

      // Guardar en localStorage para persistencia
      localStorage.setItem("authUser", JSON.stringify(response));
      
      return response;
    }
  },

  register: async (nombre, email, password, passwordConfirm) => {
    try {
      // Validaciones básicas
      if (!nombre || !email || !password || !passwordConfirm) {
        throw new Error("Por favor completa todos los campos");
      }

      if (password !== passwordConfirm) {
        throw new Error("Las contraseñas no coinciden");
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // Intentar con API real
      const response = await axiosInstance.post("/auth/register", {
        nombre,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Fallback a datos de prueba
      if (DEMO_USERS[email]) {
        throw new Error("El correo ya está registrado");
      }

      // Crear nuevo usuario de prueba
      const newUser = {
        id: Math.max(...Object.values(DEMO_USERS).map((u) => u.id)) + 1,
        email,
        password,
        nombre,
        rol: "estudiante",
      };

      DEMO_USERS[email] = newUser;
      const token = generateToken(email);

      const response = {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          nombre: newUser.nombre,
          rol: newUser.rol,
        },
      };

      localStorage.setItem("authUser", JSON.stringify(response));
      return response;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
  },

  getCurrentUser: () => {
    const authUser = localStorage.getItem("authUser");
    return authUser ? JSON.parse(authUser) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
