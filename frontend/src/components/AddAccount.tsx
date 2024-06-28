import React, { useEffect } from "react";
import AxiosWrapper from "../utils/AxiosWrapper";
import { useAccount, useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { LOCAL_STORAGE_KEYS } from "../utils/LocalStorageConstant";
import { useNavigate } from "react-router-dom";

const AddAccount: React.FC = () => {
  const axiosWrapper = new AxiosWrapper("https://localhost:3000/api/");
  const navigate = useNavigate();

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          scopes: ["api://075a2d84-8568-4c25-b893-d1e8bd9ace8b/.default"],
          account: instance.getAllAccounts()[0],
        })
        .then((response) => {
          console.log(response.accessToken);
          collectOnBehalfOfToken(response.idToken);
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              scopes: ["api://075a2d84-8568-4c25-b893-d1e8bd9ace8b/.default"],
              account: instance.getAllAccounts()[0],
            });
          } else {
            console.error("Token acquisition failed", error);
          }
        });
    }
  }, [account, instance]);

  const collectOnBehalfOfToken = async (idToken: string) => {
    try {
      const response = await axiosWrapper.post("/auth/login", { idToken });
      console.log(`On Behalf Of Token : ${response.data.token}`);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, response.data.token);
      navigate("/emails");
    } catch (error) {
      console.error("Error collecting On Behalf Of Token", error);
    }
  };
  return (
    <div className="container center-screen">
      {inProgress && <h3>Adding Outlook Account & Fetching your Emails...</h3>}
    </div>
  );
};

export default AddAccount;
