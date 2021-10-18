import { rtc } from "./rtc";
import axios from "axios";
import { auth, firestore } from "./firebaseChat/firebase";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ChannelContext } from "./contextApi/chennal";
import ChatComp from "./firebaseChat/ChatComp";
import "./hostlive.css";

const MainFrame = () => {
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [login, setLogin] = useState(false);
  const [data] = useContext(ChannelContext);
  const history = useHistory();

  useEffect(() => {
    auth
      .signInAnonymously()
      .then(() => {
        setLogin(true);
      })
      .catch((err) => {
        console.log("userNotAbleTosignIn", err);
      });
  }, []);

  const stopNotification = () => {
    axios.get(`${process.env.REACT_APP_NOTIFICATION_STOP}=${data?.sessionSubject.replace(/\s/g, "")}`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
  }

  const LeaveHost = async () => {
    stopNotification();
    await firestore
      .collection(data?.streamingChannelId)
      .get()
      .then((res) => {
        res.forEach((element) => element.ref.delete());
      });
    await rtc.localStream.stop("local_stream");
    await rtc.localStream.close("local_stream");
    await rtc.client.leave(() => {
      console.log("Host was Leave");
    });
    await rtc.client.unpublish(rtc.localStream, (error) => {
      console.log("not able to leave as host", error);
    });
    setTimeout(() => {
      auth.signOut();
      history.replace("/Final");
    }, 3000);
  };

  const Audiomute = () => {
    if (!audio) {
      rtc.localStream.muteAudio("local_stream");
      setAudio(true);
    } else {
      rtc.localStream.unmuteAudio("local_stream");
      setAudio(false);
    }
  };

  const videoMute = () => {
    if (!video) {
      rtc.localStream.muteVideo("local_stream");
      setVideo(true);
    } else {
      rtc.localStream.unmuteVideo("local_stream");
      setVideo(false);
    }
  };

  return (
    <div className="hostlive_main">
      <h2 className="main_title">Expert Streaming Service</h2>
      <div className="video_section">
        <div
          id="local_stream"
          className="video_live"
        ></div>
        <div className="video_btns">
        <button onClick={Audiomute} className="audio_button">
          {audio ? `Audio Unmute` : `Audio Mute`}
        </button>
        <button onClick={videoMute} className="video_button">
          {video ? `video Unmute` : `Video Mute`}
        </button>
        <button className="leave_button" onClick={LeaveHost}>Leave</button>
        </div>
      </div>
      {/* {console.log(rtc)}
      {console.log(option)} */}
      {login && <ChatComp />}
    </div>
  );
};

export default MainFrame;
