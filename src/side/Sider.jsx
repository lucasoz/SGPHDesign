// SEBAS este componente es https://ant.design/components/layout/ pero usa el sider
import React from "react";
import { Layout, Menu, Breadcrumb, Icon, Modal, Button } from "antd";
import ListaNoticias from "../noticias/ListaNoticias";
import CrearQueja from "../modal-form-queja/CrearQueja";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

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
              <Menu.Item key="HOME">
                <Icon type="home" /> SGPH
              </Menu.Item>
              <Menu.Item key="queja">
                <Icon type="plus-circle" /> Queja
              </Menu.Item>
              <Menu.Item key="listar-quejas">
                <Icon type="warning" /> Listar Quejas
              </Menu.Item>
              <Menu.Item key="4">nav 4</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '10px 50px', marginTop: 64 }}>
            <CrearQueja modalQueja={this.state.modalQueja} setModalVisible={this.setModalVisible} />
            <ListaNoticias />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
    );
  }
}

export default SiderContainer;
