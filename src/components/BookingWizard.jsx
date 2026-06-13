import { Icon } from './icons.jsx';
import { fmt } from '../utils/format.js';

export const TOTAL_STEPS = 3;

export function BookingWizard({ step, onBack, form, setForm, fv, services, stylists, HOURS, C, S, focusH }) {
  return (
    <>
      {/* Progress bar */}
      <div style={{display:'flex', gap:6, marginBottom:24}}>
        {[1,2,3].map(s => (
          <div key={s} style={{flex:1, height:5, borderRadius:3, background: s <= step ? `linear-gradient(90deg, ${C.accent}, ${C.accent2})` : C.bg3, transition:'all .3s'}} />
        ))}
      </div>
      {step === 1 && (
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
      {step === 2 && (
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
      {step === 3 && (
        <div>
          <div style={{fontSize:14, color:C.text2, marginBottom:14, fontWeight:500}}>Datos del cliente:</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14, marginBottom:14}}>
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
        {step > 1
          ? <button style={S.btnGhost} onClick={onBack}><Icon.arrowLeft /> Atrás</button>
          : <div />
        }
        <div style={{fontSize:11, color:C.text3, alignSelf:'center', fontWeight:600, letterSpacing:'.3px'}}>PASO {step} DE {TOTAL_STEPS}</div>
      </div>
    </>
  );
}
