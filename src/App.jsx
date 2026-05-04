import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
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
  { id:1, client:'María López',    service:'Corte de cabello', date:'2026-05-04', time:'09:00', stylist:'Ana',   status:'confirmed', phone:'310-111-2222', email:'maria@email.com',     notes:'Cliente frecuente' },
  { id:2, client:'Sofía García',   service:'Tinte completo',   date:'2026-05-04', time:'10:00', stylist:'Luisa', status:'confirmed', phone:'310-333-4444', email:'sofia@email.com',     notes:'Color rubio platino' },
  { id:3, client:'Patricia Ruiz',  service:'Manicure',         date:'2026-05-04', time:'12:00', stylist:'Ana',   status:'pending',   phone:'310-555-6666', email:'patricia@email.com',  notes:'' },
  { id:4, client:'Carmen Torres',  service:'Pedicure',         date:'2026-05-04', time:'14:00', stylist:'Luisa', status:'pending',   phone:'310-777-8888', email:'carmen@email.com',    notes:'Diseño francés' },
  { id:5, client:'Valentina Cruz', service:'Cejas y pestañas', date:'2026-05-05', time:'09:30', stylist:'Ana',   status:'confirmed', phone:'310-999-0000', email:'valentina@email.com', notes:'' },
  { id:6, client:'Isabella Mora',  service:'Corte de cabello', date:'2026-05-05', time:'11:00', stylist:'Luisa', status:'cancelled', phone:'310-121-2121', email:'isabella@email.com',  notes:'Canceló por enfermedad' },
];

const INIT_CLIENTS = [
  { id:1, name:'María López',    phone:'310-111-2222', email:'maria@email.com',     visits:18, total:850000,  loyalty:'gold',     lastVisit:'2026-04-15' },
  { id:2, name:'Sofía García',   phone:'310-333-4444', email:'sofia@email.com',     visits:12, total:1200000, loyalty:'platinum', lastVisit:'2026-04-20' },
  { id:3, name:'Patricia Ruiz',  phone:'310-555-6666', email:'patricia@email.com',  visits:5,  total:175000,  loyalty:'silver',   lastVisit:'2026-04-10' },
  { id:4, name:'Carmen Torres',  phone:'310-777-8888', email:'carmen@email.com',    visits:8,  total:380000,  loyalty:'gold',     lastVisit:'2026-04-25' },
  { id:5, name:'Valentina Cruz', phone:'310-999-0000', email:'valentina@email.com', visits:3,  total:120000,  loyalty:'silver',   lastVisit:'2026-04-05' },
];

