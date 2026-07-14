import React from 'react';
import PanelShell from "../../components/common/PanelShell";
import { User, Shield, Bell, Lightbulb, Pencil, Info } from 'lucide-react';

function Ajustes() {
  return (
    <PanelShell
      title="Ajustes de Cuenta"
      subtitle="Administra tu identidad académica y preferencias de seguridad."
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA (Perfil y Seguridad) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Tarjeta de Perfil */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-slate-500" size={22} />
              <h2 className="text-lg font-semibold text-slate-800">Perfil</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-32 h-32 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Perfil" 
                    className="object-cover w-full h-full"
                  />
                  <button className="absolute bottom-2 right-2 bg-black text-white p-1.5 rounded-full hover:bg-slate-800 transition">
                    <Pencil size={14} />
                  </button>
                </div>
                <span className="text-xs text-slate-400 mt-3">JPG o PNG. Máx 5MB.</span>
              </div>

              {/* Formulario de Perfil */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre Completo</label>
                  <input 
                    type="text" 
                    defaultValue="Julian Ramírez" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email" 
                    defaultValue="j.ramirez@studygo.edu" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] focus:border-transparent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Biografía Académica</label>
                  <textarea 
                    rows="3"
                    defaultValue="Coordinador de Ingeniería con pasión por la optimización de procesos educativos y el éxito estudiantil." 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a] focus:border-transparent resize-none" 
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
                  defaultValue="********" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nueva Contraseña</label>
                <input 
                  type="password" 
                  defaultValue="********" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  defaultValue="********" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3b4c7a]" 
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
              {/* Toggle 1 */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="pr-4">
                  <p className="font-semibold text-sm text-slate-800">Alertas de Vencimiento</p>
                  <p className="text-xs text-slate-500 mt-0.5">Recordatorios 24h antes de una entrega.</p>
                </div>
                {/* Mockup de Toggle Switch Activo */}
                <button className="w-11 h-6 bg-[#3b4c7a] rounded-full relative flex items-center px-1 shrink-0 transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full transform translate-x-5 transition-transform"></div>
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="pr-4">
                  <p className="font-semibold text-sm text-slate-800">Actualizaciones de Tutor</p>
                  <p className="text-xs text-slate-500 mt-0.5">Nuevos mensajes o correcciones.</p>
                </div>
                {/* Mockup de Toggle Switch Inactivo */}
                <button className="w-11 h-6 bg-slate-200 rounded-full relative flex items-center px-1 shrink-0 transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transform translate-x-0 transition-transform"></div>
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex justify-between items-center">
                <div className="pr-4">
                  <p className="font-semibold text-sm text-slate-800">Resumen Semanal</p>
                  <p className="text-xs text-slate-500 mt-0.5">Progreso y agenda de la próxima semana.</p>
                </div>
                {/* Mockup de Toggle Switch Activo */}
                <button className="w-11 h-6 bg-[#3b4c7a] rounded-full relative flex items-center px-1 shrink-0 transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full transform translate-x-5 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            <button className="w-full bg-[#3b4c7a] hover:bg-[#2d3a5e] text-white font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2">
              Guardar Cambios
            </button>
            <button className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-md transition-colors">
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
    </PanelShell>
  );
}

export default Ajustes;