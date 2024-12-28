import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleware/validateRequest';

import auth from '../../middleware/auth';
import { studentValidations } from './student.validation';

const router = express.Router();

// will call controller function

router.get('/', StudentControllers.getAllStudents);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty'),
  StudentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = router;
