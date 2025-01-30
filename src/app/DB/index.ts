import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superAdmin = {
  email: 'arifibnenam@gmail.com',
  role: USER_ROLE.superAdmin,
  accountType: 'email',
  password: 'admin123',
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
    await User.create(superAdmin);
  }
};
