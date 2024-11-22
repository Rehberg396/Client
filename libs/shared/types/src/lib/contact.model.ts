export interface ContactModel {
  name: string;
  email: string;
  feedback: string;
}

export interface ContactType {
  value: ContactModel;
  reset: () => void;
}