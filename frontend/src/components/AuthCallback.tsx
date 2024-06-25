import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const response = await axios.get(
            `http://localhost:3000/auth/outlook/callback?code=${code}`,
            {
              withCredentials: true,
            }
          );
          if (response.data.user) {
            navigate("/");
          }
        } else {
          console.error("Authorization code is missing");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
      }
    };
    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
