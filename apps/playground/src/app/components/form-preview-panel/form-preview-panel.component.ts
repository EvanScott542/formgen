import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormgenFormComponent, RenderableForm, CssSelectorGeneratorService, FormSelectors } from '@formgen/ui';
import { CssSelectorsDisplayComponent } from '../css-selectors-display/css-selectors-display.component';

@Component({
  selector: 'app-form-preview-panel',
  standalone: true,
  imports: [MatProgressSpinnerModule, FormgenFormComponent, CssSelectorsDisplayComponent],
  template: `
    <div class="preview-wrapper">
      @if (loading) {
        <div class="preview-loading"><mat-spinner diameter="48" /></div>
      } @else if (form()) {
        <formgen-form [config]="form()!" (formSubmit)="onSubmit($event)" />
        <app-css-selectors-display [selectors]="selectors()!" />
      } @else {
        <div class="preview-empty">
          <p>Select a form from the catalog to preview it here.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .preview-wrapper { padding: 24px; }
    .preview-loading, .preview-empty {
      display: flex; justify-content: center; align-items: center;
      min-height: 300px; color: rgba(0,0,0,.4);
    }
  `],
})
export class FormPreviewPanelComponent implements OnChanges {
  @Input() renderableForm: RenderableForm | null = null;
  @Input() loading = false;

  form = signal<RenderableForm | null>(null);
  selectors = signal<FormSelectors | null>(null);

  private selectorGenerator = inject(CssSelectorGeneratorService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['renderableForm']) {
      this.form.set(this.renderableForm);
      this.selectors.set(
        this.renderableForm ? this.selectorGenerator.generate(this.renderableForm) : null
      );
    }
  }

  onSubmit(value: Record<string, unknown>): void {
    console.log('[Playground] form submitted:', value);
  }
}
