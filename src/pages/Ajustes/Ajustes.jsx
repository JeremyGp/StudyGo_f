import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Info, LockKeyhole, Mail, Shield, User } from "lucide-react";

import PanelShell from "../../components/common/PanelShell";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../services/usuario";
import { userUpdated } from "../../store/authSlice";

const EMPTY_PASSWORDS = { nueva: "", confirmar: "" };

const getErrorMessage = (error, fallback) =>
  error.response?.data?.detail || error.message || fallback;

function Ajustes() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({ nombre: "", correo: "" });
  const [seguridad, setSeguridad] = useState(EMPTY_PASSWORDS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setPerfil({ nombre: user.nombre || "", correo: user.correo || "" });
    }
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setPerfil((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setSeguridad((current) => ({ ...current, [name]: value }));
  };

  const discardChanges = () => {
    setPerfil({ nombre: user?.nombre || "", correo: user?.correo || "" });
    setSeguridad(EMPTY_PASSWORDS);
    setError("");
    setSuccess("");
  };

  const saveChanges = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const nombre = perfil.nombre.trim();
    const correo = perfil.correo.trim();
    if (nombre.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    if (seguridad.nueva && seguridad.nueva.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (seguridad.nueva !== seguridad.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const payload = { nombre, correo };
    if (seguridad.nueva) payload.contrasena = seguridad.nueva;
    const emailChanged = correo !== user.correo;

    setSaving(true);
    try {
      const updatedUser = await usuarioService.actualizar(user.id_usuario, payload);
      dispatch(userUpdated(updatedUser));
      setSeguridad(EMPTY_PASSWORDS);

      if (emailChanged) {
        setSuccess("Perfil actualizado. Debes iniciar sesión nuevamente porque cambió tu correo.");
        window.setTimeout(() => {
          logout();
          navigate("/");
        }, 1800);
      } else {
        setSuccess("Información actualizada correctamente.");
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible actualizar tu información."));
    } finally {
      setSaving(false);
    }
  };

  const initial = perfil.nombre.charAt(0).toUpperCase() || "U";
  const hasChanges =
    perfil.nombre !== (user?.nombre || "") ||
    perfil.correo !== (user?.correo || "") ||
    Boolean(seguridad.nueva || seguridad.confirmar);

  return (
    <PanelShell
      title="Ajustes de cuenta"
      subtitle="Actualiza tu información personal y las credenciales de acceso."
    >
      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={saveChanges} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <User className="text-slate-500" size={22} />
              <h2 className="text-lg font-semibold text-slate-800">Información personal</h2>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b4c7a] to-[#1e2743] text-5xl font-bold text-white shadow-inner">
                  {initial}
                </div>
                <span className="mt-3 text-xs text-slate-400">Identidad de StudyGo</span>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  icon={<User size={17} />}
                  label="Nombre completo"
                  type="text"
                  name="nombre"
                  value={perfil.nombre}
                  onChange={handleProfileChange}
                  minLength={2}
                  maxLength={100}
                  required
                />
                <Field
                  icon={<Mail size={17} />}
                  label="Correo electrónico"
                  type="email"
                  name="correo"
                  value={perfil.correo}
                  onChange={handleProfileChange}
                  required
                />
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 md:col-span-2">
                  <p><strong className="text-slate-700">Usuario:</strong> #{user?.id_usuario}</p>
                  <p className="mt-1"><strong className="text-slate-700">Cuenta creada:</strong> {user?.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString("es-CO") : "Sin información"}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Shield className="text-[#3b4c7a]" size={22} />
              <h2 className="text-lg font-semibold text-slate-800">Cambiar contraseña</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                icon={<LockKeyhole size={17} />}
                label="Nueva contraseña"
                type="password"
                name="nueva"
                value={seguridad.nueva}
                onChange={handlePasswordChange}
                placeholder="Déjala vacía para conservar la actual"
                minLength={8}
                autoComplete="new-password"
              />
              <Field
                icon={<LockKeyhole size={17} />}
                label="Confirmar nueva contraseña"
                type="password"
                name="confirmar"
                value={seguridad.confirmar}
                onChange={handlePasswordChange}
                placeholder="Repite la nueva contraseña"
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-100 bg-[#f0f4f8] p-4 text-[#2c3e50]">
              <Info size={20} className="mt-0.5 shrink-0 text-[#3b4c7a]" />
              <p className="text-sm font-medium">
                La contraseña debe tener al menos 8 caracteres. Si no deseas cambiarla, deja ambos campos vacíos.
              </p>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6 xl:col-span-4">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Guardar cambios</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Los cambios se guardarán en tu cuenta y se reflejarán en todas las vistas de StudyGo.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="w-full rounded-md bg-[#3b4c7a] py-2.5 font-medium text-white transition-colors hover:bg-[#2d3a5e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={discardChanges}
                disabled={saving || !hasChanges}
                className="w-full rounded-md border border-slate-300 bg-white py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Descartar
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-cyan-100 bg-cyan-50 p-5 text-cyan-900 shadow-sm">
            <h3 className="font-semibold">Seguridad de la sesión</h3>
            <p className="mt-2 text-xs leading-relaxed text-cyan-800">
              Si modificas tu correo, StudyGo cerrará la sesión para emitir posteriormente un token asociado a la nueva dirección.
            </p>
          </section>
        </aside>
      </form>
    </PanelShell>
  );
}

function Field({ icon, label, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          {icon}
        </span>
        <input
          {...props}
          className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-800 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3b4c7a]"
        />
      </div>
    </label>
  );
}

export default Ajustes;
