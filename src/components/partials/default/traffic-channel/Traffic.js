import React, { useEffect, useState } from "react";
import {
  trafficChannelData,
  trafficChannelDataSet2,
  trafficChannelDataSet3,
  trafficChannelDataSet4,
} from "../../charts/default/DefaultData";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { Icon, DataTableHead, DataTableRow, DataTableItem } from "../../../Component";
import { WPCharts } from "../../charts/default/DefaultCharts";
const HeadingClass = [
  "nk-tb-channel",
  "nk-tb-sessions",
  "nk-tb-prev-sessions",
  "nk-tb-change",
  "nk-tb-trend tb-col-sm text-right",
];
const RowClass = [];
const TrafficChannel = ({ data }) => {
  const [dd, setdd] = useState("30");
  const [trafficData, setTrafficData] = useState(trafficChannelData);

  useEffect(() => {
    if (dd === "30") {
      setTrafficData(trafficChannelDataSet3);
    } else if (dd === "15") {
      setTrafficData(trafficChannelDataSet4);
    } else {
      setTrafficData(trafficChannelDataSet2);
    }
  }, [dd]);

  return (
    <React.Fragment>
      <div className="card-inner mb-n2">
        <div className="card-title-group">
          <div className="card-title card-title-sm">
            <h6 className="title">{data?.title}</h6>
            <p>{data?.subtitle}</p>
          </div>
        </div>
      </div>
      <div className="nk-tb-list is-loose traffic-channel-table">
        <DataTableHead>
          {data?.tableHeaders?.map((header, i) => (
            <DataTableRow key={header} className={"nk-tb-channel"}>
              <span>{header}</span>
            </DataTableRow>
          ))}
        </DataTableHead>
        {data?.rows?.map((item, index) => {
          return (
            <DataTableItem className="nk-tb-item" key={item?.[0]?.toString()}>
              {item?.map((row, i) => {
                return (
                  <DataTableRow key={i} className={"nk-tb-channel"}>
                    <span className={i == 0 ? "tb-lead" : "tb-sub"}>{row ? row?.toString() : "---"}</span>
                  </DataTableRow>
                );
              })}
            </DataTableItem>
          );
        })}
      </div>
    </React.Fragment>
  );
};
export default TrafficChannel;
