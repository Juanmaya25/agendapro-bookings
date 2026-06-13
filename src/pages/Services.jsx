import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';

export function Services({ services, onNew, onEdit, onDelete, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Servicios</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{services.length} servicios disponibles</div>
        </div>
        <button style={S.btnPri} onClick={onNew}>
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
              <button style={{...S.btnGhost, flex:1, justifyContent:'center', background:`${C.accent}10`, color:C.accent, border:`1px solid ${C.accent}30`}} onClick={() => onEdit(s)}>
                <Icon.pencil /> Editar
              </button>
              <button style={{...S.btnGhost, background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`}} onClick={() => onDelete(s.id)}>
                <Icon.trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
