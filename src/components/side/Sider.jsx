// SEBAS este componente es https://ant.design/components/layout/ pero usa el sider
import React from "react";
import { Switch, Route, Redirectm, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon, Modal, Button } from "antd";
import { withRouter } from 'react-router-dom';
import ListaNoticias from "../noticias/ListaNoticias";
import CrearQueja from "../modal-form-queja/CrearQueja";

const { Header, Content, Footer} = Layout;

class SiderContainer extends React.Component {
  state = {
    modalQueja: false,
  };

  setModalVisible = (modalQueja) => {
    this.setState({ modalQueja });
  }

  onClickMenu = ({ key })=>{
    switch (key) {
      case 'queja':
        this.setState({ modalQueja: true });
        break;
    }
  }

  render() {
    const { history } = this.props;
    return (
        <Layout>
          <Header style={{
            position: "fixed",
            overflow: "hidden",
            zIndex: '1',
            width: "100%"
          }}>
            <Menu
              onClick={this.onClickMenu}
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="HOME" onClick={()=>history.push("/")}>
                <Icon type="home" /> SGPH
              </Menu.Item>
              <Menu.Item key="queja">
                <Icon type="plus-circle" /> Queja
              </Menu.Item>
              <Menu.Item key="listar-quejas" onClick={()=>history.push("/quejas")}>
                <Icon type="warning" /> Listar Quejas
              </Menu.Item>
              <Menu.Item key="4">nav 4</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '10px 10px', marginTop: 64 }}>
            <CrearQueja modalQueja={this.state.modalQueja} setModalVisible={this.setModalVisible} />
            <Switch>
              <Route exact path="/" component={ListaNoticias} />
              <Route exact path="/quejas" component={"aasdawdwad"} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
    );
  }
}

export default withRouter(SiderContainer);
