import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ToastDataModel, TOAST_DATA } from './toast.config';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vh-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    trigger('show', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0 }), animate('0.2s')]),
      transition('default => closing', animate('0.2s', style({ opacity: 0 }))),
    ]),
  ],
  imports: [NgClass, MatIconModule],
})
export class ToastComponent implements OnInit, OnDestroy {
  timeout?: ReturnType<typeof setTimeout>;

  constructor(
    @Inject(TOAST_DATA)
    public toastData: ToastDataModel
  ) {}

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      this.toastData.toastRef.dispose();
    }, this.toastData.disposeTime);
  }

  onClick(): void {
    this.toastData.toastRef.detach();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
