import React, { useEffect, useState } from "react";
import AxiosWrapper from "../utils/AxiosWrapper";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface Email {
  id: string;
  subject: string;
  sender: Sender;
}

interface Sender {
  emailAddress: EmailAddress;
}

interface EmailAddress {
  address: string;
  name: string;
}

const EmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [syncStatus, setSyncStatus] = useState("Not Started");
  const axiosWrapper = new AxiosWrapper("http://localhost:3000/api/", true);

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
    <div className="main-content">
      <Sidebar />
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Email Data Synchronization</h1>
        <p className="lead">Status: {syncStatus}</p>
      </div>
      <div className="email-list">
        <ul className="list-group">
          {emails.map((email) => (
            <li className="list-group-item email-item" key={email.id}>
              <strong>{email.subject}</strong> -{" "}
              {email.sender.emailAddress.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="email-details mt-4">
        <h2>Email Subject</h2>
        <p>
          From: <span id="emailSender">Sender Name</span>
        </p>
        <p>
          To: <span id="emailRecipient">Recipient Name</span>
        </p>
        <p>
          Date: <span id="emailDate">Email Date</span>
        </p>
        <div id="emailBody">
          <p>Email body content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
