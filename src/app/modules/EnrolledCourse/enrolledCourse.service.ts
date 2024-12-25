import { HttpStatus } from 'http-status-ts';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  // check if the offeredCourse exists
  const { offeredCourse } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Offered Course not found');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Room is full !');
  }
  //check if the student is already enrolled

  const student = await Student.findOne({ id: userId }).select('_id');

  if (!student) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Student not found');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Student is already enrolled !!');
  }


};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
