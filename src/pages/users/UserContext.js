import React, { useState, createContext } from "react";
import { useSelector } from "react-redux";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const userData = useSelector((state) => state?.reducer?.userListData);
  const [data, setData] = useState(userData);

  return <UserContext.Provider value={{ contextData: [data, setData] }}>{props.children}</UserContext.Provider>;
};
