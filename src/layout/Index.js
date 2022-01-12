import React, { useEffect, useState } from "react";
import Pages from "../route/Index";
import Sidebar from "./sidebar/Sidebar";
import Head from "./head/Head";
import Header from "./header/Header";
import classNames from "classnames";
import LeftPanel from "./left-panel/LeftPanel";
import AppHeader from "./header/AppHeader";
const menu = [
  {
    icon: "grid-alt",
    text: "Applications",
    active: false,
    subMenu: [
      {
        text: "Status",
        link: "/app-status",
        icon: "activity-round",
        theme: "bg-purple-dim",
      },
      {
        text: "Chats / Messenger",
        link: "/app-chat",
        icon: "chat-circle",
        theme: "bg-orange-dim",
      },
      {
        text: "Calendar",
        link: "/app-calender",
        icon: "calendar",
        theme: "bg-success-dim",
      },
    ],
  },
];
const Layout = () => {
  //Sidebar
  const [appComponent, setappComponent] = useState();
  const [mobileView, setMobileView] = useState();
  const [visibility, setVisibility] = useState(false);
  const [themeState] = useState({
    main: "clean",
    sidebar: "white",
    apps: "theme",
    header: "white",
    skin: "dark",
  });
  // main: "default",
  // sidebar: "white",
  // apps: "theme",
  // header: "white",
  // skin: "light",
  useEffect(() => {
    document.body.className = `nk-body has-apps-sidebar has-sidebar no-touch nk-nio-theme ${
      themeState.skin === "dark" ? "dark-mode" : ""
    }`;
    let apps = menu.find((item) => item.text === "Applications");
    let matched = apps.subMenu.find((sub) => process.env.PUBLIC_URL + sub.link === window.location.pathname);
    if (matched) {
      setappComponent(matched);
      document.body.classList.remove("npc-default", "npc-apps-chat", "npc-apps-calendar", "npc-apps-messages");
      document.body.classList.add("npc-apps", "apps-only", "bg-white", `npc-apps-${matched.link.split("-")[1]}`);
    } else {
      setappComponent(undefined);
      document.body.classList.remove(
        "npc-apps",
        "apps-only",
        "npc-apps-chat",
        "npc-apps-calendar",
        "npc-apps-messages"
      );
      document.body.classList.add("npc-default");
    }
  }, [window.location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    viewChange();
  }, []);

  // function to toggle sidebar
  const toggleSidebar = (e) => {
    e.preventDefault();
    if (visibility === false) {
      setVisibility(true);
    } else {
      setVisibility(false);
    }
  };

  // function to change the design view under 1200 px
  const viewChange = () => {
    if (window.innerWidth < 1200) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };
  window.addEventListener("load", viewChange);
  window.addEventListener("resize", viewChange);

  const sidebarClass = classNames({
    "nk-sidebar-mobile": mobileView,
    "nk-sidebar-active": visibility && mobileView,
  });

  return (
    <React.Fragment>
      <Head title="Credit Mountain" />
      <div className="nk-app-root">
        <LeftPanel theme={themeState.apps} />
        <div className="nk-main">
          <div className="nk-wrap">
            {appComponent ? (
              <React.Fragment>
                <AppHeader fixed theme={themeState.header} app={appComponent} sidebarToggle={toggleSidebar} />
                {visibility && (
                  <Sidebar sidebarToggle={toggleSidebar} theme={themeState.sidebar} className={sidebarClass} />
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Header fixed theme={themeState.header} sidebarToggle={toggleSidebar} />
                <Sidebar sidebarToggle={toggleSidebar} theme={themeState.sidebar} className={sidebarClass} />
              </React.Fragment>
            )}
            {visibility && <div className="nk-sidebar-overlay" onClick={toggleSidebar}></div>}
            <Pages />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Layout;
