import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ ...props }) => {
  return (
    <Helmet>
      (<title>{props.title ? props.title : null} </title>)
    </Helmet>
  );
};
export default Head;
