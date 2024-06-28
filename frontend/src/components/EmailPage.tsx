import React, { useEffect, useState } from "react";
import AxiosWrapper from "../utils/AxiosWrapper";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { Email } from "../types/EmailType";

const EmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [syncStatus, setSyncStatus] = useState("Not Started");
  const axiosWrapper = new AxiosWrapper("https://localhost:3000/api/", true);

  const navigate = useNavigate();
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

    const fetchEmails = async () => {
      setSyncStatus("Syncing...");
      try {
        const response = await axiosWrapper.get("email/get");
        setEmails(response.data);
        setSyncStatus("Completed");
      } catch (error: any) {
        console.error("Error fetching emails", error);
        setSyncStatus("Error");
      }
    };

    fetchEmails();
  }, [isAuthenticated, navigate]);

  return (
    <div className="container main-content">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Email Data Synchronization</h1>
        <p className="lead"><small>Sync-Status: {syncStatus}</small></p>
      </div>
      <div className="email-list">
        <table className="table table-bordered table-striped">
          <thead className="thead-light">
            <tr>
              <th scope="col">Subject line</th>
              <th scope="col">Sender name</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td>
                  <strong>{email.subject}</strong>
                </td>
                <td>{email.sender.emailAddress.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailPage;
