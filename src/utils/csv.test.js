import { describe, it, expect } from 'vitest';
import { toCSV } from './csv.js';

describe('toCSV', () => {
  it('returns an empty string for no rows', () => {
    expect(toCSV([])).toBe('');
  });

  it('builds a header row from object keys', () => {
    const csv = toCSV([{ client: 'María', service: 'Corte' }]);
    expect(csv.split('\n')[0]).toBe('client,service');
  });

  it('quotes values and escapes embedded double quotes', () => {
    const csv = toCSV([{ notes: 'Color "platino"' }]);
    expect(csv.split('\n')[1]).toBe('"Color ""platino"""');
  });

  it('serialises every booking row', () => {
    const csv = toCSV([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(csv.split('\n')).toHaveLength(4); // header + 3 rows
  });
});
