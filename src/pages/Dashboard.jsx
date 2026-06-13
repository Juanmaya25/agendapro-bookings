import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { statusC } from '../data/themes.js';
import { STATS_WEEK } from '../data/seed.js';

export function Dashboard({ clients, todayBookings, todayActive, todayRevenue, monthRevenue, onNewBooking, onNewClient, onNewService, onViewReports, C, S }) {
  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      {/* HERO con gradiente vibrante */}
      <div style={{
        position:'relative', borderRadius:28, padding:'36px 40px',
        background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accent2} 100%)`,
        overflow:'hidden',
        boxShadow:'0 20px 60px rgba(168, 85, 247, .35)',
      }}>
        <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 80% -10%, rgba(255,255,255,.25), transparent 50%)', pointerEvents:'none'}} />
        <div style={{position:'absolute', right:30, top:30, fontSize:80, opacity:.18}}>✨</div>
        <div style={{position:'relative', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20, color:'#fff'}}>
          <div>
            <div style={{fontSize:13, fontWeight:600, opacity:.85, letterSpacing:'.5px', marginBottom:8, textTransform:'uppercase'}}>Salón Bella · Lunes 4 de Mayo 2026</div>
            <h1 style={{fontSize:36, fontWeight:800, margin:0, letterSpacing:'-1.2px', lineHeight:1.1}}>
              Hola, hermosa ✨
            </h1>
            <div style={{fontSize:15, marginTop:12, opacity:.92, maxWidth:520, lineHeight:1.55}}>
              Hoy tienes <strong>{todayActive.length} citas</strong> y <strong>{fmt(todayRevenue)}</strong> en ingresos esperados.
              ¡Que sea un día brillante!
            </div>
          </div>
          <button style={{...S.btnPri, background:'#fff', color:C.accent, boxShadow:'0 6px 20px rgba(0,0,0,.15)'}} onClick={onNewBooking}>
            <Icon.plus /> Nueva reserva
          </button>
        </div>
      </div>

      {/* KPI ROW */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16}}>
        {[
          { l:'Citas hoy',         v:todayActive.length,                                                                            sub:`${todayBookings.filter(b => b.status === 'pending').length} pendientes`, c:C.accent  },
          { l:'Ingresos hoy',      v:fmt(todayRevenue),                                                                              sub:'Esperados',           c:C.accent2 },
          { l:'Clientes',          v:clients.length,                                                                                 sub:'Registrados',          c:C.accent3 },
          { l:'Rating promedio',   v:'4.9',                                                                                          sub:'156 reseñas',          c:'#fbbf24' },
        ].map(k => (
          <div key={k.l} style={S.glass}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase', marginBottom:10}}>{k.l}</div>
            <div style={{fontSize:32, fontWeight:800, color:k.c, fontFamily:'monospace', letterSpacing:'-.8px', lineHeight:1, marginBottom:6}}>{k.v}</div>
            <div style={{fontSize:13, color:C.text3}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* GRID 2 cols */}
      <div className="ap-cols-main" style={{display:'grid', gap:16}}>
        <div style={S.glass}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
            <h2 style={{fontSize:18, fontWeight:700, margin:0, letterSpacing:'-.3px', color:C.text}}>Ingresos esta semana</h2>
            <div style={{fontSize:13, color:C.accent3, fontFamily:'monospace', fontWeight:700}}>{fmt(monthRevenue)}</div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={STATS_WEEK}>
              <defs>
                <linearGradient id="agendaArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={C.accent} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{background:C.bgSolid, border:`1px solid ${C.borderSolid}`, borderRadius:12, fontSize:12}} formatter={v => [fmt(v), 'Ingresos']} />
              <Area type="monotone" dataKey="revenue" stroke={C.accent} strokeWidth={3} fill="url(#agendaArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={S.glass}>
          <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', letterSpacing:'-.3px', color:C.text}}>Próximas citas</h2>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {todayActive.slice(0, 5).map(b => (
              <div key={b.id} style={{display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{
                  width:42, height:42, borderRadius:14,
                  background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
                  color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, fontSize:14, flexShrink:0,
                }}>
                  {b.client.split(' ').map(p => p[0]).slice(0,2).join('')}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14, fontWeight:600, color:C.text}}>{b.client}</div>
                  <div style={{fontSize:12, color:C.text2, marginTop:2}}>{b.time} · {b.service}</div>
                </div>
                <span style={{fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:100, background:statusC[b.status].bg, color:statusC[b.status].c, whiteSpace:'nowrap'}}>{statusC[b.status].l}</span>
              </div>
            ))}
            {todayActive.length === 0 && <div style={{fontSize:13, color:C.text2, textAlign:'center', padding:14}}>Sin citas hoy</div>}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={S.glass}>
        <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 16px', letterSpacing:'-.3px', color:C.text}}>Acciones rápidas</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12}}>
          {[
            { label:'Nueva reserva', sub:'Agendar cliente',    color:C.accent,  action: onNewBooking },
            { label:'Cliente nuevo', sub:'Agregar al CRM',     color:C.accent2, action: onNewClient },
            { label:'Servicio',      sub:'Agregar al catalogo', color:C.accent3, action: onNewService },
            { label:'Ver reportes',  sub:'Análisis y stats',   color:'#fbbf24', action: onViewReports },
          ].map(a => (
            <button
              key={a.label}
              onClick={a.action}
              style={{
                background:`${a.color}10`, color:a.color,
                border:`1px solid ${a.color}30`,
                borderRadius:16, padding:'14px 18px',
                fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                textAlign:'left', transition:'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${a.color}20`; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.transform='translateY(0)'; }}
            >
              <div>{a.label}</div>
              <div style={{fontSize:11, fontWeight:500, opacity:.7, marginTop:3}}>{a.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
