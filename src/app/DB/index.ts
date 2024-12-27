
import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'smsaifur525@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  isDeleted: false,
  status: 'in-progress',
};

const seedSuperAdmin = async () => {
  // when database is connected , we will check is there any user who is super admin

 try {
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if(!isSuperAdminExits) {
    await User.create(superUser)
  }

 } catch (err) {
  console.log(err);
 }
  
};

export default seedSuperAdmin;
