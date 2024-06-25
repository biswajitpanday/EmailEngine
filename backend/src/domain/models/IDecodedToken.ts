import { JwtPayload } from 'jsonwebtoken';

interface IDecodedToken extends JwtPayload {
  email?: string;
  preferred_username?: string;
  upn?: string;
  unique_name?: string;
}

export default IDecodedToken;
