import { Router } from "express";
import { verifySchool } from "../../middleware/auth.middleware.js";
import {
    getAttendanceByDate,
    getBoysandGirls,
    getStudentAndTeacherData
} from "../../controller/school/dashboard.controller.js";

const router = Router()

router.use(verifySchool)

router.route("/").get(getStudentAndTeacherData)
router.route("/count").get(getBoysandGirls)
router.route("/date").get(getAttendanceByDate)

export default router