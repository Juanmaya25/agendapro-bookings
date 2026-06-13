// PALETTE: glassmorphism púrpura/rosa neón sobre fondos oscuros translúcidos
export const themes = {
  dark: {
    bg:        '#0a0418',
    bg2:       'rgba(30, 14, 60, .6)',     // glass
    bg3:       'rgba(255, 255, 255, .04)', // glass más sutil
    bgSolid:   '#1a0e3c',
    accent:    '#c084fc',
    accent2:   '#f472b6',
    accent3:   '#34d399',
    glow:      '#a855f7',
    text:      '#f8f4ff',
    text2:     '#bfa8e6',
    text3:     '#7e6da3',
    border:    'rgba(192, 132, 252, .15)',
    borderSolid: 'rgba(192, 132, 252, .25)',
    red:       '#fb7185',
  },
  light: {
    bg:        '#faf7ff',
    bg2:       'rgba(255, 255, 255, .65)',
    bg3:       'rgba(192, 132, 252, .06)',
    bgSolid:   '#ffffff',
    accent:    '#7c3aed',
    accent2:   '#db2777',
    accent3:   '#059669',
    glow:      '#a855f7',
    text:      '#1e1233',
    text2:     '#6b5b8b',
    text3:     '#9c8bb8',
    border:    'rgba(124, 58, 237, .12)',
    borderSolid: 'rgba(124, 58, 237, .2)',
    red:       '#e11d48',
  },
};

export const statusC = {
  confirmed: { l:'Confirmada', bg:'rgba(52,211,153,.15)',  c:'#10b981' },
  pending:   { l:'Pendiente',  bg:'rgba(251,191,36,.15)',  c:'#f59e0b' },
  cancelled: { l:'Cancelada',  bg:'rgba(248,113,113,.15)', c:'#ef4444' },
  done:      { l:'Completada', bg:'rgba(124,58,237,.15)',  c:'#7c3aed' },
};

export const loyaltyInfo = {
  silver:   { l:'Plata',   c:'#94a3b8', bg:'rgba(148,163,184,.15)' },
  gold:     { l:'Oro',     c:'#f59e0b', bg:'rgba(245,158,11,.15)' },
  platinum: { l:'Platino', c:'#c084fc', bg:'rgba(192,132,252,.15)' },
};
