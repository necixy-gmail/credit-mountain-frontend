import classNames from "classnames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { Icon, TooltipComponent } from "../../components/Component";

import LogoSmall from "../../images/logo-small.png";
import LogoDark from "../../images/logo-dark-small.png";
import { setActivePage, setActiveUrl, setMenu } from "../../redux/Reducer";
import { useHistory } from "react-router";
import { MENU } from "../../staticData/staticdata";
const LeftPanel = ({ theme }) => {
  let currentUrl;

  if (window.location.pathname !== undefined) {
    currentUrl = window.location.pathname;
  } else {
    currentUrl = null;
  }

  const activeMenu = useSelector((state) => state?.reducer?.activeMenu);
  const dispatch = useDispatch();
  const history = useHistory();
  const appSidebarClass = classNames({
    "nk-apps-sidebar": true,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
  });
  return (
    <div className={appSidebarClass}>
      <div className="nk-apps-brand">
        <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
          <img className="logo-light logo-img" src={LogoSmall} alt="logo" />
          <img className="logo-dark logo-img" src={LogoDark} alt="logo-dark" />
        </Link>
      </div>
      <div className="nk-sidebar-element">
        <div className="nk-sidebar-body">
          <SimpleBar className="nk-sidebar-content">
            <div className="nk-sidebar-menu">
              <ul className="nk-menu apps-menu">
                {MENU?.map((item, index) => {
                  if (item?.data?.length) {
                    return (
                      <React.Fragment key={index}>
                        <TooltipComponent id={"dashboard" + index} text={item.title} direction="right" />
                        <li
                          className={`nk-menu-item ${activeMenu === item?.id ? "active current-page" : ""}`}
                          key={index}
                          id={"dashboard" + index}
                          onClick={() => {
                            dispatch(setMenu({ menu: item?.data, activeMenu: item?.id }));
                            dispatch(setActivePage(item?.data?.[0]?.items?.[0]));

                            history.push(item?.data?.[0]?.items?.[0]?.id);
                          }}
                        >
                          <Link to={""} className="nk-menu-link">
                            <span className="nk-menu-icon">
                              <Icon name={item?.icon}></Icon>
                            </span>
                          </Link>
                        </li>
                      </React.Fragment>
                    );
                  }
                })}
              </ul>
            </div>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
