import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import "antd/dist/antd.css";
import SiderContainer from "./components/side/Sider";
import "./index.css";
import './App.css';

const App = () => (
  <BrowserRouter>
    <SiderContainer />
  </BrowserRouter>
);

export default App;
