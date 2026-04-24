"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../../midellware/validation");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
const auth_service_js_1 = require("./auth.service.js");
const Authintcation_1 = require("../../midellware/Authintcation");
router.post("/send-otp", async (req, res, next) => {
    await auth_service_js_1.authService.sendOtp(req.body.email);
    res.status(200).json({
        message: "OTP sent successfully",
        success: true,
    });
});
router.post("/signup", (0, validation_1.isValidate)(auth_validation_1.signupSchema), async (req, res, next) => {
    await auth_service_js_1.authService.signup(req.body);
    res.status(200).json({
        message: "Signup successful, please verify your account with the OTP sent to your email",
    });
});
router.post("/login", async (req, res, next) => {
    const tokens = await auth_service_js_1.authService.login(req.body);
    res.status(200).json({
        message: "Login successful",
        success: true,
        data: tokens,
    });
});
router.post("/verify", async (req, res, next) => {
    await auth_service_js_1.authService.verifyAccount(req.body);
    res.status(200).json({
        message: "Account verified successfully",
        success: true,
    });
});
router.post("/refresh", async (req, res, next) => {
    const tokens = await auth_service_js_1.authService.refreshTokenService(req.body);
    res.status(200).json({
        message: "Token refreshed successfully",
        success: true,
        data: tokens,
    });
});
router.post("/logout-all", Authintcation_1.isAuthenticated, async (req, res, next) => {
    await auth_service_js_1.authService.logOutFromAllDevices(req.body);
    res.status(200).json({
        message: "Logged out of all devices successfully",
        success: true,
    });
});
exports.default = router;
