import { Router } from "express";
import { verifyStudent } from "../../middleware/auth.middleware.js";
import {
    getStudentAllHomework,
    getStudentHomeworkById,
    homeworkBySubject
} from "../../controller/student/homework.controller.js";

const router = Router()

router.use(verifyStudent)

router.route("/homeworks").get(getStudentAllHomework)
router.route("/h/:homeworkId").get(getStudentHomeworkById)
router.route("/homework-subject").get(homeworkBySubject)

export default router