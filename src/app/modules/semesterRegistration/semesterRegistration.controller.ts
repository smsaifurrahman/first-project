import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.createSemesterRegistrationIntoDB(
        req.body,
      );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Semester Registration is created Successfully',
      data: result,
    });
  },
);


const getAllSemesterRegistrations = catchAsync(async(req: Request, res: Response)=> {
    const result = await SemesterRegistrationService.getAllSemesterRegistrationFromDB(req.query);
    sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Semester Registrations are retrieved Successfully',
        data: result,
      });
});

const getSingleSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
  
      const result =
        await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(
          id,
        );
  
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Semester Registration is retrieved successfully',
        data: result,
      });
    },
  );

  const updateSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const result =
        await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
          id,
          req.body,
        );
  
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Semester Registration is updated successfully',
        data: result,
      });
    },
  );



export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration
}