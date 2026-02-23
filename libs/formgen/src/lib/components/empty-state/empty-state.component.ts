import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'fg-empty-state',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  icon = input.required<string>();
  heading = input.required<string>();
  body = input.required<string>();
  ctaLabel = input.required<string>();
  ctaRoute = input.required<string>();
}
