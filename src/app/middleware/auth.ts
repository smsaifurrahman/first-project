import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { HttpStatus } from 'http-status-ts';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requireRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   
    const token = req.headers.authorization;

    // check if the token is sent from client
    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const {role, userId, iat} = decoded;
 

    // checking if the user exists!
  const user = await User.isUserExistByCustomId(userId);

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
  };

  if(user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number))  {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not Authorized!');
  }

    if (requireRoles && !requireRoles.includes(role)) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
