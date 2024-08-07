import { Router } from "express";
import { verifySchool } from "../../middleware/auth.middleware.js";
import {
    addFees,
    deleteFees,
    getAllFees,
    getAllFeesByClass,
    getFeesById,
    updateFees
} from "../../controller/school/fees.controller.js";

const router = Router()

router.use(verifySchool)

router.route("/add-fees").post(addFees)
router.route("/fees").get(getAllFees)
router.route("/f/:feeId").get(getFeesById)
router.route("/update/:feeId").patch(updateFees)
router.route("/delete/:feeId").delete(deleteFees)
router.route("/f").get(getAllFeesByClass)

export default router