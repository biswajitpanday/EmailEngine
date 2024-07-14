import React from "react";
import { ListGroup, ListGroupItem, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen, faFlag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Email } from "../../types/EmailType";

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  handleRowClick: (email: Email) => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmail,
  handleRowClick,
  bottomRef,
}) => {
  return (
    <Card className="h-100">
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {emails.map((email) => (
            <ListGroupItem
              key={email.id}
              onClick={() => handleRowClick(email)}
              className={`d-flex justify-content-between align-items-start cursor-pointer ${
                selectedEmail?.id === email.id ? "selected-email" : ""
              }`}
            >
              <div className="email-details">
                <span className={!email.isRead ? "fw-bold" : ""}>
                  {email.subject}
                </span>
                <br />
                <small>{email.sender.emailAddress.name}</small>
              </div>
              <div className="email-status d-flex align-items-center">
                {email.isRead ? (
                  <FontAwesomeIcon
                    icon={faEnvelopeOpen}
                    title="Read"
                    className="email-icon-glow-read me-2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    title="Unread"
                    className="email-icon-glow-unread me-2"
                  />
                )}
                <FontAwesomeIcon
                  icon={faFlag}
                  title="Flagged"
                  className={
                    `ms-2 ` +
                    (email.flag?.flagStatus === "flagged"
                      ? "email-icon-glow-flag"
                      : "")
                  }
                />
                {email.isDeleted && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    title="Deleted"
                    className="ms-2"
                  />
                )}
              </div>
            </ListGroupItem>
          ))}
          <div ref={bottomRef} />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default EmailList;
