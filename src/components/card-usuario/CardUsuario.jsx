import React from 'react';
import {
  Card,
  Spin,
  Typography,
  Divider,
} from 'antd';
import {
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { firestore } from '../../firebase/firebase.utils';
import { notiError } from '../../utils/notifications';

const { Meta } = Card;
const { Text } = Typography;

class CardUsuario extends React.Component {
  constructor() {
    super();

    this.state = {
      apartamento: null,
    };
  }

  componentDidMount() {
    const { usuario } = this.props;
    this.getAsyncData(usuario);
  }

  getAsyncData = async (usuario) => {
    await firestore.collection('propiedades')
      .where('habitante', '==', firestore.collection('usuarios').doc(usuario.id))
      .onSnapshot(
        (snapshot) => snapshot.forEach((propiedadHab) => {
          this.setState({ apartamento: propiedadHab.data().apartamento });
        }),
        (error) => notiError(error),
      );
  }

  render() {
    const {
      usuario: {
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
      },
    } = this.props;

    const { apartamento } = this.state;

    return (
      <Card>
        <Meta
          avatar={(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '3em', marginBottom: '5px', color: '#1890ff' }} />
              {
                !apartamento
                  ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  : <Text strong>{apartamento}</Text>
              }
            </div>
          )}
          title={`${nombre} ${apellido}`}
          description={`Cédula: ${cedula}`}
        />
        <Divider dashed />
        <Text strong>{moment.unix(fechaNacimiento.seconds).locale('es').format('MMMM DD YYYY')}</Text>
      </Card>
    );
  }
}

export default CardUsuario;
