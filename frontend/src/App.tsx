import React from "react";
import AppRoutes from "./routes";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="landing-page">
        <div className="auth-container">
          <div className="button-container">
            <AppRoutes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
