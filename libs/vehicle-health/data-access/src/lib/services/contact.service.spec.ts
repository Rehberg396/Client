import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import { ContactService } from './contact.service';
import { ApiResponseModel, ContactModel } from '@cps/types';

describe(ContactService.name, () => {
  const url = 'https://api-server.com';
  let contactService: ContactService;
  let httpTesting: HttpTestingController;
  const contactRequest: ContactModel = {
    name: 'test1',
    email: 'test2',
    feedback: 'test3',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    const http = TestBed.inject(HttpClient);
    contactService = new ContactService(url, http);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('postFeedback', () => {
    it('should call API with success', (done) => {
      const mockResponse: ApiResponseModel<void> = {
        code: 'SUCCESS',
        timestamp: new Date().toISOString(),
        data: undefined,
      };

      contactService.postFeedback(contactRequest).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });

      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/contacts` && request.body === contactRequest
        );
      }, 'Request to submit user feedback');

      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should call API with error', (done) => {
      contactService.postFeedback(contactRequest).subscribe({
        error: (response: HttpErrorResponse) => {
          expect(response.status).toBe(500);
          expect(response.statusText).toBe('Internal Server Error');
          expect(response.error).toBe('Failed!');
          done();
        },
      });

      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/contacts` && request.body === contactRequest
        );
      }, 'Request to submit user feedback');

      expect(req.request.method).toBe('POST');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
