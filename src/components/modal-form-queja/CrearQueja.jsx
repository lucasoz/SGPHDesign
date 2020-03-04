/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
  Upload,
  message,
  Divider,
  Progress,
} from 'antd';
import {
  HomeOutlined,
  IssuesCloseOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { notiSuccess, notiError } from '../../utils/notifications';
import { firestore, storage } from '../../firebase/firebase.utils';

class CrearQueja extends React.Component {
  formRef = React.createRef()

  constructor() {
    super();
    this.state = {
      propiedades: {},
      loading: false,
      loadingImage: false,
      isLoadingImage: false,
      imageUrl: null,
      percent: 0,
    };
  }

  componentDidMount() {
    this.getPropiedades();
  }

  componentWillUnmount() {
    this.unsuscribe();
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Sólo se admiten archivos JPG/PNG!');
    }
    const isLt10M = file.size / 10240 / 10240 < 10;
    if (!isLt10M) {
      message.error('Image sebe ser menor a 10MB!');
    }
    if (isJpgOrPng && isLt10M) {
      this.setState({ extension: file.type === 'image/jpeg' ? 'jpeg' : 'png' });
    }
    return isJpgOrPng && isLt10M;
  }

  getPropiedades = async () => {
    const unsuscribe = firestore.collection('propiedades')
      .onSnapshot(
        (snapshot) => snapshot.forEach((propiedad) => {
          this.setState((state) => ({
            propiedades: {
              ...state.propiedades,
              [propiedad.id]: { ...propiedad.data(), id: propiedad.id },
            },
          }));
        }),
        (error) => notiError(error.message),
      );
    this.unsuscribe = unsuscribe;
    this.setState({ loading: false });
  }

  closeModal = () => {
    this.formRef.current.resetFields();
    const { setModalVisible } = this.props;
    this.setState({ imageUrl: null, isLoadingImage: false });
    setModalVisible(false, 'queja');
  }

  handleSubmit = (data) => {
    const { imageUrl, extension } = this.state;
    this.setState({ loading: true, isLoadingImage: true });
    const uploadTask = storage.child(`quejas/${Date.now()}.${extension}`).putString(imageUrl, 'data_url');
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ percent: Math.round(progress) });
      },
      (error) => {
        notiError(error.message);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.handleSubmitData({ ...data, downloadURL });
        });
      },
    );
  };

  handleSubmitData = async ({
    apto,
    titulo,
    descripcion,
    downloadURL,
    timePiker: { _d },
  }) => {
    this.setState({ loading: true });
    try {
      const apartamento = await firestore.collection('propiedades').doc(apto).get();
      if (apartamento.exists) {
        const usuario = await apartamento.data();
        await firestore.collection('quejas').add({
          usuario: usuario.habitante,
          apto: firestore.collection('propiedades').doc(apto),
          titulo,
          descripcion,
          fecha: _d,
          solucionado: false,
          imagen: downloadURL,
        });
        notiSuccess('La queja ha sido reportada.');
      } else {
        notiError('La propiedad no tiene inquilino');
      }
    } catch (error) {
      notiError(error.message);
    }
    this.setState({ loading: false });
    this.closeModal();
  };

  validate = () => {
    const { imageUrl } = this.state;
    this.formRef.current
      .validateFields()
      .then((values) => {
        imageUrl && this.handleSubmit(values);
      })
      .catch(() => null);
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingImage: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        imageUrl,
        loadingImage: false,
      }));
    }
  };

  render() {
    const { modalQueja } = this.props;
    const {
      loading,
      propiedades,
      imageUrl,
      loadingImage,
      isLoadingImage,
      percent,
    } = this.state;

    const uploadButton = (
      <div>
        {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
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
          <Button key="back" size="large" onClick={this.closeModal}>
            Cancelar
          </Button>,
          <Button key="submit" size="large" type="primary" disabled={loadingImage} loading={loading} onClick={this.validate}>
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
          <Divider dashed />
          <Form.Item>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? (isLoadingImage
                ? <Progress type="circle" percent={percent} />
                : <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : uploadButton}
            </Upload>
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
