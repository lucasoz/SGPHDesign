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

class CrearPropiedad extends React.Component {
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
    this.props.form.resetFields();
    this.props.setModalVisible(false, 'propiedad');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { apartamento, habitante } = this.props.form.getFieldsValue();
        try {
          await firestore.collection('propiedades').add({
            apartamento,
            habitante: firestore.collection('usuario').doc(habitante),
          });
          notiSuccess("La propiedad se creó.");
        } catch (error) {
          notiError("Ha ocurrido un error al crear la propiedad.");
        }
        this.closeModal();
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalPropiedad } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        title="Crear una Propiedad"
        centered
        okText="Crear"
        cancelText="Cancelar"
        visible={modalPropiedad}
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
          <Form.Item label="Apartamento">
            {getFieldDecorator('apartamento', {
              rules: [{ required: true, message: 'Ingresa el número del apartamento' }],
            })(
              <Input
                type="number"
                prefix={<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Apartameto"
              />,
            )}
          </Form.Item>
          <Form.Item label="Habitante">
            {getFieldDecorator('habitante', {
              rules: [{ required: true, message: 'Por favor selecciona un Usuario!' }],
            })(
              <Select
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Habitante"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  _.toArray(this.state.usuarios).map((usuario) => (
                    <Select.Option key={usuario.id} value={usuario.id}>{`${usuario.nombre} ${usuario.apellido}`}</Select.Option>
                  ))
                }
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'propiedad_form' })(CrearPropiedad);
