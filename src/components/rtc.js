export let rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {},
  };

  export let option = {
    appID : process.env.REACT_APP_AGORA_APP_ID,
    uid : 1,
    token : null
  }
  
export let cameraVideoProfile = '480p_4'