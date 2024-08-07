import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import {
    getReport,
    getReportById
} from "../../controller/student/report.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/").get(getReport)
router.route("/r/:reportId").get(getReportById)

export default router