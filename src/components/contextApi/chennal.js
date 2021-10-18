import { useState, useEffect, createContext } from "react";

export const ChannelContext = createContext();

export const ChannelProvider = (props) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("kasambaData.json")
      .then((response) => response.json())
      .then((json) => setData(json));
  });
  return(
      <ChannelContext.Provider value={[data]}>
          {props.children}
      </ChannelContext.Provider>
  )
};
