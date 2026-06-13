export function ClientForm({ form, fv, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14}}>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="María López" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Email</label><input style={S.input} value={form.email||''} onChange={fv('email')} type="email" autoComplete="off" {...focusH} /></div>
    </div>
  );
}
