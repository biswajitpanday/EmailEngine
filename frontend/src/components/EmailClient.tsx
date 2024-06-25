import { useContext } from "react";
import EmailList from "./EmailList";
import { AuthContext } from "../context/AuthContext";

const EmailClient: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.user) return null;

  return (
    <div className="App">
      <header className="App-header">
        <EmailList />
      </header>
    </div>
  );
};

export default EmailClient;
