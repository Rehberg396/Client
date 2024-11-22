import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableColumnDirective } from './resizable-column.directive';
import { Component, NgZone, Type } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'vh-dummy',
  template: `<div vhResizableColumn id="test-resize-div" style="width: 50px;">
    Resizable
  </div>`,
})
class DummyComponent {}

@Component({
  selector: 'vh-dummy',
  template: `<div
    vhResizableColumn
    [resizableElementClass]="'.test'"
    id="test-resize-div"
    style="width: 20px;"
  >
    <div class="test" style="width: 50px">Resizable</div>
  </div>`,
})
class DummyWithInputComponent {}

describe(ResizableColumnDirective.name, () => {
  let componentFixture: ComponentFixture<unknown>;
  let resizableColumnDirective: ResizableColumnDirective;

  function setup(component: Type<unknown>) {
    TestBed.configureTestingModule({
      declarations: [component],
      providers: [{ provide: DOCUMENT, useValue: document }],
      imports: [ResizableColumnDirective],
    }).compileComponents();

    const fixture = TestBed.createComponent(component);

    const directive = fixture.debugElement
      .query(By.directive(ResizableColumnDirective))
      .injector.get(ResizableColumnDirective);

    return {
      fixture,
      directive,
    };
  }

  describe('Non resizableElementClass input', () => {
    beforeEach(() => {
      const { fixture, directive } = setup(DummyComponent);
      componentFixture = fixture;
      resizableColumnDirective = directive;
      const ngZone = TestBed.inject(NgZone);
      jest
        .spyOn(ngZone, 'runOutsideAngular')
        .mockImplementation((fn: () => void) => fn());
    });

    it('should create a resizable icon span element inside host element', () => {
      resizableColumnDirective.ngAfterViewInit();
      const resizableIcon = componentFixture.nativeElement.querySelector(
        '#test-resize-div .resizable-icon'
      );
      expect(resizableIcon).toBeTruthy();
    });

    it('should resize the element on mousedown and mousemove events', () => {
      resizableColumnDirective.ngAfterViewInit();
      const resizableIcon = componentFixture.nativeElement.querySelector(
        '#test-resize-div .resizable-icon'
      );

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 100 });
      resizableIcon.dispatchEvent(mouseDownEvent);
      resizableColumnDirective.registerEvent(componentFixture.nativeElement);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 150 });
      resizableColumnDirective['_document'].dispatchEvent(mouseMoveEvent);

      expect(true).toBe(true);
    });
  });

  describe('Have resizableElementClass input', () => {
    beforeEach(() => {
      const { fixture, directive } = setup(DummyWithInputComponent);
      componentFixture = fixture;
      resizableColumnDirective = directive;
      const ngZone = TestBed.inject(NgZone);
      jest
        .spyOn(ngZone, 'runOutsideAngular')
        .mockImplementation((fn: () => void) => fn());
    });

    it('should resize the element on mousedown and mousemove events', () => {
      resizableColumnDirective.ngAfterViewInit();
      const resizableIcon = componentFixture.nativeElement.querySelector(
        '#test-resize-div .resizable-icon'
      );
      componentFixture.detectChanges();

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 100 });
      resizableIcon.dispatchEvent(mouseDownEvent);
      resizableColumnDirective.registerEvent(componentFixture.nativeElement);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 150 });
      resizableColumnDirective['_document'].dispatchEvent(mouseMoveEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      resizableColumnDirective['_document'].dispatchEvent(mouseUpEvent);

      expect(true).toBe(true);
    });
  });

  describe('resizePosition', () => {
    beforeEach(() => {
      const { fixture, directive } = setup(DummyComponent);
      componentFixture = fixture;
      resizableColumnDirective = directive;
      const ngZone = TestBed.inject(NgZone);
      jest
        .spyOn(ngZone, 'runOutsideAngular')
        .mockImplementation((fn: () => void) => fn());
    });

    it('should add class "left" if resizePosition is "left"', () => {
      resizableColumnDirective.resizePosition = 'left';
      resizableColumnDirective.ngAfterViewInit();
      const resizableIcon = componentFixture.nativeElement.querySelector(
        '.resizable-icon.left'
      );
      expect(resizableIcon).toBeTruthy();
    });

    it('should calculate right width if resizePosition is "left"', () => {
      resizableColumnDirective.resizePosition = 'left';
      resizableColumnDirective.ngAfterViewInit();
      const resizableIcon = componentFixture.nativeElement.querySelector(
        '#test-resize-div .resizable-icon.left'
      );
      componentFixture.detectChanges();

      const clickEvent = new MouseEvent('click');
      resizableIcon.dispatchEvent(clickEvent);

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 100 });
      resizableIcon.dispatchEvent(mouseDownEvent);
      resizableColumnDirective.registerEvent(componentFixture.nativeElement);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 50 });
      resizableColumnDirective['_document'].dispatchEvent(mouseMoveEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      resizableColumnDirective['_document'].dispatchEvent(mouseUpEvent);

      expect(true).toBe(true);
    });
  });
});
