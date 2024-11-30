import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;

    // data validation using Zod
    //   const zodParsedData = studentValidationSchema.parse(studentData)
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
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};
