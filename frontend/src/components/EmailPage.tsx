import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import AxiosWrapper from "../utils/AxiosWrapper";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { Email } from "../types/EmailType";
import socket from "../utils/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEnvelopeOpen,
  faFlag,
  faTrash,
  faSyncAlt,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

const EmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });
    socket.on("emailCreated", (email: Email) => {
      console.log(`emailCreated Event: ${email}`);
      setEmails((prevEmails) => [...prevEmails, email]);
    });

    socket.on("emailUpdated", (updatedEmail: Email) => {
      console.log(`emailUpdated Event: ${updatedEmail}`);
      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email.id === updatedEmail.id ? updatedEmail : email
        )
      );
    });

    socket.on("emailDeleted", (emailId: string) => {
      console.log(`emailDeleted Event: ${emailId}`);
      setEmails((prevEmails) =>
        prevEmails.filter((email) => email.id !== emailId)
      );
    });

    return () => {
      socket.off("emailCreated");
      socket.off("emailUpdated");
      socket.off("emailDeleted");
    };
  }, []);

  const handleRowClick = (email: Email) => {
    setSelectedEmail(email);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmail(null);
  };

  return (
    <Container className="main-content">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Email Data Synchronization</h1>
        <p className="lead">
          <small>Sync-Status: {syncStatus}</small>
        </p>
      </div>
      <Table bordered striped hover responsive>
        <thead className="thead-light">
          <tr>
            <th>Subject line</th>
            <th>Sender name</th>
            <th>Status</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => handleRowClick(email)}
              className="pe-auto"
            >
              <td>
                <strong>{email.subject}</strong>
              </td>
              <td>{email.sender.emailAddress.name}</td>
              <td>
                {email.isRead ? (
                  <FontAwesomeIcon icon={faEnvelopeOpen} title="Read" />
                ) : (
                  <FontAwesomeIcon icon={faEnvelope} title="Unread" />
                )}
                {email.isNew && (
                  <FontAwesomeIcon
                    icon={faSyncAlt}
                    title="New"
                    className="ml-2"
                  />
                )}
                {email.isMoved && (
                  <FontAwesomeIcon
                    icon={faFolder}
                    title="Moved"
                    className="ml-2"
                  />
                )}
              </td>
              <td>
                {email.isFlagged && (
                  <FontAwesomeIcon icon={faFlag} title="Flagged" />
                )}
                {email.isDeleted && (
                  <FontAwesomeIcon icon={faTrash} title="Deleted" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEmail?.subject}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>From:</strong> {selectedEmail?.sender.emailAddress.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedEmail?.sender.emailAddress.address}
          </p>
          <p>
            <strong>Received:</strong> {selectedEmail?.receivedDateTime}
          </p>
          <div>
            <strong>Body:</strong>
            <div
              dangerouslySetInnerHTML={{ __html: selectedEmail?.bodyPreview }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmailPage;