const INIT_STYLISTS = [
  { id:1, name:'Ana Martínez',    specialty:'Colorimetría',      rating:4.9, appts:186, color:'#f59e0b', email:'ana@bella.co' },
  { id:2, name:'Luisa Fernández', specialty:'Corte & Estilo',    rating:4.8, appts:142, color:'#ec4899', email:'luisa@bella.co' },
  { id:3, name:'Camila Restrepo', specialty:'Estética avanzada', rating:5.0, appts:98,  color:'#8b5cf6', email:'camila@bella.co' },
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

// PALETTE: glassmorphism púrpura/rosa neón sobre fondos oscuros translúcidos
const themes = {
  dark: {
    bg:        '#0a0418',
    bg2:       'rgba(30, 14, 60, .6)',     // glass
    bg3:       'rgba(255, 255, 255, .04)', // glass más sutil
    bgSolid:   '#1a0e3c',
    accent:    '#c084fc',
    accent2:   '#f472b6',
    accent3:   '#34d399',
    glow:      '#a855f7',
    text:      '#f8f4ff',
    text2:     '#bfa8e6',
    text3:     '#7e6da3',
    border:    'rgba(192, 132, 252, .15)',
    borderSolid: 'rgba(192, 132, 252, .25)',
    red:       '#fb7185',
  },
  light: {
    bg:        '#faf7ff',
    bg2:       'rgba(255, 255, 255, .65)',
    bg3:       'rgba(192, 132, 252, .06)',
    bgSolid:   '#ffffff',
    accent:    '#7c3aed',
    accent2:   '#db2777',
    accent3:   '#059669',
    glow:      '#a855f7',
    text:      '#1e1233',
    text2:     '#6b5b8b',
    text3:     '#9c8bb8',
    border:    'rgba(124, 58, 237, .12)',
    borderSolid: 'rgba(124, 58, 237, .2)',
    red:       '#e11d48',
  },
};

const statusC = {
  confirmed: { l:'Confirmada', bg:'rgba(52,211,153,.15)',  c:'#10b981' },
  pending:   { l:'Pendiente',  bg:'rgba(251,191,36,.15)',  c:'#f59e0b' },
  cancelled: { l:'Cancelada',  bg:'rgba(248,113,113,.15)', c:'#ef4444' },
  done:      { l:'Completada', bg:'rgba(124,58,237,.15)',  c:'#7c3aed' },
};

const loyaltyInfo = {
  silver:   { l:'Plata',   c:'#94a3b8', bg:'rgba(148,163,184,.15)' },
  gold:     { l:'Oro',     c:'#f59e0b', bg:'rgba(245,158,11,.15)' },
  platinum: { l:'Platino', c:'#c084fc', bg:'rgba(192,132,252,.15)' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');

// ─── SVG ICONS ──────────────────────────────────────────────────────
const Icon = {
  pencil: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  arrowLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,

  // Nav icons (línea elegante, no emojis)
  home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  bookmark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sparkle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/></svg>,
  users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  team: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>,
  chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  clock: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  dollar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────

function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(10, 4, 24, .7)', backdropFilter:'blur(12px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{
          background: C.bgSolid,
          border:`1px solid ${C.borderSolid}`,
          borderRadius:24, padding:30, width:'100%',
          maxWidth: size==='lg' ? 720 : 540,
          boxShadow:'0 30px 100px rgba(168, 85, 247, .25), 0 0 0 1px rgba(255,255,255,.05)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
          <h2 style={{fontSize:20, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'rgba(255,255,255,.06)', border:'none', color:C.text2, width:36, height:36, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
            {Icon.close()}
          </button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:26}}>
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
      setBookings(bb => [...bb, { ...form, id: nextId(bb), date: form.date || '2026-05-04', status:'confirmed', stylist: form.stylist || 'Ana' }]);
      showToast('Reserva creada — confirmación enviada por WhatsApp');
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
    onYes: () => { setServices(ss => ss.filter(x => x.id !== id)); showToast('Servicio eliminado'); setConfirm(null); }
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

  const todayBookings = useMemo(() => bookings.filter(b => b.date === '2026-05-04'), [bookings]);
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
    { id:'dashboard', icon: Icon.home,     label:'Inicio' },
    { id:'bookings',  icon: Icon.bookmark, label:'Reservas' },
    { id:'calendar',  icon: Icon.calendar, label:'Calendario' },
    { id:'services',  icon: Icon.sparkle,  label:'Servicios' },
    { id:'clients',   icon: Icon.users,    label:'Clientes' },
    { id:'team',      icon: Icon.team,     label:'Equipo' },
    { id:'analytics', icon: Icon.chart,    label:'Reportes' },
  ];

  // ESTILOS — todo con tema "glassmorphism" con backdrop-filter
  const S = {
    glass: {
      background: C.bg2,
      backdropFilter:'blur(20px)',
      WebkitBackdropFilter:'blur(20px)',
      border:`1px solid ${C.border}`,
      borderRadius:24,
      padding:24,
    },
    glassSoft: {
      background: C.bg3,
      backdropFilter:'blur(12px)',
      border:`1px solid ${C.border}`,
      borderRadius:18,
      padding:18,
    },
    input: {
      background: C.bg3,
      border:`1px solid ${C.borderSolid}`,
      borderRadius:14,
      padding:'12px 16px',
      fontSize:14, color:C.text,
      outline:'none', fontFamily:'inherit',
      width:'100%', boxSizing:'border-box',
      transition:'all .2s',
    },
    label:    { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:8, letterSpacing:'.4px', textTransform:'uppercase' },
    btnPri:   { background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color:'#fff', border:'none', borderRadius:100, padding:'12px 26px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 8px 24px rgba(168, 85, 247, .3)', transition:'transform .15s, box-shadow .2s' },
    btnGhost: { background:'rgba(255,255,255,.04)', color:C.text2, border:`1px solid ${C.border}`, borderRadius:100, padding:'12px 22px', fontSize:14, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6 },
    btnIcon:  { background:'rgba(255,255,255,.05)', color:C.text2, border:`1px solid ${C.border}`, borderRadius:12, width:36, height:36, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'all .15s' },
  };

  const focusH = {
    onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
    onBlur:  e => { e.target.style.borderColor = C.borderSolid; e.target.style.boxShadow = 'none'; },
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
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
          <button style={{...S.btnPri, background:'#fff', color:C.accent, boxShadow:'0 6px 20px rgba(0,0,0,.15)'}} onClick={() => { setPage('bookings'); setModal('booking'); setForm({}); setBookingStep(1); }}>
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
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:16}}>
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
            { label:'Nueva reserva', sub:'Agendar cliente',    color:C.accent,  action: () => { setPage('bookings'); setModal('booking'); setForm({}); setBookingStep(1); } },
            { label:'Cliente nuevo', sub:'Agregar al CRM',     color:C.accent2, action: () => { setPage('clients');  setModal('client');  setForm({}); } },
            { label:'Servicio',      sub:'Agregar al catalogo', color:C.accent3, action: () => { setPage('services'); setModal('service'); setForm({}); } },
            { label:'Ver reportes',  sub:'Análisis y stats',   color:'#fbbf24', action: () => setPage('analytics') },
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

  const renderBookings = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Reservas</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{filteredBookings.length} de {bookings.length} reservas</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredBookings, 'reservas')}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={() => { setModal('booking'); setEditTarget(null); setForm({date:'2026-05-04', time:'10:00'}); setBookingStep(1); }}>
            <Icon.plus /> Nueva reserva
          </button>
        </div>
      </div>
      <div style={{display:'flex', gap:10, margin:'24px 0 18px', flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:380}}>
          <span style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:38}} placeholder="Buscar cliente o servicio..." value={search} onChange={e => setSearch(e.target.value)} {...focusH} />
        </div>
        {['all','confirmed','pending','cancelled','done'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              background: filterStatus === s ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : 'rgba(255,255,255,.04)',
              color:      filterStatus === s ? '#fff' : C.text2,
              border:     `1px solid ${filterStatus === s ? 'transparent' : C.border}`,
              borderRadius:100, padding:'10px 18px', fontSize:13, fontWeight:600,
              cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
            }}
          >
            {s === 'all' ? 'Todas' : statusC[s]?.l || s}
          </button>
        ))}
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {filteredBookings.map(b => (
          <div key={b.id} style={{...S.glass, padding:'18px 22px', display:'flex', alignItems:'center', gap:18, flexWrap:'wrap'}}>
            <div style={{textAlign:'center', minWidth:60}}>
              <div style={{fontSize:18, fontWeight:800, color:C.accent, fontFamily:'monospace', letterSpacing:'-.5px'}}>{b.time}</div>
              <div style={{fontSize:10, color:C.text3, fontFamily:'monospace', marginTop:2}}>{b.date.slice(5)}</div>
            </div>
            <div style={{
              width:46, height:46, borderRadius:14,
              background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
              color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:15, flexShrink:0,
            }}>
              {b.client.split(' ').map(p => p[0]).slice(0,2).join('')}
            </div>
            <div style={{flex:1, minWidth:160}}>
              <div style={{fontWeight:700, fontSize:15, color:C.text}}>{b.client}</div>
              <div style={{fontSize:13, color:C.text2, marginTop:3, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
                <span>{b.service}</span>
                <span style={{color:C.text3}}>·</span>
                <span>{b.stylist}</span>
                <span style={{color:C.text3}}>·</span>
                <span style={{display:'inline-flex', alignItems:'center', gap:4}}>{Icon.phone()} {b.phone}</span>
              </div>
              {b.notes && <div style={{fontSize:12, color:C.text3, marginTop:5, fontStyle:'italic'}}>"{b.notes}"</div>}
            </div>
            <span style={{fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:100, background:statusC[b.status].bg, color:statusC[b.status].c, whiteSpace:'nowrap'}}>{statusC[b.status].l}</span>
            {b.status === 'pending' && <button style={{...S.btnGhost, color:C.accent3, border:`1px solid ${C.accent3}30`, background:`${C.accent3}10`}} onClick={() => completeBooking(b.id)}><Icon.check /> Atender</button>}
            {b.status !== 'cancelled' && b.status !== 'done' && <button style={{...S.btnGhost, color:C.red, border:`1px solid ${C.red}30`, background:`${C.red}10`}} onClick={() => cancelBooking(b.id)}>Cancelar</button>}
          </div>
        ))}
        {filteredBookings.length === 0 && <div style={{...S.glass, textAlign:'center', color:C.text2, padding:36}}>Ninguna reserva coincide con los filtros.</div>}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const today = new Date();
    const yr = today.getFullYear();
    const mo = today.getMonth(); // 0-indexed
    const FIRST_DAY_OFFSET = new Date(yr, mo, 1).getDay(); // 0=Dom, 6=Sáb
    const DAYS_IN_MONTH   = new Date(yr, mo + 1, 0).getDate();
    const monthName = today.toLocaleDateString('es-CO', { month: 'long' });
    const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const monthPad = String(mo + 1).padStart(2, '0');
    return (
      <div className="fade-in">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:14}}>
          <div>
            <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Calendario</h1>
            <div style={{fontSize:14, color:C.text2, marginTop:6}}>{monthLabel} {yr} · vista mensual</div>
          </div>
          <button style={S.btnPri} onClick={() => { setModal('booking'); setForm({date:`${yr}-${monthPad}-${String(today.getDate()).padStart(2,'0')}`, time:'10:00'}); setBookingStep(1); }}>
            <Icon.plus /> Nueva reserva
          </button>
        </div>
        <div style={S.glass}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6}}>
            {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
              <div key={d} style={{padding:'8px 0 12px', textAlign:'center', fontSize:11, color:C.text2, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase'}}>{d}</div>
            ))}
            {Array.from({length: FIRST_DAY_OFFSET}, (_, i) => (
              <div key={`empty-${i}`} style={{minHeight:90}} />
            ))}
            {Array.from({length: DAYS_IN_MONTH}, (_, i) => {
              const day = i + 1;
              const dateStr = `${yr}-${monthPad}-${String(day).padStart(2, '0')}`;
              const dayBookings = bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
              const isToday = day === today.getDate();
              return (
                <div
                  key={day}
                  style={{
                    background: isToday ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : C.bg3,
                    color: isToday ? '#fff' : C.text,
                    borderRadius:14, padding:10, minHeight:90,
                    cursor:'pointer', transition:'transform .15s',
                    border:`1px solid ${isToday ? 'transparent' : C.border}`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{fontSize:14, fontWeight:isToday?800:600, marginBottom:6}}>{day}</div>
                  {dayBookings.slice(0, 2).map(b => (
                    <div key={b.id} style={{
                      fontSize:10, padding:'2px 6px', borderRadius:6,
                      background: isToday ? 'rgba(255,255,255,.25)' : `${C.accent}15`,
                      color: isToday ? '#fff' : C.accent,
                      marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                    }}>
                      {b.time} {b.client.split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length > 2 && <div style={{fontSize:9, color: isToday ? 'rgba(255,255,255,.7)' : C.text3}}>+{dayBookings.length - 2} más</div>}
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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Servicios</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{services.length} servicios disponibles</div>
        </div>
        <button style={S.btnPri} onClick={() => { setModal('service'); setEditTarget(null); setForm({}); }}>
          <Icon.plus /> Nuevo servicio
        </button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16, marginTop:24}}>
        {services.map(s => (
          <div key={s.id} style={{
            ...S.glass,
            position:'relative',
            transition:'transform .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{position:'absolute', top:0, left:0, right:0, height:5, background:s.color, borderRadius:'24px 24px 0 0'}} />
            <div style={{fontSize:11, color:C.text3, marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px', fontWeight:600, marginTop:6}}>{s.category}</div>
            <h3 style={{fontSize:18, fontWeight:700, margin:'0 0 16px', letterSpacing:'-.3px', color:C.text}}>{s.name}</h3>
            <div style={{display:'flex', gap:18, marginBottom:18}}>
              <div>
                <div style={{fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3}}>Precio</div>
                <div style={{fontSize:22, fontWeight:800, color:s.color, fontFamily:'monospace', letterSpacing:'-.5px'}}>{fmt(s.price)}</div>
              </div>
              <div>
                <div style={{fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3}}>Duración</div>
                <div style={{fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-.5px', display:'flex', alignItems:'center', gap:6}}>
                  {s.duration}<span style={{fontSize:13, color:C.text2}}>min</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex', gap:8, paddingTop:14, borderTop:`1px solid ${C.border}`}}>
              <button style={{...S.btnGhost, flex:1, justifyContent:'center', background:`${C.accent}10`, color:C.accent, border:`1px solid ${C.accent}30`}} onClick={() => { setModal('service'); setEditTarget(s); setForm({ ...s }); }}>
                <Icon.pencil /> Editar
              </button>
              <button style={{...S.btnGhost, background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`}} onClick={() => delService(s.id)}>
                <Icon.trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Clientes</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{clients.length} clientes registrados</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={() => exportCSV(clients, 'clientes')}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={() => { setModal('client'); setEditTarget(null); setForm({}); }}>
            <Icon.plus /> Nuevo cliente
          </button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16, marginTop:24}}>
        {clients.map(c => (
          <div key={c.id} style={S.glass}>
            <div style={{display:'flex', alignItems:'flex-start', gap:14, marginBottom:14}}>
              <div style={{
                width:54, height:54, borderRadius:18,
                background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
                color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:18, flexShrink:0,
              }}>
                {c.name.split(' ').map(p => p[0]).slice(0,2).join('')}
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:16, fontWeight:700, color:C.text, letterSpacing:'-.2px'}}>{c.name}</div>
                <div style={{display:'flex', gap:6, alignItems:'center', marginTop:6, flexWrap:'wrap'}}>
                  <span style={{fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100, background:loyaltyInfo[c.loyalty].bg, color:loyaltyInfo[c.loyalty].c, display:'inline-flex', alignItems:'center', gap:4}}>
                    {Icon.star()} {loyaltyInfo[c.loyalty].l}
                  </span>
                </div>
              </div>
              <button style={S.btnIcon} onClick={() => { setModal('client'); setEditTarget(c); setForm({ ...c }); }} aria-label="Editar">
                <Icon.pencil />
              </button>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:6, paddingBottom:14, borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:8}}>
                <span style={{color:C.text3}}>{Icon.phone()}</span>{c.phone}
              </div>
              <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:8}}>
                <span style={{color:C.text3}}>{Icon.mail()}</span>{c.email}
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14}}>
              <div>
                <div style={{fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3}}>Visitas</div>
                <div style={{fontSize:20, fontWeight:800, color:C.text, fontFamily:'monospace'}}>{c.visits}</div>
              </div>
              <div>
                <div style={{fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3}}>Total</div>
                <div style={{fontSize:20, fontWeight:800, color:C.accent3, fontFamily:'monospace'}}>{fmt(c.total)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Equipo</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{stylists.length} estilistas activas</div>
        </div>
        <button style={S.btnPri} onClick={() => showToast('Próximamente: agregar nuevo estilista')}>
          <Icon.plus /> Agregar miembro
        </button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:16}}>
        {stylists.map(s => (
          <div key={s.id} style={S.glass}>
            <div style={{textAlign:'center', marginBottom:16}}>
              <div style={{
                width:88, height:88, borderRadius:'50%',
                background:`linear-gradient(135deg, ${s.color}, ${C.accent2})`,
                color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:32, margin:'0 auto 14px',
                boxShadow:'0 8px 24px rgba(0,0,0,.15)',
              }}>
                {s.name.split(' ').map(p => p[0]).slice(0,2).join('')}
              </div>
              <h3 style={{fontSize:18, fontWeight:700, margin:'0 0 4px', color:C.text, letterSpacing:'-.2px'}}>{s.name}</h3>
              <div style={{fontSize:12, color:s.color, fontWeight:600}}>{s.specialty}</div>
              <div style={{fontSize:11, color:C.text3, marginTop:3}}>{s.email}</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              <div style={{...S.glassSoft, textAlign:'center'}}>
                <div style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:22, fontWeight:800, color:'#fbbf24', fontFamily:'monospace'}}>
                  {s.rating} <Icon.star />
                </div>
                <div style={{fontSize:11, color:C.text2, marginTop:3}}>Calificación</div>
              </div>
              <div style={{...S.glassSoft, textAlign:'center'}}>
                <div style={{fontSize:22, fontWeight:800, color:C.accent3, fontFamily:'monospace'}}>{s.appts}</div>
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
        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:16}}>
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

  // Booking wizard logic
  const totalSteps = 3;
  const wizardSave = bookingStep < totalSteps
    ? () => {
        if (bookingStep === 1 && !form.service) { showToast('Selecciona un servicio', 'error'); return; }
        if (bookingStep === 2 && !form.time)    { showToast('Selecciona una hora',    'error'); return; }
        setBookingStep(s => s + 1);
      }
    : saveBooking;

  return (
    <div style={{
      minHeight:'100vh',
      background: theme === 'dark'
        ? `radial-gradient(circle at 0% 0%, rgba(168, 85, 247, .15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(244, 114, 182, .12), transparent 50%), ${C.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(124, 58, 237, .08), transparent 50%), radial-gradient(circle at 100% 100%, rgba(219, 39, 119, .06), transparent 50%), ${C.bg}`,
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      color:C.text, fontSize:14,
      display:'grid', gridTemplateColumns:'78px 1fr',
    }}>

      {/* MODALS — booking wizard */}
      {modal === 'booking' && (
        <Modal title={`Nueva reserva · Paso ${bookingStep}/${totalSteps}`} onSave={wizardSave} onClose={closeModal} C={C} S={S}>
          {/* Progress bar */}
          <div style={{display:'flex', gap:6, marginBottom:24}}>
            {[1,2,3].map(s => (
              <div key={s} style={{flex:1, height:5, borderRadius:3, background: s <= bookingStep ? `linear-gradient(90deg, ${C.accent}, ${C.accent2})` : C.bg3, transition:'all .3s'}} />
            ))}
          </div>
          {bookingStep === 1 && (
            <div>
              <div style={{fontSize:14, color:C.text2, marginBottom:14, fontWeight:500}}>Selecciona el servicio:</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10}}>
                {services.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setForm(f => ({ ...f, service: s.name }))}
                    style={{
                      border:`2px solid ${form.service === s.name ? s.color : C.border}`,
                      borderRadius:14, padding:16, cursor:'pointer',
                      transition:'all .2s',
                      background: form.service === s.name ? `${s.color}15` : 'transparent',
                    }}
                  >
                    <div style={{fontSize:14, fontWeight:700, marginBottom:6, color:C.text}}>{s.name}</div>
                    <div style={{fontSize:12, color:C.text2}}>{s.duration}min · {fmt(s.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {bookingStep === 2 && (
            <div>
              <div style={{fontSize:14, color:C.text2, marginBottom:14, fontWeight:500}}>Selecciona el horario:</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px, 1fr))', gap:8}}>
                {HOURS.map(h => (
                  <div
                    key={h}
                    onClick={() => setForm(f => ({ ...f, time: h }))}
                    style={{
                      border:`2px solid ${form.time === h ? C.accent : C.border}`,
                      borderRadius:12, padding:'12px', fontSize:13, cursor:'pointer',
                      background: form.time === h ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : 'transparent',
                      color: form.time === h ? '#fff' : C.text2,
                      fontWeight: form.time === h ? 700 : 500, textAlign:'center',
                      transition:'all .15s',
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}
          {bookingStep === 3 && (
            <div>
              <div style={{fontSize:14, color:C.text2, marginBottom:14, fontWeight:500}}>Datos del cliente:</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
                <div><label style={S.label}>Nombre *</label><input style={S.input} value={form.client||''} onChange={fv('client')} placeholder="María López" autoComplete="off" {...focusH} /></div>
                <div><label style={S.label}>Teléfono *</label><input style={S.input} value={form.phone||''}  onChange={fv('phone')}  placeholder="310-000-0000" autoComplete="off" {...focusH} /></div>
                <div><label style={S.label}>Email</label><input style={S.input} value={form.email||''} onChange={fv('email')} placeholder="email@ejemplo.com" autoComplete="off" type="email" {...focusH} /></div>
                <div><label style={S.label}>Estilista</label>
                  <select style={S.input} value={form.stylist||''} onChange={fv('stylist')} {...focusH}>
                    <option value="">Sin preferencia</option>
                    {stylists.map(s => <option key={s.id} value={s.name.split(' ')[0]}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <label style={S.label}>Notas</label>
                  <textarea style={{...S.input, height:60, resize:'none'}} value={form.notes||''} onChange={fv('notes')} placeholder="Preferencias, observaciones..." {...focusH} />
                </div>
              </div>
              <div style={{...S.glassSoft, padding:16}}>
                <div style={{fontSize:12, color:C.text3, fontWeight:700, marginBottom:8, letterSpacing:'.4px', textTransform:'uppercase'}}>Resumen</div>
                <div style={{fontSize:13, color:C.text2, marginBottom:4}}>Servicio: <span style={{color:C.text, fontWeight:600}}>{form.service}</span></div>
                <div style={{fontSize:13, color:C.text2, marginBottom:4}}>Horario: <span style={{color:C.text, fontWeight:600}}>4 Mayo · {form.time}</span></div>
                <div style={{fontSize:13, color:C.text2}}>Total: <span style={{color:C.accent3, fontWeight:800, fontSize:15}}>{fmt(services.find(s => s.name === form.service)?.price || 0)}</span></div>
              </div>
            </div>
          )}
          <div style={{display:'flex', gap:8, marginTop:18, justifyContent:'space-between'}}>
            {bookingStep > 1
              ? <button style={S.btnGhost} onClick={() => setBookingStep(s => s - 1)}><Icon.arrowLeft /> Atrás</button>
              : <div />
            }
            <div style={{fontSize:11, color:C.text3, alignSelf:'center', fontWeight:600, letterSpacing:'.3px'}}>PASO {bookingStep} DE {totalSteps}</div>
          </div>
        </Modal>
      )}

      {modal === 'service' && (
        <Modal title={editTarget ? 'Editar servicio' : 'Nuevo servicio'} onSave={saveService} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Corte de cabello" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.category||''} onChange={fv('category')} {...focusH}>
                <option value="">Seleccionar...</option>
                <option>Cabello</option><option>Uñas</option><option>Estética</option><option>Otro</option>
              </select>
            </div>
            <div><label style={S.label}>Duración (min)</label><input style={S.input} type="number" min="0" value={form.duration||''} onChange={fv('duration')} placeholder="45" {...focusH} /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Precio (COP) *</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="35000" {...focusH} /></div>
          </div>
        </Modal>
      )}

      {modal === 'client' && (
        <Modal title={editTarget ? 'Editar cliente' : 'Nuevo cliente'} onSave={saveClient} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="María López" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>Email</label><input style={S.input} value={form.email||''} onChange={fv('email')} type="email" autoComplete="off" {...focusH} /></div>
          </div>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', inset:0, background:'rgba(10, 4, 24, .7)', backdropFilter:'blur(12px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{background:C.bgSolid, border:`1px solid ${C.borderSolid}`, borderRadius:24, padding:32, maxWidth:400, textAlign:'center', boxShadow:'0 30px 100px rgba(168, 85, 247, .3)'}} onClick={e => e.stopPropagation()}>
            <div style={{width:64, height:64, borderRadius:'50%', background:`${C.red}15`, color:C.red, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px'}}>
              {Icon.alert()}
            </div>
            <div style={{fontSize:17, fontWeight:700, marginBottom:8, color:C.text}}>{confirm.msg}</div>
            <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Esta acción no se puede deshacer.</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red, boxShadow:'0 8px 24px rgba(225,29,72,.3)'}} onClick={confirm.onYes}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : `linear-gradient(135deg, ${C.accent3}, ${C.accent})`, color:'#fff', padding:'14px 22px', borderRadius:100, fontSize:14, fontWeight:600, zIndex:1001, boxShadow:'0 12px 40px rgba(0,0,0,.4)', display:'flex', alignItems:'center', gap:10}}>
          {toast.type === 'error' ? Icon.alert() : Icon.check()}
          {toast.msg}
        </div>
      )}

      {/* SIDEBAR MINIMAL CIRCULAR */}
      <aside style={{
        background: theme === 'dark' ? 'rgba(20, 8, 40, .5)' : 'rgba(255, 255, 255, .6)',
        backdropFilter:'blur(20px)',
        borderRight:`1px solid ${C.border}`,
        padding:'20px 0', display:'flex', flexDirection:'column', alignItems:'center',
        position:'sticky', top:0, height:'100vh', gap:6,
      }}>
        <div style={{
          width:46, height:46, borderRadius:14,
          background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
          color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:800, fontSize:18, marginBottom:18,
          boxShadow:'0 8px 24px rgba(168, 85, 247, .35)',
        }}>
          A
        </div>

        {nav.map(n => {
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              title={n.label}
              aria-label={n.label}
              style={{
                width:46, height:46, borderRadius:14,
                background: active ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : 'transparent',
                color:      active ? '#fff' : C.text2,
                border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s',
                boxShadow: active ? '0 6px 18px rgba(168, 85, 247, .35)' : 'none',
                position:'relative',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.bg3; e.currentTarget.style.color = C.accent; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}}
            >
              {n.icon()}
            </button>
          );
        })}

        <div style={{flex:1}} />

        <button
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          aria-label="Cambiar tema"
          style={{
            width:46, height:46, borderRadius:14, background:'transparent',
            color:C.text2, border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.bg3; e.currentTarget.style.color = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}
        >
          {theme === 'dark' ? Icon.sun() : Icon.moon()}
        </button>
      </aside>

      {/* MAIN */}
      <main style={{padding:'28px 32px 60px', maxWidth:1500, margin:'0 auto', width:'100%'}}>
        {pageRender()}
      </main>
    </div>
  );
}
