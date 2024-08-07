import { Router } from "express";
import { verifyTeacher } from "../../middleware/auth.middleware.js";
import {
    addResult,
    deleteResult,
    getAllResult,
    getResultById,
    updateResult
} from "../../controller/teacher/result.controller.js";

const router = Router()

router.use(verifyTeacher)

router.route("/add-result").post(addResult)
router.route("/result").get(getAllResult)
router.route("/r/:resultId").get(getResultById)
router.route("/update/:resultId/:subjectId").patch(updateResult)
router.route("/delete/:resultId").delete(deleteResult)

export default router