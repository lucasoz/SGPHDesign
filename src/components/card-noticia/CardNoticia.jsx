// se saco de card

import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Card } from 'antd';
import { LikeOutlined, CommentOutlined, DislikeOutlined } from '@ant-design/icons';

const CardNoticia = ({ noticia: { imagen, descripcion }}) => (
  <Card
    style={{ width: '100%' }}
    cover={(
      <img
        src={imagen}
        style={{
          width: '100%',
          height: 'auto',
        }}
        alt="noticia"
      />
    )}
    actions={[
      <div>
        <Tag>12</Tag>
        <LikeOutlined key="like" />
      </div>,
      <div>
        <Tag>12</Tag>
        <CommentOutlined key="message" />
      </div>,
      <div>
        <Tag>12</Tag>
        <DislikeOutlined key="dislike" />
      </div>,
    ]}
  >
    {descripcion}
  </Card>
);

CardNoticia.propTypes = {
  noticia: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
  }).isRequired,
};

export default CardNoticia;
