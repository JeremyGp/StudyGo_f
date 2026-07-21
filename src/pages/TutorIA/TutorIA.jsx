import React, { useState, useEffect, useRef } from "react";
import PanelShell from "../../components/common/PanelShell";

function TutorIA() {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // 1. Estado del Resumen Académico conectado a LocalStorage
  const [resumen, setResumen] = useState({
    porcentaje: 0,
    materiasRegistradas: 0
  });

  // 2. Estado de Mensajes (Historial del Chat)
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      rol: "ia",
      contenido: "¡Hola Manuel! Soy tu Tutor de Planificación. He analizado tu perfil y estoy listo para ayudarte a organizar tus horarios o repasar conceptos. ¿En qué te puedo ayudar hoy?"
    }
  ]);

  const mensajesEndRef = useRef(null);

  // --- EFECTOS ---

  // Leer LocalStorage al cargar la pantalla
  useEffect(() => {
    // Intentamos leer las asignaturas (puedes ajustar esta key cuando crees el módulo de asignaturas)
    const asignaturasGuardadas = localStorage.getItem('studygo_asignaturas');
    let totalMaterias = 0;
    let porcentajeCalculado = 0;

    if (asignaturasGuardadas) {
      const asignaturas = JSON.parse(asignaturasGuardadas);
      totalMaterias = asignaturas.length || 0;
      // Simulamos un cálculo: 20% de avance por cada materia registrada, topado al 100%
      porcentajeCalculado = Math.min(totalMaterias * 20, 100);
    } else {
      // Si aún no hay asignaturas, mostramos un 5% simbólico por tener la cuenta activa
      porcentajeCalculado = 5;
    }

    setResumen({
      porcentaje: porcentajeCalculado,
      materiasRegistradas: totalMaterias
    });
  }, []);

  // Auto-scroll hacia el último mensaje
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, isTyping]);


  // --- FUNCIONES DEL CHAT ---

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Agregar el mensaje del usuario
    const nuevoMensaje = {
      id: Date.now(),
      rol: "usuario",
      contenido: inputText
    };

    setMensajes((prev) => [...prev, nuevoMensaje]);
    setInputText("");
    setIsTyping(true);

    // 2. Simular el tiempo de respuesta de la IA (Aquí luego conectarás tu backend real)
    setTimeout(() => {
      const respuestaIA = {
        id: Date.now() + 1,
        rol: "ia",
        contenido: "Entendido. Como estamos en fase de integración, pronto podré procesar esa solicitud exacta. Por ahora te recomiendo organizar tus bloques de estudio usando la técnica Pomodoro (25 min de enfoque x 5 min de descanso)."
      };
      setMensajes((prev) => [...prev, respuestaIA]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <PanelShell
      title="Tutor IA"
      subtitle="Recibe recomendaciones personalizadas para tu aprendizaje y planificación."
    >
      <div className="flex h-[calc(100vh-160px)] min-h-[600px] gap-6">
        
        {/* ==========================================
            COLUMNA IZQUIERDA: ÁREA DE CHAT
            ========================================== */}
        <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden relative">
          
          {/* Área de mensajes (scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="flex justify-center">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-wider">
                Hoy
              </span>
            </div>

            {/* Mapeo dinámico de los mensajes */}
            {mensajes.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-[85%] ${msg.rol === "usuario" ? "ml-auto justify-end" : ""}`}
              >
                {/* Avatar IA */}
                {msg.rol === "ia" && (
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">📚</span>
                  </div>
                )}

                {/* Burbuja de Mensaje */}
                <div 
                  className={`p-5 shadow-sm ${
                    msg.rol === "ia" 
                      ? "bg-white border border-slate-200 rounded-2xl rounded-tl-none text-slate-700" 
                      : "bg-black text-white rounded-2xl rounded-tr-none"
                  }`}
                >
                  <p>{msg.contenido}</p>
                </div>

                {/* Avatar Usuario */}
                {msg.rol === "usuario" && (
                  <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold">
                    M
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de "IA Escribiendo..." */}
            {isTyping && (
              <div className="flex gap-4 max-w-[85%] animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-5 text-slate-500 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}

            {/* Referencia invisible para el auto-scroll */}
            <div ref={mensajesEndRef} />
          </div>

          {/* Área de Input */}
          <div className="border-t border-slate-100 p-4 bg-white">
            {/* Convertimos el div en un form para soportar la tecla Enter nativamente */}
            <form 
              onSubmit={enviarMensaje}
              className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-2 py-2 shadow-inner"
            >
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </button>
              
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe tus metas de estudio..." 
                className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm px-2"
              />
              
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>

              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                className="bg-black text-white p-2.5 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
            <div className="text-center mt-3">
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Inteligencia Artificial Académica - Generado por StudyGo</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            COLUMNA DERECHA: WIDGETS
            ========================================== */}
        <div className="w-[320px] flex flex-col gap-6">
          
          {/* Widget: Resumen Académico DINÁMICO */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              <h3 className="font-bold text-slate-800">Resumen Académico</h3>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>SEMESTRE ACTUAL</span>
              <span>{resumen.porcentaje}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${resumen.porcentaje}%` }}
              ></div>
            </div>
            {resumen.materiasRegistradas === 0 && (
              <p className="text-[10px] text-slate-400 mt-3 italic text-center">
                Aún no tienes asignaturas registradas. El progreso se actualizará cuando las añadas.
              </p>
            )}
          </div>

          {/* Widget: Próximos Retos (Mantenemos la estructura visual) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Próximos Retos</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 text-red-600 rounded-lg p-2 text-center min-w-[50px] border border-red-100">
                  <div className="text-[10px] font-bold uppercase">Pronto</div>
                  <div className="text-lg font-black leading-none">!</div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Registrar Horario</h4>
                  <p className="text-xs text-slate-500 mt-1">Configura tus clases para iniciar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget: Tip del Día */}
          <div className="bg-black text-white rounded-2xl p-6 relative overflow-hidden shadow-lg mt-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 relative z-10">Tip del Día</h3>
            <p className="font-medium text-sm leading-relaxed relative z-10">
              "El aprendizaje espaciado mejora la retención a largo plazo en un 40%."
            </p>
            <a href="#" className="inline-block mt-4 text-xs font-bold text-white underline underline-offset-2 relative z-10 hover:text-slate-300">
              Leer más sobre la técnica
            </a>
            <svg className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"></path></svg>
          </div>

        </div>
      </div>
    </PanelShell>
  );
}

export default TutorIA;