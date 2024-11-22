import {
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ToastComponent } from './toast.component';
import {
  ConfigModel,
  ToastDataModel,
  TOAST_DATA,
  TOAST_DEFAULT_CONFIG,
} from './toast.config';

@Injectable({
  providedIn: 'root',
})
export class ToastService implements OnDestroy {
  toastRef?: OverlayRef;
  timeout?: ReturnType<typeof setTimeout>;

  constructor(private _overlay: Overlay) {}

  success(message: string, config?: ConfigModel): void {
    this._openToast(message, 'success', config);
  }

  error(message: string, config?: ConfigModel): void {
    this._openToast(message, 'error', config);
  }

  private _openToast(
    message: string,
    type: 'success' | 'error',
    config?: ConfigModel
  ): void {
    const customConfig = { ...TOAST_DEFAULT_CONFIG, ...config };
    this.timeout = setTimeout(() => {
      const positionStrategy = this._createPosition(customConfig);
      const scrollStrategy = this._overlay.scrollStrategies.noop();
      this.toastRef = this._overlay.create({
        positionStrategy,
        scrollStrategy,
        hasBackdrop: false,
      });
      const injector = this._createInjector({
        message,
        toastRef: this.toastRef,
        type,
        disposeTime: config?.disposeTime ?? TOAST_DEFAULT_CONFIG.disposeTime,
      });
      const component = new ComponentPortal(ToastComponent, null, injector);
      this.toastRef.attach(component);
    }, 100);
  }

  private _createPosition(config: ConfigModel): GlobalPositionStrategy {
    const currentToastPosition =
      this.toastRef?.overlayElement?.getBoundingClientRect()?.bottom ?? 0;
    const position = currentToastPosition
      ? currentToastPosition + 10 + 'px'
      : config.gap;

    const positionStrategy = this._overlay
      .position()
      .global()
      [config.positionX!](position)
      [config.positionY!](config.gap);

    return positionStrategy;
  }

  private _createInjector(data: ToastDataModel) {
    const injector = Injector.create({
      providers: [
        {
          provide: TOAST_DATA,
          useValue: data,
        },
      ],
    });
    return injector;
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
