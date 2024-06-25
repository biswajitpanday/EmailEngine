import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AuthStatus from "./components/AuthStatus";
import EmailClient from "./components/EmailClient";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="landing-page">
        <div className="auth-container">
          <div className="button-container">
            <AuthProvider>
              <AuthStatus />
              <EmailClient />
            </AuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
