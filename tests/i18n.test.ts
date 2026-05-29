import { describe, it, expect } from 'vitest';
import {
  getStrings,
  detectLocale,
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  type Locale,
} from '@/lib/i18n';

describe('getStrings', () => {
  it('returns English strings for "en"', () => {
    const s = getStrings('en');
    expect(s.submit).toBe('Find resources');
    expect(s.loading).toBeTruthy();
    expect(s.whatDoYouNeed).toBeTruthy();
  });

  it('returns non-empty strings for every supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const s = getStrings(locale);
      expect(s.submit, `submit missing for ${locale}`).toBeTruthy();
      expect(s.loading, `loading missing for ${locale}`).toBeTruthy();
      expect(s.recommended, `recommended missing for ${locale}`).toBeTruthy();
      expect(s.urgentTitle, `urgentTitle missing for ${locale}`).toBeTruthy();
    }
  });

  it('falls back to English for an unknown locale', () => {
    const s = getStrings('xx' as Locale);
    expect(s.submit).toBe('Find resources');
  });

  it('has a LOCALE_LABELS entry for every supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(LOCALE_LABELS[locale], `label missing for ${locale}`).toBeTruthy();
    }
  });

  it('every locale string object has identical keys to English', () => {
    const enKeys = Object.keys(getStrings('en')).sort();
    for (const locale of SUPPORTED_LOCALES) {
      const keys = Object.keys(getStrings(locale)).sort();
      expect(keys, `key mismatch for ${locale}`).toEqual(enKeys);
    }
  });
});

describe('detectLocale', () => {
  it('returns "en" when navigator is undefined (SSR context)', () => {
    // detectLocale guards on typeof navigator === 'undefined'
    expect(detectLocale()).toBe('en');
  });
});
