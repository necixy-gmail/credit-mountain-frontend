import { createSlice } from "@reduxjs/toolkit";

const saveSlice = createSlice({
  name: "one",
  initialState: {
    mainMenu: [],
    leftIcons: [],
    extraIcons: [],
    menu: [],
    activeMenu: "",
    activePage: {},
    user: undefined,
    activeUrl: "",
    stocksData: undefined,
    authenticated: false,
    token: undefined,
    userListData: [],
  },

  reducers: {
    setUser(state, action) {
      return {
        ...state,
        user: action.payload?.user,
        token: action?.payload?.token,
      };
    },
    setMainMenu(state, action) {
      return {
        ...state,
        mainMenu: action.payload.mainMenu,
        leftIcons: action?.payload?.leftIcons,
        extraIcons: action?.payload?.extraIcons,
      };
    },
    setMenu(state, action) {
      return {
        ...state,
        menu: action.payload?.menu,
        activeMenu: action?.payload?.activeMenu,
      };
    },
    setActivePage(state, action) {
      return {
        ...state,
        activePage: action?.payload,
      };
    },
    setActiveUrl(state, action) {
      return {
        ...state,
        activeUrl: action?.payload,
      };
    },
    setStockData(state, action) {
      return {
        ...state,
        stocksData: action?.payload,
      };
    },
    setAuthenticated(state, action) {
      return {
        ...state,
        authenticated: action?.payload,
      };
    },
    setUsersListData(state, action) {
      return {
        ...state,
        userListData: action?.payload,
      };
    },
  },
});

const { actions, reducer } = saveSlice;

export const {
  setMenu,
  setMainMenu,
  setActivePage,
  setUser,
  setActiveUrl,
  setStockData,
  logout_app,
  setAuthenticated,
  setUsersListData,
} = actions;

export default reducer;
