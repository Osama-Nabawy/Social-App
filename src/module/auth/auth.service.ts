import { number } from "zod";
import { BadRequestException, compare, createAccessToken, createRefreshToken, hash, ITokenPayload, IUser, NotFoundException, verifyRefreshToken } from "../../common";
import { sendEmail } from "../../common";
import { deleteCache, existsCache, getCache, redisClient, setCache, UserRepository } from "../../DB";
import { LoginDTO, logOutFromAllDevicesDTO, refreshTokenServiceDTO, ResetPasswordDTO, sendOtoDTO, SignupDTO, verifyOtpDTO } from "./auth.dto"

class AuthService{

    private userRepo :UserRepository
    constructor() {
        this.userRepo = new UserRepository();
     }

    async sendOtp(body: sendOtoDTO)  {
      const { email } = body;
      const userExist = await this.userRepo.findOne({ email });
      const userExistInSignupCache = await getCache(`${email}:signup`);

      if (!userExist&& !userExistInSignupCache) {
        throw new BadRequestException("invalid email");
      }
    const otpDoc = await existsCache(`${email}:otp`);
    if (otpDoc) throw new BadRequestException("you have allready otp");
    const otp = Math.floor(100000 + Math.random() * 900000);
    await setCache(`${email}:otp`, otp,  3 * 60 );
    
    sendEmail({
        to: email,
        subject: "verify your account",
        html: `<p>verify your account with this OTP ${otp}</p>`,
    });
}


    async signup(signupDTO: SignupDTO) {
        const userExist = await this.userRepo.findOne({ email: signupDTO.email })
        if (userExist) {
            throw new NotFoundException("User already exists")
        }
        signupDTO.password = await hash(signupDTO.password)
        await setCache(`${signupDTO.email}:signup`, JSON.stringify(signupDTO),  5 * 60 *60*24 )
        await this.sendOtp({ email: signupDTO.email })
  }
  

  async login(loginDTO: LoginDTO) {
  const { email, password, deviceId } = loginDTO;
  const userExist  = await this.userRepo.findOne({ email });

  const match = await compare(
    password,
    userExist?.password || "bjeofkoernbksrkb;fvikmwrmgpoervrvs",
  );
  if (!userExist) throw new BadRequestException("invalid credentials");

  if (!match) throw new BadRequestException("invalid credentials");

  const tokens = {
    accsessToken: createAccessToken(
      userExist._id.toString(),
      userExist.userName,
      userExist.email,
      loginDTO.deviceId
    ),
    refreshToken: createRefreshToken(
      userExist._id.toString(),
      userExist.userName,
      userExist.email,
      loginDTO.deviceId
    ),
  };
  return tokens;
  };
async verifyAccount (body: verifyOtpDTO) {
  const { otp, email } = body;
  const otpDoc = await getCache(`${email}:otp`);

  if (!otpDoc) throw new BadRequestException("expired otp !");
if (otp !== otpDoc) {
  throw new BadRequestException("Wrong OTP");
}
  let data = await getCache(`${email}:signup`);
  
  await this.userRepo.create(JSON.parse(data?.toString() || "") as IUser);
  await deleteCache(`${email}:signup`);
  await deleteCache(`${email}:otp`);
  return true;
};




  async logOutFromAllDevices (user: logOutFromAllDevicesDTO) { 
  await this.userRepo.updateOne({ _id: user.userId }, { credentialUpdatedAt: Date.now() });
  return true;
};
async refreshTokenService(refreshTokenServiceDTO: refreshTokenServiceDTO) {
  const { Authorization } = refreshTokenServiceDTO;
  const refreshPayload = verifyRefreshToken(Authorization);

  if (!refreshPayload || typeof refreshPayload === "string") {
    throw new BadRequestException("invalid refresh token");
  }

  const payload = refreshPayload as ITokenPayload;

  if (!payload.deviceId) {
    throw new BadRequestException("invalid refresh token");
  }

  const cashRefreshToken = await getCache(
    `rt__${payload.email}__${payload.deviceId}`,
  );
  if (!cashRefreshToken) throw new BadRequestException("invalid refresh token");
  if (cashRefreshToken !== Authorization) {
    await this.logOutFromAllDevices({ userId: payload.sub });
    await deleteCache(`rt__${payload.email}__${payload.deviceId}`);
    throw new BadRequestException("invalid refresh token");
  }
  const newTokens = {
    accessToken: createAccessToken(
      payload.sub,
      payload.username,
      payload.email,
      payload.deviceId
    ),
    refreshToken: createRefreshToken(
      payload.sub,
      payload.username,
      payload.email,
      payload.deviceId,
    ),
  };
  await setCache(`rt__${payload.email}__${payload.deviceId}`, newTokens.refreshToken);

  return newTokens;
  };
  
  async resetPassword({ email, newPassword, otp }: ResetPasswordDTO) {
    const userExist = await this.userRepo.findOne({ email });
    if (!userExist) {
      throw new NotFoundException("User not found");
    }
    const otpDoc = await existsCache(`${email}:otp`);
    if (!otpDoc) throw new BadRequestException("expired otp !");
    const cachedOtp = await getCache(`${email}:otp`);
    if (cachedOtp !== otp) {
      throw new BadRequestException("invalid otp");
    }
    const hashedPassword = await hash(newPassword);
    await this.userRepo.updateOne({ email }, { password: hashedPassword });
    await deleteCache(`${email}:otp`);
    
  }




}





export const authService = new AuthService()