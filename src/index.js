import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./assets/scss/dashlite.scss";
import "./assets/scss/style-email.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";

const Error404Modern = lazy(() => import("./pages/error/404-modern"));

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <React.Fragment>
          <Suspense fallback={<div />}>
            <Router history={history} basename={`/`}>
              <Route
                render={({ location }) => (location.state && location.state.is404 ? <Error404Modern /> : <App />)}
              />
            </Router>
          </Suspense>
        </React.Fragment>
      </PersistGate>
    </Provider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
