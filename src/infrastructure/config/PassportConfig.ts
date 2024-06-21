import passport from 'passport';
import { Strategy as OutlookStrategy } from 'passport-outlook';
import { UserModel } from '../persistence/documents/UserModel';
import { TYPES } from '../di/types';
import { container } from '../di/container';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { Request } from 'express';

const userRepository: IUserRepository = container.get<IUserRepository>(
  TYPES.UserRepository,
);

passport.use(
  new OutlookStrategy(
    {
      clientID: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      callbackURL: process.env.AZURE_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void,
    ) => {
      try {
        let user = await userRepository.findByEmail(profile.emails[0].value);
        if (!user) {
          user = new UserModel(
            profile.emails[0].value,
            undefined,
            accessToken,
            refreshToken,
          );
          await userRepository.create(user);
        } else {
          user.outlookToken = accessToken;
          user.refreshToken = refreshToken;
          await userRepository.update(user.id!, user);
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.getById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
