import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';
import { generateHashedPassword } from '../utils/generateHashedPasswod';

const superAdmin = {
  email: 'arifibnenam@gmail.com',
  role: USER_ROLE.superAdmin,
  accountType: 'email',
  password: 'admin123',
  firstName: 'Md. Ariful',
  lastName: 'Islam',
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
    const hashedPassword = await generateHashedPassword(superAdmin.password);

    await User.create({
      ...superAdmin,
      password: hashedPassword,
    });
  }
};
