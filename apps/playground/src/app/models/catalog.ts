export interface CatalogEntry {
  id: string;
  name: string;
  description?: string;
  published_at: string;
}

export interface Theme {
  id: string;
  label: string;
  cssClass: string;
}

export const THEMES: Theme[] = [
  { id: 'rose',   label: 'Rose',   cssClass: '' },
  { id: 'indigo', label: 'Indigo', cssClass: 'theme-indigo' },
  { id: 'teal',   label: 'Teal',   cssClass: 'theme-teal' },
];
