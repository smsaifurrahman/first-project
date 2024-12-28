import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const createStudent: RequestHandler = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;


  // will call service func to send this data
  const result = await UserServices.createStudentIntoDB(   req.file, password, studentData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  console.log(req.body);
  // console.log(facultyData);

  const result = await UserServices.createFacultyIntoDB(req.file, password, facultyData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(req.file,password, adminData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const status = req.body;
  const result = await UserServices.changeStatus(id, status);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'User status changed successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createAdmin,
  createFaculty,
  getMe,
  changeStatus,
};
