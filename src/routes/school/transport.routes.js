import { Router } from "express";
import { verifySchool } from "../../middleware/auth.middleware.js";
import {
    addStudentInTransport,
    deleteTransport,
    getAllStudent,
    getTransportByBusNumber,
    getTransportStudentById,
    updateTransport
} from "../../controller/school/transport.controller.js";

const router = Router()

router.use(verifySchool)

router.route("/add-transport").post(addStudentInTransport)
router.route("/transports").get(getAllStudent)
router.route("/t/:transportId").get(getTransportStudentById)
router.route("/update-transport/:transportId").patch(updateTransport)
router.route("/delete-transport/:transportId").delete(deleteTransport)
router.route("/transport-busnumber").post(getTransportByBusNumber)

export default router