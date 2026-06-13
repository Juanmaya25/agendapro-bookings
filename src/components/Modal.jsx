import { Icon } from './icons.jsx';

export function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(10, 4, 24, .7)', backdropFilter:'blur(12px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{
          background: C.bgSolid,
          border:`1px solid ${C.borderSolid}`,
          borderRadius:24, padding:30, width:'100%',
          maxWidth: size==='lg' ? 720 : 540,
          boxShadow:'0 30px 100px rgba(168, 85, 247, .25), 0 0 0 1px rgba(255,255,255,.05)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
          <h2 style={{fontSize:20, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'rgba(255,255,255,.06)', border:'none', color:C.text2, width:36, height:36, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
            {Icon.close()}
          </button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:26}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
