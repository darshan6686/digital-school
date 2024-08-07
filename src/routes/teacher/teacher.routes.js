import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentTeacher,
    loginTeacher,
    logoutTeacher,
    refreshAccessToken,
    updateTeacherDetails
} from "../../controller/teacher/teacher.controller.js";
import { verifyTeacher } from "../../middleware/auth.middleware.js";

const router = Router()

router.route("/login").post(loginTeacher)
router.route("/teacher").get(verifyTeacher, getCurrentTeacher)
router.route("/logout").delete(verifyTeacher, logoutTeacher)
router.route("/change-password").patch(verifyTeacher, changeCurrentPassword)
router.route("/update-teacher-details").patch(verifyTeacher, updateTeacherDetails)
router.route("/refresh-token").post(refreshAccessToken)

export default router