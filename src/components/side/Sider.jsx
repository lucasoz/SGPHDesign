// SEBAS este componente es https://ant.design/components/layout/ pero usa el sider
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import {
  Layout,
  Menu,
} from 'antd';
import {
  HomeOutlined,
  PlusCircleOutlined,
  WarningOutlined,
  UserAddOutlined,
  UserOutlined,
  BuildOutlined,
} from '@ant-design/icons';
import ListaNoticias from '../noticias/ListaNoticias';
import CrearQueja from '../modal-form-queja/CrearQueja';
import CrearUsuario from '../modal-form-usuario/CrearUsuario';
import CrearPropiedad from '../modal-form-propiedad/CrearPropiedad';
import Quejas from '../quejas/Quejas';
import Usuarios from '../usuarios/Usuarios';

const { Header, Content } = Layout;

class SiderContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      queja: false,
      usuario: false,
      propiedad: false,
    };
  }

  setModalVisible = (modal, type) => {
    this.setState({ [type]: modal });
  }

  onClickMenu = ({ key }) => {
    switch (key) {
      case 'queja':
        this.setState({ queja: true });
        break;
      case 'crearUsuario':
        this.setState({ usuario: true });
        break;
      case 'crearPropiedad':
        this.setState({ propiedad: true });
        break;
      default:
        break;
    }
  }

  render() {
    const { queja, propiedad, usuario } = this.state;
    const { history } = this.props;
    return (
      <Layout style={{ height: '100%' }}>
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
              <HomeOutlined />
              {' '}
              SGPH
            </Menu.Item>
            <Menu.Item key="queja">
              <PlusCircleOutlined />
              {' '}
              Queja
            </Menu.Item>
            <Menu.Item key="listar-quejas" onClick={() => history.push('/quejas')}>
              <WarningOutlined />
              {' '}
              Listar Quejas
            </Menu.Item>
            <Menu.Item key="crearUsuario">
              <UserAddOutlined />
              {' '}
              Crear Usuario
            </Menu.Item>
            <Menu.Item key="crearPropiedad">
              <BuildOutlined />
              {' '}
              Crear Propiedad
            </Menu.Item>
            <Menu.Item key="listarUsuarios" onClick={() => history.push('/usuarios')}>
              <UserOutlined />
              {' '}
              Listar Usuarios
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '10px 10px', marginTop: 64 }}>
          <CrearQueja modalQueja={queja} setModalVisible={this.setModalVisible} />
          <CrearPropiedad
            modalPropiedad={propiedad}
            setModalVisible={this.setModalVisible}
          />
          <CrearUsuario modalUsuario={usuario} setModalVisible={this.setModalVisible} />
          <Switch>
            <Route exact path="/" component={ListaNoticias} />
            <Route exact path="/quejas" component={Quejas} />
            <Route exact path="/usuarios" component={Usuarios} />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(SiderContainer);
