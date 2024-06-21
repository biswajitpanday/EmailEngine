declare module 'passport-outlook' {
  import { Request } from 'express';
  import { Strategy as PassportStrategy } from 'passport';

  interface StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback?: boolean;
  }

  interface Profile {
    id: string;
    displayName: string;
    name: {
      familyName: string;
      givenName: string;
      middleName?: string;
    };
    emails: Array<{
      value: string;
      type?: string;
    }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) => void;

  type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) => void;

  class Strategy extends PassportStrategy {
    constructor(options: StrategyOption, verify: VerifyFunction);
    constructor(
      options: StrategyOption & { passReqToCallback: true },
      verify: VerifyFunctionWithRequest,
    );
    name: string;
    authenticate(
      req: Request,
      options?: { state?: string; session?: boolean },
    ): void;
  }
}
