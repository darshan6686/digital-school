import { Hostel } from "../../model/hostel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getStudentHostelData = asynchandler(async(req,res) => {
    const hostel = await Hostel.aggregate([
        {
            $match: {
                students: req.student?._id,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "students",
                foreignField: "_id",
                as: "students",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            address: 1,
                            city: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$students"
        },
        {
            $project: {
                isDelete: 0
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            hostel,
            "Hostel Data Fetched Successfully"
        )
    )
})


export {
    getStudentHostelData
}