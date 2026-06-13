import { Icon } from './icons.jsx';

export function ConfirmDialog({ confirm, onCancel, C, S }) {
  if (!confirm) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(10, 4, 24, .7)', backdropFilter:'blur(12px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={onCancel}>
      <div style={{background:C.bgSolid, border:`1px solid ${C.borderSolid}`, borderRadius:24, padding:32, maxWidth:400, textAlign:'center', boxShadow:'0 30px 100px rgba(168, 85, 247, .3)'}} onClick={e => e.stopPropagation()}>
        <div style={{width:64, height:64, borderRadius:'50%', background:`${C.red}15`, color:C.red, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px'}}>
          {Icon.alert()}
        </div>
        <div style={{fontSize:17, fontWeight:700, marginBottom:8, color:C.text}}>{confirm.msg}</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Esta acción no se puede deshacer.</div>
        <div style={{display:'flex', gap:10, justifyContent:'center'}}>
          <button style={S.btnGhost} onClick={onCancel}>Cancelar</button>
          <button style={{...S.btnPri, background:C.red, boxShadow:'0 8px 24px rgba(225,29,72,.3)'}} onClick={confirm.onYes}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
