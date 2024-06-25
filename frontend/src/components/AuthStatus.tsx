import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AuthStatus: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const { user, login, logout } = auth;

  return (
    <div className="App-header">
      <h1>Email Client Core</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login} className="auth-button">
          Login with Outlook
        </button>
      )}
    </div>
  );
};

export default AuthStatus;
