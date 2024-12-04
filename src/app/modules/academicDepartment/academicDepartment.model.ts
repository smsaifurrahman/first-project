import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

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
    throw new Error('This department is already exits');
  }

  next();
});


academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExits = await AcademicDepartment.findOne(query);

  if (!isDepartmentExits) {
    throw new Error('This department does not exit ');
  }

  next()


})

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
