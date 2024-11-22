import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TemplatePageTitleStrategy } from './template-page-title-strategy';

@Component({
  standalone: true,
  selector: 'vh-stub',
  template: '',
})
class StubComponent {
  constructor(public title: Title) {}
}

describe(TemplatePageTitleStrategy.name, () => {
  const setup = async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideRouter([
          {
            path: '**',
            component: StubComponent,
            title: 'Test',
          },
        ]),
        { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
      ],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/test', StubComponent);
    const fixture = harness.fixture;

    return {
      component,
      fixture,
    };
  };

  it('should update title', async () => {
    const { component } = await setup();
    expect(component.title.getTitle()).toBe('Vehicle Health | Test');
  });
});
