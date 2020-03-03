/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Switch,
  DatePicker,
  Spin,
  Typography,
  Divider,
  Card,
} from 'antd';
import {
  DollarCircleOutlined,
  CalendarOutlined,
  LoadingOutlined,
  WarningTwoTone,
} from '@ant-design/icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import { notiSuccess, notiError } from '../../utils/notifications';
import { firestore } from '../../firebase/firebase.utils';

const { Meta } = Card;
const { Text } = Typography;

const defaultState = {
  checked: false,
  loading: false,
};

class ModalSolucion extends React.Component {
  formRef = React.createRef()

  constructor() {
    super();
    this.state = defaultState;
  }

  closeModal = () => {
    const { closeModal } = this.props;
    this.setState({ ...defaultState });
    this.formRef.current.resetFields();
    closeModal();
  }

  handleSubmit = async ({
    multa,
    valor,
    fechaPenalizacion,
  }) => {
    this.setState({ loading: true });
    const { queja: { id }, solucionarQueja } = this.props;
    const queja = firestore.collection('quejas').doc(id);
    const { _d: fechaHoy } = moment();
    try {
      let solucion;
      let tipoSolucion;
      if (multa) {
        solucion = await firestore.collection('multas').add({
          valor,
          fechaMulta: fechaHoy,
        });
        tipoSolucion = 'multa';
      } else {
        const { _d } = fechaPenalizacion;
        solucion = await firestore.collection('penalizaciones').add({
          fechaPenalizacion: fechaHoy,
          fechaFinPenalizacion: _d,
        });
        tipoSolucion = 'penalizacion';
      }
      await queja.update({
        solucionado: true,
        tipoSolucion,
        solucion,
      });
      solucionarQueja(id);
      notiSuccess('La queja ha sido solucionada.');
    } catch (error) {
      notiError(error.message);
    }
    this.closeModal();
  };

  validate = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        this.handleSubmit(values);
      })
      .catch(() => null);
  }

  onChangeSwitch = (checked) => {
    this.setState({ checked });
  }

  render() {
    const {
      modalIsOpen,
      queja: {
        titulo,
        descripcion,
        fecha,
        apartamento,
      },
    } = this.props;

    const {
      checked,
      loading,
    } = this.state;

    return (
      <Modal
        title="Solucionar una queja"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalIsOpen}
        onCancel={this.closeModal}
        onOk={this.validate}
        footer={[
          <Button key="back" size="large" onClick={this.closeModal}>
            Cancelar
          </Button>,
          <Button key="submit" size="large" type="primary" loading={loading} onClick={this.validate}>
            Crear
          </Button>,
        ]}
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
        <Text strong>{moment.unix(fecha ? fecha.seconds : 0).locale('es').format('LLLL')}</Text>
        <Divider dashed />
        <Form
          style={{ textAlign: 'center' }}
          ref={this.formRef}
          layout="vertical"
          name="quejaForm"
          onFinish={this.handleSubmit}
        >
          <Form.Item
            style={{ textAlign: 'center', marginBottom: '0px' }}
            name="multa"
          >
            <Switch
              checked={checked}
              checkedChildren={<DollarCircleOutlined />}
              unCheckedChildren={<CalendarOutlined />}
              onChange={this.onChangeSwitch}
            />
          </Form.Item>
          <Text strong>{checked ? 'Multa' : 'Penalización'}</Text>
          {checked
            ? (
              <Form.Item
                label="Valor de la Multa"
                name="valor"
                rules={[
                  { required: true, message: 'Ingresa el valor de la multa' },
                  { min: 5, message: 'Mínimo $10.000' },
                ]}
              >
                <Input
                  type="number"
                  prefix={<DollarCircleOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="$ 10.000"
                />
              </Form.Item>
            )
            : (
              <Form.Item
                label="Fecha Fin Penalización"
                name="fechaPenalizacion"
                rules={[{ required: true, message: 'Fecha en la cual terminará la penalización' }]}
              >
                <DatePicker placeholder="Fecha Fin Penalización" style={{ width: '100%' }} />
              </Form.Item>
            )}
        </Form>
      </Modal>
    );
  }
}

ModalSolucion.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  queja: PropTypes.shape({
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
    fecha: PropTypes.shape({
      seconds: PropTypes.number,
      nanoseconds: PropTypes.number,
    }),
    apartamento: PropTypes.string,
    imagen: PropTypes.string,
  }),
  solucionarQueja: PropTypes.func.isRequired,
};

ModalSolucion.defaultProps = {
  queja: {
    fecha: {
      seconds: 0,
    },
  },
};

export default ModalSolucion;
