import { Icon } from './icons.jsx';

export const NAV = [
  { id:'dashboard', icon: Icon.home,     label:'Inicio' },
  { id:'bookings',  icon: Icon.bookmark, label:'Reservas' },
  { id:'calendar',  icon: Icon.calendar, label:'Calendario' },
  { id:'services',  icon: Icon.sparkle,  label:'Servicios' },
  { id:'clients',   icon: Icon.users,    label:'Clientes' },
  { id:'team',      icon: Icon.team,     label:'Equipo' },
  { id:'analytics', icon: Icon.chart,    label:'Reportes' },
];

export function Sidebar({ page, onNavigate, theme, onToggleTheme, C }) {
  return (
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

      {NAV.map(n => {
        const active = page === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
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
        onClick={onToggleTheme}
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
  );
}
