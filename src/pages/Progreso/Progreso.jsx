import React, { useState, useEffect } from 'react';
import PanelShell from "../../components/common/PanelShell";
import { Download, Share2, Star, Package, FileText, Trophy, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

//npm install recharts

function Progreso() {
  const [cursos, setCursos] = useState([]);
  const [promedioActual, setPromedioActual] = useState(0);
  const [mejoresNotas, setMejoresNotas] = useState([]);

  // Datos simulados para el historial, ya que el localStorage actual 
  // probablemente solo tiene los cursos del semestre en curso.
  const historialPromedios = [
    { ciclo: 'CICLO I', promedio: 7.2 },
    { ciclo: 'CICLO II', promedio: 7.8 },
    { ciclo: 'CICLO III', promedio: 8.1 },
    { ciclo: 'CICLO IV', promedio: 8.5 },
    { ciclo: 'CICLO V', promedio: 8.4 },
    { ciclo: 'CICLO VI', promedio: 8.7 },
    { ciclo: 'CICLO VII', promedio: 8.92 },
  ];

  useEffect(() => {
    // 1. Conectar con el LocalStorage
    // Ajusta 'studygo_asignaturas' al nombre exacto de la key que uses
    const datosGuardados = localStorage.getItem('studygo_asignaturas');
    
    if (datosGuardados) {
      const cursosParseados = JSON.parse(datosGuardados);
      setCursos(cursosParseados);

      // 2. Calcular promedio general basado en el 'progreso' o 'nota' de los cursos
      if (cursosParseados.length > 0) {
        // Asumimos que los cursos tienen una propiedad 'progreso' (0-100) que usaremos como base para simular la nota,
        // o si tienes una propiedad 'nota' exacta, cámbiala aquí.
        const suma = cursosParseados.reduce((acc, curso) => {
          // Convertimos porcentaje (ej. 92%) a formato sobre 10 o 100 según prefieras
          const valor = typeof curso.progreso === 'number' ? curso.progreso : parseInt(curso.progreso) || 0;
          return acc + valor;
        }, 0);
        
        // Simulamos un promedio ponderado sobre 10
        const promedioCalculado = (suma / cursosParseados.length) / 10; 
        setPromedioActual(promedioCalculado.toFixed(2));

        // 3. Obtener las mejores notas (ordenamos de mayor a menor)
        const ordenados = [...cursosParseados].sort((a, b) => {
          const valA = typeof a.progreso === 'number' ? a.progreso : parseInt(a.progreso) || 0;
          const valB = typeof b.progreso === 'number' ? b.progreso : parseInt(b.progreso) || 0;
          return valB - valA;
        });
        setMejoresNotas(ordenados.slice(0, 4)); // Tomamos el Top 4
      }
    } else {
      // Datos por defecto si el localStorage está vacío para no romper la UI
      setPromedioActual("8.92");
      setMejoresNotas([
        { curso: 'Cálculo Vectorial', profesor: 'Facultad de Ingeniería', progreso: 98 },
        { curso: 'Estructura de Datos', profesor: 'Ciencias de la Computación', progreso: 96 },
        { curso: 'Física Moderna', profesor: 'Facultad de Ingeniería', progreso: 95 },
      ]);
    }
  }, []);

  return (
    <PanelShell
      title="Progreso Académico"
      subtitle="Visualiza tu rendimiento e hitos educativos en tiempo real."
    >
      {/* Botones de acción superiores */}
      <div className="absolute top-6 right-6 flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} /> Exportar Reporte
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3b4c7a] text-white rounded-lg text-sm font-medium hover:bg-[#2d3a5e] transition-colors shadow-sm">
          <Share2 size={16} /> Compartir Perfil
        </button>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        
        {/* --- 1. TARJETAS SUPERIORES (KPIs) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Star size={20} className="fill-indigo-100" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> +0.2
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Promedio Ponderado</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{promedioActual}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Package size={20} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Créditos Completados</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-3xl font-bold text-slate-800">142</p>
                <p className="text-sm text-slate-400 font-medium">/ 340</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText size={20} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cursos Aprobados</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {cursos.length > 0 ? cursos.length : 28}
              </p>
              <p className="text-xs text-slate-400 mt-1">De un total de 44 proyectados</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Trophy size={20} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Puesto en Facultad</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">#12</p>
              <p className="text-xs text-slate-400 mt-1">Top 5% de la promoción</p>
            </div>
          </div>
        </div>

        {/* --- 2. ÁREA CENTRAL (Gráfico y Mejores Notas) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
          
          {/* Gráfico Lineal */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Evolución de Promedios</h3>
                <p className="text-sm text-slate-500">Histórico de rendimiento por semestre</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <div className="w-3 h-3 rounded-full bg-[#3b4c7a]"></div>
                Promedio
              </div>
            </div>
            
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historialPromedios} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="ciclo" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    hide
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="promedio" 
                    stroke="#3b4c7a" 
                    strokeWidth={3}
                    dot={{ fill: '#ffffff', stroke: '#3b4c7a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b4c7a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mejores Notas (Desde LocalStorage) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800">Mejores Notas</h3>
            <p className="text-sm text-slate-500 mb-6">Asignaturas sobresalientes</p>
            
            <div className="flex-1 flex flex-col gap-4">
              {mejoresNotas.map((curso, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {typeof curso.progreso === 'number' ? curso.progreso : parseInt(curso.progreso) || 90}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{curso.curso || curso.nombre}</p>
                    <p className="text-xs text-slate-500 truncate">{curso.profesor || 'Docente'}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 transition-colors">
              Ver Historial Completo
            </button>
          </div>
        </div>

        {/* --- 3. ÁREA INFERIOR (Progreso por áreas y CTA) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Estado por Áreas</h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Ciencias Básicas</span>
                  <span className="text-slate-500">92%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b4c7a] rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Humanidades</span>
                  <span className="text-slate-500">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5b6e9f] rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Especialidad</span>
                  <span className="text-slate-500">40%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a233a] to-[#2d3a5e] p-6 rounded-xl shadow-md text-white relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <span className="text-xs font-bold tracking-wider text-indigo-300 uppercase mb-2 block">Experiencia Académica</span>
              <h3 className="text-2xl font-bold mb-3">¡Vas por buen camino!</h3>
              <p className="text-sm text-indigo-100/80 leading-relaxed mb-6 max-w-[80%]">
                Basado en tus notas de Cálculo, podrías optar por el programa de Tutoría Avanzada y recibir una bonificación en tu crédito de investigación.
              </p>
              <button className="bg-white text-[#1a233a] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors shadow-sm">
                Solicitar Tutoría
              </button>
            </div>
            {/* Ícono decorativo de fondo */}
            <TrendingUp size={160} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
          </div>
        </div>

      </div>
    </PanelShell>
  );
}

export default Progreso;