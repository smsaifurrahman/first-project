import { z } from 'zod';

// Zod schema for UserName
const UserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is required')
    .max(20, 'First Name can not be more than 20 characters')
    .trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
});

// Zod schema for Guardian
const GuardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required'),
  fatherOccupation: z.string().min(1, 'Father Occupation is required'),
  fatherContactNo: z.string().min(1, 'Father Contact Number is required'),
  motherName: z.string().min(1, 'Mother Name is required'),
  motherOccupation: z.string().min(1, 'Mother Occupation is required'),
  motherContactNo: z.string().min(1, 'Mother Contact Number is required'),
});

// Zod schema for LocalGuardian
const LocalGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name is required'),
  occupation: z.string().min(1, 'Local Guardian Occupation is required'),
  contactNo: z.string().min(1, 'Local Guardian Contact Number is required'),
});

// Zod schema for Student
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: UserNameValidationSchema,
      gender: z.enum(['male', 'female', 'others'], {
        errorMap: () => ({
          message: 'Gender must be "male", "female", or "other"',
        }),
      }),
      dateOfBirth: z.date().optional(),
      email: z.string().email('Invalid email format'),
      contactNo: z.string().min(1, 'Contact Number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency Contact Number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present Address is required'),
      permanentAddress: z.string().min(1, 'Permanent Address is required'),
      guardian: GuardianValidationSchema,
      localGuardian: LocalGuardianValidationSchema,
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = { createStudentValidationSchema };
