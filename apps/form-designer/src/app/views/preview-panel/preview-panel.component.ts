import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormgenFormComponent, RenderableForm } from '@formgen/ui';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [MatCardModule, FormgenFormComponent],
  template: `
    <div class="preview-panel">
      <h3 class="preview-title">Live Preview</h3>
      @if (renderableForm) {
        <formgen-form
          [config]="renderableForm"
          (formSubmit)="onPreviewSubmit($event)"
        />
      } @else {
        <p class="preview-empty">No form to preview yet.</p>
      }
    </div>
  `,
  styles: [`
    .preview-panel { padding: 0 8px; }
    .preview-title { margin: 0 0 16px; font-size: 14px; font-weight: 500; color: rgba(0,0,0,.6); text-transform: uppercase; letter-spacing: .08em; }
    .preview-empty { color: rgba(0,0,0,.38); font-style: italic; }
  `],
})
export class PreviewPanelComponent {
  @Input() renderableForm: RenderableForm | null = null;

  onPreviewSubmit(value: Record<string, unknown>): void {
    console.log('[PreviewPanel] form submitted:', value);
  }
}
