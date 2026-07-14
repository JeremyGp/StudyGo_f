import React, { useState, useEffect } from 'react';
import PanelShell from "../../components/common/PanelShell";
import { User, Shield, Bell, Lightbulb, Pencil, Info, X, Upload } from 'lucide-react';

function Ajustes() {
  // --- 1. ESTADOS LOCALES ---
  const [perfil, setPerfil] = useState({
    nombre: '',
    correo: '',
    biografia: ''
  });

  const [seguridad, setSeguridad] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  const [notificaciones, setNotificaciones] = useState({
    alertas: true,
    actualizaciones: false,
    resumen: true
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 2. CARGAR DATOS AL INICIAR ---
  useEffect(() => {
    cargarDatosLocales();
  }, []);

  const cargarDatosLocales = () => {
    const datosGuardados = localStorage.getItem('studygo_ajustes');
    
    if (datosGuardados) {
      const datosParsed = JSON.parse(datosGuardados);
      setPerfil(datosParsed.perfil || { nombre: '', correo: '', biografia: '' });
      setNotificaciones(datosParsed.notificaciones || { alertas: true, actualizaciones: false, resumen: true });
    } else {
      // Datos por defecto simulando al usuario logeado
      setPerfil({
        nombre: 'Manuel Sebastian',
        correo: 'manuel@studygo.edu',
        biografia: 'Desarrollador Full Stack con enfoque en la creación de interfaces dinámicas y seguras.'
      });
    }
    // Limpiamos los campos de contraseña por seguridad visual
    setSeguridad({ actual: '', nueva: '', confirmar: '' });
  };

  // --- 3. MANEJADORES DE EVENTOS ---
  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));
  };

  const handleSeguridadChange = (e) => {
    const { name, value } = e.target;
    setSeguridad(prev => ({ ...prev, [name]: value }));
  };

  const toggleNotificacion = (key) => {
    setNotificaciones(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const guardarCambios = () => {
    const datosAExportar = { perfil, notificaciones };
    localStorage.setItem('studygo_ajustes', JSON.stringify(datosAExportar));
    alert('¡Ajustes guardados correctamente en LocalStorage!');
    // Aquí luego tu compañero solo agregará la llamada a su API
  };

  const descartarCambios = () => {
    cargarDatosLocales();
  };

  // Extraer la primera letra del nombre para el Avatar
  const inicial = perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : 'U';

  return (
    <PanelShell
      title="Ajustes de Cuenta"
      subtitle="Administra tu identidad académica y preferencias de seguridad."
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
        
        {/* COLUMNA IZQUIERDA (Perfil y Seguridad) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Tarjeta de Perfil */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-slate-500" size={22} />
              <h2 className="text-lg font-semibold text-slate-800">Perfil</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar con Inicial Dinámica */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-32 h-32 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                  
                  {/* Fondo degradado con la letra inicial */}
                  <div className="w-full h-full bg-gradient-to-br from-[#3b4c7a] to-[#1e2743] flex items-center justify-center text-white text-5xl font-bold">
                    {inicial}
                  </div>

                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
                <span className="text-xs text-slate-400 mt-3">Haz clic para subir foto</span>
              </div>

              {/* Formulario de Perfil (Controlado por Estado) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={perfil.nombre}
                    onChange={handlePerfilChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="correo"
                    value={perfil.correo}
                    onChange={handlePerfilChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] focus:border-transparent transition-all" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Biografía Académica</label>
                  <textarea 
                    rows="3"
                    name="biografia"
                    value={perfil.biografia}
                    onChange={handlePerfilChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] focus:border-transparent resize-none transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Seguridad */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-[#3b4c7a]" size={22} />
              <h2 className="text-lg font-semibold text-slate-800">Seguridad</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña Actual</label>
                <input 
                  type="password" 
                  name="actual"
                  value={seguridad.actual}
                  onChange={handleSeguridadChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nueva Contraseña</label>
                <input 
                  type="password" 
                  name="nueva"
                  value={seguridad.nueva}
                  onChange={handleSeguridadChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  name="confirmar"
                  value={seguridad.confirmar}
                  onChange={handleSeguridadChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] transition-all" 
                />
              </div>
            </div>

            <div className="mt-6 bg-[#f0f4f8] text-[#2c3e50] p-4 rounded-lg flex items-start gap-3 border border-slate-100">
              <Info size={20} className="text-[#3b4c7a] shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número.
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (Notificaciones y Acciones) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Tarjeta de Notificaciones */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="text-[#3b4c7a]" size={22} />
              <h2 className="text-lg font-semibold text-slate-800">Notificaciones</h2>
            </div>

            <div className="space-y-5">
              {/* Toggle 1: Alertas */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="pr-4">
                  <p className="font-semibold text-sm text-slate-800">Alertas de Vencimiento</p>
                  <p className="text-xs text-slate-500 mt-0.5">Recordatorios 24h antes de una entrega.</p>
                </div>
                <button 
                  onClick={() => toggleNotificacion('alertas')}
                  className={`w-11 h-6 rounded-full relative flex items-center px-1 shrink-0 transition-colors ${notificaciones.alertas ? 'bg-[#3b4c7a]' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notificaciones.alertas ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Toggle 2: Actualizaciones */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="pr-4">
                  <p className="font-semibold text-sm text-slate-800">Actualizaciones de Tutor</p>
                  <p className="text-xs text-slate-500 mt-0.5">Nuevos mensajes o correcciones.</p>
                </div>
                <button 
                  onClick={() => toggleNotificacion('actualizaciones')}
                  className={`w-11 h-6 rounded-full relative flex items-center px-1 shrink-0 transition-colors ${notificaciones.actualizaciones ? 'bg-[#3b4c7a]' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notificaciones.actualizaciones ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Toggle 3: Resumen */}
              <div className="flex justify-between items-center">
                <div className="pr-4">
                  <p className="font-semibold text-sm text-slate-800">Resumen Semanal</p>
                  <p className="text-xs text-slate-500 mt-0.5">Progreso y agenda de la próxima semana.</p>
                </div>
                <button 
                  onClick={() => toggleNotificacion('resumen')}
                  className={`w-11 h-6 rounded-full relative flex items-center px-1 shrink-0 transition-colors ${notificaciones.resumen ? 'bg-[#3b4c7a]' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notificaciones.resumen ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            <button 
              onClick={guardarCambios}
              className="w-full bg-[#3b4c7a] hover:bg-[#2d3a5e] text-white font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              Guardar Cambios
            </button>
            <button 
              onClick={descartarCambios}
              className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-md transition-colors"
            >
              Descartar
            </button>
          </div>

          {/* Tarjeta de Consejo */}
          <div className="bg-[#fdf8f3] border border-[#f5e6d3] rounded-xl p-5 shadow-sm text-[#8b6b4a]">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <Lightbulb size={18} className="text-[#d49a5b]" />
              <h3>Consejo de Estudio</h3>
            </div>
            <p className="text-xs leading-relaxed text-[#7a5c40]">
              Mantener tu perfil actualizado ayuda a los tutores a identificarte mejor en las sesiones grupales. ¡No olvides subir una foto clara!
            </p>
          </div>

        </div>
      </div>

      {/* --- MODAL PARA SUBIR FOTO (Overlay Integrado) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-lg">Actualizar Foto de Perfil</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body del Modal */}
            <div className="p-6 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-[#3b4c7a] border-2 border-dashed border-slate-300">
                <Upload size={28} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-800">Haz clic para seleccionar o arrastra una imagen</p>
                <p className="text-xs text-slate-500 mt-1">Soporta JPG y PNG. Tamaño máximo: 5MB.</p>
              </div>
              
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#f0f4f8] file:text-[#3b4c7a]
                  hover:file:bg-slate-200 cursor-pointer transition-all mt-2"
              />
            </div>

            {/* Footer del Modal */}
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert("Aquí procesarías la subida de la imagen. ¡Cerrando modal!");
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#3b4c7a] rounded-md hover:bg-[#2d3a5e] transition-colors"
              >
                Subir Imagen
              </button>
            </div>
          </div>
        </div>
      )}

    </PanelShell>
  );
}

export default Ajustes;