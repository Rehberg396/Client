import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  Renderer2,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  fromEvent,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Directive({
  selector: '[vhResizableColumn]',
  standalone: true,
})
export class ResizableColumnDirective implements AfterViewInit {
  /*
    - In case of mat table have too many column, <th> tag can not be resizable,
    have to use mat-sort-header-container to resize instead
  */
  @Input()
  resizableElementClass = '';

  @Input()
  resizePosition: 'left' | 'right' = 'right';

  private _el = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _document = inject(DOCUMENT);
  private _destroyRef = inject(DestroyRef);
  private _zone = inject(NgZone);

  startX = 0;
  currentWidth = 0;

  ngAfterViewInit(): void {
    this._renderer.setStyle(this._el.nativeElement, 'position', 'relative');
    const span: HTMLElement = this._renderer.createElement('span');
    span.classList.add('resizable-icon');
    if (this.resizePosition === 'left') {
      span.classList.add('left');
    }
    this._el.nativeElement.appendChild(span);
    this.registerEvent(span);
  }

  registerEvent(targetEl: HTMLElement): void {
    this._zone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(targetEl, 'click')
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(($event) => $event.stopPropagation());

      fromEvent<MouseEvent>(targetEl, 'mousedown')
        .pipe(
          tap((event) => {
            event.preventDefault();
            this.startX = event.clientX;
            const resizeEl = this.resizableElementClass
              ? this._el.nativeElement.querySelector(this.resizableElementClass)
              : this._el.nativeElement;
            this.currentWidth = resizeEl.offsetWidth;
          }),
          switchMap(() =>
            fromEvent<MouseEvent>(this._document, 'mousemove').pipe(
              tap((event) => {
                const width =
                  this.resizePosition === 'right'
                    ? this.currentWidth + (event.clientX - this.startX)
                    : this.currentWidth + (this.startX - event.clientX);
                const resizeEl = this.resizableElementClass
                  ? this._el.nativeElement.querySelector(
                      this.resizableElementClass
                    )
                  : this._el.nativeElement;
                this._renderer.setStyle(resizeEl, 'width', width + 'px');
              }),
              distinctUntilChanged(),
              takeUntil(fromEvent(this._document, 'mouseup').pipe(take(1)))
            )
          )
        )
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();
    });
  }
}
