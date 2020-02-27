// SEBAS este componente es https://ant.design/components/layout/ pero usa el sider
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import ListaNoticias from '../noticias/ListaNoticias';
import CrearQueja from '../modal-form-queja/CrearQueja';
import Quejas from '../quejas/Quejas';

const { Header, Content, Footer } = Layout;

class SiderContainer extends React.Component {
  state = {
    modalQueja: false,
  };

  setModalVisible = (modalQueja) => {
    this.setState({ modalQueja });
  }

  onClickMenu = ({ key }) => {
    switch (key) {
      case 'queja':
        this.setState({ modalQueja: true });
        break;
      default:
        break;
    }
  }

  render() {
    const { history } = this.props;
    return (
      <Layout style={{height: "100%"}}>
        <Header style={{
          position: 'fixed',
          overflow: 'hidden',
          zIndex: '1',
          width: '100%',
        }}
        >
          <Menu
            onClick={this.onClickMenu}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="home" onClick={() => history.push('/')}>
              <Icon type="home" />
              {' '}
              SGPH
            </Menu.Item>
            <Menu.Item key="queja">
              <Icon type="plus-circle" />
              {' '}
              Queja
            </Menu.Item>
            <Menu.Item key="listar-quejas" onClick={() => history.push('/quejas')}>
              <Icon type="warning" />
              {' '}
              Listar Quejas
            </Menu.Item>
            <Menu.Item key="4">nav 4</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '10px 10px', marginTop: 64, height: '100%' }}>
          <CrearQueja modalQueja={this.state.modalQueja} setModalVisible={this.setModalVisible} />
          <Switch>
            <Route exact path="/" component={ListaNoticias} />
            <Route exact path="/quejas" component={Quejas} />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(SiderContainer);
