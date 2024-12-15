import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(
    CourseValidations.createCourseValidationSchema,
  ),
  CourseControllers.createCourse,
);

router.get(
  '/:id', auth('admin', 'faculty', 'student'),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(
    CourseValidations.updateCourseValidationSchema,
  ),
  CourseControllers.updateCourse,
);

router.delete(
    '/:id',
    CourseControllers.deleteCourse,
  );

  router.put('/:courseId/assign-faculties', validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourseControllers.assignFacultiesWithCourse);

  router.delete('/:courseId/remove-faculties', validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourseControllers.removeFacultiesFromCourse)

router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router;
