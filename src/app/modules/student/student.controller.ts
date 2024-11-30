import { TStudent } from './student.interface';
import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
// import Joi from 'joi';
// import { z } from "zod";
import { studentValidationSchema } from './student.validation';
// import studentValidationSchema from './student.joi.validation';



const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students data retrieved Successfully',
      data: result,
    });
  } catch (err: any) {
     next(err)
  }
};

const getSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is retrieved Successfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is deleted Successfully',
      data: result,
    });
  } catch (err: any) {
    next(err)
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent
};
