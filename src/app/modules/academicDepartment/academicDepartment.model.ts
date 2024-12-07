import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import { HttpStatus } from 'http-status-ts';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

// Avoiding duplication department creation

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExits = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExits) {
    throw new AppError( HttpStatus.NOT_FOUND  ,'This department is already exits');
  }

  next();
});



academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExits = await AcademicDepartment.findOne(query);

  if (!isDepartmentExits) {
    throw new AppError( HttpStatus.NOT_FOUND,'This department does not exit ');
  }

  next()


})

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
