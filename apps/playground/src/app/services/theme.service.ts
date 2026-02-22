import { Injectable, signal } from '@angular/core';
import { THEMES, Theme } from '../models/catalog';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes = THEMES;
  readonly activeTheme = signal<Theme>(THEMES[0]);

  setTheme(theme: Theme): void {
    // Remove all theme classes from <html>
    for (const t of THEMES) {
      if (t.cssClass) document.documentElement.classList.remove(t.cssClass);
    }
    // Apply the new one
    if (theme.cssClass) document.documentElement.classList.add(theme.cssClass);
    this.activeTheme.set(theme);
  }
}
