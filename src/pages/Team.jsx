import { Icon } from '../components/icons.jsx';

export function Team({ stylists, onAdd, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Equipo</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{stylists.length} estilistas activas</div>
        </div>
        <button style={S.btnPri} onClick={onAdd}>
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
}
