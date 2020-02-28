import React from 'react';
import { List } from 'antd';
import CardNoticia from '../card-noticia/CardNoticia';

const data = [
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 5"
  },
  {
    title: "Title 6"
  },
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 5"
  },
  {
    title: "Title 6"
  },
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 5"
  },
  {
    title: "Title 6"
  },
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 5"
  },
  {
    title: "Title 6"
  },
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 5"
  },
  {
    title: "Title 6"
  }
];

const ListaNoticias = () => (
  <List
    style={{ textAlign: '-webkit-center' }}
    dataSource={data}
    renderItem={item => (
      <List.Item style={{ maxWidth: '500px' }}>
        <CardNoticia />
      </List.Item>
    )}
  />
);

export default ListaNoticias;
