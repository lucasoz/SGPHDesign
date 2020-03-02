import React from 'react';
import { List } from 'antd';
import _ from 'lodash';
import CardQueja from '../card-queja/CardQueja';
import { firestore } from '../../firebase/firebase.utils';
import { notiError } from '../../utils/notifications';
import ModalSolucion from '../modal-solucion/ModalSolucion';

const defState = {
  queja: {},
  modalIsOpen: false,
};

class Quejas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defState,
      quejas: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.getCollection();
  }

  getCollection = async () => {
    firestore.collection('quejas').where('solucionado', '==', false)
      .onSnapshot(
        (snapshot) => snapshot.forEach((queja) => {
          this.setState((state) => ({
            quejas: { ...state.quejas, [queja.id]: { ...queja.data(), id: queja.id } },
          }));
        }),
        (error) => notiError(error),
      );
    this.setState({ loading: false });
  }

  openModal = (queja) => {
    this.setState({ queja, modalIsOpen: true });
  }

  closeModal = () => {
    this.setState((state) => ({ ...state, ...defState }));
  }

  render() {
    const {
      quejas,
      loading,
      queja,
      modalIsOpen,
    } = this.state;

    return (
      <div>
        <List
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 5,
          }}
          dataSource={_.toArray(quejas)}
          renderItem={(item) => (
            <List.Item>
              <CardQueja queja={item} openModal={this.openModal} />
            </List.Item>
          )}
        />
        <ModalSolucion modalIsOpen={modalIsOpen} closeModal={this.closeModal} queja={queja} />
      </div>
    );
  }
};

export default Quejas;
