export type UserNotficationFilter = {
  limit: number;
  timestamp: string;
  status?: string;
};

export type UserNotification = {
  id: string;
  category: string;
  content: string;
  createdDate: string;
  messageStatus: string;
  metadata: Record<string, string>;
};

export type NotificationUpdatePayload = {
  id: string;
  status: string;
};
