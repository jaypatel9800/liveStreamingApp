import firebase from "firebase/app";
import { firestore } from "./firebase";
import { useState, useContext, useRef } from "react";
import { ChannelContext } from "../contextApi/chennal";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./chatComp.css";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import testImg from '../../assets/test.png'

const ChatComp = () => {
  const [formValue, setFormValue] = useState("");  
  const dummy = useRef()
  const [data] = useContext(ChannelContext);
  const massageRef = firestore.collection(data?.streamingChannelId);
  const query = massageRef.orderBy("createdAt").limit(30);
  const [messages] = useCollectionData(query, { idField: "id" });



  const sendMessage = async (e) => {
    e.preventDefault();
    await massageRef.add({
      _id: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      text: formValue,
      user: {
        _id: "Host",
        avatar: data?.psychicImage.match(/\.(jpeg|jpg|gif|png)$/) ? data.psychicImage : testImg,
        name: "Host",
      },
    });
    setFormValue("");
    dummy.current.scrollIntoView({behavior:'smooth'})
  };

  const deleteText = async (id) => {
    await massageRef.doc(id).delete();
  };

  return (
    <div className="chat_section chat_section2">
      {messages && (
        <div className="massage_section">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`massage${
                msg.user.name === "Host" ? "Send" : "Receive"
              }`}
            >
              <div className="massage_person">
                {msg.user.avatar && <img style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} src={msg.user.avatar} alt="avatar" />}
                {!msg.user.avatar && <img style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} src={testImg} alt="avatar" />}
              </div>
              <div
                className={`massageText${
                  msg.user.name === "Host" ? "Send" : "Receive"
                }`}
              >
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <h4 className="user_name">{msg.user.name}</h4>
                </div>
                <p>{msg.text}</p>
              </div>
              <button className="delete_btn" onClick={() => deleteText(msg.id)}>
                <HighlightOffRoundedIcon/>
              </button>
            </div>
          ))}
          <div ref={dummy}></div>
        </div>
      )}
      <form className="massage_input" onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a messaage"
        />

        <button className="massage_btn" type="submit" disabled={!formValue}>
          <SendRoundedIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatComp;
