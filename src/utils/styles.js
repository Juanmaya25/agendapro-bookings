// ESTILOS — todo con tema "glassmorphism" con backdrop-filter
export const makeStyles = C => ({
  glass: {
    background: C.bg2,
    backdropFilter:'blur(20px)',
    WebkitBackdropFilter:'blur(20px)',
    border:`1px solid ${C.border}`,
    borderRadius:24,
    padding:24,
  },
  glassSoft: {
    background: C.bg3,
    backdropFilter:'blur(12px)',
    border:`1px solid ${C.border}`,
    borderRadius:18,
    padding:18,
  },
  input: {
    background: C.bg3,
    border:`1px solid ${C.borderSolid}`,
    borderRadius:14,
    padding:'12px 16px',
    fontSize:14, color:C.text,
    outline:'none', fontFamily:'inherit',
    width:'100%', boxSizing:'border-box',
    transition:'all .2s',
  },
  label:    { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:8, letterSpacing:'.4px', textTransform:'uppercase' },
  btnPri:   { background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color:'#fff', border:'none', borderRadius:100, padding:'12px 26px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 8px 24px rgba(168, 85, 247, .3)', transition:'transform .15s, box-shadow .2s' },
  btnGhost: { background:'rgba(255,255,255,.04)', color:C.text2, border:`1px solid ${C.border}`, borderRadius:100, padding:'12px 22px', fontSize:14, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6 },
  btnIcon:  { background:'rgba(255,255,255,.05)', color:C.text2, border:`1px solid ${C.border}`, borderRadius:12, width:36, height:36, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'all .15s' },
});

export const makeFocusHandlers = C => ({
  onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
  onBlur:  e => { e.target.style.borderColor = C.borderSolid; e.target.style.boxShadow = 'none'; },
});
