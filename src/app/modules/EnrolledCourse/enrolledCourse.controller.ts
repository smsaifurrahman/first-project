import { HttpStatus } from "http-status-ts";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async(req,res)=> {
    console.log(req.user, 'user token');
    const userId = req.user.userId;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body );
   
sendResponse(res,{
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is enrolled successfully',
    data: result,
})
})

export const EnrolledCourseControllers = {
    createEnrolledCourse
}