import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';
import catchAsync from '../../utils/catchAsync';

const createStudent : RequestHandler = catchAsync(async (
  req,
  res,
  next,
) => {

    const { password, student: studentData } = req.body;

    // const { error,value } = studentValidationSchema.validate(studentData);

    // will call service func to send this data
    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Student is created successfully',
      data: result,
    });

}) ;

export const UserControllers = {
  createStudent,
};
