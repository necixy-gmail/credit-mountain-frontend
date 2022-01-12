import React, { Suspense, useLayoutEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Homepage from "../pages/Homepage";
import UserDetails from "../pages/users/UserDetails";
import { MENU } from "../staticData/staticdata";
import { RedirectAs404 } from "../utils/Utils";

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} render={(props) => <Homepage {...props} />}></Route>
        {MENU?.map?.((sidebar) => {
          return (
            sidebar?.data?.length &&
            sidebar?.data?.map?.((item) =>
              item?.items?.map((row, index) => {
                if (row?.render)
                  return (
                    <Route
                      key={row?.id}
                      exact
                      path={`${process.env.PUBLIC_URL}/${row?.id}`}
                      render={row?.render}
                    ></Route>
                  );
                else
                  return (
                    <Route
                      key={row?.id}
                      exact
                      path={`${process.env.PUBLIC_URL}/${row?.id}`}
                      component={row.component}
                    ></Route>
                  );
              })
            )
          );
        })}
        <Route exact path={`${process.env.PUBLIC_URL}/user-details/:id`} component={UserDetails}></Route>
        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
