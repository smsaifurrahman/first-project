import { HttpStatus } from 'http-status-ts';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';

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

  const course = await Course.findById(isOfferedCourseExists.course);


  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Room is full !');
  }
  //check if the student is already enrolled

  const student = await Student.findOne({ id: userId }, { _id: 1 });

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

  // check if total credits exceeds maxCredit allowed

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData'
    },
    {
      $group: {_id: null, totalEnrolledCredits: {$sum: "$enrolledCourseData.credits" }}
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1
      }
    }
  ]);

  const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits: 0;

  if(totalCredits && semesterRegistration?.maxCredit &&  totalCredits +  course?.credits > semesterRegistration?.maxCredit ) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'You have exceeded maximum number of credits')
  }

  // total enrolled credits + new enrolled course credit > maxCredit

  console.log(enrolledCourses);

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const result = await EnrolledCourse.create(
        [
          {
            semesterRegistration: isOfferedCourseExists.semesterRegistration,
            academicSemester: isOfferedCourseExists.academicSemester,
            academicFaculty: isOfferedCourseExists.academicFaculty,
            academicDepartment: isOfferedCourseExists.academicDepartment,
            offeredCourse: offeredCourse,
            course: isOfferedCourseExists.course,
            student: student._id,
            faculty: isOfferedCourseExists.faculty,
            isEnrolled: true,
          },
        ],
        { session },
      );

      if (!result) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          'Failed to enroll in this course',
        );
      }

      const maxCapacity = isOfferedCourseExists.maxCapacity;
      await OfferedCourse.findByIdAndUpdate(offeredCourse, {
        maxCapacity: maxCapacity - 1,
      });

      await session.commitTransaction();
      await session.endSession();

      return result;
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};