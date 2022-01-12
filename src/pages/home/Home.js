import React, { useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import ActiveUser from "../../components/partials/default/active-user/ActiveUser";
import UserMap from "../../components/partials/default/user-map/UserMap";
import WebsitePerformance from "../../components/partials/default/website-perfomance/WebsitePerfomance";
import AudienceOverview from "../../components/partials/default/audience-overview/AudienceOverview";
import SessionDevice from "../../components/partials/default/session-devices/SessionDevice";
import TrafficDougnut from "../../components/partials/default/traffic-dougnut/TrafficDoughnut";
import PageViewer from "../../components/partials/default/page-view/PageView";
import BrowserUser from "../../components/partials/default/browser-users/BrowserUser";
import TrafficChannel from "../../components/partials/default/traffic-channel/Traffic";
import { DropdownToggle, DropdownMenu, Card, UncontrolledDropdown, DropdownItem } from "reactstrap";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  PreviewAltCard,
} from "../../components/Component";

const Home = () => {
  const [sm, updateSm] = useState(false);
  return (
    <React.Fragment>
      <Head title="Credit Mountain" />
      <Content>
        <BlockHead size="sm">
          <div className="nk-block-between">
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Credit Mountain
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Welcome to Dashboard.</p>
              </BlockDes>
            </BlockHeadContent>
          </div>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col lg="7" xxl="6">
              <PreviewAltCard className="h-100 card-bordered">
                <AudienceOverview />
              </PreviewAltCard>
            </Col>
            <Col md="6" lg="5" xxl="3">
              <PreviewAltCard className="h-100 card-bordered">
                <ActiveUser />
              </PreviewAltCard>
            </Col>
            <Col xxl="6">
              <Card className="card-bordered h-100">
                <BrowserUser />
              </Card>
            </Col>
            <Col md="6" xxl="3">
              <PreviewAltCard className="h-100 card-bordered">
                <UserMap />
              </PreviewAltCard>
            </Col>
            <Col md="6" xxl="3">
              <PreviewAltCard className="h-100 card-bordered" bodyClass="h-100 stretch flex-column">
                <SessionDevice />
              </PreviewAltCard>
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Home;
