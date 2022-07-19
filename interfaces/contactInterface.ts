export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: number;
  message: string;
  img: string;
  dateCreated: Date;
  href?: string;
}
