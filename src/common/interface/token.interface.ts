export interface ITokenPayload {
  sub: string;
  username: string;
  email: string;
  deviceId?: string;
  jti: string;
  iat: number;
}