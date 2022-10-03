export interface IUser {
  user_id: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  refresh_token: IRefreshToken[];
  href?: string;
}

export interface IRefreshToken {
  index: number;
  token: string;
}
