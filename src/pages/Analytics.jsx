import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fmt } from '../utils/format.js';
import { STATS_WEEK, SERVICE_DIST } from '../data/seed.js';

export function Analytics({ monthRevenue, C, S }) {
  const totalAppts = STATS_WEEK.reduce((s, d) => s + d.appts, 0);
  return (
    <div className="fade-in">
      <div style={{marginBottom:8}}>
        <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Reportes</h1>
        <div style={{fontSize:14, color:C.text2, marginTop:6}}>Análisis del rendimiento del negocio</div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, margin:'24px 0'}}>
        {[
          { l:'Ingresos semana',  v:fmt(monthRevenue),                                                       sub:'7 días',           c:C.accent3 },
          { l:'Citas semana',     v:totalAppts,                                                              sub:'Atendidas',        c:C.accent  },
          { l:'Ticket promedio',  v:fmt(Math.round(monthRevenue / Math.max(totalAppts, 1))),                  sub:'Por cita',         c:C.accent2 },
          { l:'Ocupación',        v:'78%',                                                                    sub:'Esta semana',      c:'#fbbf24' },
        ].map(k => (
          <div key={k.l} style={S.glass}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:800, color:k.c, fontFamily:'monospace', letterSpacing:'-.5px'}}>{k.v}</div>
            <div style={{fontSize:12, color:C.text3, marginTop:5}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="ap-cols-main" style={{display:'grid', gap:16}}>
        <div style={S.glass}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Ingresos por día</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={STATS_WEEK}>
              <defs>
                <linearGradient id="agendaBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} />
                  <stop offset="100%" stopColor={C.accent2} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{background:C.bgSolid, border:`1px solid ${C.borderSolid}`, borderRadius:12, fontSize:12}} formatter={v => [fmt(v), 'Ingresos']} />
              <Bar dataKey="revenue" fill="url(#agendaBar)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.glass}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Distribución</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={SERVICE_DIST} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4} dataKey="value">
                {SERVICE_DIST.map(e => <Cell key={e.name} fill={e.color} stroke={C.bgSolid} strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bgSolid, border:`1px solid ${C.borderSolid}`, borderRadius:12, fontSize:12}} />
              <Legend wrapperStyle={{fontSize:11}} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
