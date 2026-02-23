import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RenderableForm } from '@formgen/ui';
import { FormCatalogApiService } from './services/form-catalog-api.service';
import { CatalogBrowserComponent } from './components/catalog-browser/catalog-browser.component';
import { FormPreviewPanelComponent } from './components/form-preview-panel/form-preview-panel.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';

const DARK_MODE_KEY = 'playground-dark-mode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule, MatSidenavModule, MatButtonModule, MatIconModule, MatTooltipModule,
    CatalogBrowserComponent, FormPreviewPanelComponent, ThemePickerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private catalogApi = inject(FormCatalogApiService);
  renderableForm = signal<RenderableForm | null>(null);
  loadingForm = signal(false);
  darkMode = signal(false);

  constructor() {
    if (localStorage.getItem(DARK_MODE_KEY) === 'true') {
      this.darkMode.set(true);
      document.body.classList.add('dark-mode');
    }
  }

  onFormSelected(id: string): void {
    this.loadingForm.set(true);
    this.renderableForm.set(null);
    this.catalogApi.getForm(id).subscribe({
      next: (form) => { this.renderableForm.set(form); this.loadingForm.set(false); },
      error: () => this.loadingForm.set(false),
    });
  }

  toggleDarkMode(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    document.body.classList.toggle('dark-mode', next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
  }
}
