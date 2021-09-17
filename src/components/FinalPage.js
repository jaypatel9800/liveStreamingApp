import { useHistory } from "react-router-dom";
import "./finalpage.css"

const LastMassage = () => {
  const history = useHistory();
  return (
    <div className="finalPage">
      <h1>Thanks for Joined</h1>
      <button onClick={() => history.replace("/")}>Participate Again</button>
    </div>
  );
};

export default LastMassage;
