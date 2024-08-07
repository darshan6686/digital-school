import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import {
    getFees,
    getFeesById
} from "../../controller/student/fees.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/").get(getFees)
router.route("/f/:feeId").get(getFeesById)

export default router