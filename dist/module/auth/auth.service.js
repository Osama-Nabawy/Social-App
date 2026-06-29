"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const common_1 = require("../../common");
const common_2 = require("../../common");
const DB_1 = require("../../DB");
class AuthService {
    userRepo;
    constructor() {
        this.userRepo = new DB_1.UserRepository();
    }
    async sendOtp(body) {
        const { email } = body;
        const userExist = await this.userRepo.findOne({ email });
        const userExistInSignupCache = await (0, DB_1.getCache)(`${email}:signup`);
        if (!userExist && !userExistInSignupCache) {
            throw new common_1.BadRequestException("invalid email");
        }
        const otpDoc = await (0, DB_1.existsCache)(`${email}:otp`);
        if (otpDoc)
            throw new common_1.BadRequestException("you have allready otp");
        const otp = Math.floor(100000 + Math.random() * 900000);
        await (0, DB_1.setCache)(`${email}:otp`, otp, 3 * 60);
        (0, common_2.sendEmail)({
            to: email,
            subject: "verify your account",
            html: `<p>verify your account with this OTP ${otp}</p>`,
        });
    }
    async signup(signupDTO) {
        const userExist = await this.userRepo.findOne({ email: signupDTO.email });
        if (userExist) {
            throw new common_1.NotFoundException("User already exists");
        }
        signupDTO.password = await (0, common_1.hash)(signupDTO.password);
        await (0, DB_1.setCache)(`${signupDTO.email}:signup`, JSON.stringify(signupDTO), 5 * 60 * 60 * 24);
        await this.sendOtp({ email: signupDTO.email });
    }
    async login(loginDTO) {
        const { email, password, deviceId } = loginDTO;
        const userExist = await this.userRepo.findOne({ email });
        const match = await (0, common_1.compare)(password, userExist?.password || "bjeofkoernbksrkb;fvikmwrmgpoervrvs");
        if (!userExist)
            throw new common_1.BadRequestException("invalid credentials");
        if (!match)
            throw new common_1.BadRequestException("invalid credentials");
        const tokens = {
            accsessToken: (0, common_1.createAccessToken)(userExist._id.toString(), userExist.userName, userExist.email, loginDTO.deviceId),
            refreshToken: (0, common_1.createRefreshToken)(userExist._id.toString(), userExist.userName, userExist.email, loginDTO.deviceId),
        };
        return tokens;
    }
    ;
    async verifyAccount(body) {
        const { otp, email } = body;
        const otpDoc = await (0, DB_1.getCache)(`${email}:otp`);
        if (!otpDoc)
            throw new common_1.BadRequestException("expired otp !");
        if (otp !== otpDoc) {
            throw new common_1.BadRequestException("Wrong OTP");
        }
        let data = await (0, DB_1.getCache)(`${email}:signup`);
        await this.userRepo.create(JSON.parse(data?.toString() || ""));
        await (0, DB_1.deleteCache)(`${email}:signup`);
        await (0, DB_1.deleteCache)(`${email}:otp`);
        return true;
    }
    ;
    async logOutFromAllDevices(user) {
        await this.userRepo.updateOne({ _id: user.userId }, { credentialUpdatedAt: Date.now() });
        return true;
    }
    ;
    async refreshTokenService(refreshTokenServiceDTO) {
        const { Authorization } = refreshTokenServiceDTO;
        const refreshPayload = (0, common_1.verifyRefreshToken)(Authorization);
        if (!refreshPayload || typeof refreshPayload === "string") {
            throw new common_1.BadRequestException("invalid refresh token");
        }
        const payload = refreshPayload;
        if (!payload.deviceId) {
            throw new common_1.BadRequestException("invalid refresh token");
        }
        const cashRefreshToken = await (0, DB_1.getCache)(`rt__${payload.email}__${payload.deviceId}`);
        if (!cashRefreshToken)
            throw new common_1.BadRequestException("invalid refresh token");
        if (cashRefreshToken !== Authorization) {
            await this.logOutFromAllDevices({ userId: payload.sub });
            await (0, DB_1.deleteCache)(`rt__${payload.email}__${payload.deviceId}`);
            throw new common_1.BadRequestException("invalid refresh token");
        }
        const newTokens = {
            accessToken: (0, common_1.createAccessToken)(payload.sub, payload.username, payload.email, payload.deviceId),
            refreshToken: (0, common_1.createRefreshToken)(payload.sub, payload.username, payload.email, payload.deviceId),
        };
        await (0, DB_1.setCache)(`rt__${payload.email}__${payload.deviceId}`, newTokens.refreshToken);
        return newTokens;
    }
    ;
    async resetPassword({ email, newPassword }) {
        const userExist = await this.userRepo.findOne({ email });
        if (!userExist) {
            throw new common_1.NotFoundException("User not found");
        }
        const hashedPassword = await (0, common_1.hash)(newPassword);
        await this.userRepo.updateOne({ email }, { password: hashedPassword });
        await (0, DB_1.deleteCache)(`${email}:otp`);
    }
}
exports.authService = new AuthService();
