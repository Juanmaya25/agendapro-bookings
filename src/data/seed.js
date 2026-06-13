// ─── DATA SEED ──────────────────────────────────────────────────────
export const INIT_SERVICES = [
  { id:1, name:'Corte de cabello',   duration:45,  price:35000,  color:'#f59e0b', category:'Cabello' },
  { id:2, name:'Tinte completo',     duration:120, price:120000, color:'#ec4899', category:'Cabello' },
  { id:3, name:'Manicure',           duration:60,  price:25000,  color:'#8b5cf6', category:'Uñas' },
  { id:4, name:'Pedicure',           duration:60,  price:30000,  color:'#06b6d4', category:'Uñas' },
  { id:5, name:'Cejas y pestañas',   duration:45,  price:40000,  color:'#10b981', category:'Estética' },
  { id:6, name:'Tratamiento facial', duration:60,  price:65000,  color:'#ef4444', category:'Estética' },
];

export const INIT_BOOKINGS = [
  { id:1, client:'María López',    service:'Corte de cabello', date:'2026-05-04', time:'09:00', stylist:'Ana',   status:'confirmed', phone:'310-111-2222', email:'maria@email.com',     notes:'Cliente frecuente' },
  { id:2, client:'Sofía García',   service:'Tinte completo',   date:'2026-05-04', time:'10:00', stylist:'Luisa', status:'confirmed', phone:'310-333-4444', email:'sofia@email.com',     notes:'Color rubio platino' },
  { id:3, client:'Patricia Ruiz',  service:'Manicure',         date:'2026-05-04', time:'12:00', stylist:'Ana',   status:'pending',   phone:'310-555-6666', email:'patricia@email.com',  notes:'' },
  { id:4, client:'Carmen Torres',  service:'Pedicure',         date:'2026-05-04', time:'14:00', stylist:'Luisa', status:'pending',   phone:'310-777-8888', email:'carmen@email.com',    notes:'Diseño francés' },
  { id:5, client:'Valentina Cruz', service:'Cejas y pestañas', date:'2026-05-05', time:'09:30', stylist:'Ana',   status:'confirmed', phone:'310-999-0000', email:'valentina@email.com', notes:'' },
  { id:6, client:'Isabella Mora',  service:'Corte de cabello', date:'2026-05-05', time:'11:00', stylist:'Luisa', status:'cancelled', phone:'310-121-2121', email:'isabella@email.com',  notes:'Canceló por enfermedad' },
];

export const INIT_CLIENTS = [
  { id:1, name:'María López',    phone:'310-111-2222', email:'maria@email.com',     visits:18, total:850000,  loyalty:'gold',     lastVisit:'2026-04-15' },
  { id:2, name:'Sofía García',   phone:'310-333-4444', email:'sofia@email.com',     visits:12, total:1200000, loyalty:'platinum', lastVisit:'2026-04-20' },
  { id:3, name:'Patricia Ruiz',  phone:'310-555-6666', email:'patricia@email.com',  visits:5,  total:175000,  loyalty:'silver',   lastVisit:'2026-04-10' },
  { id:4, name:'Carmen Torres',  phone:'310-777-8888', email:'carmen@email.com',    visits:8,  total:380000,  loyalty:'gold',     lastVisit:'2026-04-25' },
  { id:5, name:'Valentina Cruz', phone:'310-999-0000', email:'valentina@email.com', visits:3,  total:120000,  loyalty:'silver',   lastVisit:'2026-04-05' },
];

export const INIT_STYLISTS = [
  { id:1, name:'Ana Martínez',    specialty:'Colorimetría',      rating:4.9, appts:186, color:'#f59e0b', email:'ana@bella.co' },
  { id:2, name:'Luisa Fernández', specialty:'Corte & Estilo',    rating:4.8, appts:142, color:'#ec4899', email:'luisa@bella.co' },
  { id:3, name:'Camila Restrepo', specialty:'Estética avanzada', rating:5.0, appts:98,  color:'#8b5cf6', email:'camila@bella.co' },
];

export const HOURS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

export const STATS_WEEK = [
  { day:'Lun', appts:8,  revenue:280000 },
  { day:'Mar', appts:12, revenue:420000 },
  { day:'Mié', appts:10, revenue:350000 },
  { day:'Jue', appts:15, revenue:520000 },
  { day:'Vie', appts:18, revenue:640000 },
  { day:'Sáb', appts:20, revenue:710000 },
  { day:'Hoy', appts:4,  revenue:190000 },
];

export const SERVICE_DIST = [
  { name:'Cabello',  value:42, color:'#a78bfa' },
  { name:'Uñas',     value:28, color:'#f472b6' },
  { name:'Estética', value:20, color:'#34d399' },
  { name:'Otros',    value:10, color:'#fbbf24' },
];
