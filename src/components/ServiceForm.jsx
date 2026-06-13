export function ServiceForm({ form, fv, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14}}>
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
  );
}
