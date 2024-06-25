import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { InteractionStatus } from "@azure/msal-browser";

const Home: React.FC = () => {
  const { instance, accounts, inProgress } = useMsal();
  const navigate = useNavigate();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    navigate("/add-account");
  };

  return (
    <div className="auth-btn-container">
      <h1 className="app-title">Email Engine Core</h1>
      {isAuthenticated ? (
        <div>
          <p>Logged in as: {accounts[0].username}</p>
        </div>
      ) : (
        <button onClick={handleLogin} className="auth-button">
          Login with Outlook
        </button>
      )}
    </div>
  );
};

export default Home;
