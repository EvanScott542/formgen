import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [MatButtonToggleModule, FormsModule],
  template: `
    <mat-button-toggle-group
      [value]="themeService.activeTheme().id"
      (change)="onThemeChange($event.value)"
      aria-label="Theme"
    >
      @for (theme of themeService.themes; track theme.id) {
        <mat-button-toggle [value]="theme.id">{{ theme.label }}</mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  styles: [`
    mat-button-toggle-group { height: 36px; }
  `],
})
export class ThemePickerComponent {
  themeService = inject(ThemeService);

  onThemeChange(themeId: string): void {
    const theme = this.themeService.themes.find(t => t.id === themeId);
    if (theme) this.themeService.setTheme(theme);
  }
}
