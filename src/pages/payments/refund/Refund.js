import React from "react";
import { BlockHead, BlockHeadContent, BlockTitle } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";

const Refund = ({ data }) => {
  return (
    <React.Fragment>
      <Head title={"Users"} />
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
          <BlockHead size="xl">
            <div className="nk-block-between">
              <BlockHeadContent>
                <BlockTitle page tag="h3">
                  Refund Under Development
                </BlockTitle>
              </BlockHeadContent>
            </div>
          </BlockHead>
        </div>
      </Content>
    </React.Fragment>
  );
};

export default Refund;
