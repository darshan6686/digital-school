import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import {
    getCurrentStudent,
    loginStudent,
    logoutStudent,
    refreshAccessToken
} from "../../controller/student/student.controller.js";

const router = Router()

router.route("/login").post(loginStudent)
router.route("/profile").get(verifyStudent, getCurrentStudent)
router.route("/logout").delete(verifyStudent, logoutStudent)
router.route("/refresh-token").post(refreshAccessToken)

export default router