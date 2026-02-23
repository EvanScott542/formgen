import { Component, inject, signal, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

const DARK_MODE_KEY = 'formgen-dark-mode';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 959px)')
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  readonly darkMode = signal(
    localStorage.getItem(DARK_MODE_KEY) === 'true'
  );

  constructor() {
    this.applyDarkMode(this.darkMode());

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const label = this.routeLabel(e.urlAfterRedirects);
        this.liveAnnouncer.announce(`Navigated to ${label}`);
        if (this.isMobile() && this.sidenav?.opened) {
          this.sidenav.close();
        }
      });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  toggleDarkMode(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    this.applyDarkMode(next);
  }

  private applyDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark-mode', enabled);
  }

  private routeLabel(url: string): string {
    if (url.startsWith('/prompt')) return 'New Form';
    if (url.startsWith('/drafts')) return 'My Drafts';
    return 'FormGen';
  }
}
