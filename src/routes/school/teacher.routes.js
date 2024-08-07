import { Router } from "express";
import { verifySchool } from "../../middleware/auth.middleware.js";
import {
    addTeacher,
    deleteTeacher,
    getAllTeacher,
    getTeacherById,
    searchTeacher
} from "../../controller/school/teacher.controller.js";

const router = Router()

router.use(verifySchool)

router.route("/add-teacher").post(addTeacher)
router.route("/teacher").get(getAllTeacher)
router.route("/t/:teacherId").get(getTeacherById)
router.route("/search-teacher").get(searchTeacher)
router.route("/delete-teacher/:teacherId").delete(deleteTeacher)

export default router