import { TStudent } from './student.interface';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
// import Joi from 'joi';
// import { z } from "zod";
import { studentValidationSchema } from './student.validation';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from './student.joi.validation';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Students data retrieved Successfully',
    data: result,
  });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is retrieved Successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is retrieved Successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
