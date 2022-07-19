export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  refreshToken: string[];
  href?: string;
}

export const defaultRefreshToken = "";
