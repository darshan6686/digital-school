import { Router } from "express";
import { upload } from "../../middleware/multer.middleware.js";
import { verifySchool} from "../../middleware/auth.middleware.js"
import {
    changeCurrentPassword,
    changeSchoolLogo,
    getSchool,
    login,
    logout,
    refreshAccessToken,
    registerSchool,
    updateSchoolDetails
} from "../../controller/school/school.controller.js";

const router = Router()

router.route("/register-school").post(
    upload.single("logo"),
    registerSchool
)

router.route("/login").post(login)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/profile").get(verifySchool, getSchool)
router.route("/logout").delete(verifySchool, logout)
router.route("/update-school-details").patch(verifySchool, updateSchoolDetails)
router.route("/change-password").patch(verifySchool, changeCurrentPassword)
router.route("/change-school-logo").patch(
        verifySchool, 
        upload.single("logo"),
        changeSchoolLogo
    )

export default router