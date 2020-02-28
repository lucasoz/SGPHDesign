import React from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
} from 'antd';
import _ from 'lodash';
import { notiSuccess, notiError } from '../../utils/notifications';
import { firestore } from '../../firebase/firebase.utils';

class CrearQueja extends React.Component {
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
    this.props.form.resetFields();
    this.props.setModalVisible(false, 'queja');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { apto, titulo, descripcion, timePiker: { _d } } = this.props.form.getFieldsValue();
        try {
          await firestore.collection('quejas').add({
            apto,
            titulo,
            descripcion,
            fecha: _d,
          });
          notiSuccess("La queja ha sido reportada.");
        } catch (error) {
          notiError("Ha ocurrido un error al reportar la queja.");
        }
        this.closeModal();
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalQueja } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        title="Realizar una queja"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalQueja}
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
                {
                  _.toArray(this.state.propiedades).map((propiedad) => (
                    <Select.Option key={propiedad.id} value={propiedad.id}>{propiedad.apartamento}</Select.Option>
                  ))
                }
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
            {getFieldDecorator('timePiker', {
              rules: [{ required: true, message: 'Fecha en la que sucedió el hecho' }],
            })(<DatePicker placeholder="Fecha" style={{width: "100%"}}/>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  };
};

export default Form.create({ name: 'queja_form' })(CrearQueja);;