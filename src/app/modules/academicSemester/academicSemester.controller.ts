import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester  = catchAsync(async (
  req,
  res,
) => {

    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body)

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Academic semester is created successfully',
      data: result,
    });

}) ;

export const AcademicSemesterControllers = {
    createAcademicSemester,
};
