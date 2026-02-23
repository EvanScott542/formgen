import { Injectable, signal } from '@angular/core';
import { THEMES, Theme } from '../models/catalog';

const STORAGE_KEY = 'playground-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes = THEMES;
  readonly activeTheme = signal<Theme>(THEMES[0]);

  constructor() {
    this.restoreTheme();
  }

  setTheme(theme: Theme): void {
    for (const t of THEMES) {
      if (t.cssClass) document.documentElement.classList.remove(t.cssClass);
    }
    if (theme.cssClass) document.documentElement.classList.add(theme.cssClass);
    this.activeTheme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme.id);
  }

  private restoreTheme(): void {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (!savedId) return;
    const theme = THEMES.find(t => t.id === savedId);
    if (theme) this.setTheme(theme);
  }
}
