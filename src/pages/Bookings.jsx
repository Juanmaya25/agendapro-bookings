import { Icon } from '../components/icons.jsx';
import { statusC } from '../data/themes.js';

export function Bookings({ bookings, filteredBookings, search, onSearch, filterStatus, onFilter, onExport, onNew, onComplete, onCancel, C, S, focusH }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Reservas</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{filteredBookings.length} de {bookings.length} reservas</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={onExport}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={onNew}>
            <Icon.plus /> Nueva reserva
          </button>
        </div>
      </div>
      <div style={{display:'flex', gap:10, margin:'24px 0 18px', flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:380}}>
          <span style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:38}} placeholder="Buscar cliente o servicio..." value={search} onChange={e => onSearch(e.target.value)} {...focusH} />
        </div>
        {['all','confirmed','pending','cancelled','done'].map(s => (
          <button
            key={s}
            onClick={() => onFilter(s)}
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
            {b.status === 'pending' && <button style={{...S.btnGhost, color:C.accent3, border:`1px solid ${C.accent3}30`, background:`${C.accent3}10`}} onClick={() => onComplete(b.id)}><Icon.check /> Atender</button>}
            {b.status !== 'cancelled' && b.status !== 'done' && <button style={{...S.btnGhost, color:C.red, border:`1px solid ${C.red}30`, background:`${C.red}10`}} onClick={() => onCancel(b.id)}>Cancelar</button>}
          </div>
        ))}
        {filteredBookings.length === 0 && <div style={{...S.glass, textAlign:'center', color:C.text2, padding:36}}>Ninguna reserva coincide con los filtros.</div>}
      </div>
    </div>
  );
}
