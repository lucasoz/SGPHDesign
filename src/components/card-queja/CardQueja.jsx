import React from 'react';
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

const { Meta } = Card;
const { Text } = Typography;

const defState = {
  idQueja: null,
  modalIsOpen: false,
  loading: false,
};
class CardNoticia extends React.Component {
  constructor() {
    super();
    this.state = { ...defState, apartamento: null };
  }

  componentDidMount() {
    const { queja: { apto } } = this.props;
    this.getApto(apto);
  }

  getApto = async (apto) => {
    const aptoSnapshot = await apto.get();
    const { apartamento } = aptoSnapshot.data();
    this.setState({ apartamento });
  }

  openModal = (idQueja) => {
    this.setState({ idQueja, modalIsOpen: true });
  }

  closeModal = () => {
    this.setState((state) => ({ ...state, defState }));
  }

  handleSubmit = () => {

  }

  render() {
    const { queja: { id, titulo, descripcion, fecha, apto} } = this.props;
    const { modalIsOpen, idQueja, apartamento } = this.state;

    return (
      <Card
        hoverable
        onClick={() => this.openModal(id)}
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

export default CardNoticia;
