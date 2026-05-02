import { useState, useMemo, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from "recharts";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_SERVICES = [
  { id:1, name:'Corte de cabello',   duration:45,  price:35000,  color:'#f59e0b', category:'Cabello' },
  { id:2, name:'Tinte completo',     duration:120, price:120000, color:'#ec4899', category:'Cabello' },
  { id:3, name:'Manicure',           duration:60,  price:25000,  color:'#8b5cf6', category:'Uñas' },
  { id:4, name:'Pedicure',           duration:60,  price:30000,  color:'#06b6d4', category:'Uñas' },
  { id:5, name:'Cejas y pestañas',   duration:45,  price:40000,  color:'#10b981', category:'Estética' },
  { id:6, name:'Tratamiento facial', duration:60,  price:65000,  color:'#ef4444', category:'Estética' },
];

const INIT_BOOKINGS = [
  { id:1, client:'María López',    service:'Corte de cabello', date:'2025-05-01', time:'09:00', stylist:'Ana',   status:'confirmed', phone:'310-111-2222', email:'maria@email.com',     notes:'Cliente frecuente' },
  { id:2, client:'Sofía García',   service:'Tinte completo',   date:'2025-05-01', time:'10:00', stylist:'Luisa', status:'confirmed', phone:'310-333-4444', email:'sofia@email.com',     notes:'Color rubio platino' },
  { id:3, client:'Patricia Ruiz',  service:'Manicure',         date:'2025-05-01', time:'12:00', stylist:'Ana',   status:'pending',   phone:'310-555-6666', email:'patricia@email.com',  notes:'' },
  { id:4, client:'Carmen Torres',  service:'Pedicure',         date:'2025-05-01', time:'14:00', stylist:'Luisa', status:'pending',   phone:'310-777-8888', email:'carmen@email.com',    notes:'Diseño francés' },
  { id:5, client:'Valentina Cruz', service:'Cejas y pestañas', date:'2025-05-02', time:'09:30', stylist:'Ana',   status:'confirmed', phone:'310-999-0000', email:'valentina@email.com', notes:'' },
  { id:6, client:'Isabella Mora',  service:'Corte de cabello', date:'2025-05-02', time:'11:00', stylist:'Luisa', status:'cancelled', phone:'310-121-2121', email:'isabella@email.com',  notes:'Canceló por enfermedad' },
];

const INIT_CLIENTS = [
  { id:1, name:'María López',    phone:'310-111-2222', email:'maria@email.com',     visits:18, total:850000,  loyalty:'gold',     lastVisit:'2025-04-15' },
  { id:2, name:'Sofía García',   phone:'310-333-4444', email:'sofia@email.com',     visits:12, total:1200000, loyalty:'platinum', lastVisit:'2025-04-20' },
  { id:3, name:'Patricia Ruiz',  phone:'310-555-6666', email:'patricia@email.com',  visits:5,  total:175000,  loyalty:'silver',   lastVisit:'2025-04-10' },
  { id:4, name:'Carmen Torres',  phone:'310-777-8888', email:'carmen@email.com',    visits:8,  total:380000,  loyalty:'gold',     lastVisit:'2025-04-25' },
  { id:5, name:'Valentina Cruz', phone:'310-999-0000', email:'valentina@email.com', visits:3,  total:120000,  loyalty:'silver',   lastVisit:'2025-04-05' },
];

const INIT_STYLISTS = [
  { id:1, name:'Ana Martínez',    specialty:'Colorimetría',      rating:4.9, appts:186, avatar:'👩‍🦱', color:'#f59e0b', email:'ana@bella.co' },
  { id:2, name:'Luisa Fernández', specialty:'Corte & Estilo',    rating:4.8, appts:142, avatar:'👩‍🦰', color:'#ec4899', email:'luisa@bella.co' },
  { id:3, name:'Camila Restrepo', specialty:'Estética avanzada', rating:5.0, appts:98,  avatar:'👩',    color:'#8b5cf6', email:'camila@bella.co' },
];

const HOURS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

const STATS_WEEK = [
  { day:'Lun', appts:8,  revenue:280000 },
  { day:'Mar', appts:12, revenue:420000 },
  { day:'Mié', appts:10, revenue:350000 },
  { day:'Jue', appts:15, revenue:520000 },
  { day:'Vie', appts:18, revenue:640000 },
  { day:'Sáb', appts:20, revenue:710000 },
  { day:'Hoy', appts:4,  revenue:190000 },
];

const SERVICE_DIST = [
  { name:'Cabello',  value:42, color:'#a78bfa' },
  { name:'Uñas',     value:28, color:'#f472b6' },
  { name:'Estética', value:20, color:'#34d399' },
  { name:'Otros',    value:10, color:'#fbbf24' },
];

const themes = {
  dark:  { bg:'#0f0a1e', bg2:'#1a1030', bg3:'#231545', accent:'#c084fc', accent2:'#f472b6', accent3:'#34d399', text:'#f1f0ff', text2:'#9d8fd4', text3:'#5a4d7a', border:'#2d1f4e', border2:'#3d2a6a', red:'#f87171' },
  light: { bg:'#fdfcff', bg2:'#ffffff', bg3:'#f5f3ff', accent:'#7c3aed', accent2:'#db2777', accent3:'#059669', text:'#1f2937', text2:'#6b7280', text3:'#9ca3af', border:'#e5e7eb', border2:'#d1d5db', red:'#ef4444' },
};

const statusC = {
  confirmed: { l:'Confirmada', bg:'rgba(52,211,153,.15)',  c:'#16a34a' },
  pending:   { l:'Pendiente',  bg:'rgba(251,191,36,.15)',  c:'#d97706' },
  cancelled: { l:'Cancelada',  bg:'rgba(248,113,113,.15)', c:'#dc2626' },
  done:      { l:'Completada', bg:'rgba(124,58,237,.15)',  c:'#7c3aed' },
};

const loyaltyInfo = {
  silver:   { l:'Plata',   c:'#94a3b8', icon:'⭐' },
  gold:     { l:'Oro',     c:'#fbbf24', icon:'🌟' },
  platinum: { l:'Platino', c:'#c084fc', icon:'💎' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');

// ─── COMPONENTES TOP-LEVEL (estables entre renders) ─────────────────

function KPI({ label, value, sub, color, icon, trend, C, S }) {
  return (
    <div
      style={{...S.card, transition:'transform .2s'}}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{fontSize:24, marginBottom:10}}>{icon}</div>
      <div style={{fontSize:11, color:C.text2, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6}}>{label}</div>
      <div style={{fontSize:24, fontWeight:700, color, fontFamily:'monospace', marginBottom:3}}>{value}</div>
      <div style={{fontSize:12, color:C.text3, display:'flex', alignItems:'center', gap:6}}>
        {trend !== undefined && trend !== null && (
          <span style={{color: trend > 0 ? C.accent3 : C.red, fontWeight:700}}>
            {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}

function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.7)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{...S.card, width:'100%', maxWidth: size==='lg' ? 720 : 520, boxShadow:'0 30px 80px rgba(0,0,0,.5)'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
          <h2 style={{fontSize:16, fontWeight:700, margin:0, color:C.text}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, fontSize:22, cursor:'pointer', lineHeight:1, padding:0}}>×</button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:22}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]               = useState('dark');
  const [page, setPage]                 = useState('dashboard');
  const [services, setServices]         = useState(INIT_SERVICES);
  const [bookings, setBookings]         = useState(INIT_BOOKINGS);
  const [clients, setClients]           = useState(INIT_CLIENTS);
  const [stylists]                      = useState(INIT_STYLISTS);
  const [modal, setModal]               = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState({});
  const [search, setSearch]             = useState('');
  const [toast, setToast]               = useState(null);
  const [confirm, setConfirm]           = useState(null);
  const [bookingStep, setBookingStep]   = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');

  const C = themes[theme];

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;
  const closeModal = useCallback(() => {
    setModal(null); setEditTarget(null); setForm({}); setBookingStep(1);
  }, []);

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`"${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  const saveBooking = () => {
    if (!validate([['Cliente', form.client], ['Servicio', form.service], ['Hora', form.time]])) return;
    if (!editTarget) {
      setBookings(bb => [...bb, { ...form, id: nextId(bb), date: form.date || '2025-05-01', status:'confirmed', stylist: form.stylist || 'Ana' }]);
      showToast('✅ Reserva creada — confirmación enviada por WhatsApp');
    } else {
      setBookings(bb => bb.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
      showToast('Reserva actualizada');
    }
    closeModal();
  };

  const cancelBooking = id => setConfirm({
    msg: '¿Cancelar esta reserva?',
    onYes: () => {
      setBookings(bb => bb.map(b => b.id === id ? { ...b, status:'cancelled' } : b));
      showToast('Reserva cancelada — cliente notificado');
      setConfirm(null);
    }
  });

  const completeBooking = id => {
    setBookings(bb => bb.map(b => b.id === id ? { ...b, status:'done' } : b));
    showToast('Servicio completado');
  };

  const saveService = () => {
    if (!validate([['Nombre', form.name], ['Precio', form.price]])) return;
    const s = { ...form, duration: +form.duration || 30, price: +form.price || 0 };
    if (!editTarget) {
      setServices(ss => [...ss, { ...s, id: nextId(ss), color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') }]);
      showToast('Servicio agregado');
    } else {
      setServices(ss => ss.map(x => x.id === editTarget.id ? { ...x, ...s } : x));
      showToast('Servicio actualizado');
    }
    closeModal();
  };

  const delService = id => setConfirm({
    msg: '¿Eliminar este servicio?',
    onYes: () => {
      setServices(ss => ss.filter(x => x.id !== id));
      showToast('Servicio eliminado');
      setConfirm(null);
    }
  });

  const saveClient = () => {
    if (!validate([['Nombre', form.name]])) return;
    if (!editTarget) {
      setClients(cc => [...cc, { ...form, id: nextId(cc), visits:0, total:0, loyalty:'silver', lastVisit:'-' }]);
    } else {
      setClients(cc => cc.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
    }
    showToast(editTarget ? 'Cliente actualizado' : 'Cliente agregado');
    closeModal();
  };

  const exportCSV = (data, name) => {
    if (!data.length) { showToast('No hay datos', 'error'); return; }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${name}.csv descargado`);
  };

  const todayBookings = useMemo(() => bookings.filter(b => b.date === '2025-05-01'), [bookings]);
  const todayActive   = useMemo(() => todayBookings.filter(b => b.status !== 'cancelled'), [todayBookings]);
  const todayRevenue  = useMemo(() => todayActive.reduce((s, b) => {
    const svc = services.find(x => x.name === b.service);
    return s + (svc?.price || 0);
  }, 0), [todayActive, services]);
  const monthRevenue  = STATS_WEEK.reduce((s, d) => s + d.revenue, 0);

  const filteredBookings = useMemo(() => bookings.filter(b => {
    const q = search.toLowerCase();
    const matchQ = b.client.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || b.status === filterStatus;
    return matchQ && matchS;
  }), [bookings, search, filterStatus]);

  const nav = [
    { id:'dashboard', icon:'◉', label:'Inicio' },
    { id:'bookings',  icon:'◈', label:'Reservas' },
    { id:'calendar',  icon:'◎', label:'Calendario' },
    { id:'services',  icon:'✦', label:'Servicios' },
    { id:'clients',   icon:'◬', label:'Clientes' },
    { id:'team',      icon:'⬡', label:'Equipo' },
    { id:'analytics', icon:'⊞', label:'Reportes' },
  ];

  const S = {
    card:     { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:22 },
    input:    { background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 14px', fontSize:13, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' },
    label:    { fontSize:11, color:C.text3, fontWeight:600, display:'block', marginBottom:6, letterSpacing:'.5px', textTransform:'uppercase' },
    btnPri:   { background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', border:'none', borderRadius:100, padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
    btnGhost: { background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:100, padding:'10px 20px', fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnEdit:  { background:`${C.accent}25`, color:C.accent, border:'none', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
    btnDel:   { background:`${C.red}20`, color:C.red, border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="fade-in">
      <div style={{marginBottom:24}}>
        <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>
          Hola <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Salón Bella</span> ✨
        </div>
        <div style={{fontSize:13, color:C.text2}}>Jueves 1 Mayo · {todayActive.length} citas hoy · {fmt(todayRevenue)} esperados</div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KPI C={C} S={S} label="Citas hoy"        value={todayActive.length}                                       sub={`${todayBookings.filter(b => b.status === 'pending').length} pendientes`} color={C.accent}  icon="📅" trend={12} />
        <KPI C={C} S={S} label="Ingresos hoy"     value={fmt(todayRevenue)}                                        sub="Esperados"   color={C.accent3} icon="💰" trend={8} />
        <KPI C={C} S={S} label="Clientes totales" value={clients.length}                                           sub="Registrados" color={C.accent2} icon="👩" />
        <KPI C={C} S={S} label="Rating promedio"  value="4.9★"                                                     sub="156 reseñas" color="#fbbf24"   icon="⭐" trend={3} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14, marginBottom:14}}>
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div style={{fontSize:14, fontWeight:700}}>Ingresos esta semana</div>
            <div style={{fontSize:12, color:C.accent3, fontFamily:'monospace', fontWeight:700}}>{fmt(monthRevenue)}</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={STATS_WEEK}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.accent} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [fmt(v), 'Ingresos']} />
              <Area type="monotone" dataKey="revenue" stroke={C.accent} strokeWidth={2} fill="url(#ga)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Próximas citas</div>
          {todayActive.slice(0, 5).map(b => (
            <div key={b.id} style={{display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:18, background:`${C.accent}15`, width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>💆</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:600}}>{b.client}</div>
                <div style={{fontSize:11, color:C.text2}}>{b.time} · {b.service}</div>
              </div>
              <span style={{fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:10, background:statusC[b.status].bg, color:statusC[b.status].c, whiteSpace:'nowrap'}}>{statusC[b.status].l}</span>
            </div>
          ))}
          {todayActive.length === 0 && <div style={{fontSize:12, color:C.text2, textAlign:'center', padding:14}}>Sin citas hoy</div>}
        </div>
      </div>
      <div style={S.card}>
        <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Acciones rápidas</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10}}>
          {[
            { label:'+ Nueva reserva', action: () => { setPage('bookings'); setModal('booking'); setForm({}); setBookingStep(1); }, color:C.accent },
            { label:'+ Cliente',       action: () => { setPage('clients');  setModal('client');  setForm({}); },                    color:C.accent2 },
            { label:'+ Servicio',      action: () => { setPage('services'); setModal('service'); setForm({}); },                    color:C.accent3 },
            { label:'📊 Ver reportes', action: () => setPage('analytics'),                                                          color:'#fbbf24' },
          ].map(a => (
            <button
              key={a.label}
              onClick={a.action}
              style={{background:`${a.color}15`, color:a.color, border:`1px solid ${a.color}30`, borderRadius:10, padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'transform .15s'}}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Reservas</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredBookings, 'reservas')}>📥 Exportar</button>
          <button style={S.btnPri}   onClick={() => { setModal('booking'); setEditTarget(null); setForm({date:'2025-05-01', time:'10:00'}); setBookingStep(1); }}>+ Nueva reserva</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{filteredBookings.length} de {bookings.length} reservas</div>
      <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap'}}>
        <input style={{...S.input, maxWidth:280}} placeholder="🔍 Buscar cliente o servicio..." value={search} onChange={e => setSearch(e.target.value)} />
        {['all','confirmed','pending','cancelled','done'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{...S.btnGhost, background: filterStatus === s ? C.accent : 'transparent', color: filterStatus === s ? '#fff' : C.text2, border:`1px solid ${filterStatus === s ? C.accent : C.border}`, fontSize:12, padding:'8px 14px'}}
          >
            {s === 'all' ? 'Todas' : statusC[s]?.l || s}
          </button>
        ))}
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {filteredBookings.map(b => (
          <div key={b.id} style={{...S.card, padding:'18px 22px', display:'flex', alignItems:'center', gap:18, flexWrap:'wrap'}}>
            <div style={{textAlign:'center', minWidth:54}}>
              <div style={{fontSize:16, fontWeight:700, color:C.accent, fontFamily:'monospace'}}>{b.time}</div>
              <div style={{fontSize:10, color:C.text3}}>{b.date.slice(5)}</div>
            </div>
            <div style={{fontSize:28}}>💆</div>
            <div style={{flex:1, minWidth:160}}>
              <div style={{fontWeight:700, fontSize:14}}>{b.client}</div>
              <div style={{fontSize:12, color:C.text2, marginTop:2}}>{b.service} · {b.stylist} · 📞 {b.phone}</div>
              {b.notes && <div style={{fontSize:11, color:C.text3, marginTop:3, fontStyle:'italic'}}>"{b.notes}"</div>}
            </div>
            <span style={{fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:12, background:statusC[b.status].bg, color:statusC[b.status].c, whiteSpace:'nowrap'}}>{statusC[b.status].l}</span>
            {b.status === 'pending' && <button style={S.btnEdit} onClick={() => completeBooking(b.id)}>✓ Atender</button>}
            {b.status !== 'cancelled' && b.status !== 'done' && <button style={S.btnDel} onClick={() => cancelBooking(b.id)}>Cancelar</button>}
          </div>
        ))}
        {filteredBookings.length === 0 && <div style={{...S.card, textAlign:'center', color:C.text2}}>Ninguna reserva coincide con los filtros.</div>}
      </div>
    </div>
  );

  // Mayo 2025 — el día 1 cae en jueves (índice 4 con Dom=0).
  const renderCalendar = () => {
    const FIRST_DAY_OFFSET = 4; // jueves
    const DAYS_IN_MONTH    = 31;
    return (
      <div className="fade-in">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10}}>
          <div>
            <div style={{fontSize:22, fontWeight:700}}>Calendario</div>
            <div style={{fontSize:13, color:C.text2}}>Mayo 2025 · vista mensual</div>
          </div>
          <button style={S.btnPri} onClick={() => { setModal('booking'); setForm({date:'2025-05-01', time:'10:00'}); setBookingStep(1); }}>+ Nueva reserva</button>
        </div>
        <div style={S.card}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:1, background:C.border, borderRadius:12, overflow:'hidden'}}>
            {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
              <div key={d} style={{background:C.bg3, padding:'10px 0', textAlign:'center', fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.5px'}}>{d}</div>
            ))}
            {Array.from({ length: FIRST_DAY_OFFSET }, (_, i) => (
              <div key={`empty-${i}`} style={{background:C.bg2, minHeight:88}} />
            ))}
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
              const day = i + 1;
              const dateStr = `2025-05-${String(day).padStart(2, '0')}`;
              const dayBookings = bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
              const isToday = day === 1;
              return (
                <div
                  key={day}
                  style={{background:C.bg2, padding:10, minHeight:88, cursor:'pointer', transition:'background .15s'}}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = C.bg2}
                >
                  <div style={{width:24, height:24, borderRadius:8, background: isToday ? C.accent : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight: isToday ? 700 : 400, color: isToday ? '#000' : C.text, marginBottom:6}}>
                    {day}
                  </div>
                  {dayBookings.slice(0, 2).map(b => (
                    <div key={b.id} style={{fontSize:10, padding:'2px 6px', borderRadius:4, background:`${C.accent}25`, color:C.accent, marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                      {b.time} {b.client.split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length > 2 && <div style={{fontSize:10, color:C.text3}}>+{dayBookings.length - 2} más</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderServices = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Servicios</div>
        <button style={S.btnPri} onClick={() => { setModal('service'); setEditTarget(null); setForm({}); }}>+ Nuevo servicio</button>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{services.length} servicios disponibles</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:14}}>
        {services.map(s => (
          <div
            key={s.id}
            style={{...S.card, borderTop:`3px solid ${s.color}`, transition:'transform .2s'}}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{fontSize:11, color:C.text3, marginBottom:6, textTransform:'uppercase', letterSpacing:'.5px'}}>{s.category}</div>
            <div style={{fontSize:17, fontWeight:700, marginBottom:14}}>{s.name}</div>
            <div style={{display:'flex', gap:14, marginBottom:14}}>
              <div>
                <div style={{fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'.5px'}}>Precio</div>
                <div style={{fontSize:18, fontWeight:700, color:s.color, fontFamily:'monospace'}}>{fmt(s.price)}</div>
              </div>
              <div>
                <div style={{fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'.5px'}}>Duración</div>
                <div style={{fontSize:18, fontWeight:700, color:C.text}}>{s.duration} min</div>
              </div>
            </div>
            <div style={{display:'flex', gap:8, paddingTop:14, borderTop:`1px solid ${C.border}`}}>
              <button style={{...S.btnEdit, flex:1, fontSize:12}} onClick={() => { setModal('service'); setEditTarget(s); setForm({ ...s }); }}>✏️ Editar</button>
              <button style={S.btnDel} onClick={() => delService(s.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Clientes</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(clients, 'clientes')}>📥 Exportar</button>
          <button style={S.btnPri}   onClick={() => { setModal('client'); setEditTarget(null); setForm({}); }}>+ Nuevo cliente</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{clients.length} clientes registrados</div>
      <div style={S.card}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
            <thead>
              <tr>{['Cliente','Contacto','Visitas','Total gastado','Nivel','Última visita',''].map(h => (
                <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'10px 12px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .15s'}}>
                  <td style={{padding:'12px', fontWeight:600, fontSize:13}}>{c.name}</td>
                  <td style={{padding:'12px', fontSize:12, color:C.text2}}>
                    <div>📞 {c.phone}</div><div>✉ {c.email}</div>
                  </td>
                  <td style={{padding:'12px', fontFamily:'monospace', fontWeight:700, textAlign:'center'}}>{c.visits}</td>
                  <td style={{padding:'12px', fontFamily:'monospace', fontWeight:700, color:C.accent3}}>{fmt(c.total)}</td>
                  <td style={{padding:'12px'}}>
                    <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background:`${loyaltyInfo[c.loyalty].c}20`, color:loyaltyInfo[c.loyalty].c}}>
                      {loyaltyInfo[c.loyalty].icon} {loyaltyInfo[c.loyalty].l}
                    </span>
                  </td>
                  <td style={{padding:'12px', fontSize:12, color:C.text2, fontFamily:'monospace'}}>{c.lastVisit}</td>
                  <td style={{padding:'12px'}}>
                    <button style={S.btnEdit} onClick={() => { setModal('client'); setEditTarget(c); setForm({ ...c }); }}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Equipo</div>
        <button style={S.btnPri} onClick={() => showToast('Próximamente: agregar nuevo estilista')}>+ Agregar miembro</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:14}}>
        {stylists.map(s => (
          <div key={s.id}
            style={{...S.card, transition:'transform .2s'}}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:18}}>
              <div style={{width:60, height:60, borderRadius:18, background:`${s.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32}}>{s.avatar}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, fontSize:16}}>{s.name}</div>
                <div style={{fontSize:12, color:C.accent, marginTop:2}}>{s.specialty}</div>
                <div style={{fontSize:11, color:C.text3, marginTop:2}}>{s.email}</div>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              <div style={{background:C.bg3, borderRadius:10, padding:14, textAlign:'center'}}>
                <div style={{fontSize:22, fontWeight:700, color:s.color, fontFamily:'monospace'}}>{s.rating}★</div>
                <div style={{fontSize:11, color:C.text2, marginTop:3}}>Calificación</div>
              </div>
              <div style={{background:C.bg3, borderRadius:10, padding:14, textAlign:'center'}}>
                <div style={{fontSize:22, fontWeight:700, fontFamily:'monospace', color:C.accent3}}>{s.appts}</div>
                <div style={{fontSize:11, color:C.text2, marginTop:3}}>Citas totales</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => {
    const totalAppts = STATS_WEEK.reduce((s, d) => s + d.appts, 0);
    return (
      <div className="fade-in">
        <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>Reportes</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Análisis del rendimiento del negocio</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
          <KPI C={C} S={S} label="Ingresos semana"  value={fmt(monthRevenue)}                                  sub="7 días"        color={C.accent3} icon="💰" trend={18} />
          <KPI C={C} S={S} label="Citas semana"     value={totalAppts}                                          sub="Atendidas"     color={C.accent}  icon="📅" trend={12} />
          <KPI C={C} S={S} label="Ticket promedio"  value={fmt(Math.round(monthRevenue / Math.max(totalAppts, 1)))} sub="Por cita"   color={C.accent2} icon="💳" />
          <KPI C={C} S={S} label="Ocupación"        value="78%"                                                 sub="Esta semana"   color="#fbbf24"   icon="📊" trend={5} />
        </div>
        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14, marginBottom:14}}>
          <div style={S.card}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Ingresos por día</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={STATS_WEEK}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="day" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [fmt(v), 'Ingresos']} />
                <Bar dataKey="revenue" fill={C.accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={S.card}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Distribución servicios</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={SERVICE_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {SERVICE_DIST.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
                <Legend wrapperStyle={{fontSize:11}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const pageRender = {
    dashboard: renderDashboard,
    bookings:  renderBookings,
    calendar:  renderCalendar,
    services:  renderServices,
    clients:   renderClients,
    team:      renderTeam,
    analytics: renderAnalytics,
  }[page] || renderDashboard;

  // ─── BOOKING WIZARD ───────────────────────────────────────────────
  const totalSteps = 3;
  const wizardSave = bookingStep < totalSteps
    ? () => {
        if (bookingStep === 1 && !form.service) { showToast('Selecciona un servicio', 'error'); return; }
        if (bookingStep === 2 && !form.time)    { showToast('Selecciona una hora',    'error'); return; }
        setBookingStep(s => s + 1);
      }
    : saveBooking;

  return (
    <div style={{position:'relative', minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:C.text, fontSize:14}}>

      {/* MODAL: BOOKING WIZARD */}
      {modal === 'booking' && (
        <Modal title={`Nueva reserva — Paso ${bookingStep}/${totalSteps}`} onSave={wizardSave} onClose={closeModal} C={C} S={S}>
          {bookingStep === 1 && (
            <div>
              <div style={{fontSize:13, color:C.text2, marginBottom:14}}>Selecciona el servicio:</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10}}>
                {services.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setForm(f => ({ ...f, service: s.name }))}
                    style={{border:`2px solid ${form.service === s.name ? s.color : C.border}`, borderRadius:12, padding:14, cursor:'pointer', transition:'all .2s', background: form.service === s.name ? `${s.color}15` : 'transparent'}}
                  >
                    <div style={{fontSize:13, fontWeight:600, marginBottom:4}}>{s.name}</div>
                    <div style={{fontSize:12, color:C.text2}}>{s.duration}min · {fmt(s.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {bookingStep === 2 && (
            <div>
              <div style={{fontSize:13, color:C.text2, marginBottom:14}}>Selecciona el horario:</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px, 1fr))', gap:8}}>
                {HOURS.map(h => (
                  <div
                    key={h}
                    onClick={() => setForm(f => ({ ...f, time: h }))}
                    style={{border:`2px solid ${form.time === h ? C.accent : C.border}`, borderRadius:8, padding:'10px', fontSize:13, cursor:'pointer', background: form.time === h ? `${C.accent}15` : 'transparent', color: form.time === h ? C.accent : C.text2, fontWeight: form.time === h ? 600 : 400, textAlign:'center'}}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}
          {bookingStep === 3 && (
            <div>
              <div style={{fontSize:13, color:C.text2, marginBottom:14}}>Datos del cliente:</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14}}>
                <div><label style={S.label}>Nombre *</label><input style={S.input} value={form.client||''} onChange={fv('client')} placeholder="María López" autoComplete="off" /></div>
                <div><label style={S.label}>Teléfono *</label><input style={S.input} value={form.phone||''}  onChange={fv('phone')}  placeholder="310-000-0000" autoComplete="off" /></div>
                <div><label style={S.label}>Email</label><input style={S.input} value={form.email||''} onChange={fv('email')} placeholder="email@ejemplo.com" autoComplete="off" type="email" /></div>
                <div><label style={S.label}>Estilista</label>
                  <select style={S.input} value={form.stylist||''} onChange={fv('stylist')}>
                    <option value="">Sin preferencia</option>
                    {stylists.map(s => <option key={s.id} value={s.name.split(' ')[0]}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <label style={S.label}>Notas</label>
                  <textarea style={{...S.input, height:60, resize:'none'}} value={form.notes||''} onChange={fv('notes')} placeholder="Preferencias, observaciones..." />
                </div>
              </div>
              <div style={{background:C.bg3, borderRadius:12, padding:16}}>
                <div style={{fontSize:13, fontWeight:600, marginBottom:8}}>Resumen</div>
                <div style={{fontSize:13, color:C.text2}}>Servicio: <span style={{color:C.text}}>{form.service}</span></div>
                <div style={{fontSize:13, color:C.text2}}>Horario: <span style={{color:C.text}}>1 Mayo · {form.time}</span></div>
                <div style={{fontSize:13, color:C.text2}}>Total: <span style={{color:C.accent3, fontWeight:700}}>{fmt(services.find(s => s.name === form.service)?.price || 0)}</span></div>
              </div>
            </div>
          )}
          <div style={{display:'flex', gap:8, marginTop:18, justifyContent:'space-between'}}>
            {bookingStep > 1 ? <button style={S.btnGhost} onClick={() => setBookingStep(s => s - 1)}>← Atrás</button> : <div />}
            <div style={{fontSize:11, color:C.text3, alignSelf:'center'}}>Paso {bookingStep} de {totalSteps}</div>
          </div>
        </Modal>
      )}

      {/* MODAL: SERVICE */}
      {modal === 'service' && (
        <Modal title={editTarget ? 'Editar servicio' : 'Nuevo servicio'} onSave={saveService} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Corte de cabello" autoComplete="off" /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.category||''} onChange={fv('category')}>
                <option value="">Seleccionar...</option>
                <option>Cabello</option><option>Uñas</option><option>Estética</option><option>Otro</option>
              </select>
            </div>
            <div><label style={S.label}>Duración (min)</label><input style={S.input} type="number" min="0" value={form.duration||''} onChange={fv('duration')} placeholder="45" /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Precio (COP) *</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="35000" /></div>
          </div>
        </Modal>
      )}

      {/* MODAL: CLIENT */}
      {modal === 'client' && (
        <Modal title={editTarget ? 'Editar cliente' : 'Nuevo cliente'} onSave={saveClient} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="María López" autoComplete="off" /></div>
            <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" /></div>
            <div><label style={S.label}>Email</label><input style={S.input} value={form.email||''} onChange={fv('email')} type="email" autoComplete="off" /></div>
          </div>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{...S.card, maxWidth:380, textAlign:'center'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:36, marginBottom:14}}>⚠️</div>
            <div style={{fontSize:15, fontWeight:600, marginBottom:20}}>{confirm.msg}</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red}} onClick={confirm.onYes}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent3, color:'#fff', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:1001, boxShadow:'0 8px 24px rgba(0,0,0,.4)', display:'flex', alignItems:'center', gap:10}}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'210px 1fr'}}>
        {/* SIDEBAR */}
        <div style={{background:C.bg2, borderRight:`1px solid ${C.border}`, minHeight:'100vh', padding:'22px 0', display:'flex', flexDirection:'column', position:'sticky', top:0}}>
          <div style={{padding:'0 18px 22px', borderBottom:`1px solid ${C.border}`, marginBottom:14}}>
            <div style={{fontSize:18, fontWeight:700}}>Agenda<span style={{color:C.accent}}>Pro</span></div>
            <div style={{fontSize:11, color:C.text2, marginTop:2}}>Salón Bella ✨</div>
          </div>
          {nav.map(n => (
            <div key={n.id}
              onClick={() => setPage(n.id)}
              role="button" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPage(n.id); } }}
              style={{display:'flex', alignItems:'center', gap:10, padding:'10px 18px', cursor:'pointer', fontSize:13, background: page === n.id ? `${C.accent}14` : 'transparent', color: page === n.id ? C.accent : C.text2, fontWeight: page === n.id ? 600 : 400, margin:'1px 0', transition:'all .15s', userSelect:'none'}}>
              <span>{n.icon}</span>{n.label}
            </div>
          ))}
          <div style={{marginTop:'auto', padding:'18px', borderTop:`1px solid ${C.border}`}}>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{...S.btnGhost, fontSize:12, padding:'7px 14px', width:'100%'}}>
              {theme === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro'}
            </button>
          </div>
        </div>
        <div style={{padding:'24px 30px', overflowY:'auto'}}>{pageRender()}</div>
      </div>
    </div>
  );
}
