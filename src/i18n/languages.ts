export type Lang = 'en' | 'ro';

export const SUPPORTED_LANGUAGES: Array<{ id: Lang; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'ro', label: 'Română' }
];

export const LANGUAGE_STORAGE_KEY = 'tweb_lang';

export const isLangId = (value: string | null | undefined): value is Lang =>
  value === 'en' || value === 'ro';

