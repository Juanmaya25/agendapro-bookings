export const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;

export const randomHexColor = () =>
  '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
