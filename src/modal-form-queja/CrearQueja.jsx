import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker } from 'antd';

class CrearQueja extends React.Component {
  state = {
    loading: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalQueja, setModalVisible } = this.props;
    const { loading } = this.state;
    return (
      <Modal
        title="Realizar una queja"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalQueja}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            Crear
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item label="Apartamento involucrado">
          {getFieldDecorator('apto', {
            rules: [{ required: true, message: 'Por favor selecciona un Apartamento!' }],
          })(
            <Select
              prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Apartamento"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="1001">1001</Select.Option>
              <Select.Option value="1002">1002</Select.Option>
              <Select.Option value="1003">1003</Select.Option>
              <Select.Option value="1004">1004</Select.Option>
              <Select.Option value="2001">2001</Select.Option>
              <Select.Option value="2002">2002</Select.Option>
              <Select.Option value="2003">2003</Select.Option>
              <Select.Option value="2004">2004</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Título">
          {getFieldDecorator('titulo', {
            rules: [{ required: true, message: 'Ingresa un título!' }],
          })(
            <Input
              prefix={<Icon type="issues-close" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Título"
            />,
          )}
        </Form.Item>
        <Form.Item label="Descripción del hecho">
          {getFieldDecorator('descripcion', {
            rules: [{ required: true, message: 'Añade una descripción de lo sucedido!' }],
          })(
            <Input
              prefix={<Icon type="info-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Descripción"
            />,
          )}
        </Form.Item>
        <Form.Item label="Fecha">
          {getFieldDecorator('time-picker', {
            rules: [{ required: true, message: 'Fecha en la que sucedió el hecho' }],
          })(<DatePicker placeholder="Fecha" style={{width: "100%"}}/>)}
        </Form.Item>
      </Form>
      </Modal>
    );
  };
};

export default Form.create({ name: 'queja_form' })(CrearQueja);;