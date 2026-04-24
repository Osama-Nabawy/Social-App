import { Router } from "express";
import type {NextFunction, Request, Response} from "express"
import { isValidate } from "../../midellware/validation";
import { signupSchema } from "./auth.validation";
const router = Router();
import { authService } from "./auth.service.js";
import { isAuthenticated } from "../../midellware/Authintcation";



router.post("/send-otp", async (req:Request, res:Response, next:NextFunction) => {
    await authService.sendOtp(req.body.email);
    res.status(200).json({
        message: "OTP sent successfully",
        success: true,
    });
});
router.post("/signup", isValidate(signupSchema), async (req:Request, res:Response, next:NextFunction) => {   
        await authService.signup(req.body);
    res.status(200).json({
        message: "Signup successful, please verify your account with the OTP sent to your email",
    });
});
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    const tokens = await authService.login(req.body);
    res.status(200).json({
        message: "Login successful",
        success: true,
        data: tokens,
    })
});
router.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
    await authService.verifyAccount(req.body);
    res.status(200).json({
        message: "Account verified successfully",
        success: true,
    });
});
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
    const tokens = await authService.refreshTokenService(req.body);
    res.status(200).json({
        message: "Token refreshed successfully",
        success: true,
        data: tokens,
    });
});
router.post("/logout-all", isAuthenticated,async (req: Request, res: Response, next: NextFunction) => {
    await authService.logOutFromAllDevices(req.body);
    res.status(200).json({
        message: "Logged out of all devices successfully",
        success: true,
    });
});

export default router;