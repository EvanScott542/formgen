import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'fg-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip disabled [class]="'status-chip status-chip--' + status()">
      {{ status() }}
    </mat-chip>
  `,
  styles: [`
    .status-chip {
      &--saved {
        --mdc-chip-elevated-container-color: var(--mat-sys-tertiary-container);
        --mdc-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
      &--draft {
        --mdc-chip-elevated-container-color: var(--mat-sys-surface-variant);
        --mdc-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
    }
  `],
})
export class StatusChipComponent {
  status = input.required<string>();
}
