import bcrypt from 'bcrypt';
import config from '../config';

export const generateHashedPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, Number(config.bcrypt_salt_rounds));
};
