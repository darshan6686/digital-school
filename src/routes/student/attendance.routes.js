import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import {
    getAttendanceByStudent
} from "../../controller/student/attendance.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/").get(getAttendanceByStudent)

export default router