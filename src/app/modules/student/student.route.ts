import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { updateStudentValidationSchema } from './student.validation';
import auth from '../../middleware/auth';

const router = express.Router();

// will call controller function

router.get('/', StudentControllers.getAllStudents);

router.get('/:id', auth('student', 'admin', 'faculty'), StudentControllers.getSingleStudent);

router.patch('/:id', validateRequest(updateStudentValidationSchema), StudentControllers.updateStudent);

router.delete('/:id', StudentControllers.deleteStudent);


export const StudentRoutes = router;
