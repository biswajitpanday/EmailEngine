import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Email {
  id: string;
  subject: string;
  sender: string;
}

const DataPage: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [syncStatus, setSyncStatus] = useState('Not Started');

  useEffect(() => {
    const fetchEmails = async () => {
      setSyncStatus('Syncing...');
      try {
        const response = await axios.get('/api/emails');
        setEmails(response.data);
        setSyncStatus('Completed');
      } catch (error) {
        console.error('Error fetching emails', error);
        setSyncStatus('Error');
      }
    };

    fetchEmails();
  }, []);

  return (
    <div>
      <h1>Email Data Synchronization</h1>
      <p>Status: {syncStatus}</p>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>
            <strong>{email.subject}</strong> - {email.sender}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataPage;
