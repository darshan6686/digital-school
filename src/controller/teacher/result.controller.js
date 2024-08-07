import mongoose from "mongoose";
import { Result } from "../../model/result.model.js";
import { Student } from "../../model/student.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addResult = asynchandler(async(req,res) => {
    const { grNumber, subject, totalMark, obtainedMark } = req.body

    if (!(grNumber && subject && totalMark && obtainedMark)) {
        throw new ApiError(400, "All field is required")
    }

    const student = await Student.findOne({
        grNumber
    })

    if (!student) {
        throw new ApiError(404, "student not found")
    }

   const total = totalMark.reduce((acc, curr) => acc + curr,0)
   const obtained = obtainedMark.reduce((acc, curr) => acc + curr,0)

   const subjects = subject.map((sub, index) => ({
        subject: sub,
        totalMark: totalMark[index],
        obtainedMark: obtainedMark[index]
    }));

    const result = await Result.create({
        student: student._id,
        teacher: req.teacher?._id,
        subjects,
        totalMark: total,
        obtainedMark: obtained
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            result,
            "result added successfully"
        )
    )
})


const getAllResult = asynchandler(async(req,res) => {
    const result = await Result.aggregate([
        {
            $match: {
                teacher: req.teacher?._id,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student"
            }
        },
        {
            $unwind: "$student"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                student: {
                    $concat: ["$student.firstName", " ", "$student.middleName", " ", "$student.lastName"]
                },
                standard: "$student.standard",
                devision: "$student.devision",
                subjects: 1,
                totalMark: 1,
                obtainedMark: 1,
                percentage: 1,
                grade: 1,
                createdAt: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "All result fetched successfully"
        )
    )
})


const getResultById = asynchandler(async(req,res) => {
    const { resultId } = req.params

    const result = await Result.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(resultId)
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student"
            }
        },
        {
            $unwind: "$student"
        },
        {
            $project: {
                _id: 1,
                student: {
                    $concat: ["$student.firstName", " ", "$student.middleName", " ", "$student.lastName"]
                },
                standard: "$student.standard",
                devision: "$student.devision",
                subjects: 1,
                totalMark: 1,
                obtainedMark: 1,
                percentage: 1,
                grade: 1,
                createdAt: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "Result fetched successfully"
        )
    )
})


const updateResult = asynchandler(async(req,res) => {
    const { resultId, subjectId } = req.params
    const { subject, totalMark, obtainedMark } = req.body
 
    if (!(resultId && subjectId)) {
        throw new ApiError(400, "resultId and subjectId is missing")
    }

    if (!(subject && totalMark && obtainedMark)) {
        throw new ApiError(400, "All field is required")
    }

    const result = await Result.findOneAndUpdate(
        {
            _id: resultId,
            "subjects._id": subjectId
        },
        {
            $set: {
                "subjects.$.subject": subject,
                "subjects.$.totalMark": totalMark,
                "subjects.$.obtainedMark": obtainedMark
            }
        },
        {
            new: true
        }
    )

    const updateResult = await Result.findById(resultId);
    const totalMarks = updateResult.subjects.reduce((sum, subj) => sum + subj.totalMark, 0);
    const obtainedMarks = updateResult.subjects.reduce((sum, subj) => sum + subj.obtainedMark, 0);

    updateResult.totalMark = totalMarks;
    updateResult.obtainedMark = obtainedMarks;

    updateResult.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updateResult,
            "Result updated successfully"
        )
    )
})


const deleteResult = asynchandler(async(req,res) => {
    const { resultId } = req.params

    if (!resultId) {
        throw new ApiError(400, "resultId is missing")
    }

    await Result.findByIdAndUpdate(
        resultId,
        {
            $set: {
                isDelete: true
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Result deleted succesfully"
        )
    )
})


export {
    addResult,
    getAllResult,
    getResultById,
    updateResult,
    deleteResult
}