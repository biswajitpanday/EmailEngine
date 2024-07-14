import React from "react";
import { ListGroup, Badge } from "react-bootstrap";

interface FolderListProps {
  folderOrder: string[];
  customFolders: string[];
  emailsByFolder: { [folderName: string]: any[] };
  selectedFolder: string | null;
  handleFolderClick: (folderName: string) => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folderOrder,
  customFolders,
  emailsByFolder,
  selectedFolder,
  handleFolderClick,
}) => {
  return (
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
          <Badge bg="secondary">{emailsByFolder[folderName]?.length || 0}</Badge>
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
          <Badge bg="secondary">{emailsByFolder[folderName]?.length || 0}</Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default FolderList;
