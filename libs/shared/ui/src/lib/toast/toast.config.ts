import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export const TOAST_DEFAULT_CONFIG: ConfigModel = {
  positionX: 'top',
  positionY: 'right',
  gap: '20px',
  disposeTime: 5000,
};
export interface ConfigModel {
  positionX?: 'bottom' | 'top';
  positionY?: 'right' | 'left';
  gap?: string;
  disposeTime?: number;
}
export interface ToastDataModel {
  message: string;
  toastRef: OverlayRef;
  type: 'success' | 'error';
  disposeTime?: number;
}
export const TOAST_DATA = new InjectionToken<ToastDataModel>('ToastData');
