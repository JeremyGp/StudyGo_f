import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginError, logout, clearError } from "../store/authSlice";
import { authService } from "../services/authService";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      const message = error.message || "Error al iniciar sesión";
      dispatch(loginError(message));
      throw error;
    }
  };

  const handleRegister = async (nombre, email, password, passwordConfirm) => {
    try {
      const response = await authService.register(
        nombre,
        email,
        password,
        passwordConfirm
      );
      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      const message = error.message || "Error al registrarse";
      dispatch(loginError(message));
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
