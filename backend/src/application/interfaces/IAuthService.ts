import { AccessToken } from '@azure/identity';

export interface IAuthService {
  getOnBehalfToken(idToken: string): Promise<AccessToken>;
}
