import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DtcTemplate, QueryParams } from '@cps/types';
import { DtcTemplateService } from './dtc-template.service';

describe(DtcTemplateService.name, () => {
  let service: DtcTemplateService;
  const fakeDtc: DtcTemplate = {
    category: 'test',
    comment: 'test',
    criticality: 'test',
    description: 'test',
    dtcCode: 'test',
    oem: 'test',
    possibleCause: 'test',
    protocolStandard: 'test',
    recommendations: ['test'],
    source: 'test',
    symptom: 'test',
    engineType: 'engine type',
    riskAvailability: 'risk availability',
    riskDamage: 'risk damage',
    riskEmissions: 'risk emissions',
    riskSafety: 'risk safety',
    group: '',
  };

  const httpClientMocked = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  const apiUrl = 'https://example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: DtcTemplateService,
          useFactory: () => {
            return new DtcTemplateService(
              apiUrl,
              httpClientMocked as unknown as HttpClient
            );
          },
        },
      ],
    });

    service = TestBed.inject(DtcTemplateService);
  });

  it('create', () => {
    service.create(fakeDtc);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/dtcTemplates`,
      fakeDtc
    );
  });

  it('delete', () => {
    const dtcDeleteParam = {
      source: fakeDtc.source,
      protocolStandard: fakeDtc.protocolStandard,
      dtcCode: fakeDtc.dtcCode,
      oem: fakeDtc.oem,
      engineType: fakeDtc.engineType,
    };
    service.delete(fakeDtc);
    expect(httpClientMocked.delete).toHaveBeenCalledWith(
      `${apiUrl}/dtcTemplates`,
      {
        params: {
          ...dtcDeleteParam,
        },
      }
    );
  });

  it('update', () => {
    service.update(fakeDtc);
    expect(httpClientMocked.put).toHaveBeenCalledWith(
      `${apiUrl}/dtcTemplates`,
      fakeDtc
    );
  });

  it('search', () => {
    const searchParams: QueryParams = {
      search: 'test',
      page: 0,
      size: 20,
    };
    service.search(searchParams);
    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/dtcTemplates/search`,
      {
        params: {
          ...searchParams,
        },
      }
    );
  });

  it('getCriticalities', () => {
    service.getCriticalities();
    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/dtcTemplates/criticalities`
    );
  });

  it('getRisks', () => {
    service.getRisks();
    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/dtcTemplates/risks`
    );
  });
});
