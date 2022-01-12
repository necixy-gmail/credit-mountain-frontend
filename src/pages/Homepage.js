import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Spinner } from "reactstrap";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { setMenu } from "../redux/Reducer";
import { MENU } from "../staticData/staticdata";

const HomePage = ({}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    history?.replace("dashboard");
    dispatch(setMenu({ menu: MENU?.[0]?.data, activeMenu: MENU?.[0]?.data?.[0]?.id }));
  }, []);

  if (true) {
    return (
      <React.Fragment>
        <Head title={"Credit Manager"} />
        <Content>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              flexDirection: "column",
              height: "80vh",
            }}
          >
            <Spinner size="xl" color="dark" />
          </div>
        </Content>
      </React.Fragment>
    );
  }
};

export default HomePage;
