import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormgenFormComponent, RenderableForm, CssSelectorGeneratorService, FormSelectors } from '@formgen/ui';
import { CssSelectorsDisplayComponent } from '../css-selectors-display/css-selectors-display.component';

@Component({
  selector: 'app-form-preview-panel',
  standalone: true,
  imports: [MatProgressBarModule, FormgenFormComponent, CssSelectorsDisplayComponent],
  template: `
    @if (loading) {
      <mat-progress-bar mode="indeterminate" class="preview-panel__progress" aria-label="Loading form" />
    }
    <div class="preview-panel__body">
      @if (!loading && form()) {
        <formgen-form [config]="form()!" (formSubmit)="onSubmit($event)" />
        <app-css-selectors-display [selectors]="selectors()!" />
      } @else if (!loading) {
        <div class="preview-panel__empty" aria-live="polite">
          <p>Select a form from the catalog to preview it here.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .preview-panel__progress { position: sticky; top: 0; z-index: 1; }
    .preview-panel__body { padding: 24px; }
    .preview-panel__empty {
      display: flex; justify-content: center; align-items: center;
      min-height: 300px; color: var(--mat-sys-on-surface-variant);
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
