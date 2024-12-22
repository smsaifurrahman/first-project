import { TStudent } from './student.interface';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from './student.joi.validation';

const getAllStudents = catchAsync(async (req, res) => {
  console.log(req.query);
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Students data retrieved Successfully',
    data: result,
  });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await StudentServices.getSingleStudentFromDB(id);
  console.log(result);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is retrieved Successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {student} = req.body
  const result = await StudentServices.updateStudentFromDB(id, student);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is updated Successfully',
    data: result,
  });
});
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDB(id);

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
  updateStudent
};
