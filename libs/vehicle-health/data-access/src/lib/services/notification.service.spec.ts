import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiResponseModel, UserNotification } from '@cps/types';
import { ContactService } from './contact.service';
import { NotificationService } from './notification.service';

describe(ContactService.name, () => {
  const url = 'https://api-server.com';
  let httpTesting: HttpTestingController;
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    const http = TestBed.inject(HttpClient);
    service = new NotificationService(url, http);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getNotifications', () => {
    it('shoud call api with success', (done) => {
      const mockResponse: ApiResponseModel<UserNotification[]> = {
        code: 'SUCCESS',
        data: [
          {
            id: 'test',
            category: 'test',
            content: 'test',
            createdDate: '2024-01-01T00:00:00Z',
            messageStatus: 'unread',
            metadata: {
              vin: 'test',
            },
          },
        ],
        timestamp: new Date().toISOString(),
      };

      service
        .getNotifications({ limit: 5, timestamp: new Date().toJSON() })
        .subscribe((next) => {
          expect(mockResponse).toEqual(next);
          done();
        });

      const req = httpTesting.expectOne((request) => {
        return request.url === `${url}/notifications`;
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('shoud call api with error', (done) => {
      service
        .getNotifications({
          limit: 5,
          timestamp: '2024-01-01T00:00:00Z',
          status: 'read',
        })
        .subscribe({
          error: (response: HttpErrorResponse) => {
            expect(response.status).toBe(500);
            expect(response.statusText).toBe('Internal Server Error');
            expect(response.error).toBe('Failed!');
            done();
          },
        });
      const req = httpTesting.expectOne((request) => {
        return (
          request.urlWithParams ===
          `${url}/notifications?limit=5&timestamp=2024-01-01T00:00:00Z&status=read`
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('countUnreadNotifications', () => {
    it('shoud call api with success', (done) => {
      const mockResponse: ApiResponseModel<number> = {
        code: 'SUCCESS',
        data: 1,
        timestamp: new Date().toISOString(),
      };
      service.countUnreadNotifications().subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });
      const req = httpTesting.expectOne((request) => {
        return request.url === `${url}/notifications/unread/count`;
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('shoud call api with error', (done) => {
      service.countUnreadNotifications().subscribe({
        error: (response: HttpErrorResponse) => {
          expect(response.status).toBe(500);
          expect(response.statusText).toBe('Internal Server Error');
          expect(response.error).toBe('Failed!');
          done();
        },
      });
      const req = httpTesting.expectOne((request) => {
        return request.url === `${url}/notifications/unread/count`;
      });
      expect(req.request.method).toBe('GET');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('update', () => {
    it('shoud call api with success', (done) => {
      service
        .update({ messageId: 'test', command: 'MARK_AS_READ' })
        .subscribe(() => {
          done();
        });
      const req = httpTesting.expectOne((request) => {
        return (
          request.urlWithParams ===
          `${url}/notifications/test?command=MARK_AS_READ`
        );
      });
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('shoud call api with error', (done) => {
      service
        .update({ command: 'MASK_AS_UPDATED_ENGINE_TYPE', messageId: 'test' })
        .subscribe({
          error: (response: HttpErrorResponse) => {
            expect(response.status).toBe(500);
            expect(response.statusText).toBe('Internal Server Error');
            expect(response.error).toBe('Failed!');
            done();
          },
        });
      const req = httpTesting.expectOne((request) => {
        return (
          request.urlWithParams ===
          `${url}/notifications/test?command=MASK_AS_UPDATED_ENGINE_TYPE`
        );
      });
      expect(req.request.method).toBe('POST');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
