import { describe, it, expect } from 'vitest';
import { fmt } from './format.js';

describe('fmt', () => {
  it('formats a number as Colombian pesos with thousands separators', () => {
    expect(fmt(120000)).toBe('$120.000');
  });

  it('returns $0 for null, undefined or NaN', () => {
    expect(fmt(null)).toBe('$0');
    expect(fmt(undefined)).toBe('$0');
    expect(fmt(NaN)).toBe('$0');
  });

  it('handles small values', () => {
    expect(fmt(35000)).toBe('$35.000');
  });
});
