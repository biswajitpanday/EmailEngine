import React from "react";
import AxiosWrapper from "../utils/AxiosWrapper";

const AddAccount: React.FC = () => {
  const axiosWrapper = new AxiosWrapper('http://localhost:3000/api/');

  const handleAddAccount = async () => {
    try {
      const response = await axiosWrapper.get("auth/login");
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error adding account", error);
    }
  };

  return (
    <div>
      <h1>Add Outlook Account</h1>
      <button onClick={handleAddAccount}>Add Account</button>
    </div>
  );
};

export default AddAccount;
