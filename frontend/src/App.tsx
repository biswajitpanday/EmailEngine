import React from "react";
import AppRoutes from "./routes";
import "./App.css";
import { useMsal } from "@azure/msal-react";
import { Col, Container, Row } from "react-bootstrap";

const App: React.FC = () => {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  return (
    <>
      {!isAuthenticated && (
        <>
          <div className="auth-landing-page">
            <div className="auth-container">
              <div className="button-container">
                <AppRoutes />
              </div>
            </div>
          </div>
        </>
      )}
      {isAuthenticated && (
        <Container fluid>
          <Row>
            {/* <Col xs={2} id="sidebar-wrapper">
              <Sidebar />
            </Col> */}
            <Col xs={10} id="page-content-wrapper">
              <AppRoutes />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default App;
