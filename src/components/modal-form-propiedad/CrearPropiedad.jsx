import React from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
} from 'antd';
import PropTypes from 'prop-types';
import { NumberOutlined, UserOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { notiSuccess, notiError } from '../../utils/notifications';
import { firestore } from '../../firebase/firebase.utils';

class CrearPropiedad extends React.Component {
  formRef = React.createRef()

  constructor() {
    super();
    this.state = {
      loading: false,
      usuarios: {},
    };
  }

  componentDidMount() {
    this.getUsuarios();
  }

  getUsuarios = async () => {
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

  closeModal = () => {
    this.formRef.current.resetFields();
    const { setModalVisible } = this.props;
    setModalVisible(false, 'propiedad');
  }

  handleSubmit = async ({
    apartamento,
    habitante,
  }) => {
    this.setState({ loading: true });
    try {
      await firestore.collection('propiedades').add({
        apartamento,
        habitante: firestore.collection('usuario').doc(habitante),
      });
      notiSuccess('La propiedad se creó.');
    } catch (error) {
      notiError('Ha ocurrido un error al crear la propiedad.');
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
    const { modalPropiedad } = this.props;
    const { loading, usuarios } = this.state;

    return (
      <Modal
        title="Crear una Propiedad"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalPropiedad}
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
          name="propiedadForm"
          onFinish={this.handleSubmit}
        >
          <Form.Item
            label="Apartamento"
            name="apartamento"
            rules={[
              { required: true, message: 'Ingresa el número del apartamento' },
              { len: 4, message: 'Identificador de 4 dígitos' },
              { max: 9999, message: 'Máximo 9999' },
            ]}
          >
            <Input
              type="number"
              prefix={<NumberOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Apartameto"
            />
          </Form.Item>
          <Form.Item
            label="Habitante"
            name="habitante"
            rules={[{ required: true, message: 'Por favor selecciona un Usuario!' }]}
          >
            <Select
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Habitante"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(
                input.toLowerCase(),
              ) >= 0}
            >
              {
                _.toArray(usuarios).map((usuario) => (
                  <Select.Option key={usuario.id} value={usuario.id}>{`${usuario.nombre} ${usuario.apellido}`}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

CrearPropiedad.propTypes = {
  modalPropiedad: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
};

export default CrearPropiedad;
