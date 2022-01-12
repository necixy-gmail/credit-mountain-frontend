import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Layout from "./layout/Index";
import Login from "./pages/auth/Login";
import PrivateRoute from "./route/PrivateRoute";
import { RedirectAs404 } from "./utils/Utils";
import { ToastContainer } from "material-react-toastify";

const App = (props) => {
  return (
    <>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login}></Route>
        <PrivateRoute exact path="" component={Layout}></PrivateRoute>
        <Route component={RedirectAs404}></Route>
      </Switch>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
    </>
  );
};
export default withRouter(App);
