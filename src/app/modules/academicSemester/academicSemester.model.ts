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


academicSemesterSchema.pre('save', async function(next){
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
   
  })

  if(isSemesterExists){
    throw new Error('Semester already exists !')
  }
  next()
} )

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema);