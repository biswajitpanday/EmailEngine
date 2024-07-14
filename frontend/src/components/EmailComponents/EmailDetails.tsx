import React from "react";
import { Card } from "react-bootstrap";
import { Email } from "../../types/EmailType";


interface EmailDetailsProps {
  selectedEmail: Email;
}

const EmailDetails: React.FC<EmailDetailsProps> = ({ selectedEmail }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <h5>{selectedEmail.subject}</h5>
        <p>
          <strong>From:</strong> {selectedEmail.sender.emailAddress.name}
        </p>
        <p>
          <strong>Email:</strong> {selectedEmail.sender.emailAddress.address}
        </p>
        <p>
          <strong>Received:</strong> {selectedEmail.receivedDateTime}
        </p>
        <div>
          <strong>Body:</strong>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedEmail.body.content,
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default EmailDetails;
