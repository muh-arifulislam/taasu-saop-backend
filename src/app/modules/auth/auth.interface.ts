export type TLoginUser = {
  email: string;
  password?: string;
  googleId?: string;
};

export type TLoginWithGoogle = {
  email: string;
  googleId: string;
};
