import React from 'react';
import { List } from 'antd';
import _ from 'lodash';
import CardUsuario from '../card-usuario/CardUsuario';
import { firestore } from '../../firebase/firebase.utils';
import { notiError } from '../../utils/notifications';
import ModalHistorial from '../modal-historial/ModalHistorial';

class Usuarios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarios: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.getCollection();
  }

  getCollection = async () => {
    firestore.collection('usuarios')
      .onSnapshot(
        (snapshot) => snapshot.forEach((usuario) => {
          this.setState((state) => ({
            usuarios: { ...state.usuarios, [usuario.id]: { ...usuario.data(), id: usuario.id } },
          }));
        }),
        (error) => notiError(error),
      );
    this.setState({ loading: false });
  }

  render() {
    const {
      usuarios,
      loading,
    } = this.state;

    return (
      <div>
        <List
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 5,
          }}
          dataSource={_.toArray(usuarios)}
          renderItem={(item) => (
            <List.Item>
              <CardUsuario usuario={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Usuarios;
