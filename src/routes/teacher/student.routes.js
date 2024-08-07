import { Router } from "express";
import { verifyTeacher } from "../../middleware/auth.middleware.js";
import {
    addStudent,
    deleteStudent,
    getAllStudent,
    getStudentById,
    searchStudent,
    updateStudentDetails
} from "../../controller/teacher/student.controller.js";

const router = Router()

router.use(verifyTeacher)

router.route("/add-student").post(addStudent)
router.route("/students").get(getAllStudent)
router.route("/s/:studentId").get(getStudentById)
router.route("/update-student-details/:studentId").patch(updateStudentDetails)
router.route("/delete-student/:studentId").delete(deleteStudent)
router.route("/search-student").post(searchStudent)

export default router