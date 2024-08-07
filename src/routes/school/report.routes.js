import { Router } from "express";
import { verifySchool } from "../../middleware/auth.middleware.js";
import {
    addReport,
    deleteReport,
    getAllReport,
    getReportById,
    updateReport
} from "../../controller/school/report.controller.js";

const router = Router()

router.use(verifySchool)

router.route("/add-report").post(addReport)
router.route("/reports").get(getAllReport)
router.route("/r/:reportId").get(getReportById)
router.route("/update/:reportId").patch(updateReport)
router.route("/delete/:reportId").delete(deleteReport)

export default router