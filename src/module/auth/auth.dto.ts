export interface SignupDTO  {
    email: string,
    userName: string,
    password: string,
    age: number,
    phoneNumber?:string
}

export interface LoginDTO{
    email: string,
    password: string
    deviceId: string
}

export interface sendOtoDTO{
    email: string,
}

export interface verifyOtpDTO {
    email: string,
    otp: string
}
export interface refreshTokenServiceDTO { 
    Authorization: string
    

}

export interface RefreshTokenService{
    authorization: string,
    deviceId:string
}

export interface Payload{
  sub: string;
  username: string;
  email: string;
  deviceId?: string;
  jti: string;
}

export interface logOutFromAllDevicesDTO {
    userId: string;
}

