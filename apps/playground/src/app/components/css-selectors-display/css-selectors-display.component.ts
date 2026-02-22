import { Component, Input, computed, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FormSelectors } from '@formgen/ui';

@Component({
  selector: 'app-css-selectors-display',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule],
  template: `
    <mat-accordion class="selectors-accordion">
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon class="panel-icon">code</mat-icon>
            CSS Selectors
          </mat-panel-title>
          <mat-panel-description>Generated for this form</mat-panel-description>
        </mat-expansion-panel-header>

        <div class="selectors-content">
          <div class="selector-group">
            <span class="group-label">Form</span>
            <code class="selector">.{{ selectors.form }}</code>
          </div>

          @for (entry of fieldEntries(); track entry.key) {
            <div class="selector-group">
              <span class="group-label">{{ entry.key }}</span>
              <div class="selector-list">
                <code class="selector">.{{ entry.selectors.wrapper }}</code>
                <code class="selector secondary">.{{ entry.selectors.type }}</code>
                <code class="selector secondary">{{ entry.selectors.matField }}</code>
              </div>
            </div>
          }

          @for (entry of actionEntries(); track entry.type) {
            <div class="selector-group">
              <span class="group-label">action:{{ entry.type }}</span>
              <code class="selector">.{{ entry.cssClass }}</code>
            </div>
          }
        </div>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    .selectors-accordion { margin-top: 16px; }
    .panel-icon { margin-right: 8px; font-size: 18px; line-height: 18px; }
    .selectors-content { display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
    .selector-group { display: flex; flex-direction: column; gap: 4px; }
    .group-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,0,0,.5); }
    .selector-list { display: flex; flex-direction: column; gap: 2px; }
    code.selector {
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
      background: rgba(0,0,0,.04);
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
      color: var(--mat-sys-primary);
    }
    code.selector.secondary { color: rgba(0,0,0,.55); }
  `],
})
export class CssSelectorsDisplayComponent {
  @Input() selectors!: FormSelectors;

  fieldEntries() {
    return Object.entries(this.selectors.fields).map(([key, selectors]) => ({ key, selectors }));
  }

  actionEntries() {
    return Object.entries(this.selectors.actions).map(([type, cssClass]) => ({ type, cssClass }));
  }
}
