import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import { getTransport } from "../../controller/student/transport.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/transport").get(getTransport)

export default router