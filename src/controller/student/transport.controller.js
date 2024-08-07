import { Student } from "../../model/student.model.js";
import { Transport } from "../../model/transport.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getTransport = asynchandler(async(req,res) => {
    const student = await Student.findById(req.student?._id)

    if (!student) {
        throw new ApiError(404, "Student not found")
    }

    const transport = await Transport.findOne({
        studentGrNumber: student.grNumber,
        isDelete: false
    }).select(
        "-isDelete"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            transport,
            "Student transport information fetched successfully"
        )
    )
})


export {
    getTransport
}