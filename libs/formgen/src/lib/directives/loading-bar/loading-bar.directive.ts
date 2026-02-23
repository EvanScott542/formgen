import { ComponentRef, Directive, Input, OnChanges, OnDestroy, ViewContainerRef, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Directive({
  selector: '[fgLoadingBar]',
  standalone: true,
  host: { '[attr.aria-busy]': 'loading' },
})
export class LoadingBarDirective implements OnChanges, OnDestroy {
  @Input('fgLoadingBar') loading = false;

  private vcr = inject(ViewContainerRef);
  private barRef: ComponentRef<MatProgressBar> | null = null;

  ngOnChanges(): void {
    if (this.loading && !this.barRef) {
      this.barRef = this.vcr.createComponent(MatProgressBar);
      this.barRef.setInput('mode', 'indeterminate');
      const el = this.barRef.location.nativeElement as HTMLElement;
      el.setAttribute('aria-label', 'Loading');
      el.style.cssText = 'position:sticky;top:0;z-index:1;';
    } else if (!this.loading && this.barRef) {
      this.barRef.destroy();
      this.barRef = null;
    }
  }

  ngOnDestroy(): void {
    this.barRef?.destroy();
  }
}
