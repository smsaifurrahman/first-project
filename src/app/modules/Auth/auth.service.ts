import { HttpStatus } from 'http-status-ts';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payLoad: TLoginUser) => {
  // checking if the user exists!
  const user = await User.isUserExistByCustomId(payLoad.id);

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'This User is not found');
  }

  // checking if the User is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, 'This User is deleted');
  }
  // checking if the User is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This User is blocked');
  }

  // check if the password is correct
  if (!(await User.isPasswordMatched(payLoad?.password, user?.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, 'Password do not matched');
  }

  // Access Granted: Send Access token, Refresh token
  // create token and sent to the client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  // checking if the user exists!
  const user = await User.isUserExistByCustomId(userData.userId);

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'This User is not found');
  }

  // checking if the User is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, 'This User is deleted');
  }
  // checking if the User is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This User is blocked');
  }

  // check if the password is correct
  if (!(await User.isPasswordMatched(payLoad.oldPassword, user?.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, 'Password do not matched');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { id: userData.userId, role: userData.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

// const refreshToken = async (token: string) => {
//   console.log(token);
//   console.log('pk token');
//   const decoded = jwt.verify(
//     token,
//     config.jwt_refresh_secret as string,
//   ) as JwtPayload;

//   console.log('After pk token');
//   const { userId, iat } = decoded;

//   // checking if the user exists!
//   const user = await User.isUserExistByCustomId(userId);

//   if (!user) {
//     throw new AppError(HttpStatus.NOT_FOUND, 'This User is not found');
//   }

//   // checking if the User is already deleted
//   const isDeleted = user?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(HttpStatus.FORBIDDEN, 'This User is deleted');
//   }
//   // checking if the User is blocked

//   const userStatus = user?.status;
//   if (userStatus === 'blocked') {
//     throw new AppError(HttpStatus.FORBIDDEN, 'This User is blocked');
//   }

//   if (
//     user.passwordChangedAt &&
//     User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
//   ) {
//     throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not Authorized!');
//   }

//   // create access token and sent to the client

//   const jwtPayload = {
//     userId: user.id,
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   return {
//     accessToken,
//   };
// };

const refreshToken = async (token: string) => {
  // checking if the given token is valid

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistByCustomId(userId);

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await User.isUserExistByCustomId(userId);

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user?.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token,
) => {
  // checking if the user is exist
  const user = await User.isUserExistByCustomId(payload?.id);

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  // if id in token matches with the id provided from client
  if (payload?.id !== decoded?.userId) {
    throw new AppError(HttpStatus.FORBIDDEN, 'You are forbidden');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { id: decoded.userId, role: decoded.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
