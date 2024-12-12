
import { HttpStatus } from 'http-status-ts';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

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
      `This Semester is already ${currentSemesterStatus}.status `,
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

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB
};
