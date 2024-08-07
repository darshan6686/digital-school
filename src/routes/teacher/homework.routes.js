import { Router } from "express";
import { verifyTeacher } from "../../middleware/auth.middleware.js";
import { addHomework, deleteHomework, getAllHomework, getHomeworkById, updateHomework } from "../../controller/teacher/homework.controller.js";

const router = Router()

router.use(verifyTeacher)

router.route("/add-homework").post(addHomework)
router.route("/homework").get(getAllHomework)
router.route("/h/:homeworkId").get(getHomeworkById)
router.route("/update-homework/:homeworkId").patch(updateHomework)
router.route("/delete-homework/:homeworkId").delete(deleteHomework)

export default router