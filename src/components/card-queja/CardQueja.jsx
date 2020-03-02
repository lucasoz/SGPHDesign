import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Card,
  Typography,
  Spin,
} from 'antd';
import {
  WarningTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';
import './CardQueja.styles.scss';

const { Meta } = Card;
const { Text } = Typography;

const defState = {
  idQueja: null,
  modalIsOpen: false,
};
class CardQueja extends React.Component {
  constructor() {
    super();
    this.state = { ...defState, apartamento: null };
  }

  componentDidMount() {
    const { queja } = this.props;
    this.getAsyncData(queja);
  }

  getAsyncData = async ({ apto }) => {
    const aptoSnapshot = await apto.get();
    const { apartamento } = aptoSnapshot.data();
    this.setState({ apartamento });
  }

  render() {
    const {
      queja: {
        titulo,
        descripcion,
        fecha,
        imagen,
      },
      openModal,
      queja,
    } = this.props;
    const { apartamento } = this.state;

    return (
      <Card
        hoverable
        onClick={() => openModal({ ...queja, apartamento })}
        cover={(
          <div className="square">
            <img className="content" alt="queja" src={imagen} />
          </div>
        )}
      >
        <Meta
          avatar={(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <WarningTwoTone style={{ fontSize: '3em', marginBottom: '5px' }} />
              {
                !apartamento
                  ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  : <Text strong>{apartamento}</Text>
              }
            </div>
          )}
          title={titulo}
          description={descripcion}
        />
        <Divider dashed />
        <Text strong>{moment.unix(fecha.seconds).locale('es').format('LLLL')}</Text>
      </Card>
    );
  }
}

CardQueja.propTypes = {
  queja: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    fecha: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
      nanoseconds: PropTypes.number.isRequired,
    }).isRequired,
    imagen: PropTypes.string.isRequired,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
};

export default CardQueja;
