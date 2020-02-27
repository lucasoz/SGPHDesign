import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import "antd/dist/antd.css";
import SiderContainer from "./components/side/Sider";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <SiderContainer />
  </BrowserRouter>, document.getElementById("root"));
