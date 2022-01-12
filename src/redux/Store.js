import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist"; // imports from redux-persist
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reducer from "./Reducer";

const appReducer = combineReducers({
  reducer,
});
const rootReducer = (state, action) => {
  let reduxState = state;
  if (action.type === "LOGOUT") {
    if (state) {
      for (let [key, value] of Object.entries(reduxState)) {
        if (key === "staticReducer") {
          reduxState[key] = value;
        } else {
          reduxState[key] = undefined;
        }
      }
      state = reduxState;
    }
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage, // define which storage to use
};

const persistedReducers = persistReducer(persistConfig, rootReducer); // create a persisted reducer

const store = configureStore({
  reducer: persistedReducers, // pass the persisted reducer instead of rootReducer to createStore
});

const persistor = persistStore(store); // used to create the persisted store, persistor will be used in the next step

export { store, persistor };
