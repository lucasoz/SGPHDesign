import React from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
} from 'antd';
import {
  HomeOutlined,
  IssuesCloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { notiSuccess, notiError } from '../../utils/notifications';
import { firestore } from '../../firebase/firebase.utils';

class CrearQueja extends React.Component {
  formRef = React.createRef()

  constructor() {
    super();
    this.state = {
      propiedades: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.getPropiedades();
  }

  getPropiedades = async () => {
    firestore.collection('propiedades')
      .onSnapshot(
        (snapshot) => snapshot.forEach((propiedad) => {
          this.setState((state) => ({
            propiedades: {
              ...state.propiedades,
              [propiedad.id]: { ...propiedad.data(), id: propiedad.id },
            },
          }));
        }),
        (error) => notiError(error),
      );
    this.setState({ loading: false });
  }

  closeModal = () => {
    this.formRef.current.resetFields();
    const { setModalVisible } = this.props;
    setModalVisible(false, 'queja');
  }

  handleSubmit = async ({
    apto,
    titulo,
    descripcion,
    timePiker: { _d },
  }) => {
    this.setState({ loading: true });
    try {
      await firestore.collection('quejas').add({
        apto: firestore.collection('propiedades').doc(apto),
        titulo,
        descripcion,
        fecha: _d,
      });
      notiSuccess('La queja ha sido reportada.');
    } catch (error) {
      notiError('Ha ocurrido un error al reportar la queja.');
    }
    this.closeModal();
    this.setState({ loading: false });
  };

  validate = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        this.handleSubmit(values);
      })
      .catch(() => null);
  }

  render() {
    const { modalQueja } = this.props;
    const { loading, propiedades } = this.state;

    return (
      <Modal
        title="Realizar una queja"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalQueja}
        onCancel={this.closeModal}
        onOk={this.validate}
        footer={[
          <Button key="back" onClick={this.closeModal}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.validate}>
            Crear
          </Button>,
        ]}
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          name="quejaForm"
          onFinish={this.handleSubmit}
        >
          <Form.Item
            label="Apartamento involucrado"
            name="apto"
            rules={[{ required: true, message: 'Por favor selecciona un Apartamento!' }]}
          >
            <Select
              prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Apartamento"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(
                input.toLowerCase(),
              ) >= 0}
            >
              {
                _.toArray(propiedades).map((propiedad) => (
                  <Select.Option
                    key={propiedad.id}
                    value={propiedad.id}
                  >
                    {propiedad.apartamento}
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="Título"
            name="titulo"
            rules={[{ required: true, message: 'Ingresa un título!' }]}
          >
            <Input
              prefix={<IssuesCloseOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Título"
            />
          </Form.Item>
          <Form.Item
            label="Descripción del hecho"
            name="descripcion"
            rules={[{ required: true, message: 'Añade una descripción de lo sucedido!' }]}
          >
            <Input
              prefix={<InfoCircleOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Descripción"
            />
          </Form.Item>
          <Form.Item
            label="Fecha"
            name="timePiker"
            rules={[{ required: true, message: 'Fecha en la que sucedió el hecho' }]}
          >
            <DatePicker placeholder="Fecha" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

CrearQueja.propTypes = {
  modalQueja: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
};

export default CrearQueja;
