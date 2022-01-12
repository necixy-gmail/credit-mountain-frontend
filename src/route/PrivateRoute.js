import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";

const auth = localStorage.getItem("accessToken");

const PrivateRoute = ({ exact, component: Component, ...rest }) => {
  const TOKEN = useSelector((state) => state?.reducer?.token);
  return (
    <Route
      exact={exact ? true : false}
      rest
      render={(props) =>
        TOKEN ? (
          <Component {...props} {...rest}></Component>
        ) : (
          <Redirect to={`${process.env.PUBLIC_URL}/login`}></Redirect>
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
