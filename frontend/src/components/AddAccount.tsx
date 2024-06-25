import React from 'react';
import { useMsal } from "@azure/msal-react";

const AddAccount: React.FC = () => {
  const { instance } = useMsal();

  const handleAddAccount = () => {
    instance.loginRedirect({
      scopes: ["Mail.Read"],
    });
  };

  return (
    <div>
      <h1>Add Outlook Account</h1>
      <button onClick={handleAddAccount}>Add Account</button>
    </div>
  );
};

export default AddAccount;
