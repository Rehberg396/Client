import { TestBed } from '@angular/core/testing';
import { provideEnvironment } from './vehicle-health.provider';
import { VH_ENVIRONMENT } from './token';

describe(provideEnvironment.name, () => {
  const setup = async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideEnvironment({
          vh: 'https://vh.test',
          sm: 'https://sm.test',
          keycloak: {
            clientId: 'test',
            realm: 'test',
            resource: 'test',
            url: 'https://authserver.test',
          },
          checkForUpdateRate: 10,
          production: false,
          refreshRate: 10,
        }),
      ],
    }).compileComponents();
  };

  it('env', async () => {
    await setup();

    const env = TestBed.inject(VH_ENVIRONMENT);

    expect(env).toEqual({
      vh: 'https://vh.test',
      sm: 'https://sm.test',
      keycloak: {
        clientId: 'test',
        realm: 'test',
        resource: 'test',
        url: 'https://authserver.test',
      },
      checkForUpdateRate: 10,
      production: false,
      refreshRate: 10,
    });
  });
});
