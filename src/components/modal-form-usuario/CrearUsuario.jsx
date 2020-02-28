import React from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
} from 'antd';
import PropTypes from 'prop-types';
import { CreditCardOutlined, BoldOutlined, EditOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase/firebase.utils';
import { notiSuccess, notiError } from '../../utils/notifications';

class CrearUsuario extends React.Component {
  formRef = React.createRef()

  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  closeModal = () => {
    this.formRef.current.resetFields();
    const { setModalVisible } = this.props;
    setModalVisible(false, 'usuario');
  }

  handleSubmit = async ({
    nombre,
    apellido,
    cedula,
    fechaNacimiento: { _d },
  }) => {
    this.setState({ loading: true });
    try {
      await firestore.collection('usuarios').add({
        nombre,
        apellido,
        cedula,
        fechaNacimiento: _d,
      });
      notiSuccess('El usuario ha sido creado.');
    } catch (error) {
      notiError('Ha ocurrido un error al crear el usuario.');
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
    const { modalUsuario } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        title="Crear un Usuario"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalUsuario}
        onOk={this.validate}
        onCancel={this.closeModal}
        footer={[
          <Button key="back" size="large" onClick={this.closeModal}>
            Cancelar
          </Button>,
          <Button key="submit" size="large" type="primary" loading={loading} onClick={this.validate}>
            Crear
          </Button>,
        ]}
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          name="usuarioForm"
          onFinish={this.handleSubmit}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingresa un nombre!' }]}
          >
            <Input
              prefix={<BoldOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Nombre"
            />
          </Form.Item>
          <Form.Item
            label="Apellidos"
            name="apellido"
            rules={[{ required: true, message: 'Ingresa un apellido!' }]}
          >
            <Input
              prefix={<EditOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Apellido"
            />
          </Form.Item>
          <Form.Item
            label="Cédula"
            name="cedula"
            rules={[{ required: true, message: 'Ingresa la cédula!' }]}
          >
            <Input
              type="number"
              prefix={<CreditCardOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Cedula"
            />
          </Form.Item>
          <Form.Item
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            rules={[{ required: true, message: 'Agrega la fecha de nacimiento' }]}
          >
            <DatePicker placeholder="Fecha" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

CrearUsuario.propTypes = {
  modalUsuario: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
};

export default CrearUsuario;
