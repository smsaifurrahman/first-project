
import { HttpStatus } from 'http-status-ts';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import mongoose from 'mongoose';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {

  // check if there is any registered semester that is already 'UPCOMING' | 'ONGOING

  const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      {status: RegistrationStatus.UPCOMING},
      {status: RegistrationStatus.ONGOING},
    ]
  });

  if(isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status}registered semester exit !`,
    );
  }


  // check if the semester exists
  const academicSemester = payload?.academicSemester;
  console.log(academicSemester);

  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
    console.log(isAcademicSemesterExists);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'This Academic Semester is not found',
    );
  }
  // check if the semester is already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.CONFLICT,
      'This Semester is already registered',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};


const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>,) => {
 const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields();


 const result = await semesterRegistrationQuery.modelQuery;
 return result;

}

const getSingleSemesterRegistrationFromDB = async(id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
   
}

const updateSemesterRegistrationIntoDB = async(id: string, payload: Partial<TSemesterRegistration> ) => {

  //check if the requested registered semester exists 

  // check if the semester is already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);


  if (!isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'This Semester is not found',
    );
  }

  // if the requested semester registration's status is 'ENDED', we will not update anything
  const currentSemesterStatus  = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status
  console.log(currentSemesterStatus);

  if(currentSemesterStatus=== RegistrationStatus.ENDED)  {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `This Semester is already ${currentSemesterStatus} `,
    );
  }

  // UPCOMING --> ONGOING --> ---> ENDED
  if(currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus ===RegistrationStatus.ENDED) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus} `,
    );
  
  }
  if(currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus ===RegistrationStatus.UPCOMING) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus} `,
    );
  
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });

  return result;



}

const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // checking if the semester registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'This registered semester is not found !',
    );
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not update as the registered semester is ${semesterRegistrationStatus}`,
    );
  }

  const session = await mongoose.startSession();

  //deleting associated offered courses

  try {
    session.startTransaction();

    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      },
    );

    if (!deletedOfferedCourse) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      );
    }

    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemesterRegistration) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB
};
