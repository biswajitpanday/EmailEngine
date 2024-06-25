import axios from "axios";
import React from "react";

const EmailList: React.FC = () => {
  const [emails, setEmails] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/emails", {
          withCredentials: true,
        });
        setEmails(response.data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, []);

  return (
    <div>
      <h2>Emails:</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.emailId}>
            <strong>{email.subject}</strong> - {email.from}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
