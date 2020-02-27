import React from 'react';
import { firestore } from '../../firebase/firebase.utils';
import { List } from 'antd';
import _ from 'lodash';

class Quejas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quejas: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.getCollection();
  }

  getCollection = async () => {
    const snapshot = await firestore.collection('quejas').get();
    snapshot.forEach((queja) => {
      this.setState((state) => ({
        quejas: { ...state.quejas, [queja.id]: { ...queja.data(), id: queja.id } },
      }));
    });
    this.setState({ loading: false });
  }

  render() {
    const { quejas, loading } = this.state;
    console.log(quejas);
    
    return (
      <div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 3,
          }}
          dataSource={_.toArray(quejas)}
          renderItem={item => (
            <List.Item>
              {item.id}
            </List.Item>
          )}
        />
      </div>
    );
  }
};

export default Quejas;
