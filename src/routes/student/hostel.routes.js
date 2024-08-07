import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import { getStudentHostelData } from "../../controller/student/hostel.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/hostel").get(getStudentHostelData)

export default router