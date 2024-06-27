import {
  faFileAlt,
  faInbox,
  faPaperPlane,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Nav } from "react-bootstrap";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar bg-light border-right">
      <div className="sidebar bg-light border-right p-3">
        <h4 className="mb-4">Email Engine</h4>
        <Nav defaultActiveKey="/inbox" className="flex-column">
          <Nav.Item>
            <Nav.Link href="/inbox">
              <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/sent">
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Sent
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/drafts">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Drafts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/trash">
              <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Trash
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
