import classNames from "classnames";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Icon from "../../components/icon/Icon";
import { setActivePage, setActiveUrl } from "../../redux/Reducer";

const MenuHeading = ({ heading }) => {
  return (
    <li className="nk-menu-heading">
      <h6 className="overline-title text-primary-alt">{heading}</h6>
    </li>
  );
};

const MenuItem = ({ icon, link, text, sub, newTab, data, ...props }) => {
  const menuHeight = (el) => {
    var totalHeight = [];
    for (var i = 0; i < el.length; i++) {
      var margin =
        parseInt(window.getComputedStyle(el[i]).marginTop.slice(0, -2)) +
        parseInt(window.getComputedStyle(el[i]).marginBottom.slice(0, -2));
      var padding =
        parseInt(window.getComputedStyle(el[i]).paddingTop.slice(0, -2)) +
        parseInt(window.getComputedStyle(el[i]).paddingBottom.slice(0, -2));
      var height = el[i].clientHeight + margin + padding;
      totalHeight.push(height);
    }

    totalHeight = totalHeight.reduce((sum, value) => (sum += value));
    return totalHeight;
  };

  const makeParentActive = (el, childHeight) => {
    let element = el.parentElement.parentElement.parentElement;
    let wrap = el.parentElement.parentElement;
    if (element.classList[0] === "nk-menu-item") {
      element.classList.add("active");
      const subMenuHeight = menuHeight(el.parentNode.children);
      wrap.style.height = subMenuHeight + childHeight - 50 + "px";
      makeParentActive(element);
    }
  };
  let currentUrl;

  if (window.location.pathname !== undefined) {
    currentUrl = window.location.pathname;
  } else {
    currentUrl = null;
  }
  useEffect(() => {
    var element = document.getElementsByClassName("nk-menu-item active current-page");
    var arrayElement = [...element];

    arrayElement.forEach((dom) => {
      if (dom.parentElement.parentElement.parentElement.classList[0] === "nk-menu-item") {
        dom.parentElement.parentElement.parentElement.classList.add("active");
        const subMenuHeight = menuHeight(dom.parentNode.children);
        dom.parentElement.parentElement.style.height = subMenuHeight + "px";
        makeParentActive(dom.parentElement.parentElement.parentElement, subMenuHeight);
      }
    });
  }, []);

  const menuItemClass = classNames({
    "nk-menu-item": true,
    "has-sub": sub,
    "active current-page": currentUrl?.replace("%20", " ") === process.env.PUBLIC_URL + "/" + data?.id,
  });

  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <li className={menuItemClass}>
      {newTab ? (
        <Link
          to={`/${data?.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nk-menu-link"
          onClick={() => {
            dispatch(setActivePage(data));
            dispatch(setActiveUrl(data?.links?.[0]?.url));
            // history.push(link);
            // history.push(link);
          }}
        >
          {icon ? (
            <span className="nk-menu-icon">
              <Icon name={icon} />
            </span>
          ) : null}
          <span className="nk-menu-text">{text}</span>
        </Link>
      ) : (
        <Link
          to={`/${data?.id}`}
          className={`nk-menu-link${sub ? " nk-menu-toggle" : ""}`}
          onClick={() => {
            dispatch(setActivePage(data));
            dispatch(setActiveUrl(data?.links?.[0]?.url));
            // history.push(link);
          }}
        >
          {icon ? (
            <span className="nk-menu-icon">
              <Icon name={icon} />
            </span>
          ) : null}
          <span className="nk-menu-text">{text}</span>
        </Link>
      )}
      {sub ? (
        <div className="nk-menu-wrap">
          <MenuSub sub={sub} />
        </div>
      ) : null}
    </li>
  );
};

const MenuSub = ({ icon, link, text, sub, ...props }) => {
  return (
    <ul className="nk-menu-sub" style={props.style}>
      {sub.map((item) => (
        <MenuItem
          link={item.link}
          icon={item.icon}
          text={item.text}
          sub={item.subMenu}
          key={item.text}
          newTab={item.newTab}
        />
      ))}
    </ul>
  );
};

const Menu = () => {
  const MENU = useSelector((state) => state?.reducer?.menu);
  return (
    <ul className="nk-menu nk-menu-md">
      {MENU?.map((item) => {
        return (
          <React.Fragment key={item.title}>
            <MenuHeading heading={item?.title} />
            {item?.items?.map((subMenu) => (
              <MenuItem
                key={subMenu?.title}
                link={subMenu?.title}
                icon={subMenu?.icon}
                text={subMenu?.title}
                data={subMenu}
              />
            ))}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default Menu;
