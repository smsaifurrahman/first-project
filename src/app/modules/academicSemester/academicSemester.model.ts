import { model, Schema } from 'mongoose';
import { TAcademicSemester, TAcademicSemesterCode, TAcademicSemesterName, TMonths } from './academicSemester.interface';
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constant';



const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: true,
    enum: AcademicSemesterName,
  },
  year: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    enum: AcademicSemesterCode
  },
  startMonth: {
    type: String,
    enum: Months,
    required: true,

 
  },
  endMonth: {
    type: String,
    enum: Months,
    required: true,

  },
}, {
  timestamps:true
});


export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema);