import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SiderContainer from './components/side/Sider';
import 'antd/dist/antd.css';
import './index.css';
import './App.css';

const App = () => (
  <BrowserRouter>
    <SiderContainer />
  </BrowserRouter>
);

export default App;
