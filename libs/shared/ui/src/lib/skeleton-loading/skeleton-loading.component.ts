import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vh-skeleton-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loading.component.html',
  styleUrls: ['./skeleton-loading.component.scss'],
})
export class SkeletonLoadingComponent {
  @Input()
  set count(count: number) {
    this.countItems = Array(count).fill(1);
  }
  countItems: number[] = [1];
  @Input()
  shape: 'circle' | 'line' = 'line';
  @Input()
  width = '100%';
  @Input()
  height = '100%';
  @Input()
  theme = '';

  @HostBinding('style.width.%')
  get hostWidth(): number | string {
    return this.width.includes('%')
      ? Number(this.width.split('%')[0])
      : this.width;
  }
}
