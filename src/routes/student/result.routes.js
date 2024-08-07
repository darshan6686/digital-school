import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import {
    getResult,
    getResultById
} from "../../controller/student/result.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/").get(getResult)
router.route("/r/:resultId").get(getResultById)

export default router