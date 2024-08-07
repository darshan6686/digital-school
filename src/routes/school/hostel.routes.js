import { Router } from "express";
import { verifySchool } from "../../middleware/auth.middleware.js";
import {
    addHostel,
    addToStudent,
    deleteHostel,
    getAllhostel,
    getHostelById,
    removeToStudent,
    updateHostelDetails
} from "../../controller/school/hostel.controller.js"

const router = Router()

router.use(verifySchool)

router.route("/add-hostel").post(addHostel)
router.route("/hostel").get(getAllhostel)
router.route("/h/:hostelId").get(getHostelById)
router.route("/update-hostel/:hostelId").patch(updateHostelDetails)
router.route("/delete-hostel/:hostelId").delete(deleteHostel)
router.route("/add-student/:hostelId").post(addToStudent)
router.route("/remove-student/:hostelId/:studentId").delete(removeToStudent)

export default router