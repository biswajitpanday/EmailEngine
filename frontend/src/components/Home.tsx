import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { accounts } = useMsal();
  const navigate = useNavigate();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    navigate("/add-account");
  };

  const handleEmailSync = () => {
    navigate("/email");
  };

  return (
    <div className="auth-btn-container">
      <h1 className="app-title">Email Engine Core</h1>
      {isAuthenticated ? (
        <>
          <div>
            <p>Welcome: {accounts[0].username}</p>
          </div>
          <div>
            <button onClick={handleEmailSync} className="btn btn-primary">
              Sync Email
            </button>
          </div>
        </>
      ) : (
        <button onClick={handleLogin} className="btn btn-primary">
          Login with Outlook
        </button>
      )}
    </div>
  );
};

export default Home;
