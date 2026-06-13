import { Icon } from '../components/icons.jsx';

export function Calendar({ bookings, onNewBooking, C, S }) {
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
        <button style={S.btnPri} onClick={() => onNewBooking(`${yr}-${monthPad}-${String(today.getDate()).padStart(2,'0')}`)}>
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
}
