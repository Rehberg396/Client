import { HttpClient } from '@angular/common/http';
import { ContactModel } from '@cps/types';

export class ContactService {
  constructor(
    private apiUrl: string,
    private httpClient: HttpClient
  ) {}
  public postFeedback(data: ContactModel) {
    return this.httpClient.post(`${this.apiUrl}/contacts`, data);
  }
}
