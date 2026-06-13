import { describe, it, expect } from 'vitest';
import { nextId, randomHexColor } from './ids.js';

describe('nextId', () => {
  it('returns 1 for an empty array', () => {
    expect(nextId([])).toBe(1);
  });

  it('returns max id + 1', () => {
    expect(nextId([{ id: 1 }, { id: 6 }, { id: 4 }])).toBe(7);
  });
});

describe('randomHexColor', () => {
  it('returns a 7-char hex color string', () => {
    const c = randomHexColor();
    expect(c).toMatch(/^#[0-9a-f]{6}$/);
  });
});
