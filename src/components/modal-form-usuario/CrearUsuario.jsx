import React from 'react';
import { Form, Icon, Input, Button, Modal, Select, DatePicker } from 'antd';
import { firestore } from '../../firebase/firebase.utils.js'
import { notiSuccess, notiError } from '../../utils/notifications';

class CrearUsuario extends React.Component {
  state = {
    loading: false,
  };

  closeModal = () => {
    this.props.form.resetFields();
    this.props.setModalVisible(false, 'usuario');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { nombre, apellido, cedula, fechaNacimiento: { _d } } = this.props.form.getFieldsValue();
        try {
          await firestore.collection('usuarios').add({
            nombre,
            apellido,
            cedula,
            fechaNacimiento: _d,
          });
          notiSuccess("El usuario ha sido creado.");
        } catch (error) {
          notiError("Ha ocurrido un error al crear el usuario.");
        }
        this.closeModal();
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalUsuario } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        title="Crear un Usuario"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalUsuario}
        onCancel={this.closeModal}
        footer={[
          <Button key="back" onClick={this.closeModal}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            Crear
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label="Nombre">
            {getFieldDecorator('nombre', {
              rules: [{ required: true, message: 'Ingresa un nombre!' }],
            })(
              <Input
                prefix={<Icon type="bold" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Nombre"
              />,
            )}
          </Form.Item>
          <Form.Item label="Apellidos">
            {getFieldDecorator('apellido', {
              rules: [{ required: true, message: 'Ingresa un apellido!' }],
            })(
              <Input
                prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Apellido"
              />,
            )}
          </Form.Item>
          <Form.Item label="Cédula">
            {getFieldDecorator('cedula', {
              rules: [{ required: true, message: 'Ingresa la cédula!' }],
            })(
              <Input
                type="number"
                prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Cedula"
              />,
            )}
          </Form.Item>
          <Form.Item label="Fecha de Nacimiento">
            {getFieldDecorator('fechaNacimiento', {
              rules: [{ required: true, message: 'Agrega la fecha de nacimiento' }],
            })(<DatePicker placeholder="Fecha" style={{width: "100%"}}/>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  };
};

export default Form.create({ name: 'usuario_form' })(CrearUsuario);