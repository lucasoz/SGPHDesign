import React from 'react';
import { List } from 'antd';
import _ from 'lodash';
import CardNoticia from '../card-noticia/CardNoticia';
import { notiError } from '../../utils/notifications';
import { firestore } from '../../firebase/firebase.utils';

class ListaNoticias extends React.Component {
  constructor() {
    super();
    this.state = {
      noticias: {},
    };
  }

  componentDidMount() {
    const unsuscribe = firestore.collection('noticias')
      .onSnapshot(
        (snapshot) => snapshot.forEach((noticia) => {
          this.setState((state) => ({
            noticias: { ...state.noticias, [noticia.id]: { ...noticia.data(), id: noticia.id } },
          }));
        }),
        (error) => notiError(error.message),
      );
    this.unsuscribe = unsuscribe;
  }

  componentWillUnmount() {
    this.unsuscribe();
  }

  render() {
    const { noticias } = this.state;

    return (
      <List
        style={{ textAlign: '-webkit-center' }}
        dataSource={_.toArray(noticias)}
        renderItem={(noticia) => (
          <List.Item style={{ maxWidth: '500px' }}>
            <CardNoticia noticia={noticia} />
          </List.Item>
        )}
      />
    );
  }
}


export default ListaNoticias;
