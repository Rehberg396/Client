import { HttpClient } from '@angular/common/http';
import {
  ApiResponseModel,
  UserNotficationFilter,
  UserNotification,
} from '@cps/types';

type Command =
  | 'MARK_AS_READ'
  | 'MARK_AS_UNREAD'
  | 'MASK_AS_UPDATED_ENGINE_TYPE';

export class NotificationService {
  constructor(
    private apiUrl: string,
    private http: HttpClient
  ) {}

  getNotifications(filter: UserNotficationFilter) {
    return this.http.get<ApiResponseModel<UserNotification[]>>(
      `${this.apiUrl}/notifications`,
      {
        params: {
          ...filter,
        },
      }
    );
  }

  countUnreadNotifications() {
    return this.http.get<ApiResponseModel<number>>(
      `${this.apiUrl}/notifications/unread/count`
    );
  }

  update(body: { messageId: string; command: Command }) {
    return this.http.post<void>(
      `${this.apiUrl}/notifications/${body.messageId}`,
      {},
      {
        params: {
          command: body.command,
        },
      }
    );
  }
}
