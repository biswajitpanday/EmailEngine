import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Container,
  Spinner,
  Col,
  Row,
  ListGroup,
  Badge,
  Card,
  ListGroupItem,
} from "react-bootstrap";
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
} from "@fortawesome/free-solid-svg-icons";
import { AppConst } from "../utils/AppConstant";
import { debounce } from "lodash";

const EmailPage: React.FC = () => {
  const [emailsByFolder, setEmailsByFolder] = useState<{
    [folderName: string]: Email[];
  }>({});
  const [selectedFolder, setSelectedFolder] = useState<string | null>("Inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [syncStatus, setSyncStatus] = useState("Not Started");
  const [connectionStatus, setConnectionStatus] = useState("Connected");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [nextLinkByFolder, setNextLinkByFolder] = useState<{
    [folderName: string]: string | null;
  }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const axiosWrapper = new AxiosWrapper(AppConst.API_BASEURL, true);
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const fetchEmailsByFolder = async () => {
    setSyncStatus("Syncing...");
    try {
      const response = await axiosWrapper.get("email/emailsByFolder");
      setEmailsByFolder(response.data);
      setSyncStatus("Completed");

      // Automatically select the first email in the Inbox
      if (response.data["Inbox"] && response.data["Inbox"].length > 0) {
        setSelectedEmail(response.data["Inbox"][0]);
      }
    } catch (error: any) {
      console.error("Error fetching emails by folder", error);
      setSyncStatus("Error");
    }
  };

  const fetchEmails = async (folderName: string, skipToken?: string) => {
    setSyncStatus("Syncing...");
    try {
      const response = await axiosWrapper.get("email/get", {
        params: { skipToken },
      });
      const { emails, nextLink } = response.data;
      setEmailsByFolder((prevEmailsByFolder) => {
        const updatedEmailsByFolder = { ...prevEmailsByFolder };

        emails.forEach((email: Email) => {
          if (!updatedEmailsByFolder[folderName]) {
            updatedEmailsByFolder[folderName] = [];
          }
          updatedEmailsByFolder[folderName].push(email);
        });

        return updatedEmailsByFolder;
      });
      setNextLinkByFolder((prevNextLinks) => ({
        ...prevNextLinks,
        [folderName]: nextLink || null,
      }));
      setSyncStatus("Completed");
    } catch (error: any) {
      console.error("Error fetching emails", error);
      setSyncStatus("Error");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchEmailsByFolder();
    }
  }, [isAuthenticated, navigate]);

  const loadMoreEmails = async (folderName: string) => {
    if (nextLinkByFolder[folderName]) {
      await fetchEmails(folderName, nextLinkByFolder[folderName]);
    }
  };

  const handleEmailCreated = useCallback(
    debounce((email: Email) => {
      console.log(`emailCreated Event: ${email}`);
      setEmailsByFolder((prevEmailsByFolder) => {
        const folderName = email.parentFolderId || "Others";
        return {
          ...prevEmailsByFolder,
          [folderName]: [email, ...(prevEmailsByFolder[folderName] || [])],
        };
      });
    }, 300),
    []
  );

  const handleEmailUpdated = useCallback(
    debounce((updatedEmail: Email) => {
      console.log(`emailUpdated Event: ${updatedEmail}`);
      setEmailsByFolder((prevEmailsByFolder) => {
        const folderName = updatedEmail.parentFolderId || "Others";
        return {
          ...prevEmailsByFolder,
          [folderName]: prevEmailsByFolder[folderName]?.map((email) =>
            email.id === updatedEmail.id ? updatedEmail : email
          ) || [],
        };
      });
    }, 300),
    []
  );

  const handleEmailDeleted = useCallback(
    debounce((emailId: string) => {
      console.log(`emailDeleted Event: ${emailId}`);
      setEmailsByFolder((prevEmailsByFolder) => {
        const updatedEmailsByFolder = { ...prevEmailsByFolder };
        Object.keys(updatedEmailsByFolder).forEach((folderName) => {
          updatedEmailsByFolder[folderName] = updatedEmailsByFolder[
            folderName
          ].filter((email) => email.id !== emailId);
        });
        return updatedEmailsByFolder;
      });
    }, 300),
    []
  );

  const attemptReconnect = useCallback(() => {
    if (isRetrying) return;

    setIsRetrying(true);
    let retries = 0;
    const maxRetries = 5;
    const retryInterval = setInterval(() => {
      if (retries >= maxRetries) {
        clearInterval(retryInterval);
        setIsRetrying(false);
        return;
      }

      socket.connect();
      retries += 1;
      setRetryCount(retries);
    }, 2000 * retries);
  }, [isRetrying]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
      setConnectionStatus("Connected");
      setIsRetrying(false);
      setRetryCount(0);
    });

    socket.on("disconnect", (reason: any) => {
      console.warn("Disconnected from server:", reason);
      setConnectionStatus("Disconnected");
      attemptReconnect();
    });

    socket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect to server...");
      setConnectionStatus("Reconnecting...");
    });

    socket.on("connect_error", (error: any) => {
      console.error("Connection error:", error);
      setConnectionStatus("Connection Error");
      attemptReconnect();
    });

    socket.on("emailCreated", handleEmailCreated);
    socket.on("emailUpdated", handleEmailUpdated);
    socket.on("emailDeleted", handleEmailDeleted);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect_attempt");
      socket.off("connect_error");
      socket.off("emailCreated", handleEmailCreated);
      socket.off("emailUpdated", handleEmailUpdated);
      socket.off("emailDeleted", handleEmailDeleted);
    };
  }, [
    attemptReconnect,
    handleEmailCreated,
    handleEmailUpdated,
    handleEmailDeleted,
  ]);

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(folderName);
    setSelectedEmail(null); // Clear selected email when folder changes
  };

  const handleRowClick = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleCloseModal = () => {
    setSelectedEmail(null);
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && selectedFolder) {
        loadMoreEmails(selectedFolder);
      }
    });

    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [selectedFolder, nextLinkByFolder]);

  const folderOrder = [
    "Inbox",
    "Drafts",
    "Sent Items",
    "Deleted Items",
    "Junk Email",
    "Archive",
  ];

  const customFolders = Object.keys(emailsByFolder).filter(
    (folderName) => !folderOrder.includes(folderName)
  );

  const getStatusBarColor = () => {
    if (connectionStatus === "Connected" && syncStatus === "Completed") {
      return "bg-success text-white";
    } else if (connectionStatus !== "Connected" && syncStatus !== "Completed") {
      return "bg-danger text-white";
    } else {
      return "bg-warning text-dark";
    }
  };

  const getDisconnectionTextColor = () => {
    if (connectionStatus !== "Connected") {
      return "text-danger";
    }
    return "";
  };

  return (
    <Container fluid className="p-0">
      <div
        className={`p-2 d-flex justify-content-between ${getStatusBarColor()}`}
      >
        <div>
          <strong>Sync Status: </strong>
          {syncStatus}
        </div>
        <div>
          <strong>Connection Status: </strong>
          <span className={getDisconnectionTextColor()}>
            {connectionStatus}
          </span>
          {isRetrying && (
            <span className="ml-2">
              (Retrying... {retryCount})
              <Spinner animation="border" size="sm" className="ml-1" />
            </span>
          )}
        </div>
      </div>
      <Row className="m-0">
        <Col md={2} className="bg-light border-right p-0">
          <ListGroup variant="flush">
            {folderOrder.map((folderName) => (
              <ListGroup.Item
                key={folderName}
                action
                onClick={() => handleFolderClick(folderName)}
                active={folderName === selectedFolder}
                className="d-flex justify-content-between align-items-center"
              >
                {folderName}
                <Badge bg="secondary">
                  {emailsByFolder[folderName]?.length || 0}
                </Badge>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="mt-3">
              <strong>Folders</strong>
            </ListGroup.Item>
            {customFolders.map((folderName) => (
              <ListGroup.Item
                key={folderName}
                action
                onClick={() => handleFolderClick(folderName)}
                active={folderName === selectedFolder}
                className="d-flex justify-content-between align-items-center"
              >
                {folderName}
                <Badge bg="secondary">
                  {emailsByFolder[folderName]?.length || 0}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={3} className="p-0">
          {selectedFolder ? (
            <Card className="h-100">
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {emailsByFolder[selectedFolder]?.map((email) => (
                    <ListGroupItem
                      key={email.id}
                      onClick={() => handleRowClick(email)}
                      className={`d-flex justify-content-between align-items-start cursor-pointer ${selectedEmail?.id === email.id ? "selected-email" : ""}`}
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
          ) : (
            <p className="p-3">Select a folder to view emails</p>
          )}
        </Col>
        <Col md={7} className="p-0">
          {selectedEmail ? (
            <Card className="h-100">
              <Card.Body>
                <h5>{selectedEmail.subject}</h5>
                <p>
                  <strong>From:</strong>{" "}
                  {selectedEmail.sender.emailAddress.name}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedEmail.sender.emailAddress.address}
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
          ) : (
            <p className="p-3">Select an email to view its details</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EmailPage;
