import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RenderableForm } from '@formgen/ui';
import { FormCatalogApiService } from './services/form-catalog-api.service';
import { CatalogBrowserComponent } from './components/catalog-browser/catalog-browser.component';
import { FormPreviewPanelComponent } from './components/form-preview-panel/form-preview-panel.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule, MatSidenavModule,
    CatalogBrowserComponent, FormPreviewPanelComponent, ThemePickerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private catalogApi = inject(FormCatalogApiService);
  renderableForm = signal<RenderableForm | null>(null);
  loadingForm = signal(false);

  onFormSelected(id: string): void {
    this.loadingForm.set(true);
    this.renderableForm.set(null);
    this.catalogApi.getForm(id).subscribe({
      next: (form) => { this.renderableForm.set(form); this.loadingForm.set(false); },
      error: () => this.loadingForm.set(false),
    });
  }
}
