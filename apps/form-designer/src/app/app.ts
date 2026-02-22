import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span class="app-title">FormGen</span>
      <span class="toolbar-spacer"></span>
      <a mat-button routerLink="/prompt" routerLinkActive="active-link">Generate</a>
      <a mat-button routerLink="/drafts" routerLinkActive="active-link">My Drafts</a>
    </mat-toolbar>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-toolbar   { position: sticky; top: 0; z-index: 100; }
    .app-title     { font-size: 18px; font-weight: 600; margin-right: 16px; }
    .toolbar-spacer { flex: 1; }
    .active-link   { background: rgba(255,255,255,.15); border-radius: 4px; }
    main           { min-height: calc(100vh - 64px); }
  `],
})
export class App {}
