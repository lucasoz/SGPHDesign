import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Spin,
  Typography,
  Divider,
  Modal,
  Timeline,
} from 'antd';
import {
  LoadingOutlined,
  UserOutlined,
  WarningTwoTone,
  DollarCircleTwoTone,
  CalendarTwoTone,
} from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import { firestore } from '../../firebase/firebase.utils';
import { notiError } from '../../utils/notifications';

const { Meta } = Card;
const { Text } = Typography;

class CardUsuario extends React.Component {
  constructor() {
    super();

    this.state = {
      apartamento: null,
      quejas: null,
    };
  }

  componentDidMount() {
    const { usuario } = this.props;
    this.getAsyncData(usuario);
  }

  getAsyncData = async (usuario) => {
    const unsuscribePropiedades = firestore.collection('propiedades')
      .where('habitante', '==', firestore.collection('usuarios').doc(usuario.id))
      .onSnapshot(
        (snapshot) => snapshot.forEach((propiedadHab) => {
          this.setState({ apartamento: propiedadHab.data().apartamento });
        }),
        (error) => notiError(error.message),
      );
    const user = firestore.collection('usuarios').doc(usuario.id);
    const unsuscribeQuejas = firestore.collection('quejas')
      .where('usuario', '==', user)
      .where('solucionado', '==', true)
      .onSnapshot(
        (snapshot) => snapshot.forEach(async (queja) => {
          const data = queja.data();
          let solucion;
          try {
            solucion = await data.solucion.get();
          } catch (error) {
            notiError(error.message);
          }
          this.setState((state) => ({
            quejas: {
              ...state.quejas,
              [queja.id]: {
                id: queja.id,
                descripcion: data.descripcion,
                titulo: data.titulo,
                fechaQueja: moment.unix(data.fecha.seconds),
                fechaSolucion: moment.unix(data.fechaSolucion.seconds),
                tipoSolucion: data.tipoSolucion,
                solucion: solucion.data(),
              },
            },
          }));
        }),
        (error) => notiError(error.message),
      );
    this.unsuscribePropiedades = unsuscribePropiedades;
    this.unsuscribeQuejas = unsuscribeQuejas;
  }

  componentWillUnmount = () => {
    this.unsuscribePropiedades();
    this.unsuscribeQuejas();
  }

  openModal = () => this.setState({ modalIsOpen: true });

  closeModal = () => this.setState({ modalIsOpen: false });

  render() {
    const {
      usuario: {
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
      },
    } = this.props;

    const { apartamento, modalIsOpen, quejas } = this.state;
    const dataToRender = _.orderBy(quejas, ['fechaQueja'], ['asc']);

    return (
      <div>
        <Card
          hoverable
          onClick={this.openModal}
        >
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
        <Modal
          visible={modalIsOpen}
          onCancel={this.closeModal}
          footer={null}
          title="Historial de Habitabilidad"
        >
          <Timeline mode="left">
            {
              dataToRender.map(({ id, fechaQueja, titulo, descripcion, tipoSolucion, solucion }) => (
                <Timeline.Item
                  key={id}
                  label={fechaQueja.locale('es').format('MMMM DD YYYY, h:mm:ss a')}
                  dot={<WarningTwoTone style={{ fontSize: '20px' }} />}
                >
                  {titulo}
                  <br />
                  {descripcion}
                  <br />
                  {
                    tipoSolucion === 'multa'
                      ? (
                        <div>
                          <DollarCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '20px' }} />
                          {' '}
                          {Number(solucion.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                      )
                      : (
                        <div>
                          <CalendarTwoTone twoToneColor="#eb2f96" style={{ fontSize: '20px' }} />
                          {' '}
                          {moment.unix(solucion.fechaFinPenalizacion.seconds).locale('es').format('MMMM DD YYYY')}
                        </div>
                      )
                  }
                </Timeline.Item>
              ))
            }
          </Timeline>
        </Modal>
      </div>
    );
  }
}

CardUsuario.propTypes = {
  usuario: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    cedula: PropTypes.string,
    fechaNacimiento: PropTypes.shape({}),
  }).isRequired,
};

export default CardUsuario;
