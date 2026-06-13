import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { loyaltyInfo } from '../data/themes.js';

export function Clients({ clients, onExport, onNew, onEdit, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Clientes</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{clients.length} clientes registrados</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={onExport}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={onNew}>
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
              <button style={S.btnIcon} onClick={() => onEdit(c)} aria-label="Editar">
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
}
