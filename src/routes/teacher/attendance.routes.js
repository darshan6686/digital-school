import { Router } from "express";
import { verifyTeacher } from "../../middleware/auth.middleware.js";
import {
    addAttendance,
    addStudentInAttendance,
    deleteAttendance,
    getAllAttendance,
    getAttendanceByDate,
    getAttendanceById,
    getAttendanceByMonth,
    getAttendanceByStudent,
    removeAttendance,
    updateAttendance
} from "../../controller/teacher/attendance.controller.js";

const router = Router()

router.use(verifyTeacher)

router.route("/add-student").post(addStudentInAttendance)
router.route("/attendances").get(getAllAttendance)
router.route("/a/:attandanceId").get(getAttendanceById)
router.route("/delete/:attandanceId").delete(deleteAttendance)
router.route("/add/:attendanceId").post(addAttendance)
router.route("/update/:attendanceId").patch(updateAttendance)
router.route("/remove/:attendanceId").delete(removeAttendance)
router.route("/date").get(getAttendanceByDate)
router.route("/student").get(getAttendanceByStudent)
router.route("/month").get(getAttendanceByMonth)

export default router