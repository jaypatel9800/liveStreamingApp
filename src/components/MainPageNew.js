import AgoraRTC from "agora-rtc-sdk";
import axios from "axios";
import {option ,rtc, cameraVideoProfile } from "./rtc";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ChannelContext } from "./contextApi/chennal";
import "./mainpage.css"

const MainPageNew = () => {
  const [data] = useContext(ChannelContext);

  const notification = () => {
    axios.get(`${process.env.REACT_APP_FIREBASE_NOTIFICATION}=${data?.sessionSubject.replace(/\s/g, "")}`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
  }
  const joinChannel = (role) => {

    //Create Client
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    //Initialize Client
    rtc.client.init(
      option.appID,
      () => {
        console.log("successful initialize");

        //join Channel
        rtc.client.join(
          option.token ? option.token : null,
          data?.streamingChannelId,
          option.uid ? option.uid : null,
          (uid) => {
            console.log(`join channel: ${data?.streamingChannelId} successful`);
            console.log(`uid: ${uid}`);
            rtc.params.uid = uid;
            if (role === "host") {
              rtc.client.setClientRole("host");
              // Create Local Streaming
              rtc.localStream = AgoraRTC.createStream({
                streamID: rtc.params.uid,
                audio: true,
                video: true,
                screen: false,
              });

              // set video resolution
              rtc.localStream.setVideoProfile(cameraVideoProfile)

              // Initialize local streaming
              rtc.localStream.init(
                () => {
                  console.log("local stream successfully initialized");
                  rtc.localStream.play("local_stream");
                  notification();
                  rtc.client.publish(rtc.localStream, (error) => {
                    console.log("publish failed!!", error);
                  });
                },
                (error) => {
                  console.log("Local Streaming Failed!!", error);
                }
              );
              // rtc.client.on("connection-state-change", function (evt) {
              //   console.log("audience", evt);
              // });
            }
            // if (role === "audience") {
            //   console.log(rtc.client)
            //   // rtc.client.on("connection-state-change", (evt) => {
            //   //   console.log("audience", evt);
            //   // });
            //   rtc.client.on("stream-added", (evt) => {
            //     let remoteStream = evt.stream;
            //     let id = remoteStream.getId();
            //     console.log(evt)
            //     if (id !== rtc.params.uid) {
            //       rtc.client.subscribe(remoteStream, (err) => {
            //         console.log("stream subscription failed", err);
            //       });
            //     }
            //     console.log("stream-added remote-uid: ", id);
            //   });
            //   rtc.client.on("stream-removed", (evt) => {
            //     let remoteStream = evt.stream;
            //     let id = remoteStream.getId();
            //     remoteStream.close("Join-as-a-guest");
            //     console.log("stream-removed remote-uid: ", id);
            //   });

            //   rtc.client.on("stream-subscribed", (evt) => {
            //     let remoteStream = evt.stream;
            //     let id = remoteStream.getId();
            //     remoteStream.play("Join-as-a-guest");
            //     console.log("stream-subscribed remote-uid: ", id);
            //   });

            //   rtc.client.on("stream-unsubscribed", (evt) => {
            //     let remoteStream = evt.stream;
            //     let id = remoteStream.getId();
            //     remoteStream.pause("Join-as-a-guest");
            //     console.log("stream-unsubscribed remote-uid: ", id);
            //   });
            // }
          },
          (error) => console.error("client Joined Failed", error)
        );
      },
      (error) => console.log(error)
    );
  };


  return (
    <div className="firstPage">
      <Link to="/HostLive">
        <button onClick={() => joinChannel("host")}>Start Streaming</button>
      </Link>
    </div>
  );
};

export default MainPageNew;
